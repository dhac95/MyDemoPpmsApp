var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var sizeof = require('object-sizeof');
var in_array = require('in_array');
var db = require('../dbconnections'); //reference of dbconnection.js \\
//var conn = require('../singleConnection');
var moment = require('moment');
var async = require("async");
var pending = require('../models/testAddTask');

function getHolidays(){
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(2014, 1, 1);
    var lastDay = new Date(y, m + 1, 0);
    var day = firstDay;
    var weekends = [];
    while (day < lastDay) {
        var d = day.getDay(); 
        if (d === 0 || d === 6) { 
            var currentDate = moment(new Date(day)).format('YYYY-MM-DD');
            weekends.push(currentDate);
        }
        day.setDate(day.getDate() + 1);
    }
    return weekends;
}

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
var queryError = [];
    holidays = getHolidays();
        // db.query("SELECT date FROM amz_holidays where status='1' AND deleted='0'" , function(error, results, fields) {
        //            if(results.length > 0 ) {
        //                for(var i= 0 ; i< results.length ; i++) {
        //                    var tempData = moment(results[i].date).format('YYYY-MM-DD');
                          
        //                    holidays.push(tempData);
        //                 //    holidays = new Array(results);
        //      }
                               db.query("SELECT user_id,user_mail,last_entry_on,create_date FROM amz_login where user_id=?" ,[userID], function (e1,r1,f1) {
                                   if(e1) {
                                       res.send({
                                           "code" : 500,
                                           "message" : "Conncection Error"
                                       });
                                   }
                                   else if(r1.length > 0 ) {
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
                                                 var newArr = [];
                                         for (var date in arrDates) {
                                             if (in_array(arrDates[date], holidays ) == false) {
                                              var singleDate = arrDates[date];
                                                //  var timeDiff = getTimes(singleDate , todayDate);
                                                
                                                 newArr.push(singleDate);
                                             }
                                            }
                                               //  if(timeDiff >= 24) {
                                                var totHours = 0;
                                                  //   async.forEachOf(singleDate , function(value, key, callback) {
                            

                                                       async.each(newArr, function (single , callback) {
                                                              // var timeDiff = getTimes(single, todayDate);
                                                            //  if (timeDiff >= 24) {
                                                          //db.query("SELECT time FROM user_tasks WHERE date= ? AND user_id= ?", [single, userID ] , function(e2, r2, f2) {
                                                                    var obj = {
                                                                        date : single,
                                                                        user_id : userID
                                                                    };
                                                           pending.getPendingDates(obj , function(e2, r2){
                                                                    
                                                        if(e2) {
                                                            queryError.push(e2); 
                                                         }
                                                        else {
                                                            totHours = 0;
                                                            if (r2.length > 0) {
                                                                for (var j = 0; j < r2.length ; j++) {
                                                                    totHours += nodestrtotime(r2[j].time) - nodestrtotime('00:00:00'); 
                                                                   
                                                                }                                                            
                                                           }
                                                            if(totHours < 28800) {
                                                                pendingDates.push(single);
                                                            }
                                                        }     
                                                               callback();                  
                                                });     
                                                         
                                            } , function(response){
                                                if (queryError.length > 0 ) {
                                                    res.send(queryError);
                                                } else {
                                                res.send(pendingDates);
                                                }
                                        });
                                }
                            
                        });
                            
              //  }    
        // });
  
        
});

module.exports = router; 