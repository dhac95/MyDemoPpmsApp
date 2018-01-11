var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
// var uLogin = require('../models/uLogin');
var AllUserInfo = require('../models/AllUserInfo');

var db = require('../dbconnections'); //reference of dbconnection.js  
var IsAuth;


router.post('/', function(req, res, next) {
// exports.uLogin = function(req,res){
  var username= req.body.user_name;
  var password = md5(req.body.password);
  var IsAuth ;
  db.query('SELECT * FROM amz_login WHERE user_name = ? AND user_deletion=0 AND user_activation=1',[username], function (error, results, fields) {
  if (error) {
    // console.log("error ocurred",error);
    IsAuth = false;
    res.send({
      "code":400,
      "failed":"error ocurred",
        IsAuth : false
    });
  }else{
    // var user = results[0].user_id;
    // db.query('select team_id from amz_user_info where user_id = ? and status=1',[user], function(e,r,f){
    //   if(e) {
    //     res.send({
    //       "code":400,
    //       "failed":"error ocurred"
    //     });
    //   } else {
    //     res.send(r);
    //   }
    // });
    // console.log('The solution is: ', results);
    if(results.length >0){
      //if([0].password === password)
      if(password==results[0].password){
       IsAuth = true;
        res.send({
          "code":200,
          "success":"login sucessfull",
            IsAuth : true, 
            data : results
            }
          );
          
      }
      else{
       IsAuth = false;
        res.send({
          "code":204,
          "success":"username and password does not match",
            IsAuth : false
            });
      }
    }
    else{
      IsAuth = false;
      res.send({
        "code":204,
        "success":"username does not exits",
        IsAuth : false
          });
    }
  }
  });
});

module.exports = router; 
// var existing_hashed_password = uLogin.password;
// var password = req.body.password;
// var login_attempt_hashed = crypto.createHash('md5').update(password).digest('hex');
// if ( login_attempt_hashed === existing_hashed_password ) {
//   // Successful login
// } else {
//   // Unsuccessful login
// }