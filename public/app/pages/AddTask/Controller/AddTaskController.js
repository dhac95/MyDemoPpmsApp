
(function () {
    'use strict';

    angular
        .module('ERP.pages.AddTask')
        .controller('AddTaskController', AddTaskController)
        .controller('AddTaskModelController', AddTaskModelController);


    AddTaskController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'AddTaskService', '$uibModal', 'Notification', 'NgTableParams'];
    function AddTaskController($scope, $rootScope, $http, $filter, AddTaskService, $uibModal, Notification , NgTableParams) {

        $rootScope.title = "AddTask";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.getTotalTime = getTotalTime;
        $scope.getTotalCount = getTotalCount;
        $scope.itemsByPage = 15;

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeAddTask = removeAddTask;
        $scope.saveAddTask = saveAddTask;
       // $scope.getTaskbyDate = getTaskbyDate;
       

        $scope.team = {};
        $scope.build = {};
        $scope.task = {};
        $scope.subtask = {};
        $scope.date = {};
        $scope.getTeamList = getTeamList;
        $scope.getRemaingDate = getRemaingDate;
      
      //  loadGrid();

        $scope.addAddTaskModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/AddTask/views/AddTaskModel.html',
                controller: 'AddTaskModelController',
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


        $scope.editAddTaskModel = function (AddTask) {
            $scope.items.isEditing = true;
            $scope.items.AddTask = AddTask;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/AddTask/views/AddTaskModel.html',
                controller: 'AddTaskModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.getTaskbyDate();
                getTotalTime();
            }, function () {
            });
        };

        
        function saveAddTask(AddTask) {
            $scope.AddTask.user_id = $rootScope.user_id;
                AddTask.team_id = $scope.team.selected;
                AddTask.tasks_id = $scope.task.selected;
                AddTask.sub_task_id = $scope.subtask.selected;
                AddTask.build = $scope.build.selected;
                AddTask.date = $scope.date.selected;
                var now = new Date();
            var formatDate = $filter('date')(AddTask.date , 'yyyy-MM-dd' );
            var today = $filter('date')(now, 'yyyy-MM-dd');

            if (formatDate > today) {
                Notification({ message: 'That can\'t be allowed! wait for that day ' }, 'warning');
            }
            else {
                AddTaskService.addAddTask($scope, $rootScope, $http, $scope.AddTask).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Task Added");
                        $scope.getTaskbyDate();
                        getTotalTime();
                    } else if(res.data.results){
                        Notification({ message: "Time total must be total of 8 hours", title: "Error! Check entered time" }, 'error');
                    }
                    else {
                        Notification({message :"Error occoured !! Please try again"} , 'error');
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
            }


            getRemaingDate();
            function getRemaingDate(){
                var obj = {
                    user_id: $rootScope.user_id
                };
                var promiseGet = AddTaskService.getRemaingDate($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                  
                    if(pl.data.length > 0) {
                        $rootScope.prop = true;
                        Notification("You have pending dates! Complete the pending dates");
                        $scope.DateList = $filter('orderBy')(pl.data); 
                    var formatmyDate = $scope.DateList[0];
                    $scope.date.selected = new Date(formatmyDate);
                    // for (var i in $scope.DateList) {
                    //     if ($scope.DateList[i] == $scope.AddTask.date) {
                    //         $scope.date.selected = $scope.DateList[i];
                    //     }
                    //     else {
                    //         $scope.date.selected = $scope.DateList[0];
                    //     }
                    // }
                    $scope.getTaskbyDate();
                        getTotalTime();
                    }
                    else {
                        $rootScope.prop = false;
                        $scope.date.selected = new Date();
                        $scope.getTaskbyDate();
                        getTotalTime();
                    }
                },
                    function (errorPl) {
                        Notification({ message: 'Some Error in Getting Records.' }, 'error');
                    });
            }

          //  getTaskbyDate();
           
        $scope.getTaskbyDate = function() {
                 var myDate = $scope.date.selected;
                 var formatDate = $filter('date')(myDate, "yyyy-MM-dd");
                 var obj = {
                        date : formatDate,
                        user_id : $rootScope.user_id
                           };
                
                  var creDate = $filter('date')($rootScope.create_date, "yyyy-MM-dd");
                  if(creDate > formatDate) {
                      Notification({ message: "You are now redirected to Today\'s Date", title: "That action is restricted" }, 'Warning');
                      getRemaingDate();
                      
                  }

                    else {
                var promiseGet = AddTaskService.getAddedTask($scope, $rootScope, $http ,obj );
                promiseGet.then(function (pl) {
                     $scope.Addedtasklist = pl.data; 
                       if ($scope.isEditing) {
                        for (var i in $scope.Addedtasklist) {
                        if ($scope.Addedtasklist[i].date == $scope.AddTask.date) {
                            $scope.date.selected = $scope.Addedtasklist[i];
                        }
                    }
                 }
                },
                      function (errorPl) {
                          Notification({message :'Some Error in Getting Records.'}, 'error');
                    });
                }
            };



            getTeamList();

            function getTeamList() {
                var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
                promiseGet.then(function (pl) {
                     $scope.TeamList = pl.data; 
                       if ($scope.isEditing) {
                                       for (var team in $scope.TeamList) {
                                        if ($scope.TeamList[team].team_id == $scope.AddTask.team_id) {
                                           $scope.team.selected = $scope.TeamList[team];
                                          }
                    }
                 }
                    $scope.selectTask();
                    $scope.selectBuild();
                },
                      function (errorPl) {
                          Notification({message :'Some Error in Getting Records.'}, 'error');
                      });
            }
    
            $scope.selectBuild = function() {
                //  $scope.task.selected = {};
                  var team_id = $scope.team.selected;
                  var promiseGet = AddTaskService.getLoadedBuilds($scope, $rootScope, $http ,team_id );
                  promiseGet.then(function (pl) {
                       $scope.BuildList = pl.data;
                     if ($scope.isEditing) { 
                       for (var build in $scope.BuildList) {
                          if ($scope.BuildList[build].build_no == $scope.AddTask.build) {
                              $scope.build.selected = $scope.BuildList[build];
                          }
                      }
                     }
                  },
                        function (errorPl) {
                            Notification({message : 'Some Error in Getting Records.'}, 'error');
                        });
          };
    
    
    
            $scope.selectTask = function() {
                  //  $scope.task.selected = {};
                    var team_id = $scope.team.selected;
                    var promiseGet = AddTaskService.getLoadedTasks($scope, $rootScope, $http ,team_id );
                    promiseGet.then(function (pl) {
                         $scope.TaskList = pl.data; 
                 if ($scope.isEditing) {
                         for (var task in $scope.TaskList) {
                            if ($scope.TaskList[task].task_id == $scope.AddTask.tasks_id) {
                                $scope.task.selected = $scope.TaskList[task];
                            }
                        }
                     }
                        $scope.selectsubTask();
                    },
                          function (errorPl) {
                              Notification({message :'Some Error in Getting Records.'}, 'errorl');
                         });
                 };
    
            $scope.selectsubTask = function() {
                //  $scope.task.selected = {};
                  var task_id = $scope.task.selected;
                  var promiseGet = AddTaskService.getLoadedsubTasks($scope, $rootScope, $http ,task_id );
                  promiseGet.then(function (pl) {
                       $scope.subTaskList = pl.data; 
                    if ($scope.isEditing) {
                       for (var subtask in $scope.subTaskList) {
                          if ($scope.subTaskList[subtask].sub_task_id == $scope.AddTask.sub_task_id) {
                              $scope.subtask.selected = $scope.subTaskList[subtask];
                              
                          }
                          
                      }
                 
                }
               
                  },
                        function (errorPl) {
                            Notification({message :'Some Error in Getting Records.'}, 'error');
                        });
          };

          function getTotalCount() {
            var totCount = 0;
            for (var i in $scope.Addedtasklist) {
                totCount += $scope.Addedtasklist[i].count;
            }

            // $scope.AddTask.TotalTime = grandTot;
            return totCount;
        }


        getTotalTime();
        function getTotalTime() {
            var Date = $scope.date.selected;
            var formatDate =  $filter('date')(Date, "yyyy-MM-dd");
            var obj = {
                    date : formatDate,
                    user_id : $rootScope.user_id
            };
            var promiseGet = AddTaskService.getRemaingTime($scope, $rootScope, $http ,obj );
            promiseGet.then(function (pl) {
                 $scope.remTime = pl.data; 
                //var grandTot = $scope.remTime.time;
                // $scope.AddTask.TotalTime = grandTot;
                // return grandTot;
            },
                  function (errorPl) {
                      Notification({message :'Some Error in Getting Records.'}, 'error');
                });
        }

        function removeAddTask(AddTask) {
            //if (AddTask.Active === 0) {
               var id = AddTask.task_id;
            //    id :  AddTask.AddTask_id
            // //     //Active: AddTask.Active,
            // //     //ActionBy: $rootScope.loggedUserId
           //   };
            if (window.confirm("Do you really want to delte this AddTask")) {
                AddTaskService.deleteAddTask($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification("Removed successfully");
                        $scope.getTaskbyDate();
                        getTotalTime();
                    } else {
                        Notification({message : "Try Again"} , 'error');
                        
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            }
            //} else {
            //    alert("Active Status Can't be Delete")
            //}
        }
    }

       


    AddTaskModelController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'items', '$uibModalInstance','Notification' ,'AddTaskService'];
    function AddTaskModelController($scope, $rootScope, $http, $filter, items, $uibModalInstance, Notification ,AddTaskService) {
        var time = items.AddTask.time.substring(0,5); 
       var formatDate =  $filter('date')(items.AddTask.date, "yyyy-MM-dd");
        // items.push({ "time" : time } );
        items.AddTask.time = time;
        items.AddTask.date = formatDate;

        $scope.items = items;
     
        if (items.isEditing)
            $scope.AddTask = angular.copy(items.AddTask);
        else
            $scope.AddTask = null;

        $scope.saveAddTask = function (AddTask) {
            if (items.isEditing) {
                //$scope.AddTask.ModifiedBy = "1";
                var id = AddTask.task_id;
                $scope.AddTask.user_id = $rootScope.user_id;
                AddTask.team_id = $scope.team.selected;
                AddTask.tasks_id = $scope.task.selected;
                AddTask.sub_task_id = $scope.subtask.selected;
                AddTask.build = $scope.build.selected;
                //AddTask.date = $scope.date.selected;
               // $scope.AddTask.create_date = $rootScope.date;
                AddTaskService.updateAddTask($scope, $rootScope, $http, $scope.AddTask,id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Task Updated");
                        $uibModalInstance.close();
                    } else if(res.data.results){
                        Notification({ message: "Time must be total of 8 hours", title: "Error! Check entered time" }, 'error');
                    }
                    else {
                        Notification({message : "Error occoured !! Please try again"} , 'error');
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            } else {
                $scope.AddTask.user_id = $rootScope.user_id;
                AddTask.team_id = $scope.team.selected;
                AddTask.tasks_id = $scope.task.selected;
                AddTask.sub_task_id = $scope.subtask.selected;
                AddTask.build = $scope.build.selected;
                
                // $scope.AddTask.team_id = 19;
                // $scope.AddTask.last_entry_on = $rootScope.date;
                // $scope.AddTask.create_date = $rootScope.date;
                // $scope.AddTask.maintain_date = $rootScope.date;
                //$scope.AddTask.CreatedBy = "1";
               // $scope.AddTask.ModifiedBy = "1";
                AddTaskService.addAddTask($scope, $rootScope, $http, $scope.AddTask).then(function (res) {
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
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
            promiseGet.then(function (pl) {
                 $scope.TeamList = pl.data; 
                   if ($scope.isEditing) {
                 for (var team in $scope.TeamList) {
                    if ($scope.TeamList[team].team_id == $scope.AddTask.team_id) {
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
              var promiseGet = AddTaskService.getLoadedBuilds($scope, $rootScope, $http ,team_id );
              promiseGet.then(function (pl) {
                   $scope.BuildList = pl.data;
                 if ($scope.isEditing) { 
                   for (var build in $scope.BuildList) {
                      if ($scope.BuildList[build].build_no == $scope.AddTask.build) {
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
                var promiseGet = AddTaskService.getLoadedTasks($scope, $rootScope, $http ,team_id );
                promiseGet.then(function (pl) {
                     $scope.TaskList = pl.data; 
             if ($scope.isEditing) {
                     for (var task in $scope.TaskList) {
                        if ($scope.TaskList[task].task_id == $scope.AddTask.tasks_id) {
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
              var promiseGet = AddTaskService.getLoadedsubTasks($scope, $rootScope, $http ,task_id );
              promiseGet.then(function (pl) {
                   $scope.subTaskList = pl.data; 
                if ($scope.isEditing) {
                   for (var subtask in $scope.subTaskList) {
                      if ($scope.subTaskList[subtask].sub_task_id == $scope.AddTask.sub_task_id) {
                          $scope.subtask.selected = $scope.subTaskList[subtask];
                      }
                  }
             }
              },
                    function (errorPl) {
                        $log.error('Some Error in Getting Records.', errorPl);
                    });
      };

      getTotalTime();
        function getTotalTime() {
            var Date = $scope.AddTask.date;
            var formatDate =  $filter('date')(Date, "yyyy-MM-dd");
            var obj = {
                    date : formatDate,
                    user_id : $rootScope.user_id
            };
            var promiseGet = AddTaskService.getRemaingTime($scope, $rootScope, $http ,obj );
            promiseGet.then(function (pl) {
                 $scope.remTime = pl.data; 
                //var grandTot = $scope.remTime.time;
                // $scope.AddTask.TotalTime = grandTot;
                // return grandTot;
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.', errorPl);
                });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();