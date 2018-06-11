var express = require('express');
var md5 = require('md5');
var router = express.Router();
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var db = require('../dbconnections'); //reference of dbconnection.js 


router.post('/', function (req, res, next) {

    var tem_date = datetime.create(req.body.date);
    var date = tem_date.format('Y-m-d');
    var userID = req.body.user_id;

    db.query("SELECT user_tasks.task_id , user_tasks.user_id ,user_tasks.team_id, amz_teams.team_name ,user_tasks.build, amz_builds.build_name ,user_tasks.tasks_id, amz_tasks.task_name , user_tasks.sub_task_id,amz_sub_tasks.sub_task_name ,user_tasks.task_desc ,amz_task_desc.task_info , user_tasks.count , user_tasks.noofdevice , user_tasks.work_type , user_tasks.cf , user_tasks.wu , user_tasks.wu_status , user_tasks.time , user_tasks.date , user_tasks.ON_time , user_tasks.cmds , user_tasks.user_type , user_tasks.modified_by , user_tasks.create_date , user_tasks.maintain_date FROM user_tasks INNER JOIN amz_teams ON user_tasks.team_id = amz_teams.team_id LEFT JOIN amz_builds ON  user_tasks.build = amz_builds.build_no INNER JOIN amz_tasks ON user_tasks.tasks_id = amz_tasks.task_id LEFT JOIN amz_sub_tasks ON user_tasks.sub_task_id = amz_sub_tasks.sub_task_id LEFT JOIN amz_task_desc ON user_tasks.task_desc = amz_task_desc.task_id  WHERE date=? AND user_id= ?", [date, userID], function (error, results, fields) {
        if (error) {
            res.send({
                "code": 400,
                "failed": "error ocurred",
            });
        } else {
            res.send(results);
        }
    });

});

module.exports = router;