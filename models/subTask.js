var db = require('../dbconnections'); //reference of dbconnection.js  
var subTask = {  
    getAllsubTasks: function(callback) {  
        return db.query("Select * from amz_sub_tasks limit 500", callback);  
    },  
    getsubTaskById: function(id, callback) {  
        return db.query("select * from amz_sub_tasks where sub_task_id=?", [id], callback);  
    },  
    addsubTask: function(subTask, callback) {  
        return db.query("INSERT INTO amz_sub_tasks(team_id,task_id,sub_task_name,cf_change,auto_cf,task_status,deletion,create_date,maintain_date) VALUES(?,?,?,?,?,?,?,?,?)", [subTask.team_id,subTask.task_id,subTask.sub_task_name,subTask.cf_change,subTask.auto_cf,subTask.task_status,subTask.deletion,subTask.create_date,subTask.maintain_date], callback);  
    },  
    deletesubTask: function(id, callback) {  
        return db.query("delete from amz_sub_tasks where sub_task_id=?", [id], callback);  
    },  
    updatesubTask: function(id, subTask, callback) {  
        return db.query("update amz_sub_tasks set ?  where sub_task_id= ?", [subTask , id], callback);  
    }  
};  
module.exports = subTask;  