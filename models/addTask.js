var db = require('../dbconnections'); //reference of dbconnection.js  




var uEntry = {
    getHoliday: function (callback) {
        return db.query("Select * from amz_holidays where status= 1 and deleted = 0", callback);
    },
    getLastUserEntry: function (id, callback) {

        return db.query("SELECT user_id,user_mail,last_entry_on,create_date FROM amz_login where user_id=?", [id], callback);

    },
    getLastEntryTime: function (uEntry, callback) {
        return db.query("SELECT time FROM user_tasks WHERE date=? AND user_id= ?", uEntry.date, uEntry.user_id);
    },
    adduEntry: function (uEntry, callback) {
        return db.query("insert into user_tasks (user_id,team_id,build,tasks_id,sub_task_id,task_desc,count,noofdevice,time,date,on_time,cmds,create_date,maintain_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [uEntry.user_id, uEntry.team_id, uEntry.build, uEntry.tasks_id, uEntry.sub_task_id, uEntry.task_desc, uEntry.count, uEntry.noofdevice, uEntry.time, uEntry.date, uEntry.on_time, uEntry.cmds, uEntry.create_date, uEntry.maintain_date], callback);
    },
    deleteuEntry: function (id, callback) {
        return db.query("delete from user_tasks where task_id=?", [id], callback);
    },
    updateuEntry: function (id, uEntry, callback) {
        return db.query("update user_tasks set ?  where task_id= ?", [uEntry, id], callback);
    }
};
module.exports = uEntry;