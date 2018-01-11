var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var in_array = require('in_array');
var db = require('../dbconnections');

router.post('/' , function(req , res , next){ 
        var userID = req.body.user_id;
        var teamID = req.body.team_id;
        var modify = req.body.modify;
            db.query("SELECT * from amz_login where user_id = ?" , [userID] , function(e , r , f){
  
                        if(e) {
                            res.send(e);
                        } else {
                            var  tempTeamCount = r[0].team_count;
                            var teamCount = tempTeamCount + 1;
                                db.query("UPDATE amz_login set team_count = ? ,approved_by = ? ,user_activation=1 , user_deletion = 0 , user_status = 1 WHERE user_id = ?" , [teamCount ,modify ,userID] , function(e2 , r2, f2){
                                        if(e2) {
                                            res.send(e2);
                                        } else {
                                                db.query("UPDATE amz_user_info set status = 1 where user_id = ? and team_id = ?" , [userID , teamID] , function(e3 , r3 , f3)  {
                                                        if(e3) {
                                                            res.send(e3);
                                                        } else {
                                                            res.send({
                                                                    "code" : 200 , 
                                                                    "message" : "success",
                                                                    "results" : r3
                                                        });
                                              }
                                      });
                               }
                      });
              }
        });
});  

    router.delete('/:id?' , function(req , res , next){
        var id = req.params.id ; 
        db.query('delete from amz_user_info where s_no = ?',[id], function(error , results , fields){
            if(error) {
                res.send({
                    "code":400,
                    "failed":"error ocurred",
                  });
            }
            else {
                res.send({
                    "code":200,
                    "success":"passed",
                });
            }
             });
    });

module.exports = router;