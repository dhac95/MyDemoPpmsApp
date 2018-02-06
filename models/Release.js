var db = require('../dbconnections'); //reference of dbconnection.js  
var Release = {
    addRelease: function (Release, callback) {
        return db.query("INSERT INTO amz_releases(team_id , release_name , release_status , added_by , create_date , modified_date)  VALUES (? , ? , ? , ? , ?, ?)", [Release.team_id, Release.release_name, Release.release_status, Release.added_by, Release.create_date, Release.modified_date ], callback);  
    } , 
    updateRelease : function(id , Release , callback) {
        return db.query("UPDATE amz_releases set team_id = ? , release_name = ? , release_status = ? , modified_date = ?  where s_no = ?", [Release.team_id, Release.release_name, Release.release_status , Release.modified_date, id], callback);
    } , 
    removeRelease : function(id , callback) {
        return db.query("DELETE FROM amz_releases where s_no = ?" , [id] ,callback);
    } , 
    getAllReleases: function (callback) {
        return db.query("SELECT amz_releases.s_no , amz_releases.team_id , amz_teams.team_name , amz_releases.release_name , amz_releases.release_status , amz_releases.added_by , addedBy.user_name AS AddedBy , amz_releases.create_date , amz_releases.modified_date , modifiedBy.user_name AS ModifiedBy FROM amz_releases INNER JOIN amz_teams ON amz_releases.team_id = amz_teams.team_id INNER JOIN amz_login AS addedBy ON amz_releases.added_by = addedBy.user_id LEFT JOIN amz_login AS modifiedBy ON amz_releases.modified_by = modifiedBy.user_id", callback);
    }, 
    getReleaseById: function (id, callback) {
        return db.query("SELECT amz_releases.s_no , amz_releases.team_id , amz_teams.team_name , amz_releases.release_name , amz_releases.release_status , amz_releases.added_by , addedBy.user_name AS AddedBy , amz_releases.create_date , amz_releases.modified_date , modifiedBy.user_name AS ModifiedBy FROM amz_releases INNER JOIN amz_teams ON amz_releases.team_id = amz_teams.team_id INNER JOIN amz_login AS addedBy ON amz_releases.added_by = addedBy.user_id LEFT JOIN amz_login AS modifiedBy ON amz_releases.modified_by = modifiedBy.user_id where amz_releases.team_id=?  ORDER BY s_no DESC", [id], callback);
    }  
};
module.exports = Release; 
