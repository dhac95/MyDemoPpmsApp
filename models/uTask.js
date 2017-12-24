var db = require('../dbconnections'); //reference of dbconnection.js  
var uTask = {  
    getAlluTasks: function(callback) {  
        return db.query("select amz_teams.team_name , amz_builds.build_name , amz_task_desc.task_info , amz_sub_tasks.sub_task_name, amz_tasks.task_name , user_tasks.count , user_tasks.noofdevice , user_tasks.time, user_tasks.date , user_tasks.cmds from user_tasks inner join amz_teams on user_tasks.team_id = amz_teams.team_id inner join amz_builds on user_tasks.build = amz_builds.build_no left join amz_task_desc on user_tasks.task_desc = amz_task_desc.tdi_no inner join amz_sub_tasks on user_tasks.sub_task_id = amz_sub_tasks.sub_task_id inner join amz_tasks on user_tasks.tasks_id = amz_tasks.task_id", callback);  
    },  
    getuTaskById: function(id, callback) {  
        return db.query("select amz_teams.team_name , amz_builds.build_name , amz_task_desc.task_info , amz_sub_tasks.sub_task_name, amz_tasks.task_name , user_tasks.count , user_tasks.noofdevice , user_tasks.time, user_tasks.date , user_tasks.cmds from user_tasks inner join amz_teams on user_tasks.team_id = amz_teams.team_id inner join amz_builds on user_tasks.build = amz_builds.build_no left join amz_task_desc on user_tasks.task_desc = amz_task_desc.tdi_no inner join amz_sub_tasks on user_tasks.sub_task_id = amz_sub_tasks.sub_task_id inner join amz_tasks on user_tasks.tasks_id = amz_tasks.task_id where user_id =?", [id], callback);  
    },  
    adduTask: function(uTask, callback) {  
        return db.query("INSERT INTO user_tasks(user_id,team_id,build,tasks_id,sub_task_id,task_desc,count,noofdevice,time,date,on_time,cmds,create_date,maintain_date) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [Task.user_id,Task.team_id,Task.build,Task.tasks_id,Task.sub_task_id,Task.task_desc,Task.count,Task.noofdevice,Task.time,Task.date,Task.on_time,Task.cmds,Task.create_date,Task.maintain_date], callback);  
    },  
    deleteuTask: function(id, callback) {  
        return db.query("delete from user_tasks where task_id=?", [id], callback);  
    },  
    updateuTask: function(id, uTask, callback) {  
        return db.query("update user_tasks set ?  where task_id= ?", [uTask , id], callback);  
    }  
};  
module.exports = uTask;  