var db = require('../dbconnections');
var express = require('express');
var router = express.Router();
var Releases = require('../models/Release');  

router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        Releases.getReleaseById(req.params.id, function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        });
    } else {
        Releases.getAllReleases(function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        });
    }
});  

router.delete('/:id', function (req, res, next) {
    Releases.removeRelease(req.params.id, function (err, count) {
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
    var team = req.body.team_id, releaseName = req.body.release_name , sNo = req.body.s_no;

    db.query("SELECT release_name FROM amz_releases WHERE team_id = ? AND release_name = ? AND s_no != ?", [team, releaseName, sNo], function (e, r, f) {

        if (r.length > 0) {
            res.send({
                "code": "300",
                "message": "Name already exists"
            });
        }
        else {
    Releases.updateRelease(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json({
                "code": 200,
                "success": "passed",
            });
        }
    });
}
});
});  

router.post('/' , function(req , res , next) {
    var team = req.body.team_id , releaseName = req.body.release_name ;

    db.query("SELECT release_name FROM amz_releases WHERE team_id = ? AND release_name = ?" , [team  , releaseName] , function(e , r , f) {
        
         if( r.length > 0 ) {
            res.send({
                    "code" : "300",
                    "message" : "Name already exists"
            });
        }
        else {
             Releases.addRelease(req.body, function (err, count) {
               if (err) {
              res.json(err);
                      } else {
                              res.send({
                                    "code": 200,
                                    "success": "passed",
                                }); 
                    }
                });
            }
            });  
});

module.exports = router;  