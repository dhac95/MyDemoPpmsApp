var express = require('express');
var md5 = require('md5');
var router = express.Router();
var nodestrtotime = require('nodestrtotime');
var in_array = require('in_array');
var db = require('../dbconnections');
var moment = require('moment');
var async = require("async");

router.post('/', function (req, res, next) {
    var team = req.body.team_id;
    var tempDate = req.body.month;
    var actionBy = req.body.user_id;
    var formattedDate = moment(tempDate).format('YYYY-MM');
    var formatDate2 = moment(tempDate).format('YYYY-MM-DD');
    var endDate = moment(tempDate).add(1, 'M').format('YYYY-MM-DD');
    var today = moment().format('YYYY-MM-DD');
    var queryError = [];
    db.query('select * from amz_daily_target where month_from = ? and team = ? and status = 1 and deletion = 1 and about_cf = 0', [tempDate, team], function (e, r, f) {
        if (r.length > 0) {
            res.send({
                "code": 300,
                "Message": "Already exisits"
            });
        } else {
            db.query('SELECT * FROM amz_sub_tasks WHERE task_status = 1 AND deletion = 0 AND about_cf = 0 AND team_id = ? ', [team], function (errors, results, fields) {
                if (errors) {
                    res.send(errors);
                } else {
                    async.each(results, function (single, callback) {
                        db.query('INSERT INTO amz_daily_target (month_from , team , task , sub_task , cf_updated  , wu_status , status , deletion , added_by , modified_by , create_date , maintain_date , about_cf) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )', [tempDate, single.team_id, single.task_id, single.sub_task_id, '1', '1', '1', '0', actionBy, actionBy, today, today, '0'], function (e2, r2, f2) {
                            if (e2) {
                                queryError.push({
                                    "code": 400,
                                    "message": "Error occoured",
                                    "error": e2
                                });
                            }
                            //  else {
                            db.query('SELECT * FROM amz_tasks WHERE status = 1 AND deletion = 0 AND about_cf = 0 and have_st = 0 AND team_id = ? ', [team], function (e3, r3, f3) {
                                if (e3) {
                                    queryError.push(e3);
                                } else {
                                    async.each(r3, function (taskresult, callback) {
                                        db.query('INSERT INTO amz_daily_target (month_from , team , task , cf_updated , wu_status , status , deletion , added_by , modified_by , create_date , maintain_date , about_cf) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )', [tempDate, team, taskresult.task_id, '1', '1', '1', '0', actionBy, actionBy, today, today, '0'], function (e4, r4, f4) {
                                            if (e4) {
                                                queryError.push({
                                                    "code": 400,
                                                    "message": "Error occoured",
                                                    "error": e4
                                                });
                                            }
                                        });
                                        callback();
                                    });
                                }

                            });

                            // }
                        });

                        callback();

                    }, function (response) {
                        if (queryError.length > 0) {
                            res.send({
                                "code": 500,
                                "BulkError": queryError
                            });
                        } else {
                            res.send({
                                "code": 200,
                                "message": "success"
                            });
                        }
                    });
                }

            });
        }
    });

});

module.exports = router;