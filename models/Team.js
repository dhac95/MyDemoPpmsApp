var db = require('../dbconnections'); //reference of dbconnection.js  
var Team = {  
    getAllTeams: function(callback) {  
        return db.query("SELECT amz_teams.team_id , amz_teams.team_name , amz_teams.added_by , amz_login.user_name , amz_teams.status , amz_teams.team_deletion , amz_teams.last_modify , amz_teams.create_date FROM amz_teams LEFT JOIN amz_login ON amz_teams.added_by = amz_login.user_id WHERE amz_teams.team_deletion = 0 order by amz_teams.team_name ASC", callback);  
    },  
    getTeamById: function(id, callback) {  
        return db.query("SELECT amz_teams.team_id , amz_teams.team_name , amz_teams.added_by , amz_login.user_name , amz_teams.status , amz_teams.team_deletion , amz_teams.last_modify , amz_teams.create_date FROM amz_teams LEFT JOIN amz_login ON amz_teams.added_by = amz_login.user_id where amz_teams.team_id = ? and amz_teams.team_deletion = 0 ORDER BY amz_teams.team_name ASC", [id], callback);  
    },  
      
    addTeam: function(Team, callback) {  
        return db.query("INSERT INTO amz_teams(team_name,added_by,status,team_deletion,create_date,maintain_date) VALUES(?,?,?,?,?,?)", [Team.team_name,Team.added_by,Team.status,'0',Team.create_date,Team.maintain_date], callback);  
    },  
    deleteTeam: function (Team, callback) {  
        return db.query("UPDATE amz_teams set team_deletion = 1  where team_id = ?", [Team.team_id, Team.last_modify], callback);  
    },  
    updateTeam: function(id, Team, callback) {  
        return db.query("update amz_teams set team_name = ? , added_by = ? ,  status = ? , maintain_date = ? where team_id= ?", [Team.team_name, Team.added_by, Team.status, Team.maintain_date , id], callback);  
    }  
};  
module.exports = Team;  