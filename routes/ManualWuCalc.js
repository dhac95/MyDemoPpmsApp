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
    
    db.query('SELECT * from amz_daily_target where status = 1 and deletion = 0 and team = ? and month_from = ? ' , [team , tempDate], function(e , r , f){
        if(e){
            res.send(e);
        } else {
         //   for (var i = 0; i < r.length; i++) {
            async.each(r, function (single, callback) {
                var conversionFactor = single.con_fac ;
                var task = single.task;
                var subTask = single.sub_task;
                
                if(subTask != undefined){
                    db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = (count *' + (100 / conversionFactor) + ') WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date between ? and ?', [conversionFactor, team, task, subTask, formatDate2, endDate], function (e4, r4, f4) {
                        if (e4) {
                            res.send({
                                "code": 400,
                                "message": "Error occoured",
                                "error": e4
                            });
                        } else {
                            db.query('UPDATE user_tasks_ot set cf = ? , wu_status = 1 ,  wu = (count *' + (100 / conversionFactor) + ')  WHERE team_id = ? AND tasks_id = ? AND sub_task_id = ? AND date between ? and ? ', [conversionFactor, team, task, subTask, formatDate2, endDate] , function(err1 , result1 , field1){
                                if (err1) {
                                    res.send({
                                        "code": 400,
                                        "message": "Error occoured",
                                        "error": err1
                                    });
                                }
                            });
                        }
                     
                    });
                } else {
                    db.query('UPDATE user_tasks set cf = ? ,  wu_status = 1 , wu = (count *' + (100 / conversionFactor) + ') WHERE team_id = ? AND tasks_id = ?  AND date between ? and ?', [conversionFactor, team, task, formatDate2, endDate], function (e2, r2, f2) {
                        if (e2) {
                            res.send({
                                "code": 400,
                                "message": "Error occoured",
                                "error": e2
                            });
                        } else {
                            db.query('UPDATE user_tasks_ot set cf = ? , wu_status = 1 ,  wu = (count *' + (100 / conversionFactor) + ')  WHERE team_id = ? AND tasks_id = ?  AND date between ? and ? ', [conversionFactor, team, task, formatDate2, endDate], function (err2, result2, field2) {
                                if (err2) {
                                    res.send({
                                        "code": 400,
                                        "message": "Error occoured",
                                        "error": err2
                                    });
                                }
                            });
                        }
                      
                    });

                }
                callback();
           
            }, function (response) {
                res.send({
                    "code": 200,
                    "message": "success"
                });
            
            });
       // }
        }
    });

});

module.exports = router;