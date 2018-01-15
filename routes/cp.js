var express = require('express');
var md5 = require('md5');
var router = express.Router();
var generator = require('generate-password');
var nodemailer = require('nodemailer');
var db = require('../dbconnections');
var moment = require('moment');

router.post('/', function (req, res, next) { 
            var oldPassword = req.body.old;
            var newPassword = md5(req.body.new);
            var userID = req.body.user_id;
                db.query('SELECT user_name, password , user_mail from amz_login where user_id = ?' , [userID] , function(e , r , f ){
                    if(e) {
                        res.send(e);
                    }
                    else {
                        var userName = r[0].user_name;
                        var email = r[0].user_mail;
                        var existPassword = r[0].password ; 
                        if (existPassword == md5(oldPassword)) {
                            db.query('UPDATE amz_login set password = ? where user_id = ?', [newPassword , userID] , function(e2 , r2 , f2 ){
                                    if(e2) {
                                        res.send(e2);
                                    }
                                    else {
                                        var transporter = nodemailer.createTransport({
                                            // host: 'smtp.ethereal.email',
                                            // port: 587,
                                            service: 'Gmail',
                                            // secure: false, // true for 465, false for other ports
                                            auth: {
                                                user: process.env.MAIL_U, 
                                                pass: process.env.MAIL_P 
                                            }
                                        });
                                            
                                        var today = moment().format('LLLL');
                                        // setup email data with unicode symbols
                                        var mailOptions = {
                                            from: '"Fred Foo 👻" <admin_no-reply.p2r@amazon.com>', // sender address
                                            to: email, // list of receivers
                                            subject: 'Password change request ✔', // Subject line
                                            text: today, // plain text body
                                            html: '<b> Hi ' + userName + ',</b><br /> Your mail id is used to Change a new password <br /> at ' + today + '<b><br /> Thanks</b>' // html body
                                        };

                                        // send mail with defined transport object
                                        transporter.sendMail(mailOptions, function (error, info) {
                                            if (error) {
                                                return console.log(error);
                                            }

                                        });
                                        res.send({
                                            "code" : 200,
                                            "message" : "success"
                                        });
                                    }
                            });
                        }
                        else {
                            res.send({
                                    "code" : 400,
                                    "message" : "Passwords doesn't match"
                            });
                        }
                    }
                });


});

router.put('/:id?' , function(req , res , next) {
    var id = req.params.id;
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var below = req.body.pic;
                db.query('UPDATE amz_login set first_name = ? , last_name = ? , below_on = ? WHERE user_id = ?' , [firstName , lastName , below , id] , function(error , results , feilds) {
                        if(error) {
                            res.send({
                                    "code" : 300,
                                    "message" : "process error"
                            }); 
                        }
                        else {
                            res.send({
                                "code" : 200 , 
                                "message" : "success"
                            });
                        }
                });

});

module.exports = router;