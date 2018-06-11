var express = require('express');
var md5 = require('md5');
var router = express.Router();
// var uLogin = require('../models/uLogin');
var moment = require('moment');
var os = require('os');

var AllUserInfo = require('../models/AllUserInfo');

var db = require('../dbconnections'); //reference of dbconnection.js  
var IsAuth;


router.post('/', function (req, res, next) {
  // var ip3 = os.hostname();

  // var interfaces = os.networkInterfaces();
  // var addresses = [];
  // for (var k in interfaces) {
  //   for (var k2 in interfaces[k]) {
  //     var address = interfaces[k][k2];
  //     if (address.family === 'IPv4' && !address.internal) {
  //       addresses.push(address.address);
  //     }
  //   }
  // }
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  // exports.uLogin = function(req,res){
  var username = req.body.user_name;
  var email = req.body.user_mail;
  var password = md5(req.body.password);
  var now = moment().format('LLLL');
  var IsAuth;
  db.query('SELECT * FROM amz_login WHERE (user_name = ? OR user_mail = ?) AND user_deletion=0 AND user_activation=1', [username, email], function (error, results, fields) {
    if (error) {
      // console.log("error ocurred",error);
      IsAuth = false;
      res.send({
        "code": 400,
        "failed": "error ocurred",
        "IsAuth": false
      });
    } else {
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
      if (results.length > 0) {
        //if([0].password === password)
        if (password == results[0].password) {
          IsAuth = true;
          res.send({
            "code": 200,
            "success": "login sucessfull",
            "IsAuth": true,
            data: results
          });
          console.log('\x1b[33m%s\x1b[0m', 'New login by user : ' + username + ' at ' + now + ' with IP ' + ip);
          // console.log('New login by user : ' + username + ' at ' + now);
        } else {
          IsAuth = false;
          res.send({
            "code": 204,
            "success": "username and password does not match",
            "IsAuth": false
          });
          console.log('\x1b[33m%s\x1b[0m', 'New login attempt by user : ' + username + ' at ' + now  + ' with IP ' + ip);
        }
      } else {
        IsAuth = false;
        res.send({
          "code": 204,
          "success": "username does not exits",
          "IsAuth": false
        });
        console.log('\x1b[33m%s\x1b[0m', 'New login attempt by unknown user : ' + username + ' at ' + now + ' with IP ' + ip);
      }
    }
  });
});

module.exports = router;