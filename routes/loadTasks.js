var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var db = require('../dbconnections'); //reference of dbconnection.js 

router.get('/:id?', function(req , res , next) {
    //var team = req.body.team_id;
    db.query('SELECT task_id , task_name FROM amz_tasks where team_id = ? and amz_tasks.status = 1 and amz_tasks.deletion = 0 ORDER BY amz_tasks.task_name ASC',[req.params.id] , function(error, results , fields){
        if(error) {
            res.json({
                "code":400,
                "failed":"error ocurred",
              });
        }
        else {
                res.send(results);
                
        }

    });


});

router.get('/subTask/:id' , function(req , res , next) {
   //var taskID = req.body.task_id;

    db.query('SELECT sub_task_id , sub_task_name FROM amz_sub_tasks where task_id=? and deletion = 0 and task_status=1 ORDER BY sub_task_name ASC',[req.params.id] , function(error, results , fields){
        if(error) {
            res.json({
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