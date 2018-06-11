var express = require('express');
var router = express.Router();
var Tasks = require('../models/Tasks');
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Tasks.getTaskById(req.params.id, function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        });
    } else {
        Tasks.getAllTasks(function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        });
    }
});
router.post('/', function (req, res, next) {
    Tasks.addTask(req.body, function (err, count) {
        if (err) {
            res.json(err);
        } else {
            res.json({
                "code": 200,
                "success": "passed",
            }); //or return count for 1 & 0  
        }
    });
});

router.post('/remove', function (req, res, next) {
    Tasks.deleteTask(req.body, function (err, count) {
        if (err) {
            res.json(err);
        } else {
            res.json({
                "code": 200,
                "success": "passed",
            });
        }
    });
});
router.put('/:id', function (req, res, next) {
    Tasks.updateTask(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json({
                "code": 200,
                "success": "passed",
            });
        }
    });
});
module.exports = router;