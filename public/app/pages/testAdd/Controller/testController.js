(function () {
    'use strict';

    angular
        .module('ERP.pages.test')
        .controller('testController', testController);

        testController.$inject = ['$scope', '$rootScope', '$http','NgTableParams' ,'AddTaskService'];
        
        function testController($scope, $rootScope, $http,NgTableParams , AddTaskService) {
            $rootScope.title = "Test";
            $rootScope.isLoginPage = false;
            $scope.noOfRows = "10";
            $scope.items = {};
            $scope.AddTask = {};

            $scope.team = {};
            $scope.build = {};
            $scope.task = {};
            $scope.subtask = {};
            $scope.date = {};

            $scope.addTask = addTask;
            $scope.getTask = getTask;
            $scope.removeTask = removeTask;
          //  $scope.getGrandTotal = getGrandTotal;
         //   $scope.printDiv = printDiv;
         //   $scope.submitSales = submitSales;
            $scope.tasksList = [];

            loadGrid();
            function loadGrid() {
            
                //   var date = $scope.date.selected;
                   var self = this;
                   AddTaskService.getAddedTask($scope, $rootScope, $http, $scope.AddTask, $rootScope.user_id).then(function (responce) {
                       $scope.tableParams = new NgTableParams({}, { 
                           dataset: responce.data 
                       });
                   });
               }

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

            $scope.addTask = function (AddTask) {
                $scope.AddTask.user_id = $rootScope.user_id;
                    AddTask.team_id = $scope.team.selected;
                    AddTask.tasks_id = $scope.task.selected;
                    AddTask.sub_task_id = $scope.subtask.selected;
                    AddTask.build = $scope.build.selected;
                    
    
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
                };
    
    
    
            function removeTask(AddTask) {
                //if (AddTask.Active === 0) {
                   var id = AddTask.task_id;
                //    id :  AddTask.AddTask_id
                // //     //Active: AddTask.Active,
                // //     //ActionBy: $rootScope.loggedUserId
               //   };
                if (window.confirm("Do you really want to delte this AddTask")) {
                    AddTaskService.deleteAddTask($scope, $rootScope, $http, id).then(function (res) {
                        if (res.data.code == 200) {
                            alert("Deleted Successful");
                            loadGrid();
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
    

});