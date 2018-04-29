
(function () {
    'use strict';

    angular
        .module('ERP.pages.UserOT')
        .controller('UserOTController', UserOTController)
        .controller('UserOTModelController', UserOTModelController);


    UserOTController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'UserOTService', '$uibModal', 'NgTableParams','Notification'];
    function UserOTController($scope, $rootScope, $http, $filter, UserOTService, $uibModal, NgTableParams, Notification) {

        $rootScope.title = "UserOT";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.getTotalTime = getTotalTime;
        $scope.getTotalCount = getTotalCount;
        

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeUserOT = removeUserOT;
        $scope.saveUserOT = saveUserOT;
       

        $scope.team = {};
        $scope.build = {};
        $scope.task = {};
        $scope.subtask = {};
        $scope.date = {};
        $scope.getTeamList = getTeamList;
        $scope.getTaskbyDate = getTaskbyDate;
      
      //  loadGrid();

        $scope.LeaveTypes = [
            { "id": 0, "Name": "Not a Leave" },
            { "id": 1, "Name": "Manager Approved" },
            { "id": 2, "Name": "Manager Not Approved" },
            { "id": 3, "Name": "Unexpected" }
        ];

        $scope.addUserOTModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/UserOT/views/UserOTModel.html',
                controller: 'UserOTModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                loadGrid();
            }, function () {
            });
        };


        $scope.editUserOTModel = function (UserOT) {
            $scope.items.isEditing = true;
            $scope.items.UserOT = UserOT;
            
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/UserOT/views/UserOTModel.html',
                controller: 'UserOTModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                getTaskbyDate();
                getTotalTime();
            }, function () {
            });
        };

        // function loadGrid() {
        //     var self = this;
        //     UserOTService.getAddedTask($scope, $rootScope, $http, $scope.UserOT, $rootScope.user_id).then(function (responce) {
        //         $scope.tableParams = new NgTableParams({}, { 
        //             dataset: responce.data 
        //         });
        //     });
        // }

        
        function saveUserOT(UserOT) {
            $scope.UserOT.user_id = $rootScope.user_id;
                UserOT.team_id = $scope.team.selected;
                UserOT.tasks_id = $scope.task.selected;
                UserOT.sub_task_id = $scope.subtask.selected;
                UserOT.build = $scope.build.selected;
                UserOT.date = $scope.date.selected;
                UserOT.user_type = $rootScope.user_type;
                $scope.showLoader = true;

                UserOTService.addUserOT($scope, $rootScope, $http, $scope.UserOT).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Added Successful");
                        getTaskbyDate();
                        getTotalTime();
                        $scope.showLoader = false;
                    } else if(res.data.results){
                        Notification({ message: "Time must be total of 16 hours", title: "Error! Check entered time" }, 'error');
                        $scope.showLoader = false;
                    }
                    else {
                        Notification.error("Error occoured !! Please try again");
                        $scope.showLoader = false;
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                    $scope.showLoader = false;
                });
            }


            getTaskbyDate();
           
            function getTaskbyDate() {
               
                var Date = $scope.date.selected;
                
                var formatDate =  $filter('date')(Date, "yyyy-MM-dd");
                var obj = {
                        date : formatDate,
                        user_id : $rootScope.user_id
                };
                var promiseGet = UserOTService.getAddedTask($scope, $rootScope, $http ,obj );
                promiseGet.then(function (pl) {
                     $scope.Addedtasklist = pl.data;  
                       if ($scope.isEditing) {
                        for (var i in $scope.Addedtasklist) {
                        if ($scope.Addedtasklist[i].date == $scope.UserOT.date) {
                            $scope.date.selected = $scope.Addedtasklist[i];
                        }
                    }
                 }
                    getTotalTime();
                },
                      function (errorPl) {
                          Notification('Some Error in Getting Records.', errorPl);
                    });
            }

    
            // getTeamList();

            // function getTeamList() {
            //     var promiseGet = UserOTService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
            //     promiseGet.then(function (pl) {
            //          $scope.TeamList = pl.data; 
            //            if ($scope.isEditing) {
            //          for (var team in $scope.TeamList) {
            //             if ($scope.TeamList[team].team_id == $scope.UserOT.team_id) {
            //                 $scope.team.selected = $scope.TeamList[team];
            //             }
            //         }
            //      }
            //         $scope.selectTask();
            //         $scope.selectBuild();
            //     },
            //           function (errorPl) {
            //               Notification('Some Error in Getting Records.', errorPl);
            //           });
            // }
    
        getTeamList();
        function getTeamList() {
            var promiseGet = UserOTService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                $scope.TeamList = pl.data;
                if (pl.data.length > 1) {
                    if ($scope.isEditing) {
                        for (var team in $scope.TeamList) {
                            if ($scope.TeamList[team].team_id == $scope.UserOT.team_id) {
                                $scope.team.selected = $scope.TeamList[team];

                            }

                        }
                        $scope.selectTask();
                        $scope.selectBuild();
                    }
                    else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                        $scope.selectTask();
                        $scope.selectBuild();
                    }
                }
                else {
                    $scope.team.selected = $scope.TeamList[0].team_id;
                    $scope.selectTask();
                    $scope.selectBuild();
                }

            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }


            $scope.selectBuild = function() {
                //  $scope.task.selected = {};
                  var team_id = $scope.team.selected;
                  var promiseGet = UserOTService.getLoadedBuilds($scope, $rootScope, $http ,team_id );
                  promiseGet.then(function (pl) {
                       $scope.BuildList = pl.data;
                     if ($scope.isEditing) { 
                       for (var build in $scope.BuildList) {
                          if ($scope.BuildList[build].build_no == $scope.UserOT.build) {
                              $scope.build.selected = $scope.BuildList[build];
                          }
                      }
                     }
                  },
                        function (errorPl) {
                            Notification('Some Error in Getting Records.', errorPl);
                        });
          };
    
    
    
            $scope.selectTask = function() {
                  //  $scope.task.selected = {};
                    var team_id = $scope.team.selected;
                    var promiseGet = UserOTService.getLoadedTasks($scope, $rootScope, $http ,team_id );
                    promiseGet.then(function (pl) {
                         $scope.TaskList = pl.data; 
                 if ($scope.isEditing) {
                         for (var task in $scope.TaskList) {
                            if ($scope.TaskList[task].task_id == $scope.UserOT.tasks_id) {
                                $scope.task.selected = $scope.TaskList[task];
                            }
                        }
                     }
                        $scope.selectsubTask();
                    },
                          function (errorPl) {
                              Notification('Some Error in Getting Records.', errorPl);
                         });
                 };
    
            $scope.selectsubTask = function() {
                //  $scope.task.selected = {};
                  var task_id = $scope.task.selected;
                  var promiseGet = UserOTService.getLoadedsubTasks($scope, $rootScope, $http ,task_id );
                  promiseGet.then(function (pl) {
                       $scope.subTaskList = pl.data; 
                    if ($scope.isEditing) {
                       for (var subtask in $scope.subTaskList) {
                          if ($scope.subTaskList[subtask].sub_task_id == $scope.UserOT.sub_task_id) {
                              $scope.subtask.selected = $scope.subTaskList[subtask];
                          }
                      }
                 }
                  },
                        function (errorPl) {
                            Notification('Some Error in Getting Records.', errorPl);
                        });
          };

          function getTotalCount() {
            var totCount = 0;
            for (var i in $scope.Addedtasklist) {
                totCount += $scope.Addedtasklist[i].count;
            }

            // $scope.UserOT.TotalTime = grandTot;
            return totCount;
        }     

        getTotalTime();
        function getTotalTime() {
            var Date = $scope.date.selected;
            var formatDate = $filter('date')(Date, "yyyy-MM-dd");
            var obj = {
                date: formatDate, 
                user_id: $rootScope.user_id
            };
            var promiseGet = UserOTService.getRemaingTime($scope, $rootScope, $http, obj);
            promiseGet.then(function (pl) {
                $scope.remTime = pl.data;
                //var grandTot = $scope.remTime.time;
                // $scope.AddTask.TotalTime = grandTot;
                // return grandTot;
            },
                function (errorPl) {
                    Notification({ message: 'Some Error in Getting Records.' }, 'error');
                });
        }

        //   function getTotalTime() {
        //     var grandTot =  new Date('00:00:00');
        //     for (var i in $scope.Addedtasklist) {
        //         var filterTime = $scope.Addedtasklist[i].time;
        //         grandTot = new Date(grandTot) + new Date(filterTime);
        //     }

        //     // $scope.UserOT.TotalTime = grandTot;
        //     return grandTot;
        // }

        

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = yyyy + '-' + mm + '-' + dd;
        document.getElementById("date").setAttribute("max", today);


        var Create = new Date($rootScope.create_date);
        var ddd = Create.getDate();
        var mmm = Create.getMonth() + 1; //January is 0!
        var yyy = Create.getFullYear();
        if (ddd < 10) {
            ddd = '0' + ddd;
        }
        if (mmm < 10) {
            mmm = '0' + mmm;
        }
        Create = yyy + '-' + mmm + '-' + ddd;
        document.getElementById("date").setAttribute("min", Create);

        function removeUserOT(UserOT) {
            //if (UserOT.Active === 0) {
               var id = UserOT.task_id;
            //    id :  UserOT.UserOT_id
            // //     //Active: UserOT.Active,
            // //     //ActionBy: $rootScope.loggedUserId
           //   };
            if (window.confirm("Do you really want to delete this UserOT")) {
                UserOTService.deleteUserOT($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Deleted Successful");
                        getTaskbyDate();
                        getTotalTime();
                    } else {
                        Notification.error("Try Again");
                        
                    }
                }, function (err) {
                    Notification.error("Error while processing! Try Again.");
                });
            }
            //} else {
            //    alert("Active Status Can't be Delete")
            //}
        }
    }

       


    UserOTModelController.$inject = ['$scope', '$rootScope', '$http','$filter' ,'items', '$uibModalInstance', 'UserOTService', 'Notification'];
    function UserOTModelController($scope, $rootScope, $http, $filter,items, $uibModalInstance, UserOTService, Notification) {

        var time = items.UserOT.time.substring(0, 5);
        var formatDate = $filter('date')(items.UserOT.date, "yyyy-MM-dd");
        // items.push({ "time" : time } );
        items.UserOT.time = time;
        items.UserOT.date = formatDate;

        $scope.items = items;
        if (items.isEditing)
            $scope.UserOT = angular.copy(items.UserOT);
        else
            $scope.UserOT = null;

        $scope.saveUserOT = function (UserOT) {
            if (items.isEditing) {
                //$scope.UserOT.ModifiedBy = "1";
                var id = UserOT.task_id;
                $scope.UserOT.user_id = $rootScope.user_id;
                UserOT.team_id = $scope.team.selected;
                UserOT.tasks_id = $scope.task.selected;
                UserOT.sub_task_id = $scope.subtask.selected;
                UserOT.build = $scope.build.selected;
                UserOT.date = $scope.date.selected;
                UserOT.user_type = $rootScope.user_type;
               // $scope.UserOT.create_date = $rootScope.date;
                UserOTService.updateUserOT($scope, $rootScope, $http, $scope.UserOT,id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Update Successful");
                        $uibModalInstance.close();
                    } else {
                        Notification.error("Error while updating! Try Again.");
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            } else {
                $scope.UserOT.user_id = $rootScope.user_id;
                UserOT.team_id = $scope.team.selected;
                UserOT.tasks_id = $scope.task.selected;
                UserOT.sub_task_id = $scope.subtask.selected;
                UserOT.build = $scope.build.selected;
                UserOT.user_type = $rootScope.user_type;

                UserOTService.addUserOT($scope, $rootScope, $http, $scope.UserOT).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Added Successful");
                        $uibModalInstance.close();
                    } else if(res.data.results){
                        Notification({ message: "Time must be total of 16 hours", title: "Error! Check entered time" }, 'error');
                    }
                    else {
                        Notification.error("Error occoured !! Please try again");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        };

        getTeamList();

        function getTeamList() {
            var promiseGet = UserOTService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
            promiseGet.then(function (pl) {
                 $scope.TeamList = pl.data; 
                   if ($scope.isEditing) {
                 for (var team in $scope.TeamList) {
                    if ($scope.TeamList[team].team_id == $scope.UserOT.team_id) {
                        $scope.team.selected = $scope.TeamList[team];
                    }
                }
             }
                $scope.selectTask();
                $scope.selectBuild();
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.');
                  });
        }

        $scope.selectBuild = function() {
            //  $scope.task.selected = {};
              var team_id = $scope.team.selected;
              var promiseGet = UserOTService.getLoadedBuilds($scope, $rootScope, $http ,team_id );
              promiseGet.then(function (pl) {
                   $scope.BuildList = pl.data;
                 if ($scope.isEditing) { 
                   for (var build in $scope.BuildList) {
                      if ($scope.BuildList[build].build_no == $scope.UserOT.build) {
                          $scope.build.selected = $scope.BuildList[build];
                      }
                  }
                 }
              },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                    });
      };



        $scope.selectTask = function() {
              //  $scope.task.selected = {};
                var team_id = $scope.team.selected;
                var promiseGet = UserOTService.getLoadedTasks($scope, $rootScope, $http ,team_id );
                promiseGet.then(function (pl) {
                     $scope.TaskList = pl.data; 
             if ($scope.isEditing) {
                     for (var task in $scope.TaskList) {
                        if ($scope.TaskList[task].task_id == $scope.UserOT.tasks_id) {
                            $scope.task.selected = $scope.TaskList[task];
                        }
                    }
                 }
                    $scope.selectsubTask();
                },
                      function (errorPl) {
                          Notification('Some Error in Getting Records.', errorPl);
                      });
        };

        $scope.selectsubTask = function() {
            //  $scope.task.selected = {};
              var task_id = $scope.task.selected;
              var promiseGet = UserOTService.getLoadedsubTasks($scope, $rootScope, $http ,task_id );
              promiseGet.then(function (pl) {
                   $scope.subTaskList = pl.data; 
                if ($scope.isEditing) {
                   for (var subtask in $scope.subTaskList) {
                      if ($scope.subTaskList[subtask].sub_task_id == $scope.UserOT.sub_task_id) {
                          $scope.subtask.selected = $scope.subTaskList[subtask];
                      }
                  }
             }
              },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.', errorPl);
                    });
      };


        getTotalTime();
        function getTotalTime() {
            var Date = $scope.UserOT.date;
            var formatDate = $filter('date')(Date, "yyyy-MM-dd");
            var obj = {
                date: formatDate,
                user_id: $rootScope.user_id
            };
            var promiseGet = UserOTService.getRemaingTime($scope, $rootScope, $http, obj);
            promiseGet.then(function (pl) {
                $scope.remTime = pl.data;
                //var grandTot = $scope.remTime.time;
                // $scope.AddTask.TotalTime = grandTot;
                // return grandTot;
            },
                function (errorPl) {
                    Notification({ message: 'Some Error in Getting Records.' }, 'error');
                });
        }

        $scope.LeaveTypes = [
            { "id": 0, "Name": "Not a Leave" },
            { "id": 1, "Name": "Manager Approved" },
            { "id": 2, "Name": "Manager Not Approved" },
            { "id": 3, "Name": "Unexpected" }
        ];


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();