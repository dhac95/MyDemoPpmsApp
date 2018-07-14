var express = require('express');
var router = express.Router();
var db = require('../dbconnections');
var moment = require('moment');
var async = require("async");
var nodestrtotime = require('nodestrtotime');

router.post('/', function (req, res) {
    var team = req.body.team_id,
        task = req.body.task_id,
        subTask = req.body.sub_task_id;
    var tempDate = req.body.month;
    var actionBy = req.body.action;
    var ms_non_ms = (req.body.ms_non_ms).toString(),
        op_off = (req.body.op_off).toString(),
        rele_non_rele = (req.body.rele_non_rele).toString();
    // var formattedDate = moment(tempDate).format('YYYY-MM');
    // var formatDate2 = moment(tempDate).subtract(1, 'M').format('MMMM YYYY');
    // var endDate = moment(tempDate).add(1, 'M').format('YYYY-MM-DD');
    // var today = moment().format('YYYY-MM-DD');
    // var queryError = [];


    db.query('SELECT s_no FROM amz_daily_target where team = ? AND task = ?  AND month_from = ? AND status= 1 AND deletion = 0', [team, task, tempDate], function (err, results, fields) {

        if (results.length > 0) {
            db.query('UPDATE amz_daily_target set modified_by = ? , op_off = ? , ms_non_ms = ? , rele_non_rele = ? , maintain_date = now() where team = ? and task = ? and month_from = ?', [actionBy, op_off, ms_non_ms, rele_non_rele, team, task, tempDate], function (e, r) {
                if (e) {
                    res.send({
                        "code": 300,
                        "message": "Error while updating",
                        "Error": e
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "Success"
                    });
                }
            });
        } else {
            res.send({
                "code": 400,
                "message": "Please set targets first and then set the target type"
            });
        }

    });

});


router.post('/get', function (req, res) {
    var team = req.body.team_id;
    var tempDate = req.body.month;

    db.query("SELECT amz_daily_target.s_no ,amz_daily_target.task , amz_daily_target.team , amz_teams.team_name , amz_daily_target.op_off , amz_daily_target.rele_non_rele , amz_daily_target.ms_non_ms , amz_daily_target.month_from , amz_daily_target.maintain_date , amz_tasks.task_name , amz_login.user_name as ModifiedBy FROM amz_daily_target INNER JOIN amz_tasks ON  amz_daily_target.task = amz_tasks.task_id LEFT JOIN amz_login ON amz_daily_target.modified_by = amz_login.user_id INNER JOIN amz_teams ON amz_daily_target.team = amz_teams.team_id WHERE amz_daily_target.team = ? and amz_daily_target.month_from = ? group by task_name order by task_name", [team, tempDate], function (e, r) {
        if (e) {
            res.send({
                "code": 300,
                "message": "Error",
                "Error": e
            });
        } else {
            res.send(r);
        }

    });

});


module.exports = router;