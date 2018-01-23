var express = require('express');
var router = express.Router();
var myTeam = require('../models/loadTeamForReg');

router.get('/', function (req, res, next) {
   
        myTeam.getAllTeams(function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        });  
    });

module.exports = router; 