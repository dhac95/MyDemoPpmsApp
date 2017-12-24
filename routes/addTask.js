var express = require('express');  
var db = require('../dbconnections');
var router = express.Router();  
var uEntry = require('../models/uEntry');  




db.query("SELECT date FROM amz_holidays where status='1' AND deleted='0'" , function(error , results , fields) {
    var holiday = [];
    holiday = results.date;
});



router.get('/:id?', function(req, res, next) {  
    if (req.params.id) {  
        uEntry.getuEntryById(req.params.id, function(err, rows) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(rows);  
            }  
        });  
    } else {  
        uEntry.getAlluEntry(function(err, rows) {  
            if (err) {  
                res.json(err);  
            } else {  
                res.json(rows);  
            }  
        });  
    }  
});  
router.get('/holiday', function(res, req , next){
        uEntry.getHoliday(function(err, rows){
                if(err) {
                    res.json(err);
                } else {
                    res.json(rows);
                }
        });
});

router.post('/', function(req, res, next) {  
    uEntry.adduEntry(req.body, function(err, count) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(req.body); //or return count for 1 & 0  
        }  
    });  
});  
router.delete('/:id', function(req, res, next) {  
    uEntry.deleteuEntry(req.params.id, function(err, count) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(count);  
        }  
    });  
});  
router.put('/:id', function(req, res, next) {  
    uEntry.updateuEntry(req.params.id, req.body, function(err, rows) {  
        if (err) {  
            res.json(err);  
        } else {  
            res.json(rows);  
        }  
    });  
});  
module.exports = router;  