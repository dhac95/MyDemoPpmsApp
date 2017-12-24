var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var loadTeams = require('../models/loadTeams');
//var db = require('../dbconnections'); //reference of dbconnection.js 


var Teams = [];
router.get('/:id?', function(req, res, next) {  
        if (req.params.id) {  
                loadTeams.getLoadedTeams(req.params.id, function(err, rows) {  
                if (err) {  
                    res.json(err);  
                } else {  
                        setValue(rows);  
                        res.json(rows);  
                }  
            });  
        }   
    });  
    function setValue(value) {
        Teams = value;
        //console.log(Teams);
      }




      
// router.get('/:id', function(req , res , next) {
// //     var user = req.body.user_id;
//         db.query('select amz_user_info.team_id , amz_teams.team_name from amz_user_info inner join amz_teams on amz_user_info.team_id = amz_teams.team_id where user_id = ?' , [user] , function(error, results , fields){
//                 if(error) {
//                     res.json({
//                         "code":400,
//                         "failed":"error ocurred",
//                       });
//                 }
//                 else {
//                         res.send(results);
                        
//                 }
//         });
// });     

module.exports = router; 