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
    db.query('SELECT team_name from amz_teams where team_name = ? and team_deletion = 0', [req.body.team_name] , function(e , r , f) {
        if(e) {
            res.send(e);
        } else if(r.length > 0 ) {
            res.send({
                    "code" : 401 , 
                    "message" : "Team Already exists"
            });
        } else {
             Team.addTeam(req.body, function (err, count) {
                 if (err) {
                     res.json(err);
                 } else {
                     db.query('SELECT team_id from amz_teams where team_name = ?' , [req.body.team_name] , function(e2 , r2 , f2){
                         if(e2){
                             res.send({
                                 'code' : 402,
                                 'message' : e2
                             });
                         } else {
                             var team = r2[0].team_id;
                             var now = moment(new Date()).format('YYYY-MM-DD');
                             db.query('INSERT INTO amz_user_info(user_id , team_id , status , create_date , maintain_date) VALUES (? , ? , ? , ? , ?) ' , [303 , team , 1 , now , now] , function(e3 , r3 , f3){
                                 if(e3){
                                     res.send({
                                         'code': 403,
                                         'message': e3
                                     });
                                 } else {
                                     db.query('UPDATE amz_login set team_count = team_count + 1 where user_id = ?' , [303] , function(e4 , r4 , f4) {
                                         if(e4) {
                                             res.send({
                                                 'code': 405,
                                                 'message': e4
                                             });
                                         } else {
                                             res.json({
                                                 'code': 200,
                                                 'Message': 'success'
                                             });
                                         }
                                     });
                                 }
                             });
                         }
                     });

                    
                 }
             });
        }
    });
   
});  

router.post('/remove', function(req, res, next) {  
    Team.deleteTeam(req.body, function(err, count) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json({
                "code" : 200 ,
                "message" : "success"
            });  
        }  
    });  
});  
router.put('/:id', function(req, res, next) {  
    // db.query('SELECT team_id from amz_teams where team_name = ?', [req.body.team_name], function (e, r, f) { 
    //     if (e) {
    //         res.send(e);
    //     } else if (r.length > 0) {
    //         res.send({
    //             "code" : 401,
    //             "message" : "Team Already exists"
    //         });
    //     } else {
            Team.updateTeam(req.params.id, req.body, function (err, rows) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({
                        "code" : 200,
                        "message" : "success"
                    });
                }
            });  
      //  }
    // });
   
});  

module.exports = router;  