var express = require('express');

var router = express.Router();
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var md5 = require('md5');
var db = require('../dbconnections'); //reference of dbconnection.js 


router.get('/:id?', function (req, res, next) {
    //var team = req.body.team_id;
    db.query('SELECT build_no , build_name FROM amz_builds where team_id = ? and build_status = 1 ORDER BY amz_builds.build_no DESC', [req.params.id], function (error, results, fields) {
        if (error) {
            res.json({
                "code": 400,
                "failed": "error ocurred",
            });
        } else {
            res.send(results);

        }
    });
});

router.get('/release/:id?', function (req, res, next) {
    //var team = req.body.team_id;
    db.query("select s_no , release_name from amz_releases where team_id = ? and release_status = '1' ORDER BY s_no DESC", [req.params.id], function (error, results, fields) {
        if (error) {
            res.json({
                "code": 400,
                "failed": "error ocurred",
            });
        } else {
            res.send(results);

        }
    });
});


module.exports = router;