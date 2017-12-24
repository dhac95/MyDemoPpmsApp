var db = require('../dbconnections'); //reference of dbconnection.js  

var testAddTask = {  
    getHoliday: function(callback) {  
        return db.query("Select * from amz_holidays where status= 1 and deleted = 0", callback);  
    },  
    getLastUserEntry: function(id, callback) {  
        return db.query("SELECT user_id,user_mail,last_entry_on,create_date FROM amz_login where user_id=?", [id], callback);  
    },  
    getCurrentUserEntryForDate : function(testAddTask , callback) {
        return db.query("SELECT * FROM user_tasks WHERE date=? AND user_id= ?", testAddTask.date, testAddTask.user_id);
    },
    addtestAddTask: function(testAddTask, callback) {  
        return db.query("insert into user_tasks (user_id,team_id,build,tasks_id,sub_task_id,task_desc,count,noofdevice,time,date,on_time,cmds,create_date,maintain_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [testAddTask.user_id,testAddTask.team_id,testAddTask.build,testAddTask.tasks_id,testAddTask.sub_task_id,testAddTask.task_desc,testAddTask.count,testAddTask.noofdevice,testAddTask.time,testAddTask.date,testAddTask.on_time,testAddTask.cmds,testAddTask.create_date,testAddTask.maintain_date], callback);  
    },  
    deletetestAddTask: function(id, callback) {  
        return db.query("delete from user_tasks where task_id=?", [id], callback);  
    },  
    updatetestAddTask: function(id, testAddTask, callback) {  
        return db.query("update user_tasks set ?  where task_id= ?", [testAddTask , id], callback);  
    }  
};  
module.exports = testAddTask;  