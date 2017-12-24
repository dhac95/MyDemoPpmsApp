var db = require('../dbconnections'); //reference of dbconnection.js  
var UserInfo = {  
    getAllUserInfos: function(callback) {  
        return db.query("Select * from amz_user_info limit 500", callback);  
    },  
    getUserInfoById: function(id, callback) {  
        return db.query("select * from amz_user_info where s_no=?", [id], callback);  
    },  
    addUserInfo: function(UserInfo, callback) {  
        return db.query("INSERT INTO amz_user_info(user_id,team_id,status,create_date,maintain_date) VALUES(?,?,?,?,?,?)", [UserInfo.user_id,UserInfo.team_id,UserInfo.status,UserInfo.create_date,UserInfo.maintain_date], callback);  
    },  
    deleteUserInfo: function(id, callback) {  
        return db.query("delete from amz_user_info where s_no=?", [id], callback);  
    },  
    updateUserInfo: function(id, UserInfo, callback) {  
        return db.query("update amz_user_info set ?  where s_no= ?", [UserInfo , id], callback);  
    }  
};  
module.exports = UserInfo;  