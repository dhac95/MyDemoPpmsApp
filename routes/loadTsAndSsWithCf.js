var express = require('express');
var router = express.Router(); 
var db = require('../dbconnections'); //reference of dbconnection.js 

router.post('/tasks/manual' , function(req , res , next){

    db.query('SELECT * from amz_tasks WHERE status = 1 ANF deletion = 0 AND about_cf = 1 AND team_id = ?' ,[req.body.team_id]  , function(errors , results , fields) {
        if (error) {
            res.json({
                "code": 400,
                "failed": "error ocurred",
            });
        }
        else {
            res.send(results);
        }
    });
});

router.post('/subTasks/manual' , function(req , res , next) {
    db.query('SELECT * from amz_sub_tasks WHERE status = 1 ANF deletion = 0 AND about_cf = 1 AND team_id = ?', [req.body.team_id], function (errors, results, fields) {
        if (error) {
            res.json({
                "code": 400,
                "failed": "error ocurred",
            });
        }
        else {
            res.send(results);
        }
    });
});

router.post('tasks/auto' , function(req , res , next){
    db.query('SELECT * from amz_tasks WHERE status = 1 ANF deletion = 0 AND about_cf = 0 AND team_id = ?', [req.body.team_id], function (errors, results, fields) {
        if (error) {
            res.json({
                "code": 400,
                "failed": "error ocurred",
            });
        }
        else {
            res.send(results);
        }
    });
});

router.post('/subTasks/auto', function (req, res, next) {
    db.query('SELECT * from amz_sub_tasks WHERE status = 1 ANF deletion = 0 AND about_cf = 0 AND team_id = ?', [req.body.team_id], function (errors, results, fields) {
        if (error) {
            res.json({
                "code": 400,
                "failed": "error ocurred",
            });
        }
        else {
            res.send(results);
        }
    });
});

router.post('tasks/no', function (req, res, next) {
    db.query('SELECT * from amz_tasks WHERE status = 1 ANF deletion = 0 AND about_cf IS NULL AND team_id = ?', [req.body.team_id], function (errors, results, fields) {
        if (error) {
            res.json({
                "code": 400,
                "failed": "error ocurred",
            });
        }
        else {
            res.send(results);
        }
    });
});

router.post('/subTasks/no', function (req, res, next) {
    db.query('SELECT * from amz_sub_tasks WHERE status = 1 ANF deletion = 0 AND about_cf IS NULL AND team_id = ?', [req.body.team_id], function (errors, results, fields) {
        if (error) {
            res.json({
                "code": 400,
                "failed": "error ocurred",
            });
        }
        else {
            res.send(results);
        }
    });
});

module.exports = router;