var db = require('../dbconnections'); //reference of dbconnection.js  
var subTask = {  
    getAllsubTasks: function(callback) {  
        return db.query("select amz_sub_tasks.sub_task_id , amz_sub_tasks.team_id , amz_teams.team_name , amz_sub_tasks.task_id , amz_tasks.task_name , amz_sub_tasks.sub_task_name , amz_sub_tasks.cf_change , amz_sub_tasks.about_cf , amz_sub_tasks.op_type , amz_sub_tasks.about_chart , amz_sub_tasks.task_status , amz_sub_tasks.deletion , amz_sub_tasks.last_modify_by , amz_login.user_name as Modified , amz_sub_tasks.create_date , amz_sub_tasks.maintain_date from amz_sub_tasks inner join amz_teams on amz_sub_tasks.team_id = amz_teams.team_id inner join amz_tasks on amz_sub_tasks.task_id = amz_tasks.task_id left join amz_login on amz_sub_tasks.last_modify_by = amz_login.user_id", callback);  
    },  
    getsubTaskById: function(id, callback) {  
        return db.query("select amz_sub_tasks.sub_task_id , amz_sub_tasks.team_id , amz_teams.team_name , amz_sub_tasks.task_id , amz_tasks.task_name , amz_sub_tasks.sub_task_name , amz_sub_tasks.cf_change , amz_sub_tasks.about_cf , amz_sub_tasks.op_type , amz_sub_tasks.about_chart , amz_sub_tasks.task_status , amz_sub_tasks.deletion , amz_sub_tasks.last_modify_by , amz_login.user_name as Modified , amz_sub_tasks.create_date , amz_sub_tasks.maintain_date from amz_sub_tasks inner join amz_teams on amz_sub_tasks.team_id = amz_teams.team_id inner join amz_tasks on amz_sub_tasks.task_id = amz_tasks.task_id left join amz_login on amz_sub_tasks.last_modify_by = amz_login.user_id where amz_sub_tasks.team_id = ? AND amz_sub_tasks.deletion = 0 ORDER BY sub_task_id DESC", [id], callback);  
    },  
    addsubTask: function(subTask, callback) {  
        return db.query("INSERT INTO amz_sub_tasks(team_id,task_id,sub_task_name,cf_change,about_cf,op_type,about_chart ,task_status,deletion,last_modify_by,create_date,maintain_date) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [subTask.team_id, subTask.task_id, subTask.sub_task_name, '0', subTask.about_cf, subTask.op_type, subTask.about_chart, subTask.task_status, '0' ,subTask.last_modify_by,subTask.create_date,subTask.maintain_date], callback);  
    },  
    deletesubTask: function (subTask, callback) {  
        return db.query("UPDATE amz_sub_tasks SET deletion = 1 where sub_task_id=?", [subTask.sub_task_id], callback);  
    },  
    updatesubTask: function(id, subTask, callback) {  
        return db.query("update amz_sub_tasks set team_id = ?,task_id = ?,sub_task_name = ?,cf_change = ?,about_cf = ?,op_type = ?,about_chart = ? , task_status = ? , last_modify_by = ?,maintain_date=?  where sub_task_id= ?", [subTask.team_id, subTask.task_id, subTask.sub_task_name, '0', subTask.about_cf, subTask.op_type, subTask.about_chart,subTask.task_status,subTask.last_modify_by,subTask.maintain_date , id], callback);  
    }  
};  
module.exports = subTask;  