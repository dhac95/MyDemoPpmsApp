var express = require('express');
var router = express.Router();
var db = require('../dbconnections');
var moment = require('moment');
var async = require("async");

router.post('/' , function(req , res , next) {
     var team = req.body.team_id;
     var tempDate = req.body.month;
     var actionBy = req.body.user_id;
     var formattedDate = moment(tempDate).format('YYYY-MM');
     var formatDate2 = moment(tempDate).subtract(1, 'M').format('MMMM YYYY');
     var endDate = moment(tempDate).add(1, 'M').format('YYYY-MM-DD');
     var today = moment().format('YYYY-MM-DD');
     var queryError = [];

     db.query('SELECT s_no FROM amz_dc_units WHERE team_id = ?  AND month = ? AND status = 1', [team, formatDate2], function (errors, results, feilds) {
        if(errors) {
            res.send({
                "code" : 401 , 
                "message" : "Fatel Error"
            });
        }    
        else if(results.length == 0) {
              res.send({
                  "code": 300,
                  "Message": "No Device count set previous month"
              });
         } else {
                db.query('INSERT INTO amz_dc_units(month , team_id , task_id , sub_task_id , noofdevice , percentage , status , modified_by , create_date , maintain_date)  SELECT ? , team_id, task_id, sub_task_id, noofdevice, percentage, status, ? , now(), now() FROM `amz_dc_units` where team_id = ? and month = ? AND status = 1 ', [tempDate, actionBy, team, formatDate2], function (err, resp, fiel) {
                        if(err) {
                            res.send({
                                "code" : 402 , 
                                "message" : "Error Occored"
                            });
                        } else {
                            res.send({
                                "code" : 200 , 
                                "message" : "passed"
                            });
                        }
                });
            }
         });

});

module.exports = router;