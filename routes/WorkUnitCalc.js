
var express = require('express');
var md5 = require('md5');
var router = express.Router();
var nodestrtotime = require('nodestrtotime');
var in_array = require('in_array');
var db = require('../dbconnections');
var moment = require('moment');
var async = require("async");


router.post('/' , function(req , res , next) {
    var team = req.body.team_id , task = req.body.tasks_id , subTask = req.body.sub_task_id;
    var tempDate = req.body.month;
    var conversionFactor = req.body.con_fac;
    var actionBy = req.body.user_id;
    var formattedDate = moment(tempDate).format('YYYY-MM'); 
    var formatDate2 = moment(tempDate).format('YYYY-MM-DD');
    var today = moment().format('YYYY-MM-DD');
    if (subTask != undefined) {
        db.query('SELECT * FROM amz_daily_target where team = ? AND task = ? AND sub_task = ? AND month_from = ? AND status= 1 AND deletion = 0 AND about_cf = 1' ,[team , task , subTask , tempDate] , function(err , results , fields) {
            if(results.length > 0) {
                db.query('UPDATE amz_daily_target set modified_by = ? , about_cf = 1 ,  con_fac = ? , cf_updated = 1 , maintain_date = ? where team = ? AND task = ? AND sub_task = ? AND month_from = ?  ', [actionBy,conversionFactor , today , team, task, subTask, tempDate] , function(e1 , r1, f1){
                    if(e1) {
                        res.send(e1);
                    } else {
                        var tempCF = (100 / conversionFactor);
                        
                        db.query('UPDATE user_tasks set cf = ? , wu_status = 1 , wu = (count *' + tempCF + ') WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date >= ?', [conversionFactor, team, task, subTask, formatDate2] , function(e2 , r2 , f2) {
                        if(e2) {
                            res.send({ 
                                "code" : 400 , 
                                "message" : "Error occoured",
                                "error" : e2
                            });
                        } else {
                            res.send({
                                "code" : 200 , 
                                "message" : "success"
                            });
                        }
                    });
                }
                });
            }
            else {
                db.query('INSERT INTO amz_daily_target (month_from , team , task , sub_task , cf_updated , con_fac , wu_status , status , deletion , added_by , modified_by , create_date , maintain_date , about_cf) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)' , [tempDate , team , task , subTask , '1' , conversionFactor , '1' , '1' , '0' , actionBy , actionBy , today , today , '1' ] , function(e3 , r3 , f3 ){
                    if(e3) {
                        res.send(e3);
                    } else {
                        db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = (count *' + (100 / conversionFactor) + ') WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date >= ?', [conversionFactor, team, task, subTask, formatDate2] , function(e4 , r4 , f4) {
                            if (e4) {
                                res.send({
                                    "code": 400,
                                    "message": "Error occoured",
                                    "error": e4
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
    } 
    //////////////////////////////
    //////////////////////////////
    else {
        db.query('SELECT con_fac FROM amz_daily_target where team = ? AND task = ?  AND month_from = ? AND status= 1 AND deletion = 0', [team, task, tempDate], function (err, results, fields) {
            if (results.length > 0) {
                db.query('UPDATE amz_daily_target set modified_by = ? ,about_cf = 1 , con_fac = ? , cf_updated = 1 where team = ? AND task = ?  AND month_from = ?', [actionBy,conversionFactor ,  team, task, tempDate], function (e1, r1, f1) {
                    if (e1) {
                        res.send(e1);
                    } else {
                        db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = (count *' + (100 / conversionFactor) + ') WHERE team_id = ? AND tasks_id = ?  AND date >= ?', [conversionFactor, team, task , formatDate2], function (e2, r2, f2) {
                            if (e2) {
                                res.send({
                                    "code": 400,
                                    "message": "Error occoured",
                                    "error": e2
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
            else {
                db.query('INSERT INTO amz_daily_target (month_from , team , task , cf_updated , con_fac , wu_status , status , deletion , added_by , modified_by , create_date , maintain_date , about_cf) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )', [tempDate, team, task, '1', conversionFactor, '1', '1', '0', actionBy, actionBy, today, today , '1'], function (e3, r3, f3) {
                    if (e3) {
                        res.send(e3);
                    } else {
                        db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = (count *' + (100 / conversionFactor) + ') WHERE team_id = ? AND tasks_id = ? AND date >= ?', [conversionFactor, team, task, formatDate2], function (e4, r4, f4) {
                            if (e4) {
                                res.send({
                                    "code": 400,
                                    "message": "Error occoured",
                                    "error": e4
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

    }
});

router.post('/Get' , function(req , res , next){
    db.query('SELECT amz_daily_target.s_no , amz_daily_target.month_from , amz_daily_target.team , amz_teams.team_name , amz_daily_target.task , amz_tasks.task_name , amz_daily_target.sub_task , amz_sub_tasks.sub_task_name , amz_daily_target.about_cf , amz_daily_target.con_fac , amz_daily_target.added_by , amz_login.user_name as AddedBy FROM amz_daily_target LEFT JOIN amz_teams ON amz_daily_target.team = amz_teams.team_id LEFT JOIN amz_tasks ON amz_daily_target.task = amz_tasks.task_id LEFT JOIN amz_sub_tasks ON amz_daily_target.sub_task = amz_sub_tasks.sub_task_id LEFT JOIN amz_login ON amz_daily_target.added_by = amz_login.user_id WHERE amz_daily_target.month_from = ? AND amz_daily_target.team = ?' , [req.body.month , req.body.team_id] , function(errors , results , fields)  {
        if(errors) {
            res.send(errors);
        } else {
            res.send(results);
        }
    });
});

router.post('/delete', function (req, res, next) {
    db.query('UPDATE amz_daily_target set deletion = 0 where s_no = ?', [req.body.s_no], function (errors, results, fields) {
        if (errors) {
            res.send(errors);
        } else {
            res.send({
                "code" : 200 , 
                "message" : "success",
                "result" : results
            });
        }
    });
});

module.exports = router;