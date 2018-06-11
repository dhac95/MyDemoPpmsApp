var express = require('express');
var router = express.Router();
var db = require('../dbconnections');
var moment = require('moment');
var async = require("async");
var nodestrtotime = require('nodestrtotime');

function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-4) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

function secondsToAvg(num) {
    num = Number(num);

    var h = Math.floor(num / 3600);
    var m = Math.floor(num % 3600 / 60);
    var value = (h + m) / 8;
    return value;
}

router.post('/', function (req, res, next) {
            var where1, where2, where3, where4, where5, where6, whereN;
            where1 = where2 = where3 = where4 = where5 = where6 = whereN = "";

            var d1 = moment(req.body.From).format('YYYY-MM-DD');
            var d2 = moment(req.body.To).format('YYYY-MM-DD');
            var dateToMonthFirst = moment(req.body.From).format('MMMM YYYY');
            var dateToMonthSecond = moment(req.body.To).format('MMMM YYYY');
            var team = req.body.team_id;
            var userID = req.body.user_id;
            var userOT = req.body.user_ot;

            var secs = 0;
            var count = 0;
            var wu = 0;
            var TotalHours = 0;
            var sub_task_list = [];
            //   if (userOT) {
                  db.query("select distinct sub_task from amz_daily_target where month_from in (? , ?) and team = ? and ms_non_ms = '1' and about_cf = 1 and wu_status = 1 and sub_task is NOT NULL;", [dateToMonthFirst, dateToMonthSecond, team], function (e, r, f) {
                      if(e) {
                          res.send(e);
                      } else {
                          if(r.length > 0) {
                              for (var i = 0; i < r.length; i++) {
                                sub_task_list.push(r[i].sub_task);
                              }
                              if(userOT) {
                              db.query("SELECT user_tasks_ot.time , user_tasks_ot.count, user_tasks_ot.wu  FROM user_tasks_ot  where date between ? and ?  and sub_task_id in (?) and wu_status = 1 ", [d1, d2, sub_task_list], function (error, results, fields) {
                                  if(error){
                                      res.send({
                                          "code" : 200 , 
                                          "message" : "Error Occoured"
                                      });
                                  } else {
                                       if (results.length > 0) {
                                           for (var i = 0; i < results.length; i++) {
                                               secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                                           }
                                           for (var j = 0; j < results.length; j++) {
                                               count = count + results[j].count;
                                           }
                                           for (var k = 0; k < results.length; k++) {
                                               wu = wu + results[k].wu;
                                           }
                                           wu = Number(wu).toFixed(2);
                                           TotalHours = secondsToHms(secs);
                                           var diffHour = secondsToAvg(secs);
                                           var avgWu = wu / diffHour;
                                           res.json({
                                               "total": TotalHours,
                                               "workunit": wu,
                                               "Count": count,
                                               "AverageWorkUnit": avgWu
                                           });
                                        } else {
                                             TotalHours = 0;
                                             res.json({
                                                 total: TotalHours
                                             });
                                        }

                                  }   
                              });
                          } else {
                              db.query("SELECT user_tasks.time , user_tasks.count, user_tasks.wu  FROM user_tasks  where date between ? and ? and sub_task_id in (?) and wu_status = 1", [d1, d2, sub_task_list], function (error, results, fields) {
                                  if (error) {
                                      res.send(error);
                                  } else {
                                      if (results.length > 0) {

                                          for (var i = 0; i < results.length; i++) {
                                              secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                                          }
                                          for (var j = 0; j < results.length; j++) {
                                              count = count + results[j].count - 0;
                                          }
                                          for (var k = 0; k < results.length; k++) {
                                              wu = wu + results[k].wu - 0.0;
                                          }
                                          wu = Number(wu).toFixed(2);
                                          TotalHours = secondsToHms(secs);
                                          var diffHour = secondsToAvg(secs);
                                          var avgWu = Number(wu / diffHour).toFixed(2);
                                          res.json({
                                              "total": TotalHours,
                                              "workunit": wu,
                                              "Count": count,
                                              "AverageWorkUnit": avgWu
                                          });
                                      } else {
                                          TotalHours = 0;
                                          res.json({
                                              total: TotalHours
                                          });
                                      }
                                  }
                              });
                          }
                        }
                        else {
                              res.send({
                                  "code" : 301,
                                  "message" : "No data available"

                              });
                          }
                      }
                  });
            
        });

