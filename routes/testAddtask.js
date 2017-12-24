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

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
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
    db.query("SELECT time FROM user_tasks WHERE date=? AND user_id=?", [Date, userID ],function (error, results, fields) {
        if(results.length > 0){
            for (var i=0 ; i < results.length ; i++)
            {
                secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
            }
        var remainSecs = 28800 - secs;
        var remainHours = secondsToHms(remainSecs);
    }
    else{
       var remainHours = '08:00:00' ; 
       var remainSecs = '28800';
    }

    var givenTimeInSecs = nodestrtotime(Time) - nodestrtotime('00:00:00');
    if (givenTimeInSecs > remainSecs) {
        res.send({
            results : "Failed enter timelimit with 8hrs"
                });
            }
            else {
            db.query("insert into user_tasks (user_id,team_id,build,tasks_id,sub_task_id,task_desc,count,noofdevice,time,date,on_time,cmds,create_date,maintain_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)" ,[userID,team,Build,TasksID,subtask,taskDesc,Count,noOfDevice,Time,Date,ontime,Cmds,actionDate,actionDate], function (error, results, fields) {
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
        }
    }); 

});

// router.post('/bydate', function(req, res, next) {  
   
//     var date = req.body.date;
//     var userId = req.body.user_id;

//     db.query("SELECT * FROM user_tasks WHERE date=? AND user_id= ?", [Date, userID ] , function(error, results, fields){
//             if(error) {
//                 res.send({
//                     "code":400,
//                     "failed":"error ocurred",
//                   });
//             }
//             else {
//                 res.send(results);
//             }
//     });

//});  

module.exports = router; 