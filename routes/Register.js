var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var generator = require('generate-password');
var nodemailer = require('nodemailer');
//var in_array = require('in_array');
var inArray = require('in-array');
var db = require('../dbconnections');
//var os = require('os');

router.post('/' , function(req , res , next){ 
//     var ifaces = os.networkInterfaces();
//     Object.keys(ifaces).forEach(function (ifname) {
//     var alias = 0;
  
//     ifaces[ifname].forEach(function (iface) {
//       if ('IPv4' !== iface.family || iface.internal !== false) {
//         // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
//         return;
//       }
  
//       if (alias >= 1) {
//         // this single interface has multiple ipv4 addresses
//         console.log(ifname + ':' + alias, iface.address);
//       } else {
//         // this interface has only one ipv4 adress
//        console.log(ifname, iface.address);
//       }
//       ++alias;
//     });
//   });

        // var forwardedIpsStr = req.header('x-forwarded-for') || req.connection.remoteAddress;
        //     var IP = '';

        // if (forwardedIpsStr) {
        //  IP = forwardedIps = forwardedIpsStr.split(',')[0];  
        //         }
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var name = req.body.user_name;
    var mail = name + '@amazon.com';
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
                if(tempTeamCount >= 1 ) {
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
                                                                if(inArray(tempTeam) , team){
                                                                    res.send({
                                                                        "code" : 300,
                                                                        "message" : "User already in selected team"
                                                                    });
                                                                
                                                                }
                                                                 else {
                                                                    teamCount = tempTeamCount + 1;
                                                                    db.query("UPDATE amz_login SET user_deletion=0 ,team_count=?, user_status=0, user_activation=0 WHERE user_name=?" ,[teamCount , name] , function(e4 , r4 , f4) {
                                                                   // db.query("INSERT INTO amz_user_info(user_id,team_id,status,create_date, maintain_date) VALUES(?,?,?,?,?)" ,[userID , team , '1' , actionDate , actionDate ] , function(e4, r4, f4){
                                                                        if(e4) {
                                                                            res.send(e4);
                                                                        } else {
                                                                            db.query("INSERT INTO amz_user_info(user_id,team_id,status,create_date, maintain_date) VALUES(?,?,?,?,?)" ,[userID , team , '1' , actionDate , actionDate ] , function(e5, r5, f5) {
                                                                                if(e5) {
                                                                                    res.send(e5);
                                                                                } else {
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
                }
                
        }
        else {
            db.query("INSERT INTO amz_login(first_name,user_name,team_count,password,user_type,user_mail,host_name_1,host_name_2,manager,user_status,user_activation,create_date, maintain_date) VALUES(? , ? , ? ,? , ? , ? , ? ,? ,? ,? ,?,?,?)" , [name , name , 1 , pass , 1 , mail , ip ,'test' ,1 , 0 , 0 ,actionDate , actionDate ] , function(errors , results , fields) {
                    if(errors){
                        res.send(errors);
                    } else {
                        db.query("SELECT user_id FROM amz_login WHERE user_name= ?" , [name] ,function(errors2,results2,fields2){
                            
                                if(errors2) {
                                    res.send(errors2);
                                } else {
                                   var userID = results2[0].user_id;
                                    db.query("INSERT INTO amz_user_info(user_id,team_id,status,create_date, maintain_date) VALUES(?,?,?,?,?)" ,[userID , team , '1' , actionDate , actionDate ] , function(errors3, results3, feilds3) {
                                        if(errors3) {
                                            res.send(errors3);
                                        } else {
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