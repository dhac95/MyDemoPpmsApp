var express = require('express');
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
    var startDate = moment(tempDate).format('YYYY-MM-DD');
    var endDate = moment(tempDate).add(1, 'M').format('YYYY-MM-DD');
    var today = moment().format('YYYY-MM-DD');
    var queryError = [];

    db.query('select s_no , month_from , team , task , sub_task , about_cf , cf_updated , con_fac from amz_daily_target where month_from = ? and team = ? and wu_status = 1 and status = 1 and deletion = 0', [tempDate, team], function (e, r) {
        if (e) {
            res.send({
                "code": 302,
                "Message": "My Sql error",
                "Error": e
            });
        } else {
            if (r.length == 0) {
                res.send({
                    "code": 304,
                    "Message": "Work unit status is not updated properly, Try to set the values again"
                });
            } else {
                async.each(r, function (single, callback) {
                        var conversionFactor = single.con_fac;
                        var task = single.task;
                        var subTask = single.sub_task;
                        if (subTask != undefined) {
                            if (conversionFactor != null || conversionFactor != 0 || conversionFactor != undefined) {
                                db.query('select s_no , noofdevice , percentage from amz_dc_units where team_id = ? and month = ? and task_id = ? and sub_task_id = ? and status = 1', [team, tempDate, task, subTask], function (async1Error, async1Results) {
                                    if (async1Error) {
                                        queryError.push(async1Error);
                                    } else {
                                        if (async1Results.length == 0) {

                                            db.query('SELECT count FROM user_tasks WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date >= ? and date < ? ', [team, task, subTask, startDate, endDate], function (errors1, results1) {
                                                async.each(results1, function (singleValue1, callback) {
                                                    var Count = singleValue1.count;
                                                    var wu = 0;


                                                    if (Count != null && Count != undefined) {
                                                        wu = (Count * (100 / conversionFactor));
                                                    } else {
                                                        wu = 0;
                                                    }

                                                    db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = ? WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date >= ? and date < ?', [conversionFactor, wu, team, task, subTask, startDate, endDate], function (userError2, userResults2) {
                                                        if (userError2) {
                                                            queryError.push(userError2);
                                                        }
                                                    });
                                                    db.query('UPDATE user_tasks_ot set cf = ? , wu_status = 1 ,  wu = ?  WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date >= ? and date < ? ', [conversionFactor, wu, team, task, subTask, startDate, endDate], function (userOTError2, userOTResults2) {
                                                        if (userOTError2) {
                                                            queryError.push(userOTError2);
                                                        }
                                                    });


                                                    callback();
                                                }); //usertasks asyc ends
                                            }); // UserTasks query ends

                                            // db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = (count *' + (100 / conversionFactor) + ') WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date >= ? and date < ?', [conversionFactor, team, task, subTask, startDate, endDate], function (userError, userResults) {
                                            //     if (userError) {
                                            //         queryError.push(userError);
                                            //     }
                                            // });
                                            // db.query('UPDATE user_tasks_ot set cf = ? , wu_status = 1 ,  wu = (count *' + (100 / conversionFactor) + ')  WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date >= ? and date < ? ', [conversionFactor, team, task, subTask, startDate, endDate], function (userOTError, userOTResults) {
                                            //     if (userOTError) {
                                            //         queryError.push(userOTError);
                                            //     }
                                            // });

                                        } else {
                                            async.each(async1Results, function (deviceSingle, callback) {
                                                var deviceCount = deviceSingle.noofdevice;
                                                var percentage = deviceSingle.percentage;
                                                var multiplier = 0;
                                                if (percentage != null || percentage != undefined) {
                                                    multiplier = percentage / 100;
                                                } else {
                                                    multiplier = 0;
                                                }
                                                db.query('SELECT count , noofdevice FROM user_tasks WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date >= ? and date < ? ', [team, task, subTask, startDate, endDate], function (errors, results) {
                                                    async.each(results, function (singleValue, callback) {
                                                        var Count = singleValue.count;
                                                        var wu = 0;
                                                        var userDeviceCount = singleValue.userDeviceCount;
                                                        if (deviceCount == userDeviceCount) {
                                                            if (Count != null && Count != undefined) {
                                                                wu = (Count + (Count * (percentage / 100)) * (100 / conversionFactor));
                                                            } else {
                                                                wu = 0;
                                                            }

                                                            db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = ? WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date >= ? and date < ?', [conversionFactor, wu, team, task, subTask, startDate, endDate], function (userError1, userResults1) {
                                                                if (userError1) {
                                                                    queryError.push(userError1);
                                                                }
                                                            });
                                                            db.query('UPDATE user_tasks_ot set cf = ? , wu_status = 1 ,  wu = ?  WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date >= ? and date < ? ', [conversionFactor, wu, team, task, subTask, startDate, endDate], function (userOTError1, userOTResults1) {
                                                                if (userOTError1) {
                                                                    queryError.push(userOTError1);
                                                                }
                                                            });

                                                        }
                                                        callback();
                                                    }); //usertasks asyc ends
                                                }); // UserTasks query ends


                                                callback();
                                            });
                                        }
                                    }
                                });
                            } //ConversionFlag ends 
                            else {
                                db.query('UPDATE user_tasks set user_tasks.cf = ? ,  user_tasks.wu_status = 1 , user_tasks.wu = 0 WHERE user_tasks.team_id = ? AND user_tasks.tasks_id = ? AND user_tasks.sub_task_id = ? AND date >= ? and date < ?', [conversionFactor, team, task, subTask, startDate, endDate], function (userErrorOnCFNull, UserResultsOnCFNull) {
                                    if (userErrorOnCFNull) {
                                        queryError.push(userErrorOnCFNull);
                                    }
                                });
                                db.query('UPDATE user_tasks_ot set cf = ? , wu_status = 1 ,  wu = 0  WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date >= ? and date < ? ', [conversionFactor, team, task, subTask, startDate, endDate], function (userOTErrorOnCFNull, UserOTResultsOnCFNull) {
                                    if (userOTErrorOnCFNull) {
                                        queryError.push(userOTErrorOnCFNull);
                                    }
                                });
                            }
                        } // subtask Flag ends  
                        callback();
                    },

                    function () {
                        if (queryError.length > 0) {
                            res.send({
                                "Error": queryError,
                                "code": 500
                            });
                        } else {
                            res.send({
                                "code": 200,
                                "message": "success",
                                "ErrorsWhileUpdate": queryError
                            });
                        }

                    });
            }
        }
    });

});

module.exports = router;