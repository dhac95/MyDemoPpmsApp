
(function () {
    'use strict';

    angular
        .module('ERP.pages.UserOT')
        .controller('UserOTController', UserOTController)
        .controller('UserOTModelController', UserOTModelController);


    UserOTController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'UserOTService','$uibModal','NgTableParams'];
    function UserOTController($scope, $rootScope, $http, $filter, UserOTService, $uibModal, NgTableParams) {

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
                UserOTService.addUserOT($scope, $rootScope, $http, $scope.UserOT).then(function (res) {
                    if (res.data.code == 200) {
                        alert("Added Successful");
                        getTaskbyDate();
                    } else if(res.data.results){
                        alert("Error occoured !! Check the entered time");
                    }
                    else {
                        alert("Error occoured !! Please try again");
                    }
                }, function (err) {
                    alert("Error in processing sever error 500! Try Again.");
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
                },
                      function (errorPl) {
                        alert('Some Error in Getting Records.', errorPl);
                    });
            }



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
                        alert('Some Error in Getting Records.', errorPl);
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
                            alert('Some Error in Getting Records.', errorPl);
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
                            alert('Some Error in Getting Records.', errorPl);
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
                            alert('Some Error in Getting Records.', errorPl);
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

          function getTotalTime() {
            var grandTot =  $filter('date')('00:00:00','HH:mm:ss');
            for (var i in $scope.Addedtasklist) {
                var filterTime = $scope.Addedtasklist[i].time;
                grandTot = $filter('date')(grandTot,'HH:mm:ss') + $filter('date')(filterTime,'HH:mm:ss');
            }

            // $scope.UserOT.TotalTime = grandTot;
            return grandTot;
        }

        function removeUserOT(UserOT) {
            //if (UserOT.Active === 0) {
               var id = UserOT.task_id;
            //    id :  UserOT.UserOT_id
            // //     //Active: UserOT.Active,
            // //     //ActionBy: $rootScope.loggedUserId
           //   };
            if (window.confirm("Do you really want to delte this UserOT")) {
                UserOTService.deleteUserOT($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.code == 200) {
                        alert("Deleted Successful");
                        getTaskbyDate();
                    } else {
                        alert("Try Again");
                        
                    }
                }, function (err) {
                    alert("Error while processing! Try Again.");
                });
            }
            //} else {
            //    alert("Active Status Can't be Delete")
            //}
        }
    }

       


    UserOTModelController.$inject = ['$scope', '$rootScope', '$http', 'items', '$uibModalInstance', 'UserOTService'];
    function UserOTModelController($scope, $rootScope, $http, items, $uibModalInstance, UserOTService) {
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
               // $scope.UserOT.create_date = $rootScope.date;
                UserOTService.updateUserOT($scope, $rootScope, $http, $scope.UserOT,id).then(function (res) {
                    if (res.data == 200) {
                        alert("Update Successful");
                        $uibModalInstance.close();
                    } else {
                        alert("Error while updating! Try Again.");
                    }
                }, function (err) {
                    alert("Error while processing! Try Again.");
                });
            } else {
                $scope.UserOT.user_id = $rootScope.user_id;
                UserOT.team_id = $scope.team.selected;
                UserOT.tasks_id = $scope.task.selected;
                UserOT.sub_task_id = $scope.subtask.selected;
                UserOT.build = $scope.build.selected;

                UserOTService.addUserOT($scope, $rootScope, $http, $scope.UserOT).then(function (res) {
                    if (res.data.code == 200) {
                        alert("Added Successful");
                        $uibModalInstance.close();
                    } else if(res.data.results){
                        alert("Error occoured !! Check the entered time");
                    }
                    else {
                        alert("Error occoured !! Please try again");
                    }
                }, function (err) {
                    alert("Error in processing sever error 500! Try Again.");
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
                      $log.error('Some Error in Getting Records.', errorPl);
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
                        $log.error('Some Error in Getting Records.', errorPl);
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
                          $log.error('Some Error in Getting Records.', errorPl);
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
                        $log.error('Some Error in Getting Records.', errorPl);
                    });
      };



        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();