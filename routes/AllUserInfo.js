var express = require('express');
var router = express.Router();
var AllUserInfo = require('../models/AllUserInfo');
router.get('/:id?', function (req, res, next) {
    if (req.params.id) {
        AllUserInfo.getAllUserInfoById(req.params.id, function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        });
    } else {
        AllUserInfo.getAllAllUserInfos(function (err, rows) {
            if (err) {
                res.json(err);
            } else {
                res.json(rows);
            }
        });
    }
});
router.post('/', function (req, res, next) {
    AllUserInfo.addAllUserInfo(req.body, function (err, count) {
        if (err) {
            res.json(err);
        } else {
            res.json(req.body); //or return count for 1 & 0  
        }
    });
});
router.delete('/:id', function (req, res, next) {
    AllUserInfo.deleteAllUserInfo(req.params.id, function (err, count) {
        if (err) {
            res.json(err);
        } else {
            res.json(count);
        }
    });
});
router.put('/:id', function (req, res, next) {
    AllUserInfo.updateAllUserInfo(req.params.id, req.body, function (err, rows) {
        if (err) {
            res.json(err);
        } else {
            res.json(rows);
        }
    });
});
module.exports = router;