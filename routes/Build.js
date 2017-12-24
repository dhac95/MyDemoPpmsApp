var express = require('express');  
var router = express.Router();  
var Build = require('../models/Build');  
router.get('/:id?', function(req, res, next) {  
    if (req.params.id) {  
        Build.getBuildById(req.params.id, function(err, rows) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(rows);  
            }  
        });  
    } else {  
        Build.getAllBuilds(function(err, rows) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(rows);  
            }  
        });  
    }  
});  
router.post('/', function(req, res, next) {  
    Build.addBuild(req.body, function(err, count) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(req.body); //or return count for 1 & 0  
        }  
    });  
});  
router.delete('/:id', function(req, res, next) {  
    Build.deleteBuild(req.params.id, function(err, count) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(count);  
        }  
    });  
});  
router.put('/:id', function(req, res, next) {  
    Build.updateBuild(req.params.id, req.body, function(err, rows) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(rows);  
        }  
    });  
});  
module.exports = router;  