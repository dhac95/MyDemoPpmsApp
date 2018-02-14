var express = require('express');  
var router = express.Router();  
var Team = require('../models/Team');  
var moment = require('moment');
var db = require('../dbconnections');
router.get('/:id?', function(req, res, next) {  
    if (req.params.id) {  
        Team.getTeamById(req.params.id, function(err, rows) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(rows);  
            }  
        });  
    } else {  
        Team.getAllTeams(function(err, rows) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(rows);  
            }  
        });  
    }  
});  
router.get('/:id?', function (req, res, next) {
   
    Team.getTeamByIdStatusTrue(req.params.id, function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        });
    });  

router.post('/', function(req, res, next) {  
    Team.addTeam(req.body, function(err, count) {  
        if (err) {  
            res.json(err);  
        } else {  
           /*  db.query('SELECT team_id from amz_teams ORDER BY team_id DESC' , function(e , r , f){
                if(e) {
                    res.send(e);
                } else {
               var team = r[0].team_id;
               var added = req.body.added_by;
                var today = moment().format('YYYY-MM-DD');
                    db.query('INSERT into amz_tasks(team_id , task_name , added_by , status , about_cf , device_count , op_type , about_chart , deletion , last_modified_by , create_date , maintain_date) VALUES ? ',
                     [[
                                                    [team, 'Absence', added, 1, 0, 0, 0, 0, 0, added, today, today], 
                                                    [team, 'Adhoc task', added, 1, 1, 0, 1 , 1 , 0 , added, today, today], 
                                                    [team, 'Audit' , added, 1, 1, 0 , 1, 1, 0, added, today, today],
                    ]] , function(e1 , r1 , f1){

                    });
                }

            }); */
            res.json(req.body);  
        }  
    });  
});  

router.delete('/:id', function(req, res, next) {  
    Team.deleteTeam(req.params.id, function(err, count) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(count);  
        }  
    });  
});  
router.put('/:id', function(req, res, next) {  
    Team.updateTeam(req.params.id, req.body, function(err, rows) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(rows);  
        }  
    });  
});  
module.exports = router;  