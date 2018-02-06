var express = require('express');

var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var md5 = require('md5');  
var db = require('../dbconnections'); //reference of dbconnection.js 


router.get('/:id?', function(req , res , next) {
    //var team = req.body.team_id;
    db.query('SELECT * FROM amz_builds where team_id = ? and build_status=1',[req.params.id] , function(error, results , fields){
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