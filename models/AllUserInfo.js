var db = require('../dbconnections'); //reference of dbconnection.js 
var md5 = require('md5'); 
var AllUserInfo = {  
    getAllAllUserInfos: function(callback) {  
        return db.query("Select * from amz_login", callback);  
    },  
    getAllUserInfoById: function(id, callback) {  
        return db.query("select * from amz_login where user_id=?", [id], callback);  
    },  
    addAllUserInfo: function(AllUserInfo, callback) {  
        return db.query("INSERT INTO amz_login(first_name,last_name,user_name,team_count,password,user_type,user_mail,host_name_1,host_name_2,below_on,manager,approved_by,user_status,user_activation,user_deletion,last_entry_on,create_date,maintain_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [AllUserInfo.first_name,AllUserInfo.last_name,AllUserInfo.user_name,AllUserInfo.team_count,md5(AllUserInfo.password),AllUserInfo.user_type,AllUserInfo.user_mail,AllUserInfo.host_name_1,AllUserInfo.host_name_2,AllUserInfo.below_on,AllUserInfo.manager,AllUserInfo.approved_by,AllUserInfo.user_status,AllUserInfo.user_activation,AllUserInfo.user_deletion,AllUserInfo.last_entry_on,AllUserInfo.create_date,AllUserInfo.maintain_date], callback);  
    },  
    deleteAllUserInfo: function(id, callback) {  
        return db.query("delete from amz_login where user_id=?", [id], callback);  
    },  
    updateAllUserInfo: function(id, AllUserInfo, callback) {  
        return db.query("update amz_login set ?  where user_id= ?", [AllUserInfo , id], callback);  
    }  
};  
module.exports = AllUserInfo;  