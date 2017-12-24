var db = require('../dbconnections'); //reference of dbconnection.js  
var loadTeams = {  
    getLoadedTeams: function(id, callback) {  
        return db.query('select amz_user_info.team_id , amz_teams.team_name from amz_user_info inner join amz_teams on amz_user_info.team_id = amz_teams.team_id where user_id = ?', [id], callback);  
    }
};
  
module.exports = loadTeams; 