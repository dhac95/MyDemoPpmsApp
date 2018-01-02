var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var sizeof = require('object-sizeof');
var in_array = require('in_array');
var mktime = require('locutus/php/datetime/mktime');
var db = require('../dbconnections'); //reference of dbconnection.js \\
var moment = require('moment');

function java_mktime(hour,minute,seconds,month,day,year) {
    return new Date(year, month, day, hour, minute, 0, 0).getTime() / 1000;
}


// Returns an array of dates between the two dates
function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopdate = moment(stopDate);
    while (currentDate <= stopdate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD') );
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

//Getting hour diffenece
function getTimes(startDate, endDate)  {
startDate = moment(startDate, 'YYYY-MM-DD');
endDate = moment(endDate, 'YYYY-MM-DD');
var hourDiff = endDate.diff(startDate, 'hours');
            return hourDiff;
}


router.post('/', function(req, res, next) {
var pendingDates = [];
var userID = req.body.user_id;
var totHours = 0;
var holidays = [];
        db.query("SELECT date FROM amz_holidays where status='1' AND deleted='0'" , function(error, results, fields) {
                   if(results.length > 0 ) {
                           holidays = new Array(results);
                               db.query("SELECT user_id,user_mail,last_entry_on,create_date FROM amz_login where user_id=?" ,[userID], function (e1,r1,f1) {
                                   if(r1.length) {
                                       var lastEntered = null;
                                         var createDate = datetime.create(r1[0].create_date).format('Y-m-d');
                                         if(r1[0].last_entry_on != null) {
                                         var lastEntry = datetime.create(r1[0].last_entry_on).format('Y-m-d');
                                          lastEntered = lastEntry == null ? createDate : lastEntry;     
                                          }
                                          else {
                                               lastEntered = r1[0].last_entry_on == null ? createDate : r1[0].last_entry_on ;
                                              }
                                          var credate = datetime.create();//new Date();
                                          var todayDate = credate.format('Y-m-d');
                                          var arrDates = getDates(lastEntered , todayDate);
                                           //  var arrDates = temp_arrDates;
                                          //  var size = arrDates.length;

                                         for(var i=0; i < arrDates.length ; i++){
                                             if(!in_array(arrDates[i] , holidays)) {
                                              var singleDate = arrDates[i];
                                                 var timeDiff = getTimes(singleDate , todayDate);
                                                 if(timeDiff >= 24) {
                                                // var totHours = 0;
                                                db.query("SELECT time FROM user_tasks WHERE date=? AND user_id=?",[singleDate , userID] , function(e2,r2,f2){
                                                        if(e2) {
                                                            res.send(e2);
                                                         }
                                                        else {
                                                            if(r2.length > 0) {
                                                                for(var j=0 ; j < r2.length ; j++) {
                                                                    totHours += nodestrtotime(r2[j].time) - nodestrtotime('00:00:00'); 
                                                                }
                                                            
                                                            }
                                                            if(totHours < 28800) {
                                                                pendingDates.push(singleDate);
                                                                res.send(pendingDates);
                                                            }
                                                            else {
                                                                pendingDates.push(singleDate);
                                                                res.send(pendingDates);
                                                            }
                                                           // res.send(pendingDates);
                                                        }
                                                });
                                           }
                                        }
                                    }
                                }
                            }
                 )}     
        });
        
});

module.exports = router; 