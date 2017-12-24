var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var db = require('../dbconnections'); //reference of dbconnection.js 


router.post('/', function(req, res, next) {
var pendingDates = [];
var userID = req.body.user_id;
var totHours = 0;
var holidays = [];

        db.query("SELECT date FROM amz_holidays where status='1' AND deleted='0'" , function(error, results, fields) {
                   if(results.length > 0 ) {
                      for(var i=0 ; i < results.length ; i++) {
                           holidays = results[i];
                       }
                       res.send(holidays);
                   }
        });
});

module.exports = router; 