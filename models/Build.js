var db = require('../dbconnections'); //reference of dbconnection.js  
var Build = {
    getAllBuilds: function (callback) {
        return db.query("select amz_builds.build_no , amz_teams.team_name , amz_builds.build_name , amz_builds.build_status, amz_login.user_name , amz_builds.create_date, amz_builds.modified_date, amz_login.user_name as Modified_by from amz_builds left join amz_teams on amz_builds.team_id = amz_teams.team_id left join amz_login on amz_builds.added_by = amz_login.user_id and amz_builds.modified_by = amz_login.user_id", callback);
    },
    getBuildById: function (id, callback) {
        return db.query("select amz_builds.build_no , amz_builds.team_id ,amz_teams.team_name , amz_builds.build_name , amz_builds.build_status, amz_login.user_name as Modified , amz_builds.create_date, amz_builds.modified_date, amz_login.user_name as Modified_by from amz_builds left join amz_teams on amz_builds.team_id = amz_teams.team_id left join amz_login on amz_builds.added_by = amz_login.user_id and amz_builds.modified_by = amz_login.user_id where amz_builds.team_id = ? ORDER BY build_no DESC", [id], callback);
    },
    addBuild: function (Build, callback) {
        return db.query("INSERT INTO amz_builds(team_id,build_name,build_status,added_by,create_date,modified_date) VALUES(?,?,?,?,?,?)", [Build.team_id, Build.build_name, Build.build_status, Build.added_by, Build.create_date, Build.modified_date], callback);
    },
    deleteBuild: function (id, callback) {
        return db.query("delete from amz_builds where build_no=?", [id], callback);
    },
    updateBuild: function (id, Build, callback) {
        return db.query("update amz_builds set team_id = ?,build_name = ?,build_status = ?,modified_by = ? ,modified_date = ? where amz_builds.build_no= ?", [Build.team_id, Build.build_name, Build.build_status, Build.modified_by, Build.modified_date, id], callback);
    }
};
module.exports = Build;