var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var in_array = require('in_array');
var nodemailer = require('nodemailer');
var moment = require('moment');
var db = require('../dbconnections');

router.post('/' , function(req , res , next){ 
        var userID = req.body.user_id;
        var teamID = req.body.team_id;
        var modify = req.body.modify;
        var actionDate = datetime.create().format('Y-m-d');
            db.query("SELECT * from amz_login where user_id = ?" , [userID] , function(e , r , f){
  
                        if(e) {
                            res.send(e);
                        } else {
                            var  tempTeamCount = r[0].team_count;
                            var teamCount = tempTeamCount + 1;
                            var name = r[0].user_name;
                            var email = r[0].user_mail;
                            db.query("UPDATE amz_login set team_count = ? ,approved_by = ? ,user_activation=1 , user_deletion = 0 , user_status = 1 , maintain_date = ? WHERE user_id = ?", [teamCount, modify, actionDate , userID] , function(e2 , r2, f2){
                                        if(e2) {
                                            res.send(e2);
                                        } else {
                                            db.query("UPDATE amz_user_info set status = 1 , maintain_date = ? where user_id = ? and team_id = ? ", [actionDate, userID, teamID] , function(e3 , r3 , f3)  {
                                                        if(e3) {
                                                            res.send(e3);
                                                        } else {
                                                            var today = moment().format('LLLL');
                                                            var transporter = nodemailer.createTransport({
                                                                // host: 'smtp.ethereal.email',
                                                                // port: 587,
                                                                service: 'Gmail',
                                                                // secure: false, // true for 465, false for other ports
                                                                auth: {
                                                                    user: process.env.MAIL_U, // generated ethereal user
                                                                    pass: process.env.MAIL_P  // generated ethereal password
                                                                }
                                                            });
                                                           
                                                            // setup email data with unicode symbols
                                                            var mailOptions = {
                                                                from: '"Fred Foo 👻" <admin_no-reply.p2r@amazon.com>', // sender address
                                                                to: email, // list of receivers
                                                                subject: 'Team request approved ✔', // Subject line
                                                                text: name, // plain text body
                                                                html: '<b> Hi ' + name + ',</b><br /> You request have been approved  at ' + today +'<br /> You are now able to login with your username and password.<b><br /> Thanks</b>' // html body
                                                            };

                                                            // send mail with defined transport object
                                                            transporter.sendMail(mailOptions, function (error, info) {
                                                                if (error) {
                                                                    return console.log(error);
                                                                }
                                                            });
                                                            res.send({
                                                                    "code" : 200 , 
                                                                    "message" : "success",
                                                                    "results" : r3
                                                                     });
                                              }
                                      });
                               }
                      });
              }
        });
});  

    router.post('/reject' , function(req , res , next){
        var id = req.body.ID;
        var modify = req.body.Modify;
        db.query('select * from amz_user_info where s_no = ?',[id], function(error , results , fields){
            if(error) {
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                  });
            }
            else {
                var user = results[0].user_id;
                    db.query('select * from amz_login where user_id = ?', [user] , function(error2 , results2 , fields2){
                            if(error2) {
                                res.send(error2);
                            }
                            else {
                                var name = results2[0].user_name;
                                var email = results2[0].user_mail;
                                    db.query('delete from amz_user_info where s_no = ?' , [id] , function(e , r , f){
                                            if(e) {
                                                res.send({
                                                    "code": 400,
                                                    "failed": "error ocurred",
                                                    "message" : e
                                                });
                                            } else {
                                                var today = moment().format('LLLL');
                                                var transporter = nodemailer.createTransport({
                                                    // host: 'smtp.ethereal.email',
                                                    // port: 587,
                                                    service: 'Gmail',
                                                    // secure: false, // true for 465, false for other ports
                                                    auth: {
                                                        user: process.env.MAIL_U, // generated ethereal user
                                                        pass: process.env.MAIL_P  // generated ethereal password
                                                    }
                                                });

                                                // setup email data with unicode symbols
                                                var mailOptions = {
                                                    from: '"Fred Foo 👻" <admin_no-reply.p2r@amazon.com>', // sender address
                                                    to: email, // list of receivers
                                                    subject: 'Team request Rejected :(', // Subject line
                                                    text: name, // plain text body
                                                    html: '<b> Hi ' + name + ',</b><br /> You request have been rejected at '+ today +'<br /> You are now removed from the team and can\'t login with that team.<b><br /> Thanks</b>' // html body
                                                };

                                                // send mail with defined transport object
                                                transporter.sendMail(mailOptions, function (error, info) {
                                                    if (error) {
                                                        return console.log(error);
                                                    }
                                                });
                                                res.send({
                                                    "code": 200,
                                                    "message" : "success"
                                                });
                                            }
                                    });
                            }
                    });
            }
             });
    });

module.exports = router;