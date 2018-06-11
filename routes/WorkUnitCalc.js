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

    db.query('SELECT amz_daily_target.s_no, amz_daily_target.month_from , amz_daily_target.month_to , amz_daily_target.team , amz_daily_target.task , amz_daily_target.sub_task , amz_daily_target.about_cf , amz_daily_target.cf_updated , amz_daily_target.con_fac, amz_daily_target.wu_status , amz_daily_target.status , amz_daily_target.deletion , amz_daily_target.added_by , amz_daily_target.modified_by , amz_daily_target.create_date , amz_daily_target.modified_by , amz_dc_units.noofdevice , amz_dc_units.percentage FROM test.amz_daily_target LEFT JOIN amz_dc_units ON(amz_daily_target.month_from = amz_dc_units.month AND amz_daily_target.team = amz_dc_units.team_id AND amz_daily_target.task = amz_dc_units.task_id AND amz_daily_target.sub_task = amz_dc_units.sub_task_id) where amz_daily_target.status = 1 and amz_daily_target.deletion = 0 and amz_daily_target.team = ? and amz_daily_target.month_from = ? ', [team, tempDate], function (e, r, f) {
        if (e) {
            res.send(e);
        } else if (r.length == 0) {
            res.send({
                "code": 305,
                "message": "No targets set for the week"
            });
        } else {
            //   for (var i = 0; i < r.length; i++) {
            async.each(r, function (single, callback) {
                var conversionFactor = single.con_fac;
                var task = single.task;
                var subTask = single.sub_task;

                var multiplier = 0;

                if (single.noofdevice == 2) {
                    multiplier = single.percentage;
                } else if (single.noofdevice == 3) {
                    multiplier = single.percentage;
                } else if (single.noofdevice == 4) {
                    multiplier = single.percentage;
                } else if (single.noofdevice == 5) {
                    multiplier = single.percentage;
                } else if (single.noofdevice == 6) {
                    multiplier = single.percentage;
                } else {
                    multiplier = 0;
                }


                if (subTask != undefined) {
                    if (conversionFactor != undefined) {

                        db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = ( CASE WHEN noofdevice = 2 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 3 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 4 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 5 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 6 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 1 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice IS NULL THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') END) WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date between ? and ? ', [conversionFactor, team, task, subTask, formatDate2, endDate],
                            function (e4, r4, f4) {
                                if (e4) {
                                    queryError.push({
                                        "code": 400,
                                        "message": "Error occoured",
                                        "error": e4
                                    });
                                } else {
                                    db.query('UPDATE user_tasks_ot set cf = ? , wu_status = 1 , wu = ( CASE WHEN noofdevice = 2 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 3 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 4 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 5 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 6 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 1 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice IS NULL THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') END)  WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date between ? and ? ', [conversionFactor, team, task, subTask, formatDate2, endDate],
                                        function (err1, result1, field1) {
                                            if (err1) {
                                                queryError.push({
                                                    "code": 400,
                                                    "message": "Error occoured",
                                                    "error": err1
                                                });
                                            }
                                        });
                                }

                            });

                    } else {
                        db.query('UPDATE user_tasks set user_tasks.cf = ? ,  user_tasks.wu_status = 1 , user_tasks.wu = 0 WHERE user_tasks.team_id = ? AND user_tasks.tasks_id = ? AND user_tasks.sub_task_id = ? AND user_tasks.date between ? and ?', [conversionFactor, team, task, subTask, formatDate2, endDate],
                            function (e8, r8, f8) {
                                if (e8) {
                                    queryError.push({
                                        "code": 400,
                                        "message": "Error occoured",
                                        "error": e8
                                    });
                                } else {
                                    db.query('UPDATE user_tasks_ot set cf = ? , wu_status = 1 ,  wu = 0  WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date between ? and ? ', [conversionFactor, team, task, subTask, formatDate2, endDate],
                                        function (err5, result5, field5) {
                                            if (err5) {
                                                queryError.push({
                                                    "code": 400,
                                                    "message": "Error occoured",
                                                    "error": err5
                                                });
                                            }
                                        });
                                }

                            });
                    }
                    // callback();
                } else {
                    if (conversionFactor != undefined) {
                        db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = ( CASE WHEN noofdevice = 2 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 3 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 4 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 5 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 6 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice = 1 THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') WHEN noofdevice IS NULL THEN ((count + (count * ' + (multiplier / 100) + ')) * ' + (100 / conversionFactor) + ') END) WHERE team_id = ? AND tasks_id = ?  AND date between ? and ?', [conversionFactor, team, task, formatDate2, endDate],
                            function (e2, r2, f2) {
                                if (e2) {
                                    queryError.push({
                                        "code": 400,
                                        "message": "Error occoured",
                                        "error": e2
                                    });
                                } else {
                                    db.query(
                                        "UPDATE user_tasks_ot set cf = ? , wu_status = 1 ,  wu = ( CASE WHEN noofdevice = 2 THEN ((count + (count * " +
                                        multiplier / 100 +
                                        ")) * " +
                                        100 /
                                        conversionFactor +
                                        ") WHEN noofdevice = 3 THEN ((count + (count * " +
                                        multiplier / 100 +
                                        ")) * " +
                                        100 /
                                        conversionFactor +
                                        ") WHEN noofdevice = 4 THEN ((count + (count * " +
                                        multiplier / 100 +
                                        ")) * " +
                                        100 /
                                        conversionFactor +
                                        ") WHEN noofdevice = 5 THEN ((count + (count * " +
                                        multiplier / 100 +
                                        ")) * " +
                                        100 /
                                        conversionFactor +
                                        ") WHEN noofdevice = 6 THEN ((count + (count * " +
                                        multiplier / 100 +
                                        ")) * " +
                                        100 /
                                        conversionFactor +
                                        ") WHEN noofdevice = 1 THEN ((count + (count * " +
                                        multiplier / 100 +
                                        ")) * " +
                                        100 /
                                        conversionFactor +
                                        ") WHEN noofdevice IS NULL THEN ((count + (count * " +
                                        multiplier / 100 +
                                        ")) * " +
                                        100 /
                                        conversionFactor +
                                        ") END) WHERE team_id = ? AND tasks_id = ?  AND date between ? and ? ", [
                                            conversionFactor,
                                            team,
                                            task,
                                            formatDate2,
                                            endDate
                                        ],
                                        function (
                                            err2,
                                            result2,
                                            field2
                                        ) {
                                            if (err2) {
                                                queryError.push({
                                                    code: 400,
                                                    message: "Error occoured",
                                                    error: err2
                                                });
                                            }
                                        }
                                    );
                                }

                            });
                    } else {
                        db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = 0  WHERE team_id = ? AND tasks_id = ?  AND date between ? and ?', [conversionFactor, team, task, formatDate2, endDate],
                            function (e10, r10, f10) {
                                if (e10) {
                                    queryError.push({
                                        "code": 400,
                                        "message": "Error occoured",
                                        "error": e10
                                    });
                                } else {
                                    db.query('UPDATE user_tasks_ot set cf = ? , wu_status = 1 ,  wu = 0  WHERE team_id = ? AND tasks_id = ?  AND date between ? and ? ', [conversionFactor, team, task, formatDate2, endDate],
                                        function (err8, result8, field8) {
                                            if (err8) {
                                                queryError.push({
                                                    "code": 400,
                                                    "message": "Error occoured",
                                                    "error": err8
                                                });
                                            }
                                        });
                                }

                            });
                    }
                    // callback();
                }
                callback();

            }, function (response) {
                if (queryError.length > 0) {
                    res.send({
                        "Error": queryError,
                        "code": 500
                    });
                } else {
                    res.send({
                        "code": 200,
                        "message": "success"
                    });
                }

            });
            // }
        }
    });

});

module.exports = router;