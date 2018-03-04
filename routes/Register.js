var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var generator = require('generate-password');
var nodemailer = require('nodemailer');
var in_array = require('in_array');
var moment = require('moment');
var sendmail = require('sendmail')();
//var inArray = require('in-array');

var db = require('../dbconnections');

var os = require('os');

router.post('/' , function(req , res , next){ 

   var ip0 = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var ip2 = req.headers.host;
    var ip3 = os.hostname();
    var ifaces = os.networkInterfaces();

    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    var ip = addresses[0];


   // var ip4 = ifaces.WI-FI[1].address;
   // var ip7 = ip5;

    var name = req.body.user_name;
    var email = name + '@amazon.com';
    var team = req.body.team_id;
    var actionDate = datetime.create().format('Y-m-d');
    var password = generator.generate({
        length: 10,
        numbers: true,
       // symbols : true , 
       // excludeSimilarCharacters : true
    });
    var pass  = md5(password);
    db.query("SELECT * from amz_login where user_name = ?" , [name] , function(e , r , f){
        if(r.length > 0 ) { 
               // db.query("select ")
                var  tempTeamCount = r[0].team_count;
             //   if(tempTeamCount >= 1 ) {
                       //  if(team != tempTeam) {
                             
                                db.query("SELECT user_id FROM amz_login WHERE user_name= ?" , [name] ,function(e2,r2,f2) {
                            //        db.query("UPDATE amz_login SET user_deletion=0 ,team_count=?, user_status=0, user_activation=0 WHERE user_name=?" ,[teamCount , name] , function(e2 , r2 , f2) {
                                                        if(e2) {
                                                            res.send(e2);
                                                        }
                                                        else {
                                                            var userID = r2[0].user_id;
                                                            db.query("SELECT team_id FROM amz_user_info WHERE user_id= ?" , [userID] ,function(e3,r3,f3){
                                                                var tempTeam = [];
                                                                for (var i=0 ; i < r3.length ; i++) {
                                                                  tempTeam.push(r3[i].team_id);
                                                                }
                                                                if(in_array(team , tempTeam) == true){
                                                                    res.send({
                                                                        "code" : 300,
                                                                        "message" : "User already in selected team"
                                                                    });
                                                                
                                                                }
                                                                 else {
                                                                //     teamCount = tempTeamCount ;
                                                                    db.query("INSERT INTO amz_ip_list(ip_address,create_date,maintain_date) VALUES(?,?,?)", [ip, actionDate, actionDate], function(e4 , r4 , f4) {
                                                                //    // db.query("INSERT INTO amz_user_info(user_id,team_id,status,create_date, maintain_date) VALUES(?,?,?,?,?)" ,[userID , team , '1' , actionDate , actionDate ] , function(e4, r4, f4){
                                                                       if(e4) {
                                                                            res.send(e4);
                                                                        } else {
                                                                            db.query("INSERT INTO amz_user_info(user_id,team_id,status,create_date, maintain_date) VALUES(?,?,?,?,?)" ,[userID , team , '0' , actionDate , actionDate ] , function(e5, r5, f5) {
                                                                                if(e5) {
                                                                                    res.send(e5);
                                                                                } else {
                                                                                    var today = moment().format('LLLL');

                                                                                    sendmail({
                                                                                        from: '"PPMS Admin 👻" <no-reply.ppms@amazon.com>',
                                                                                        to: email,
                                                                                        subject: 'New Team Registration ✔', // Subject line
                                                                                        html: '<b> Hi ' + name + ',</b><br /> Your registration is created at ' + today + '.<br /> Wait for your request to be approved.<b><br /> Thanks</b>' // html body
                                                                                    }, function (err, reply) {
                                                                                        console.log(err && err.stack);
                                                                                        console.dir(reply);
                                                                                    });

                                                                                    // db.query("INSERT INTO amz_ip_list(ip_address,create_date,maintain_date) VALUES(?,?,?)", [ip, actionDate, actionDate], function (e, r, f) {
                                                                                    //     if (e) {
                                                                                    //         res.send(e);
                                                                                    //     }
                                                                                    // });
                                                                                    // create reusable transporter object using the default SMTP transport
                                                                                    // var transporter = nodemailer.createTransport({
                                                                                    //     // host: 'smtp.ethereal.email',
                                                                                    //     // port: 587,
                                                                                    //         service : 'Gmail' , 
                                                                                    // // secure: false, // true for 465, false for other ports
                                                                                    //     auth: {
                                                                                    //         user: process.env.MAIL_U, // generated ethereal user
                                                                                    //         pass: process.env.MAIL_P  // generated ethereal password
                                                                                    //     }
                                                                                    // });
                                                                                
                                                                                    // // setup email data with unicode symbols
                                                                                    // var mailOptions = {
                                                                                    //     from: '"Fred Foo 👻" <admin_no-reply.p2r@amazon.com>', // sender address
                                                                                    //     to: email, // list of receivers
                                                                                    //     subject: 'New Team Registration ✔', // Subject line
                                                                                    //     text: name, // plain text body
                                                                                    //     html: '<b> Hi ' + name + ',</b><br /> Your registration is created at ' + today +  ' .<br /> Wait for your request to be approved.<b><br /> Thanks</b>' // html body
                                                                                    // };
                                                                                
                                                                                    // // send mail with defined transport object
                                                                                    // transporter.sendMail(mailOptions, function(error, info) {
                                                                                    //     if (error) {
                                                                                    //         return console.log(error);
                                                                                    //                 }
                                                                                    //                     });
                                                                                    res.send({
                                                                                        "code" : 200,
                                                                                        "message" : "success"
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                        
                                                                    });
                                                                }
                                                          //  }
                                                            });
                                                        }
                                    });
                        // }
                        // else{
                        //     res.send({
                        //             "code" : 400 , 
                        //             "error" : "User already exisits in the team"
                        //     });
                        // }
              //  }
                
        }
        else {
            db.query("INSERT INTO amz_login(first_name,user_name,team_count,password,user_type,user_mail,host_name_1,host_name_2,manager,user_status,user_activation,create_date, maintain_date) VALUES(? , ? , ? ,? , ? , ? , ? ,? ,? ,? , ? , ? , ?)" , [name , name , 0 , pass , 1 , email , ip ,'test' ,1 , 0 , 0 ,actionDate , actionDate ] , function(errors , results , fields) {
                    if(errors){
                        res.send(errors);
                    } else {
                        db.query("SELECT user_id FROM amz_login WHERE user_name= ?" , [name] ,function(errors2,results2,fields2){
                            
                                if(errors2) {
                                    res.send(errors2);
                                } else {
                                   var userID = results2[0].user_id;
                                    db.query("INSERT INTO amz_user_info(user_id,team_id,status,create_date, maintain_date) VALUES(?,?,?,?,?)" ,[userID , team , '0' , actionDate , actionDate ] , function(errors3, results3, feilds3) {
                                        if(errors3) {
                                            res.send(errors3);
                                        } else {
                                            db.query("INSERT INTO amz_ip_list(ip_address,create_date,maintain_date) VALUES(?,?,?)" , [ip , actionDate , actionDate], function(e,r,f){
                                                    if(e) {
                                                        res.send(e);
                                                    }
                                            });
                                            var today = moment().format('LLLL');
                                                 // create reusable transporter object using the default SMTP transport
                                                    //         var transporter = nodemailer.createTransport({
                                                    //         // host: 'smtp.ethereal.email',
                                                    //         // port: 587,
                                                    //             service : 'Gmail' , 
                                                    //     // secure: false, // true for 465, false for other ports
                                                    //         auth: {
                                                    //             user: process.env.MAIL_U, // generated ethereal user
                                                    //             pass: process.env.MAIL_P  // generated ethereal password
                                                    //         }
                                                    //     });
                                                    
                                                    //     // setup email data with unicode symbols
                                                    //     var mailOptions = {
                                                    //         from: '"Fred Foo 👻" <admin_no-reply.p2r@amazon.com>', // sender address
                                                    //         to: email, // list of receivers
                                                    //         subject: 'New User Registration ✔', // Subject line
                                                    //         text: name, // plain text body
                                                    //         html: '<b> Hi ' + name + ',</b><br /> Your registration is created at '+ today +'. Use this temp password to update your password  <strong> """ '+ password + ' """</strong> <br /> Wait for your request to be approved .<b><br /> Thanks</b>' // html body
                                                    //     };
                                                    
                                                    //     // send mail with defined transport object
                                                    //     transporter.sendMail(mailOptions, function(error, info) {
                                                    //         if (error) {
                                                    //             return console.log(error);
                                                    //         }
                                                    // });

                                            sendmail({
                                                from: '"PPMS Admin 👻" <no-reply.ppms@amazon.com>',
                                                to: email,
                                                subject: 'New Team Registration ✔', // Subject line
                                                html: '<b> Hi ' + name + ',</b><br /> Your registration is created at ' + today + '. Use this temp password to update your password later. Your password is : <strong> ***'+ password +'***</strong> <br /> Wait for your request to be approved, After approval login with the username and password .<b><br /> Thanks</b>' // html body
                                            }, function (err, reply) {
                                                console.log(err && err.stack);
                                                console.dir(reply);
                                            });

                                            res.send({
                                                "code" : 200 ,
                                                "message" : "success"
                                            });
                                        }
                                    });
                                }
                        });
                    }

            });
    }
    });



    
});

module.exports = router;