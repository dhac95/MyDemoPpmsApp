var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var generator = require('generate-password');
var nodemailer = require('nodemailer');

router.post('/' , function(req , res , next){ 

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var name = req.body.user_name;
    var team = req.body.team_id;
});