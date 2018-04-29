var db = require('../dbconnections'); //reference of dbconnection.js  
var myTeam = {
    getAllTeams: function (callback) {
        return db.query("SELECT team_id , team_name FROM amz_teams WHERE status = 1 AND team_deletion = 0 ORDER BY team_name ASC ",  callback);
    }
 };
module.exports = myTeam; 
