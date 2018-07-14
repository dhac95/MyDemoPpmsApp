var express = require('express');
var md5 = require('md5');
var router = express.Router();
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var db = require('../dbconnections'); //reference of dbconnection.js  

function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-5) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

router.post('/', function (req, res, next) {
    var where1, where2, where3, where4, where5, where6, whereN;
    where1 = where2 = where3 = where4 = where5 = where6 = whereN = "";


    var d1 = datetime.create(req.body.From).format('Y-m-d');
    var d2 = datetime.create(req.body.To).format('Y-m-d');
    var team = req.body.team_id;
    var task = req.body.tasks_id;
    var subTask = req.body.sub_task_id;
    var userID = req.body.user_id;
    var taskDesc = req.body.task_desc;
    var userOT = req.body.user_ot;


    if (userOT) {
        if (d1 == "" && d2 == "") {

        } else if (d1 == "" && d2 != "") {

        } else if (d1 != "" && d2 == "") {

        } else {
            where1 = " date between ? and ?";
        }
        if (team != "") {
            where2 = " AND user_tasks_ot.team_id = " + team;
        }
        if (task != undefined && task.length != 0) {
            where3 = " AND user_tasks_ot.tasks_id in (" + task + ")";
        }
        if (subTask != undefined && subTask.length != 0) {
            where4 = " AND user_tasks_ot.sub_task_id in (" + subTask + ")";
        }
        if (taskDesc != undefined) {
            where5 = " AND user_tasks_ot.task_desc = " + taskDesc;
        }
        if (userID != undefined && userID.length != 0) {
            where6 = " AND user_tasks_ot.user_id in (" + userID + ")";
        }

        whereN = where1 + where2 + where3 + where4 + where5 + where6;

        db.query('SELECT user_tasks_ot.task_id , user_tasks_ot.user_id , amz_login.user_name ,user_tasks_ot.team_id , amz_teams.team_name ,user_tasks_ot.build, amz_builds.build_name ,user_tasks_ot.tasks_id, amz_tasks.task_name , user_tasks_ot.sub_task_id,amz_sub_tasks.sub_task_name ,user_tasks_ot.task_desc ,amz_task_desc.task_info , user_tasks_ot.count , user_tasks_ot.noofdevice , user_tasks_ot.work_type , user_tasks_ot.cf , user_tasks_ot.wu , user_tasks_ot.wu_status , user_tasks_ot.time , user_tasks_ot.date , user_tasks_ot.cmds , user_tasks_ot.user_type , user_tasks_ot.modified_by , user_tasks_ot.create_date , user_tasks_ot.maintain_date FROM user_tasks_ot LEFT JOIN amz_builds ON  user_tasks_ot.build = amz_builds.build_no INNER JOIN amz_tasks ON user_tasks_ot.tasks_id = amz_tasks.task_id LEFT JOIN amz_sub_tasks ON user_tasks_ot.sub_task_id = amz_sub_tasks.sub_task_id LEFT JOIN amz_task_desc ON user_tasks_ot.task_desc = amz_task_desc.task_id INNER JOIN amz_teams on user_tasks_ot.team_id = amz_teams.team_id INNER JOIN amz_login ON user_tasks_ot.user_id = amz_login.user_id WHERE' + whereN + ' ORDER BY date', [d1, d2], function (error, results, fields) {
            if (error) {
                res.send(error);
            } else {
                res.send(results);
            }
        });
    } else {
        if (d1 == "" && d2 == "") {

        } else if (d1 == "" && d2 != "") {

        } else if (d1 != "" && d2 == "") {

        } else {
            where1 = " date between ? and ?";
        }
        if (team != "") {
            where2 = " AND user_tasks.team_id = " + team;
        }
        if (task != undefined && task.length != 0) {
            where3 = " AND user_tasks.tasks_id in (" + task + ")";
        }
        if (subTask != undefined && subTask.length != 0) {
            where4 = " AND user_tasks.sub_task_id in (" + subTask + ")";
        }
        if (taskDesc != undefined) {
            where5 = " AND user_tasks.task_desc = " + taskDesc;
        }
        if (userID != undefined && userID.length != 0) {
            where6 = " AND user_tasks.user_id in (" + userID + ")";
        }

        whereN = where1 + where2 + where3 + where4 + where5 + where6;
        db.query('SELECT user_tasks.task_id , user_tasks.user_id , amz_login.user_name , user_tasks.team_id , amz_teams.team_name ,user_tasks.build, amz_builds.build_name ,user_tasks.tasks_id, amz_tasks.task_name , user_tasks.sub_task_id,amz_sub_tasks.sub_task_name ,user_tasks.task_desc ,amz_task_desc.task_info , user_tasks.count , user_tasks.noofdevice , user_tasks.work_type , user_tasks.cf , user_tasks.wu , user_tasks.wu_status , user_tasks.time , user_tasks.date , user_tasks.ON_time , user_tasks.cmds , user_tasks.user_type , user_tasks.modified_by , user_tasks.create_date , user_tasks.maintain_date FROM user_tasks LEFT JOIN amz_builds ON  user_tasks.build = amz_builds.build_no INNER JOIN amz_tasks ON user_tasks.tasks_id = amz_tasks.task_id LEFT JOIN amz_sub_tasks ON user_tasks.sub_task_id = amz_sub_tasks.sub_task_id LEFT JOIN amz_task_desc ON user_tasks.task_desc = amz_task_desc.task_id INNER JOIN amz_teams on user_tasks.team_id = amz_teams.team_id INNER JOIN amz_login ON user_tasks.user_id = amz_login.user_id where' + whereN + ' ORDER BY date', [d1, d2], function (error, results, fields) {
            if (error) {
                res.send(error);
            } else {
                res.send(results);
            }
        });
    }
});


