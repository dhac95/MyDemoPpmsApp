var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var db = require('../dbconnections'); //reference of dbconnection.js 


router.post('/', function(req, res, next) {  
   
    var tem_date = datetime.create(req.body.date);
    var date = tem_date.format('Y-m-d');
    var userID = req.body.user_id;

    db.query("SELECT * FROM user_tasks WHERE date=? AND user_id= ?", [date, userID] , function(error, results, fields){
            if(error) {
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                  });
            }
            else {
                res.send(results);
            }
    });

});  

module.exports = router; 