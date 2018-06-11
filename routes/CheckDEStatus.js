var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var db = require('../dbconnections');
var moment = require('moment');
var async = require("async");
var sendmail = require('sendmail')();

router.post('/', function (req, res, next) {
        var userID = req.body.user_id;
        var userName = req.body.user_name;
        var dateFrom = req.body.month;
        var email = userName + '@amazon.com';
        var queryError = [];
        var successDE = [];
        var failedDE = [];
        var tempUser = [];
        var managerMail = [];
        db.query('select amz_user_info.s_no ,  amz_user_info.user_id , amz_user_info.team_id , amz_teams.team_name from amz_user_info inner join amz_teams on amz_user_info.team_id = amz_teams.team_id where amz_user_info.user_id = ?', [userID], function (e, r, f) {
                async.each(r, function (singleTeam, callback) {
                        db.query('SELECT con_fac FROM amz_daily_target WHERE month_from = ? AND team = ?', [dateFrom, singleTeam.team_id], function (e2, r2, f2) {
                                if (r2.length > 0) {
                                        successDE.push({
                                                "code": 102,
                                                "user": userID,
                                                "teamID": singleTeam.team_id,
                                                "teamName": singleTeam.team_name,
                                                "userName": userName,
                                                "Message": "No Action required",
                                        });

                                } else {
                                        db.query('SELECT * from amz_user_info WHERE team_id = ?', [singleTeam.team_id], function (e3, r3, f3) {
                                                async.each(r3, function (singleUser, callback2) {
                                                                db.query('SELECT * FROM amz_login where user_id = ? and user_type >= 3', [singleUser.user_id], function (e4, r4, f4) {
                                                                        if (e4) {
                                                                                queryError.push(e4);
                                                                        } else if (r4.length > 0) {
                                                                                managerMail.push(r4[0].user_mail);
                                                                        }
                                                                        callback2();
                                                                });

                                                        },
                                                        function (response) {
                                                                if (queryError.length > 0) {
                                                                        res.send({
                                                                                "code": 500,
                                                                                "message": "bulk error"
                                                                        });
                                                                } else {

                                                                        var today = moment().format('LLLL');
                                                                        var mail = managerMail;
                                                                        sendmail({
                                                                                from: '"PPMS Admin 👻" <no-reply.ppms@amazon.com>',
                                                                                to: email,
                                                                                cc: managerMail,
                                                                                subject: 'Remainder mail - Set daily target', // Subject line
                                                                                html: '<b> Hi ' + userName + ',</b><br /> Please ignore this is a test <br /> at ' + today + '<b><br /> Thanks</b>' // html body
                                                                        });
                                                                }

                                                        });

                                        });
                                }

                                callback();

                        });


                }, function (response) {
                        res.send({
                                "code": 103,
                                "Message": "need to set DE"
                        });
                });
        });
});


module.exports = router;