router.post('/user' , function(req , res , next ) {
      var d1 = moment(req.body.From).format('YYYY-MM-DD');
      var d2 = moment(req.body.To).format('YYYY-MM-DD');
      var dateToMonthFirst = moment(req.body.From).format('MMMM YYYY');
      var dateToMonthSecond = moment(req.body.To).format('MMMM YYYY');
      var team = req.body.team_id;
      var userID = req.body.user_id;
      var userOT = req.body.user_ot;
      var queryError = [];
      var userData = [];

    //  var secs = 0;
    //  var count = 0;
    //  var wu = 0;
    //  var TotalHours = 0;
        var sub_task_list = [];
      db.query("select distinct sub_task from amz_daily_target where month_from in (? , ?) and team = ? and ms_non_ms = '1' and about_cf = 1 and wu_status = 1 and sub_task is NOT NULL;", [dateToMonthFirst, dateToMonthSecond, team], function (e, r, f) {
                  if (e) {
                      res.send(e);
                  } else if(r.length > 0) {
                        for (var i = 0; i < r.length; i++) {
                            sub_task_list.push(r[i].sub_task);
                        }
                       db.query('select amz_user_info.s_no, amz_user_info.user_id , amz_login.user_name , amz_user_info.team_id  from amz_user_info inner join amz_login on amz_user_info.user_id = amz_login.user_id where amz_user_info.team_id = ? and amz_user_info.status = 1 ', [team], function (err, res1, feild1) {
                           if(err) {
                               res.send(err);
                           } 
                            if (userOT) {
                                     async.each(res1, function (single, callback) {
                                         var secs = 0;
                                         var count = 0;
                                         var wu = 0;
                                         var TotalHours = 0;
                                         db.query("SELECT user_tasks_ot.time , user_tasks_ot.count, user_tasks_ot.wu  FROM user_tasks_ot  WHERE where date between ? and ? and AND user_tasks_ot.user_id = ?  and sub_task_id in (?) and wu_status = 1", [d1, d2, single.user_id, sub_task_list], function (error, results, fields) {
                                             if (error) {
                                                 queryError.push(error);
                                             } else {
                                                 if (results.length > 0) {
                                                     for (var i = 0; i < results.length; i++) {
                                                         secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                                                     }
                                                     for (var j = 0; j < results.length; j++) {
                                                         count = count + results[j].count;
                                                     }
                                                     for (var k = 0; k < results.length; k++) {
                                                         wu = wu + results[k].wu;
                                                     }
                                                     wu = Number(wu).toFixed(3);
                                                     TotalHours = secondsToHms(secs);
                                                     var diffHour = secondsToAvg(secs);
                                                     var avgWu = Number(wu / diffHour).toFixed(2);

                                                     userData.push({
                                                         "total": TotalHours,
                                                         "workunit": wu,
                                                         "Count": count,
                                                         "AverageWorkUnit": avgWu,
                                                         "UserName": single.user_name,
                                                     });
                                                 }
                                             }
                                             callback();
                                         });
                                     }, function (response) {
                                         if (queryError.length > 0) {
                                             res.send(queryError);
                                         } else {
                                             res.send(userData);
                                         }

                                     });
                            } else {
                                      async.each(res1, function (single, callback) {
                                          var secs = 0;
                                          var count = 0;
                                          var wu = 0;
                                          var TotalHours = 0;

                                          db.query("SELECT user_tasks.time , user_tasks.count, user_tasks.wu  FROM user_tasks where  date between ? and ? AND user_tasks.user_id = ? and sub_task_id in (?)  and wu_status = 1", [d1, d2, single.user_id, sub_task_list], function (error, results, fields) {
                                              if (error) {
                                                  queryError.push(error);
                                              } else {
                                                  if (results.length > 0) {

                                                      for (var i = 0; i < results.length; i++) {
                                                          secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                                                      }
                                                      for (var j = 0; j < results.length; j++) {
                                                          count = count + results[j].count;
                                                      }
                                                      for (var k = 0; k < results.length; k++) {
                                                          wu = wu + results[k].wu;
                                                      }

                                                      wu = Number(wu).toFixed(2);
                                                      TotalHours = secondsToHms(secs);
                                                      var diffHour = secondsToAvg(secs);
                                                      var avgWu = Number(wu / diffHour).toFixed(2);
                                                      userData.push({
                                                          "total": TotalHours,
                                                          "workunit": wu,
                                                          "Count": count,
                                                          "AverageWorkUnit": avgWu,
                                                          "UserName": single.user_name,
                                                      });
                                                  }
                                              }
                                              callback();
                                          });

                                      }, function (response) {
                                          if (queryError.length > 0) {
                                              res.send(queryError);
                                          } else {
                                              res.send(userData);
                                          }
                                      });
                            }
                       });
                  }
                
                });

});

