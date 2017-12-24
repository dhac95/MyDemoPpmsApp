var db = require('../dbconnections'); //reference of dbconnection.js  
var uTask = { 

        getLogin : function (callback) {
            
        }
};

// var uLogin = {
//                 getuLogin : function (callback) {  
//                     return db.query("SELECT * FROM amz_login WHERE user_name= ? AND user_deletion='0'" , callback);
//                 },
//                 adduLogin: function(uLogin, callback) {  
//                     return db.query("INSERT INTO amz_login(user_id,first_name,last_name,user_name,team_count,password,user_type,user_mail,host_name_1,host_name_2,manager,user_status,user_activation,user_deletion,create_date,maintain_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [uLogin.user_id,uLogin.first_name,uLogin.last_name,uLogin.user_name,uLogin.team_count,uLogin.password,uLogin.user_type,uLogin.user_mail,uLogin.host_name_1,uLogin.host_name_2,uLogin.manager,uLogin.user_status,uLogin.user_activation,uLogin.user_deletion,uLogin.create_date,uLogin.maintain_date], callback);  
//                 },  
// };