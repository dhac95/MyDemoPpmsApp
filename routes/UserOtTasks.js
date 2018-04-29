var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var db = require('../dbconnections'); //reference of dbconnection.js 
// var testAddTask = require('../models/testAddTask');

function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2); //+ ":" + ('0' + s).slice(-2);
}

router.post('/', function(req, res, next) {

    var temp_date = datetime.create(req.body.date);
    var Date = temp_date.format('Y-m-d');
    var team = req.body.team_id;
    var userID = req.body.user_id;
    var Build = req.body.build;
    var TasksID = req.body.tasks_id;
    var subtask = req.body.sub_task_id;
    var taskDesc = req.body.task_desc;
    var temp_time = req.body.time;
    var Time = temp_time + ':00';
    var Count = req.body.count;
    var noOfDevice = req.body.noofdevice;
    var Cmds = req.body.cmds;
    var ontime = "Y";
    var actionDate = datetime.create().format('Y-m-d');
  //  var TasksID = req.body.tasks_id;

    var secs = 0;
    db.query("SELECT time FROM user_tasks_ot WHERE date=? AND user_id=?", [Date, userID ],function (error, results, fields) {
        if(results.length > 0){
            for (var i=0 ; i < results.length ; i++)
            {
                secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
            }
        var remainSecs = 57600 - secs;
        var remainHours = secondsToHms(remainSecs);
    }
    else{
       var remainHours = '16:00' ; 
       var remainSecs = '57600';
    }

    var givenTimeInSecs = nodestrtotime(Time) - nodestrtotime('00:00:00');
    if (givenTimeInSecs > remainSecs) {
        res.send({
            results : "Failed enter timelimit with 16 Hours"
                });
            }
            else {
            db.query("insert into user_tasks_ot (user_id,team_id,build,tasks_id,sub_task_id,task_desc,count,noofdevice,time,date,cmds,create_date,maintain_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?)" ,[userID,team,Build,TasksID,subtask,taskDesc,Count,noOfDevice,Time,Date,Cmds,actionDate,actionDate], function (error, results, fields) {
                if(error) {
                    res.send({
                        "code":400,
                        "failed":"error ocurred",
                        "results": error
                      });
                }
                else {
                    res.send({
                        "code":200,
                        "success":"passed",
                 });
             }
         });
        }
    }); 

});


router.put('/:id', function(req, res, next) {
    var id = req.params.id;
    var temp_date = datetime.create(req.body.date);
    var Date = temp_date.format('Y-m-d');
    var team = req.body.team_id;
    var userID = req.body.user_id;
    var Build = req.body.build;
    var TasksID = req.body.tasks_id;
    var subtask = req.body.sub_task_id;
    var taskDesc = req.body.task_desc;
   // var temp_time = 
    var Time = req.body.time;
    var Count = req.body.count;
    var noOfDevice = req.body.noofdevice;
    var Cmds = req.body.cmds;
    var ontime = "Y";
    var actionDate = datetime.create().format('Y-m-d');
    var userType = req.body.user_type;
  //  var TasksID = req.body.tasks_id;

    var secs = 0;
    db.query("SELECT time FROM user_tasks_ot WHERE date=? AND user_id=?", [Date, userID ],function (error, results, fields) {
        if(results.length > 0){
            for (var i=0 ; i < results.length ; i++)
            {
                secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
            }
        var remainSecs = 57600 - secs;
        var remainHours = secondsToHms(remainSecs);
    }
    else{
       var remainHours = '16:00' ; 
       var remainSecs = '57600';
    }

    var givenTimeInSecs = nodestrtotime(Time) - nodestrtotime('00:00:00');
    if (givenTimeInSecs > remainSecs) {
        res.send({
            results : "Failed enter timelimit with 8hrs"
                });
            }
            else {
            db.query("update user_tasks_ot set team_id = ?,build = ?,tasks_id = ?,sub_task_id = ?,task_desc = ?,count = ?,noofdevice = ?,time = ?,date = ?,cmds = ?,maintain_date = ? WHERE task_id = ?" ,[team,Build,TasksID,subtask,taskDesc,Count,noOfDevice,Time,Date,Cmds,actionDate, id], function (error, results, fields) {
                if(error) {
                    res.send({
                        "code":400,
                        "failed":"error ocurred",
                        "results" : error
                      });
                }
                else {
                    res.send({
                        "code":200,
                        "success":"passed",
                 });
             }
         });
        }
    }); 

});

