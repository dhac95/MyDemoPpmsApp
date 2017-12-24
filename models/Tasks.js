var db = require('../dbconnections'); //reference of dbconnection.js  
var Task = {  
    getAllTasks: function(callback) {  
        return db.query("Select * from amz_tasks limit 500", callback);  
    },  
    getTaskById: function(id, callback) {  
        return db.query("select * from amz_tasks where task_id=?", [id], callback);  
    },  
    addTask: function(Task, callback) {  
        return db.query("INSERT INTO amz_tasks(team_id,task_name,added_by,status,about_cf,have_st,have_tdi,tdi_type,op_type,have_complexity,deletion,create_date,maintain_date)  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)", [Task.team_id,Task.task_name,Task.added_by,Task.status,Task.about_cf,Task.have_st,Task.have_tdi,Task.tdi_type,Task.op_type,Task.have_complexity,Task.deletion,Task.create_date,Task.maintain_date], callback);  
    },  
    deleteTask: function(id, callback) {  
        return db.query("delete from amz_tasks where task_id=?", [id], callback);  
    },  
    updateTask: function(id, Task, callback) {  
        return db.query("update amz_tasks set ?  where task_id= ?", [Task , id], callback);  
    }  
};  
module.exports = Task;  