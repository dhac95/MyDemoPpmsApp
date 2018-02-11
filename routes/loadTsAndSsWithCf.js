var express = require('express');
var router = express.Router(); 
var db = require('../dbconnections'); //reference of dbconnection.js 

router.get('/tasks/manual/:id?' , function(req , res , next){

    db.query('SELECT * from amz_tasks WHERE status = 1 AND deletion = 0 AND about_cf = 1 AND team_id = ? ORDER BY task_name ASC' ,[req.params.id]  , function(errors , results , fields) {
        if (errors) {
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

router.get('/subtasks/manual/:id?' , function(req , res , next) {
    db.query('SELECT * from amz_sub_tasks WHERE task_status = 1 AND deletion = 0 AND about_cf = 1 AND task_id = ? ORDER BY sub_task_name ASC', [req.params.id], function (errors, results, fields) {
        if (errors) {
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

router.get('tasks/auto/:id?' , function(req , res , next){
    db.query('SELECT * from amz_tasks WHERE status = 1 AND deletion = 0 AND about_cf = 0 AND team_id = ?', [req.params.id], function (errors, results, fields) {
        if (errors) {
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

router.get('/subTasks/auto/:id?', function (req, res, next) {
    db.query('SELECT * from amz_sub_tasks WHERE status = 1 AND deletion = 0 AND about_cf = 0 AND team_id = ?', [req.params.id], function (errors, results, fields) {
        if (errors) {
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

router.get('tasks/no/:id?', function (req, res, next) {
    db.query('SELECT * from amz_tasks WHERE status = 1 AND deletion = 0 AND about_cf IS NULL AND team_id = ?', [req.params.id], function (errors, results, fields) {
        if (errors) {
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

router.get('/subTasks/no/:id?', function (req, res, next) {
    db.query('SELECT * from amz_sub_tasks WHERE status = 1 AND deletion = 0 AND about_cf IS NULL AND team_id = ?', [req.params.id], function (errors, results, fields) {
        if (errors) {
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

router.get('/Tasks/HaveSt/:id?', function (req, res, next) {
    db.query('SELECT * from amz_tasks WHERE status = 1 AND deletion = 0 AND have_st = 1 AND team_id = ?', [req.params.id], function (errors, results, fields) {
        if (errors) {
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