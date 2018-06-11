var express = require('express');
var router = express.Router();
var async = require("async");
var db = require('../dbconnections'); //reference of dbconnection.js 
var moment = require('moment');

router.post('/', function (req, res, next) {
    var queryError = [];
    var userData = [];
    var teamID = req.body.team_id;
    db.query('SELECT user_id from amz_user_info where team_id = ? AND status = 1', [teamID], function (e, r, f) {
        async.each(r, function (single, callback) {
            var userID = single.user_id;
            db.query('SELECT amz_login.user_id , amz_login.first_name , amz_login.last_name , amz_login.user_name , amz_login.team_count , amz_login.user_type , amz_login.user_mail , amz_login.host_name_1 , amz_login.approved_by , approve_table.user_name as Approvar , amz_login.user_status , amz_login.user_activation , amz_login.user_deletion , amz_login.last_entry_on , amz_login.create_date FROM amz_login LEFT JOIN amz_login as approve_table on amz_login.approved_by = approve_table.user_id WHERE amz_login.user_id = ?', [userID], function (e2, r2, f2) {
                if (e2) {
                    queryError.push(e2);
                } else {
                    userData.push({
                        "result": r2
                    });
                }
                callback();
            });
        }, function (response) {
            if (queryError.length > 0) {
                res.send({
                    "code": 500,
                    "message": "Bulkerror"
                });
            } else {
                res.send(userData);
            }
        });
    });
});

router.post('/remove', function (req, res, next) {
    var teamID = req.body.team_id;
    var userID = req.body.user_id;

    db.query('UPDATE amz_user_info set status = 0 WHERE team_id = ? AND user_id = ?', [teamID, userID], function (e, r, f) {
        if (e) {
            res.send({
                "code": 400,
                "messgae": "error occoured at beginning",
                "result": e
            });
        } else {
            db.query('UPDATE amz_login set team_count = team_count - 1 where user_id = ?', [userID], function (e2, r2, f2) {
                if (e2) {
                    res.send({
                        "code": 400,
                        "messgae": "error occoured at end",
                        "result": e2
                    });
                } else {
                    res.send({
                        "code": 200,
                        "messgae": "Success",

                    });
                }
            });
        }
    });
});

router.post('/promote', function (req, res, next) {
    userID = req.body.user_id;
    userType = req.body.user_type;
    db.query('UPDATE amz_login set user_type = ? where user_id = ?', [userType, userID], function (e, r, f) {
        if (e) {
            res.send({
                "code": 400,
                "messgae": "error occoured at beginning",
                "result": e
            });
        } else {
            res.send({
                "code": 200,
                "messgae": "Success",
            });
        }
    });
});

router.post('/user', function (req, res, next) {
    var userID = req.body.user_id,
        firstName = req.body.first_name,
        lastName = req.body.last_name,
        lastEntry = req.body.last_entry_on,
        userType = req.body.user_type;
    if (lastEntry != null) {
        lastEntry = moment(lastEntry).format('YYYY-MM-DD');
    }
    db.query('UPDATE amz_login set first_name = ? , last_name = ? , last_entry_on = ? , user_type = ? WHERE user_id = ? ', [firstName, lastName, lastEntry, userType, userID], function (e, r, f) {
        if (e) {
            res.send({
                "code": 400,
                "messgae": "error occoured at beginning",
                "result": e
            });
        } else {
            res.send({
                "code": 200,
                "messgae": "Success",
            });
        }
    });
});




module.exports = router;