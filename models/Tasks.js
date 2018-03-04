var db = require('../dbconnections'); //reference of dbconnection.js  
var Tasks = {  
    getAllTasks: function(callback) {  
        return db.query("select amz_tasks.task_id, amz_tasks.team_id ,amz_teams.team_name , amz_tasks.task_name , amz_tasks.added_by , added.user_name as AddedBy, amz_tasks.status , amz_tasks.about_cf , amz_tasks.have_st , amz_tasks.device_count , amz_tasks.have_tdi , amz_tasks.tdi_type , amz_tasks.op_type , amz_tasks.have_complexity , amz_tasks.about_chart , amz_tasks.deletion , amz_tasks.last_modified_by , modified.user_name as ModifiedBy , amz_tasks.create_date , amz_tasks.maintain_date from amz_tasks inner join amz_teams on amz_tasks.team_id = amz_teams.team_id  inner join amz_login added on (amz_tasks.added_by = added.user_id) left join amz_login modified on (amz_tasks.last_modified_by = modified.user_id)  order by task_id desc", callback);  
    },  
    getTaskById: function(id, callback) {  
        return db.query("select amz_tasks.task_id, amz_tasks.team_id ,amz_teams.team_name , amz_tasks.task_name , amz_tasks.added_by , added.user_name as AddedBy, amz_tasks.status ,  amz_tasks.about_cf , amz_tasks.have_st , amz_tasks.device_count , amz_tasks.have_tdi , amz_tasks.tdi_type , amz_tasks.op_type , amz_tasks.have_complexity , amz_tasks.about_chart , amz_tasks.deletion , amz_tasks.last_modified_by , modified.user_name as ModifiedBy , amz_tasks.create_date , amz_tasks.maintain_date from amz_tasks inner join amz_teams on amz_tasks.team_id = amz_teams.team_id  inner join amz_login added on (amz_tasks.added_by = added.user_id) left join amz_login modified on (amz_tasks.last_modified_by = modified.user_id) where amz_tasks.team_id=? AND deletion = 0  ORDER BY task_id DESC", [id], callback);  
    },  
    addTask: function(Task, callback) {  
        return db.query("INSERT INTO amz_tasks(team_id,task_name,added_by,status,about_cf,have_st,have_tdi,tdi_type,op_type,deletion, about_chart , create_date,maintain_date , last_modified_by , device_count)  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [Task.team_id, Task.task_name, Task.added_by, Task.status, Task.about_cf, Task.have_st, Task.have_tdi, Task.tdi_type, Task.op_type, '0', Task.about_chart, Task.create_date, Task.maintain_date, Task.last_modified_by, Task.device_count], callback);  
    },  
    deleteTask: function (Task, callback) {  
        return db.query("UPDATE amz_tasks SET deletion = 1 where amz_tasks.task_id =?", [Task.task_id], callback);  
    },  
    updateTask: function(id, Task, callback) {  
        return db.query("update amz_tasks set  team_id = ?,task_name = ?,status = ?,about_cf = ?,have_st = ?,have_tdi = ?,tdi_type = ?,op_type = ?, about_chart = ? , maintain_date = ?, last_modified_by=? , device_count = ? where amz_tasks.task_id = ?", [Task.team_id, Task.task_name, Task.status, Task.about_cf, Task.have_st, Task.have_tdi, Task.tdi_type, Task.op_type, Task.about_chart, Task.maintain_date, Task.last_modified_by, Task.device_count , id], callback);  
    }  
};  
module.exports = Tasks;  