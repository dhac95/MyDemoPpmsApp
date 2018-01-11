
var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var generator = require('generate-password');
var nodemailer = require('nodemailer');
var db = require('../dbconnections');

router.post('/' , function(req , res , next){ 
    var password = generator.generate({
        length: 10,
        numbers: true,
       // symbols : true , 
       // excludeSimilarCharacters : true
    });

        var pass = md5(password);
        var user = req.body.name; 
        var email = user + '@amazon.com';

        db.query("select * from amz_login where user_name = ?" , [user] , function(e , r , f){
            if(r.length > 0) {
                db.query("UPDATE amz_login SET password = ? WHERE amz_login.user_name = ?" ,[pass , user] , function(errors , results , fields) {
                    if(errors) {
                            res.send(errors);
                    }
                    else  {
                      //  nodemailer.createTestAccount(function(err, account) {
        
                            // create reusable transporter object using the default SMTP transport
                            var transporter = nodemailer.createTransport({
                                // host: 'smtp.ethereal.email',
                                // port: 587,
                                    service : 'Gmail' , 
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
                                subject: 'Password change request ✔', // Subject line
                                text: password, // plain text body
                                html: '<b> Hi ' + user + ',</b><br /> Your mail id is used to request a new password. Use this temp password to update your password  <strong> """ '+ password + ' """</strong> <br /> If you are not requested for password change please contact your manager for further actions.<b><br /> Thanks</b>' // html body
                            };
                        
                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, function(error, info) {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message sent: %s', info.messageId);
                                // Preview only available when sending through an Ethereal account
                                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        
                                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        
                                
                          //  });
                            
                        });
                        res.send({
                            "code" : 200,
                            "success" : "passed",
                            "results" : results
                        });
                        
                    }
               });
            }
            else {
                res.send({
                        "code" : 300 , 
                        "message" : "User does not exist"
                });
            }
        });
    });
        
    

     

module.exports = router;