router.delete('/:id', function(req, res, next) {
    var id = req.params.id ; 
    db.query('delete from user_tasks_ot where task_id = ?',[id], function(error , results , fields){
        if(error) {
            res.send({
                "code":400,
                "failed":"error ocurred",
              });
        }
        else {
            res.send({
                "code":200,
                "success":"passed",
            });
        }
         });

});

router.post('/reports', function(req, res, next) {  
   
    var tem_date = datetime.create(req.body.date);
    var date = tem_date.format('Y-m-d');
    var userID = req.body.user_id;

    db.query("SELECT user_tasks_ot.task_id , user_tasks_ot.user_id , amz_login.user_name ,user_tasks_ot.team_id, amz_teams.team_name ,user_tasks_ot.build, amz_builds.build_name ,user_tasks_ot.tasks_id, amz_tasks.task_name , user_tasks_ot.sub_task_id,amz_sub_tasks.sub_task_name , user_tasks_ot.task_desc , amz_task_desc.task_info , user_tasks_ot.count , user_tasks_ot.noofdevice , user_tasks_ot.work_type , user_tasks_ot.cf , user_tasks_ot.wu , user_tasks_ot.wu_status , user_tasks_ot.time , user_tasks_ot.date , user_tasks_ot.cmds ,user_tasks_ot.ot_status ,user_tasks_ot.act_by,user_tasks_ot.admin_cmds,user_tasks_ot.user_type , user_tasks_ot.modified_by , user_tasks_ot.create_date , user_tasks_ot.maintain_date FROM user_tasks_ot INNER JOIN amz_teams ON user_tasks_ot.team_id = amz_teams.team_id LEFT JOIN amz_builds ON  user_tasks_ot.build = amz_builds.build_no INNER JOIN amz_tasks ON user_tasks_ot.tasks_id = amz_tasks.task_id Left JOIN amz_sub_tasks ON user_tasks_ot.sub_task_id = amz_sub_tasks.sub_task_id LEFT JOIN amz_task_desc ON user_tasks_ot.task_desc = amz_task_desc.task_id INNER JOIN amz_login on user_tasks_ot.user_id = amz_login.user_id WHERE date= ? AND user_tasks_ot.user_id= ?", [date, userID] , function(error, results, fields){
            if(error) {
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                  });
            }
            else {
                res.send(results);
            }
    });

});  

router.post('/getTime', function (req, res, next) {
    var userID = req.body.user_id;
    var temp_date = datetime.create(req.body.date);
    var Date = temp_date.format('Y-m-d');
    var secs = 0;
    db.query("SELECT time FROM user_tasks_ot WHERE date=? AND user_id=?", [Date, userID], function (error, results, fields) {
        if (error) {
            res.send(error);
        }
        else {
            if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                }
                var remainSecs = 57600 - secs;
                var remainHours = secondsToHms(remainSecs);
                var TotalHours = secondsToHms(secs);
                res.json({
                    total: TotalHours,
                    remain: remainHours
                });
            }
            else {
                for (var i = 0; i < results.length; i++) {
                    secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                }
                var remainSecs = 57600 - secs;
                var remainHours = secondsToHms(remainSecs);
                var TotalHours = secondsToHms(secs);
                res.json({
                    total: '00:00',
                    remain: remainHours

                });
            }
        }
    });
});

module.exports = router; 