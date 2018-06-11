var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('../dbconnections'); //reference of dbconnection.js

router.post('/', function (req, res, next) {

    db.query('select build_no from amz_build_mapping where build_no = ?', [req.body.build_no], function (e, r, f) {
        if (e) {
            res.send(e);
        } else if (r.length > 0) {
            res.send({
                "code": 401,
                "message": "Build already mapped "
            });
        } else {
            var myDate = moment(req.body.date).format('YYYY-MM-DD');
            db.query('INSERT INTO amz_build_mapping(date , team , release_no , build_no , run_status , build_info , create_date , created_by , deletion_status , modified_by) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ?) ', [myDate, req.body.team, req.body.release_no, req.body.build_no, req.body.run_status, req.body.build_info, req.body.create_date, req.body.created_by, '0', req.body.modified_by], function (e2, r2, f2) {
                if (e2) {
                    res.send(e2);
                } else {
                    res.send({
                        "code": 200,
                        "message": "success"
                    });
                }
            });
        }
    });
});

router.put('/:id', function (req, res, next) {
    var myDate = moment(req.body.date).format('YYYY-MM-DD');
    db.query('UPDATE amz_build_mapping set date = ? ,  team = ? , release_no = ? , build_no = ? , run_status = ? , build_info = ? , modified_by = ? where s_no = ?', [myDate, req.body.team, req.body.release_no, req.body.build_no, req.body.run_status, req.body.build_info, req.body.modified_by, req.params.id], function (e, r, f) {
        if (e) {
            res.send({
                "code": 400,
                "message": e
            });
        } else {
            res.send({
                "code": 200,
                "message": "Success"
            });
        }
    });
});

router.post('/remove', function (req, res, next) {
    db.query('UPDATE amz_build_mapping set deletion_status = 1 , modified_by = ? where s_no = ?', [req.body.deletion_status, req.body.modified_by, req.body.s_no], function (e, r, f) {
        if (e) {
            res.send({
                "code": 300,
                "message": "Error",
                "Error": e
            });
        } else {
            res.send({
                "code": 200,
                "message": "Success",
            });
        }
    });
});

router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        db.query('SELECT amz_build_mapping.s_no , amz_build_mapping.date , amz_build_mapping.team , amz_teams.team_name , amz_build_mapping.release_no , amz_releases.release_name , amz_build_mapping.build_no , amz_builds.build_name , amz_build_mapping.run_status , amz_build_mapping.build_info , amz_build_mapping.create_date , amz_build_mapping.created_by , amz_login.user_name as creater FROM amz_build_mapping LEFT JOIN amz_teams ON amz_build_mapping.team = amz_teams.team_id LEFT JOIN amz_releases ON amz_build_mapping.release_no = amz_releases.s_no LEFT JOIN amz_builds ON amz_build_mapping.build_no = amz_builds.build_no LEFT JOIN amz_login ON amz_build_mapping.created_by = amz_login.user_id WHERE amz_build_mapping.team = ? and amz_build_mapping.deletion_status = 1 ORDER BY amz_build_mapping.s_no DESC', [req.params.id], function (e, r, f) {
            if (e) {
                res.send({
                    "code": 402,
                    "message": "error",
                    "error": e
                });
            } else {
                res.send(r);
            }
        });
    }

});


module.exports = router;