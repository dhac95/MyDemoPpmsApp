var express = require('express');
var md5 = require('md5');
var router = express.Router();
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var generator = require('generate-password');
var nodemailer = require('nodemailer');
var in_array = require('in_array');
var moment = require('moment');
//var inArray = require('in-array');

var db = require('../dbconnections');

var uTask = require('../models/uTask');  



router.post('/thismonth' , function(req , res , next) {
    var From = moment(req.body.from).format('YYYY-MM-DD');
    var To = moment(req.body.to).format('YYYY-MM-DD');
    var user = req.body.user_id;

    db.query("select user_tasks.task_id, user_tasks.user_id, amz_login.user_name, user_tasks.team_id , amz_teams.team_name , user_tasks.build ,amz_builds.build_name , user_tasks.task_desc , amz_task_desc.task_info , user_tasks.sub_task_id , amz_sub_tasks.sub_task_name, user_tasks.task_id , amz_tasks.task_name , user_tasks.count , user_tasks.noofdevice , user_tasks.time, user_tasks.date , user_tasks.cmds from user_tasks inner join amz_teams on user_tasks.team_id = amz_teams.team_id inner join amz_builds on user_tasks.build = amz_builds.build_no left join amz_task_desc on user_tasks.task_desc = amz_task_desc.tdi_no inner join amz_sub_tasks on user_tasks.sub_task_id = amz_sub_tasks.sub_task_id inner join amz_tasks on user_tasks.tasks_id = amz_tasks.task_id inner join amz_login on user_tasks.user_id = amz_login.user_id where user_tasks.user_id = ? and date between ? and ? order by date ASC", [user , From , To] , function(e , r, f){
        if(e) {
            res.send(e);
        } else {
            res.send(r);
        }
    });
});


router.get('/:id?', function(req, res, next) {  
    if (req.params.id) {  
        uTask.getuTaskById(req.params.id, function(err, rows) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(rows);  
            }  
        });  
    } else {  
        uTask.getAlluTasks(function(err, rows) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(rows);  
            }  
        });  
    }  
});  
router.post('/', function(req, res, next) {  
    uTask.adduTask(req.body, function(err, count) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(req.body); //or return count for 1 & 0  
        }  
    });  
});  
router.delete('/:id', function(req, res, next) {  
    uTask.deleteuTask(req.params.id, function(err, count) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(count);  
        }  
    });  
});  
router.put('/:id', function(req, res, next) {  
    uTask.updateuTask(req.params.id, req.body, function(err, rows) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(rows);  
        }  
    });  
});  
module.exports = router;  