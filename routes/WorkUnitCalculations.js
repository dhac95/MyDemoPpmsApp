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
                       // if (subTask != undefined) {
                            var WhereCondition = 'team_id = ? AND tasks_id = ?  AND date >= ? and date < ? AND sub_task_id = ?';
                            var WhereConditionForDev = 'team_id = ? and month = ? and  noofdevice = ? and task_id = ? and sub_task_id = ? and status = 1';
                            if (subTask == undefined) {
                                WhereCondition = 'team_id = ? AND tasks_id = ?  AND date >= ? and date < ? AND sub_task_id is Null';
                                WhereConditionForDev = 'team_id = ? and month = ? and  noofdevice = ? and task_id = ? and sub_task_id is NULL and status = 1';
                            } else {
                                WhereCondition = 'team_id = ? AND tasks_id = ?  AND date >= ? and date < ? AND sub_task_id = ?';
                                WhereConditionForDev = 'team_id = ? and month = ? and  noofdevice = ? and task_id = ? and sub_task_id = ? and status = 1';
                            }
                            if (conversionFactor != null || conversionFactor != 0 || conversionFactor != undefined) {
                                
                                db.query('SELECT task_id , count , noofdevice FROM user_tasks WHERE  ' + WhereCondition, [team, task, startDate, endDate , subTask], function (errors, results) {
                                    async.each(results, function (singleValue, callback) {
                                        var Count = singleValue.count;
                                        var wu = 0;
                                        var deviceCount = singleValue.noofdevice;
                                        var multiplier = 0;
                                        var updateID = singleValue.task_id;
                                        if (deviceCount >= 2 && deviceCount <= 6 && deviceCount != undefined) {
                                            db.query('select  percentage from amz_dc_units where  ' + WhereConditionForDev, [team, tempDate, deviceCount ,task, subTask], function (dcUnitError, dcUnitResults) {
                                                if (dcUnitError) {
                                                    queryError.push(dcUnitError);
                                                } else {
                                                    async.each(dcUnitResults , function(singleDeviceValue  , callback){
                                                             var percentage = singleDeviceValue.percentage;
                                                             if (percentage != undefined || percentage != null) {
                                                                 multiplier = (Count * (percentage / 100));
                                                             } else {
                                                                 multiplier = 0;
                                                             }
                                                             wu = ((Count  + multiplier) * (100 / conversionFactor)) ;
                                                             db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = ? WHERE task_id =  ?', [conversionFactor, wu, updateID], function (userError2, userResults2) {
                                                                 if (userError2) {
                                                                     queryError.push(userError2);
                                                                 }
                                                             });
                                                        callback();
                                                    }); 
                                                }
                                            });
                                        } 
                                        else {
                                             wu = (Count * (100 / conversionFactor));
                                              db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = ? WHERE task_id =  ?', [conversionFactor, wu, updateID], function (userError20, userResults20) {
                                                  if (userError20) {
                                                      queryError.push(userError20);
                                                    
                                                  }
                                              });
                                        }
                                        callback();
                                    });
                                }); // End of UserTasks select query

                                 db.query('SELECT task_id , count , noofdevice FROM user_tasks_ot WHERE  ' + WhereCondition, [team, task, startDate, endDate, subTask], function (errors, results) {
                                     async.each(results, function (singleValue, callback) {
                                         var Count = singleValue.count;
                                         var wu = 0;
                                         var deviceCount = singleValue.noofdevice;
                                         var multiplier = 0;
                                         var updateID = singleValue.task_id;
                                         if (deviceCount >= 2 && deviceCount <= 6 && deviceCount != undefined) {
                                             db.query('select  percentage from amz_dc_units where  ' + WhereConditionForDev, [team, tempDate, deviceCount, task, subTask], function (dcUnitError, dcUnitResults) {
                                                 if (dcUnitError) {
                                                     queryError.push(dcUnitError);
                                                 } else {
                                                     async.each(dcUnitResults, function (singleDeviceValue, callback) {
                                                         var percentage = singleDeviceValue.percentage;
                                                         if (percentage != undefined || percentage != null) {
                                                             multiplier = (Count * (percentage / 100));
                                                         } else {
                                                             multiplier = 0;
                                                         }
                                                         wu = ((Count + multiplier) * (100 / conversionFactor));
                                                         db.query('UPDATE user_tasks_ot set cf = ? ,  wu_status = 1 , wu = ? WHERE task_id =  ?', [conversionFactor, wu, updateID], function (userError2, userResults2) {
                                                             if (userError2) {
                                                                 queryError.push(userError2);
                                                             }
                                                         });
                                                         callback();
                                                     });
                                                 }
                                             });
                                         } else {
                                             wu = (Count * (100 / conversionFactor));
                                             db.query('UPDATE user_tasks_ot set cf = ? ,  wu_status = 1 , wu = ? WHERE task_id =  ?', [conversionFactor, wu, updateID], function (userError20, userResults20) {
                                                 if (userError20) {
                                                     queryError.push(userError20);

                                                 }
                                             });
                                         }
                                         callback();
                                     });
                                 }); // End of UserOTTasks select query

                            } //ConversionFlag ends 
                            else {
                                db.query('UPDATE user_tasks set user_tasks.cf = ? ,  user_tasks.wu_status = 1 , user_tasks.wu = 0 WHERE ' + WhereCondition, [conversionFactor, team, task, startDate, endDate, subTask], function (userErrorOnCFNull, UserResultsOnCFNull) {
                                    if (userErrorOnCFNull) {
                                        queryError.push(userErrorOnCFNull);
                                    }
                                });
                                db.query('UPDATE user_tasks_ot set cf = ? , wu_status = 1 ,  wu = 0  WHERE ' + WhereCondition, [conversionFactor, team, task, startDate, endDate, subTask], function (userOTErrorOnCFNull, UserOTResultsOnCFNull) {
                                    if (userOTErrorOnCFNull) {
                                        queryError.push(userOTErrorOnCFNull);
                                    }
                                });
                            }
                       // } // subtask Flag ends  
                        
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