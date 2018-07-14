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
    var formatDate2 = moment(tempDate).subtract(1, 'M').format('YYYY MMMM');
    var endDate = moment(tempDate).add(1, 'M').format('YYYY-MM-DD');
    var today = moment().format('YYYY-MM-DD');
    var queryError = [];

    db.query('select * from amz_daily_target where month_from = ? and team = ? and status = 1 and deletion = 0 and about_cf = 1', [tempDate, team], function (e, r, f) {
        if (r.length > 0) {
            res.send({
                "code": 300,
                "Message": "Already exisits"
            });
        } else {
            db.query('SELECT * FROM amz_tasks WHERE status = 1 AND deletion = 0 AND team_id = ?', [team], function (e1, r1, f1) {
                if (e1) {
                    res.send({
                        "code": 300,
                        "message": "Error occoured",
                        "error": e1
                    });
                } else {
                    async.each(r1, function (single, callback) {
                        if (single.have_st == 0 && single.about_cf == 1) {
                            db.query('INSERT INTO amz_daily_target (month_from , team , task , cf_updated , wu_status , status , deletion , added_by , modified_by , create_date , maintain_date , about_cf) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )', [tempDate, team, single.task_id, '1', '1', '1', '0', actionBy, actionBy, today, today, 1], function (e2, r2, f2) {
                                if (e2) {
                                    queryError.push({
                                        "code": 400,
                                        "message": "Error occoured",
                                        "error": e2
                                    });
                                }
                            });
                        } else if (single.have_st == 1) {
                            db.query('SELECT * FROM amz_sub_tasks WHERE task_status = 1 AND deletion = 0 AND about_cf = 1 AND team_id = ? AND task_id = ?', [team, single.task_id], function (e3, r3, f3) {
                                if (e3) {
                                    queryError.push({
                                        "code": 400,
                                        "message": "Error occoured",
                                        "error": e3
                                    });
                                } else {
                                    async.each(r3, function (taskresult, callback) {
                                        db.query('INSERT INTO amz_daily_target (month_from , team , task , sub_task , cf_updated  , wu_status , status , deletion , added_by , modified_by , create_date , maintain_date , about_cf) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )', [tempDate, team, single.task_id, taskresult.sub_task_id, '1', '1', '1', '0', actionBy, actionBy, today, today, 1], function (e4, r4, f4) {
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
                        }

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

router.post('/prev', function (req, res, next) {
    var team = req.body.team_id;
    var tempDate = req.body.month;
    var actionBy = req.body.user_id;
    var formattedDate = moment(tempDate).format('YYYY-MM');
    var formatDate2 = moment(tempDate).subtract(1, 'M').format('MMMM YYYY');
    var endDate = moment(tempDate).add(1, 'M').format('YYYY-MM-DD');
    var today = moment().format('YYYY-MM-DD');
    var queryError = [];

    db.query('select * from amz_daily_target where month_from = ? and team = ? and status = 1 and deletion = 0 and about_cf = 1', [formatDate2, team], function (e, r, f) {
        if (e) {
            res.send(e);
        } else if (r.length == 0) {
            res.send({
                "code": 304,
                "message": "No Target for previous month"
            });
        } else {
            db.query('select * from amz_daily_target where month_from = ? and team = ? and status = 1 and deletion = 0 and about_cf = 1', [tempDate, team], function (err, results, fields) {
                if (err) {
                    res.send(err);
                } else if (results.length > 0) {
                    res.send({
                        "code": 300,
                        "message": "Error occoured",
                        "error": err
                    });
                } else {
                    async.each(r, function (single, callback) {
                        db.query('INSERT INTO amz_daily_target (month_from , team , task , sub_task , cf_updated , con_fac , wu_status , status , deletion , added_by , modified_by , create_date , maintain_date , about_cf , op_off , ms_non_ms , rele_non_rele) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)', [tempDate, single.team, single.task, single.sub_task, single.cf_updated, single.con_fac, single.wu_status, single.status, single.deletion, actionBy, actionBy, today, today, '1', single.op_off, single.ms_non_ms, single.rele_non_rele], function (e2, r2, f2) {
                            if (e2) {
                                queryError.push({
                                    "code": 400,
                                    "message": "Error occoured",
                                    "error": e3
                                });
                            }
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