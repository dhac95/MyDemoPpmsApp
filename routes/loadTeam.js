var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var loadTeams = require('../models/loadTeams');
//var db = require('../dbconnections'); //reference of dbconnection.js 


router.get('/:id?', function(req, res, next) {  
        if (req.params.id) {  
                loadTeams.getLoadedTeams(req.params.id, function(err, rows) {  
                if (err) {  
                    res.json(err);  
                } else {  
                       // setValue(rows);  
                        res.json(rows);  
                }  
            });  
        }   
    });  

    router.get('/users/:id?', function(req , res , next) {
        if(req.params.id) {
            loadTeams.getLoadedUsers(req.params.id , function(err , rows){
                    if(err) {
                        res.json(err);
                    } else {
                        res.json(rows);
                    }
            });
        }
    });

        router.get('/registereduser/:id?', function(req , res , next) {
            if(req.params.id) {
                loadTeams.getRegisteredUsers(req.params.id , function(err , rows){
                        if(err) {
                            res.json(err);
                        } else {
                            res.json(rows);
                        }
                });
            }

    });

   

module.exports = router; 