router.post('/task' , function(req , res , next) {
  var d1 = moment(req.body.From).format('YYYY-MM-DD');
  var d2 = moment(req.body.To).format('YYYY-MM-DD');
  var dateToMonthFirst = moment(req.body.From).format('MMMM YYYY');
  var dateToMonthSecond = moment(req.body.To).format('MMMM YYYY');
  var team = req.body.team_id;
  var userOT = req.body.user_ot;

  var secs = 0;
   var count = 0;
   var wu = 0;
   var TotalHours = 0;

   var sub_task_list = [];
 db.query("select distinct sub_task from amz_daily_target where month_from in (? , ?) and team = ? and ms_non_ms = '1' and about_cf = '1' and sub_task is NOT NULL;", [dateToMonthFirst, dateToMonthSecond, team], function (e, r, f) {
             if (e) {
                 res.send(e);
             } else if(r.length > 0) {
                   for (var i = 0; i < r.length; i++) {
                       sub_task_list.push(r[i].sub_task);
                   }
                   if (userOT) {
                        db.query("SELECT SEC_TO_TIME( SUM( TIME_TO_SEC( user_tasks_ot.time ) ) ) AS total   , user_tasks_ot.time , sum(user_tasks_ot.count) as Count , sum(user_tasks_ot.wu) as workunit,  (sum(user_tasks_ot.wu) / SUM( TIME_TO_SEC( user_tasks_ot.time ) ) * 28800 ) as AverageWorkUnit  , amz_tasks.task_name AS task_name FROM user_tasks_ot INNER JOIN amz_tasks ON user_tasks_ot.tasks_id = amz_tasks.task_id where date between ? and ? and user_tasks_ot.sub_task_id in (?) group by user_tasks_ot.tasks_id ", [d1, d2, sub_task_list], function (error, results, fields) {
                            if(error) {
                                res.send({
                                    "code" : 304,
                                    "message" : "Sql Error"
                                });
                            } else {
                                res.send(resultsa);
                            }
                        });
                   } else {
                        db.query("SELECT SEC_TO_TIME( SUM( TIME_TO_SEC( user_tasks.time ) ) ) AS total   , user_tasks.time , sum(user_tasks.count) as Count, sum(user_tasks.wu) as workunit,  (sum(user_tasks.wu) / SUM( TIME_TO_SEC( user_tasks.time ) ) * 28800 ) as AverageWorkUnit , amz_tasks.task_name AS task_name FROM user_tasks INNER JOIN amz_tasks ON user_tasks.tasks_id = amz_tasks.task_id where date between ? and ? and sub_task_id in (?)  group by user_tasks.tasks_id ", [d1, d2, sub_task_list], function(e2 , r2 , f2){
                                if(e2) {
                                    res.send({
                                        "code" : 304 , 
                                        "message" : "Sql error"
                                    });
                                } else {
                                    res.send(r2);
                                }
                        });
                   }

             } else {

             }

            });

});