router.post('/getTotalTime', function (req, res, next) {
    var where1, where2, where3, where4, where5, where6, whereN;
    where1 = where2 = where3 = where4 = where5 = where6 = whereN = "";

    var d1 = datetime.create(req.body.From).format('Y-m-d');
    var d2 = datetime.create(req.body.To).format('Y-m-d');
    var team = req.body.team_id;
    var task = req.body.tasks_id;
    var subTask = req.body.sub_task_id;
    var userID = req.body.user_id;
    var taskDesc = req.body.task_desc;
    var userOT = req.body.user_ot;


    if (userOT) {
        if (d1 == "" && d2 == "") {

        } else if (d1 == "" && d2 != "") {

        } else if (d1 != "" && d2 == "") {

        } else {
            where1 = " date between ? and ?";
        }
        if (team != "") {
            where2 = " AND user_tasks_ot.team_id = " + team;
        }
        if (task != undefined && task.length != 0) {
            where3 = " AND user_tasks_ot.tasks_id in (" + task + ")";
        }
        if (subTask != undefined && subTask.length != 0) {
            where4 = " AND user_tasks_ot.sub_task_id in (" + subTask + ")";
        }
        if (taskDesc != undefined) {
            where5 = " AND user_tasks_ot.task_desc = " + taskDesc;
        }
        if (userID != undefined && userID.length != 0) {
            where6 = " AND user_tasks_ot.user_id=  (" + userID + ")";
        }
        whereN = where1 + where2 + where3 + where4 + where5 + where6;

        var secs = 0;
        db.query('select time from user_tasks_ot where ' + whereN, [d1, d2], function (error, results, fields) {
            if (error) {
                res.send(error);

            } else {
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                    }
                    // var remainSecs = 28800 - secs;
                    //  var remainHours = secondsToHms(remainSecs);
                    var TotalHours = secondsToHms(secs);
                    res.json({
                        total: TotalHours
                    });
                } else {
                    var TotalHours = 0;
                    res.json({
                        total: TotalHours
                    });
                }
            }
        });

    } else {
        if (d1 == "" && d2 == "") {

        } else if (d1 == "" && d2 != "") {

        } else if (d1 != "" && d2 == "") {

        } else {
            where1 = " date between ? and ?";
        }
        if (team != "") {
            where2 = " AND user_tasks.team_id = " + team;
        }
        if (task != undefined && task.length != 0) {
            where3 = " AND user_tasks.tasks_id in (" + task + ")";
        }
        if (subTask != undefined && subTask.length != 0) {
            where4 = " AND user_tasks.sub_task_id in (" + subTask + ")";
        }
        if (taskDesc != undefined) {
            where5 = " AND user_tasks.task_desc = " + taskDesc;
        }
        if (userID != undefined && userID.length != 0) {
            where6 = " AND user_tasks.user_id in (" + userID + ")";
        }
        whereN = where1 + where2 + where3 + where4 + where5 + where6;

        var secs = 0;
        db.query('select time from user_tasks where ' + whereN, [d1, d2], function (error, results, fields) {
            if (error) {
                res.send(error);

            } else {
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                    }
                    // var remainSecs = 28800 - secs;
                    //  var remainHours = secondsToHms(remainSecs);
                    var TotalHours = secondsToHms(secs);
                    res.json({
                        total: TotalHours
                    });
                } else {
                    var TotalHours = 0;
                    res.json({
                        total: TotalHours
                    });
                }
            }
        });

    }

});

module.exports = router;