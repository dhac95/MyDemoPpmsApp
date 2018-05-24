var express = require('express');
var router = express.Router();
var nodestrtotime = require('nodestrtotime');
var in_array = require('in_array');
var db = require('../dbconnections');
var moment = require('moment');
var async = require("async");

router.post('/' , function(req , res , next){
  var team = req.body.team_id,
      task = req.body.task_id,
      subTask = req.body.sub_task_id;
  var tempDate = req.body.month;
  var conversionFactor = req.body.con_fac;
  var deviceCount = req.body.noofdevice;
  var percentage = req.body.percentage;
  var actionBy = req.body.action;
  var today = moment().format('YYYY-MM-DD');

  if(subTask != undefined) {
      db.query('SELECT * FROM amz_daily_target where team = ? AND task = ? AND sub_task = ? AND month_from = ? AND status= 1 AND deletion = 0 AND about_cf = 1', [team, task, subTask, tempDate], function (err, results, fields) {
          if(err) {
              res.send({
                    "code" : 300,
                    "message" : "Error while query daily target query"
              });
          }
           else if(results.length == 0 ) {
                res.send({
                    "code" : 405,
                    "message" : "Set Daily target and then set the device percentage"
                });
          } else if(results.length > 0) {
              db.query('SELECT * FROM amz_dc_units where team_id in (?) and task_id in (?) and sub_task_id in (?) and noofdevice in (?) and month = ? and status = 1', [team, task, subTask, deviceCount, tempDate] , function (err2 , results2 , fields2){
                if(err2) {
                    res.send({
                        "code" : 301,
                        "message" : "Error while dc unit query"
                    });
                } else if(results2.length > 0) {
                    db.query('UPDATE amz_dc_units set status = 1 , noofdevice = ? , percentage = ? , maintain_date = ? , modified_by = ?  WHERE team_id in (?) and task_id in (?) and sub_task_id in (?) and noofdevice in (?) and month = ?', [deviceCount, percentage, today, actionBy, team, task, subTask, deviceCount, tempDate] , function(err3 , results3 , fields3){
                        if(err3){
                            res.send({
                                    "code" : 302 , 
                                    "message" : "Error while update dc unit"
                            });
                        } else {
                            res.send({
                                "code": 200,
                                "message": "success"
                            });
                        }
                    });
                }  else {
                    db.query('INSERT INTO amz_dc_units(month , team_id , task_id , sub_task_id , noofdevice , percentage , status , modified_by , create_date , maintain_date) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ' ,
                     [tempDate , team , task , subTask , deviceCount , percentage , 1 , actionBy , today , today] , 
                     function(err4 ,results4 , fields4) {
                    if(err4) {
                        res.send({
                            "code" : 303 , 
                            "message" : "Error while insert dc"
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
  } else {
      db.query('SELECT * FROM amz_daily_target where team = ? AND task = ?  AND month_from = ? AND status= 1 AND deletion = 0 AND about_cf = 1', [team, task, tempDate], function (err5, results5, fields5) {
          if (err5) {
              res.send({
                  "code": 304,
                  "message": "Error while query daily target query"
              });
          } else if (results5.length == 0) {
              res.send({
                  "code": 305,
                  "message": "Set Daily target and then set the device percentage"
              });
          } else if (results5.length > 0) {
              db.query('SELECT * FROM amz_dc_units where team_id in (?) and task_id in (?)  and noofdevice in (?) and month = ? and status = 1 ', [team, task, deviceCount, tempDate], function (err6, results6, fields6) {
                  if (err6) {
                      res.send({
                          "code": 301,
                          "message": "Error while dc unit query"
                      });
                  } else if (results6.length > 0) {
                      db.query('UPDATE amz_dc_units set status = 1 , noofdevice = ? , percentage = ? , maintain_date = ? , modified_by = ?  WHERE team_id in (?) and task_id in (?)  and noofdevice in (?) and month = ?', 
                      [deviceCount, percentage, today, actionBy, team, task, deviceCount, tempDate], 
                      function (err7, results7, fields7) {
                          if (err7) {
                              res.send({
                                  "code": 302,
                                  "message": "Error while update dc unit"
                              });
                          } else {
                              res.send({
                                  "code": 200,
                                  "message": "success"
                              });
                          }
                      });
                  } else {
                      db.query('INSERT INTO amz_dc_units(month , team_id , task_id  , noofdevice , percentage , status , modified_by , create_date , maintain_date) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? ) ', 
                      [tempDate, team, task, deviceCount, percentage, 1, actionBy, today, today],
                          function (err8, results8, fields8) {
                              if (err8) {
                                  res.send({
                                      "code": 303,
                                      "message": "Error while insert dc"
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

router.post('/Get', function (req, res, next) {
    db.query('SELECT amz_dc_units.s_no , amz_dc_units.month , amz_dc_units.team_id , amz_teams.team_name , amz_dc_units.task_id , amz_tasks.task_name , amz_dc_units.sub_task_id , amz_sub_tasks.sub_task_name , amz_dc_units.noofdevice , amz_dc_units.percentage ,  amz_dc_units.modified_by ,amz_dc_units.status , amz_dc_units.create_date , amz_dc_units.maintain_date , ModifiedName.user_name as ModifiedBy FROM amz_dc_units LEFT JOIN amz_teams ON amz_dc_units.team_id = amz_teams.team_id LEFT JOIN amz_tasks ON amz_dc_units.task_id = amz_tasks.task_id LEFT JOIN amz_sub_tasks ON amz_dc_units.sub_task_id = amz_sub_tasks.sub_task_id LEFT JOIN amz_login as ModifiedName  ON amz_dc_units.modified_by = ModifiedName.user_id  WHERE amz_dc_units.month = ? AND amz_dc_units.team_id in (?) AND amz_dc_units.status = 1 ORDER BY amz_dc_units.s_no DESC',
     [req.body.month, req.body.team_id],
      function (errors, results, fields) {
        if (errors) {
            res.send(errors);
        } else {
            res.send(results);
        }
    });
});

router.post('/delete', function (req, res, next) {
    db.query('DELETE FROM amz_dc_units where s_no IN (?)', [req.body.s_no], function (errors, results, fields) {
        if (errors) {
            res.send(errors);
        } else {
            res.send({
                "code": 200,
                "message": "success",
                "result": results
            });
        }
    });
});

module.exports = router;