router.post('/subtask' , function(req , res , next){
      var d1 = moment(req.body.From).format('YYYY-MM-DD');
      var d2 = moment(req.body.To).format('YYYY-MM-DD');
      var dateToMonthFirst = moment(req.body.From).format('MMMM YYYY');
      var dateToMonthSecond = moment(req.body.To).format('MMMM YYYY');
      var team = req.body.team_id;
      var userOT = req.body.user_ot;
      var sub_task_list = [];
      var secs = 0;
      var count = 0;
      var wu = 0;
      var TotalHours = 0;

      db.query("select distinct sub_task from amz_daily_target where month_from in (? , ?) and team = ? and ms_non_ms = '1' and about_cf = '1' and sub_task is NOT NULL;", [dateToMonthFirst, dateToMonthSecond, team], function (e, r, f) {
            if(e) {
                res.send(e);
            } else if(r.length > 0) {
                   for (var i = 0; i < r.length; i++) {
                       sub_task_list.push(r[i].sub_task);
                   }
                   if(userOT) {
                        db.query("SELECT SEC_TO_TIME( SUM( TIME_TO_SEC( user_tasks_ot.time ) ) ) AS total   , user_tasks_ot.time , sum(user_tasks_ot.count) as Count , sum(user_tasks_ot.wu) as workunit,  (sum(user_tasks_ot.wu) / SUM( TIME_TO_SEC( user_tasks_ot.time ) ) * 28800 ) as AverageWorkUnit  , amz_sub_tasks.sub_task_name AS sub_task_name ,  amz_tasks.task_name AS task_name FROM user_tasks_ot INNER JOIN amz_tasks ON user_tasks.tasks_id = amz_tasks.task_id LEFT JOIN amz_sub_tasks ON user_tasks_ot.sub_task_id = amz_sub_tasks.sub_task_id where date between ? and ? and user_tasks_ot.sub_task_id in (?) group by user_tasks_ot.sub_task_id ", [d1, d2, sub_task_list], function (error, results, fields) {
                            if (error) {
                                res.send({
                                    "code": 304,
                                    "message": "Sql Error",
                                     "error": error
                                });
                            } else {
                                res.send(results);
                            }
                        });
                   } else {
                         db.query("SELECT SEC_TO_TIME( SUM( TIME_TO_SEC( user_tasks.time ) ) ) AS total   , user_tasks.time , sum(user_tasks.count) as Count, sum(user_tasks.wu) as workunit,  (sum(user_tasks.wu) / SUM( TIME_TO_SEC( user_tasks.time ) ) * 28800 ) as AverageWorkUnit , amz_sub_tasks.sub_task_name AS sub_task_name , amz_tasks.task_name AS task_name FROM user_tasks LEFT JOIN amz_sub_tasks ON user_tasks.sub_task_id = amz_sub_tasks.sub_task_id INNER JOIN amz_tasks ON user_tasks.tasks_id = amz_tasks.task_id  where date between ? and ? and user_tasks.sub_task_id in (?)  group by user_tasks.sub_task_id ", [d1, d2, sub_task_list], function (e2, r2, f2) {
                             if (e2) {
                                 res.send({
                                     "code": 304,
                                     "message": "Sql error",
                                     "error" : e2
                                 });
                             } else {
                                 res.send(r2);
                             }
                         });
                   }
            }
      });


});

module.exports = router;