var db = require('../dbconnections'); //reference of dbconnection.js  
var loadTeams = {  
    getLoadedTeams: function(id, callback) {  
        return db.query('select amz_user_info.team_id , amz_teams.team_name from amz_user_info inner join amz_teams on amz_user_info.team_id = amz_teams.team_id where user_id = ?', [id], callback);  
    },
    
    getLoadedUsers : function(id , callback) {
            return db.query('select amz_user_info.user_id , amz_login.user_name , amz_user_info.team_id  from amz_user_info inner join amz_login on amz_user_info.user_id = amz_login.user_id where amz_user_info.team_id = ?' , [id], callback);
        
    }
};
  
module.exports = loadTeams; 
// module.exports = loadUsers;