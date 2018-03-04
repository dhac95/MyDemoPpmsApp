var express = require('express');  
var router = express.Router();  
var subTask = require('../models/subTask');  
router.get('/:id?', function(req, res, next) {  
    if (req.params.id) {  
        subTask.getsubTaskById(req.params.id, function(err, rows) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(rows);  
            }  
        });  
    } else {  
        subTask.getAllsubTasks(function(err, rows) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(rows);  
            }  
        });  
    }  
});  
router.post('/', function(req, res, next) {  
    subTask.addsubTask(req.body, function(err, count) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json({
                "code":200,
                "success":"passed",
            }); //or return count for 1 & 0  
        }  
    });  
});  
router.post('/remove', function(req, res, next) {  
    subTask.deletesubTask(req.body, function(err, count) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json({
                "code":200,
                "success":"passed",
            });  
        }  
    });  
});  
router.put('/:id', function(req, res, next) {  
    subTask.updatesubTask(req.params.id, req.body, function(err, rows) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json({
                "code":200,
                "success":"passed",
            });  
        }  
    });  
});  
module.exports = router;  