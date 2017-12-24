(function(){
    'use strict';

    angular
        .module('ERP.pages.AddTask')
        .controller('NewTaskController', NewTaskController);

        NewTaskController.$inject = ['$location', '$scope', '$rootScope', '$http', '$filter', 'AddTaskService', '$uibModal'];
        function NewTaskController($location, $scope, $rootScope, $http, $filter, AddTaskService, $uibModal) {
            $rootScope.isLoginPage = false;
            $scope.noOfRows = "10";
            $scope.team = {};
            $scope.build = {};
            $scope.task = {};
            $scope.subTask = {};
            $scope.loading = true;
          $scope.isLoading = true;
          $scope.isEditing = false;

          $scope.removeAddTask = removeAddTask;

          loadGrid();
          loadTeams();

        }


        function loadStates() {
            var id = $rootScope.user_id;
            AddTaskService.getLoadedTeam($scope, $rootScope, $http, id).then(function (res) {
                if (res.status === 200) {
                    $scope.loading = false;
                    $scope.TeamMasterList = res.data.result;
                    if ($scope.isEditing) {
                        $scope.loading = true;
                        for (var team in $scope.TeamMasterList) {
                            if ($scope.TeamMasterList[team].team_id == $scope.AddTask.team_id) {
                                $scope.loading = false;
                                $scope.team.selected = $scope.TeamMasterList[team];
                            }
                        }
                        $scope.selectTask();
                    }
                    $scope.isLoading = false;
                } else {
                    $rootScope.showToster('error', 'Load Failed! Try Again', "State Master");
                }
            }, function (err) {
                $rootScope.showToster('error', 'Error! Try Again', "State Master");
            });
        }


        $scope.selectTask = function () {
            $scope.task.selected = {};
            var team_id =  $scope.team.selected.team_id;
            AddTaskService.getLoadedTasks($scope, $rootScope, $http, team_id).then(function (res) {
                if (res.status === 200) {
                    $scope.loading = false;
                    $scope.TaskMasterList = res.data.result;
                    if ($scope.isEditing) {
                        $scope.loading = true;
                        for (var task in $scope.TaskMasterList) {
                            if ($scope.TaskMasterList[task].task_id == $scope.AddTask.task_id) {
                                $scope.loading = false;
                                $scope.task.selected = $scope.TaskMasterList[task];
                            }
                        }
                        $scope.selectsubTask();
                    }
                } else {
                    $rootScope.showToster('error', 'Load Failed! Try Again', "City Master");
                }
            }, function (err) {
                $rootScope.showToster('error', 'Error! Try Again', "City Master");
            });
        };

        $scope.selectsubTask = function () {
            $scope.task.selected = {};
            var task_id =  $scope.task.selected.task_id;
            AddTaskService.getLoadedsubTasks($scope, $rootScope, $http, task_id).then(function (res) {
                if (res.status === 200) {
                    $scope.loading = false;
                    $scope.subTaskMasterList = res.data.result;
                    if ($scope.isEditing) {
                        $scope.loading = true;
                        for (var subtask in $scope.subTaskMasterList) {
                            if ($scope.subTaskMasterList[subtask].sub_task_id == $scope.AddTask.sub_task_id) {
                                $scope.loading = false;
                                $scope.task.selected = $scope.subTaskMasterList[task];
                            }
                        }
                        $scope.selectsubTask();
                    }
                } else {
                    $rootScope.showToster('error', 'Load Failed! Try Again', "City Master");
                }
            }, function (err) {
                $rootScope.showToster('error', 'Error! Try Again', "City Master");
            });
        };

            //Edit Added Tasks
        $scope.editAddTask = function (AddTask) {
            $scope.AddTaskModel = true;
            $scope.isEditing = true;
            $scope.AddTask = angular.copy(AddTask);
          //  $scope.SaveAddTaskId = AddTask.AddTaskId;

            loadGrid();
            loadTeams();
            
        };

        //remove Added Tasks
        function removeAddTask(AddTask) {
           
                var id = AddTask.task_id;
                
                if (window.confirm("Sure you want to delete this AddTask Details")) {
                    AddTaskService.deleteAddTask($scope, $rootScope, $http, id).then(function (res) {
                        if (res.data.result) {
                            loadAddTaskGrid();
                            $rootScope.showToster('success', 'Deleted Successfully', "AddTask Details");
                        } else {
                            $rootScope.showToster('error', 'Deleted Failed! Try Again', "AddTask Details");
                        }
                    }, function (err) {
                        $rootScope.showToster('error', 'Error! Try Again', "AddTask Details");
                    });
                }
            } 
            $scope.saveAddTask = function (AddTask) {
                AddTask.Team = $scope.state.selected.team_id;
                AddTask.Task = $scope.state.selected.task_id;
                AddTask.subTask = $scope.city.selected.sub_task_id;
                if ($scope.isEditing) {
                    var id = AddTask.task_id;
                    AddTaskService.updateAddTask($scope, $rootScope, $http, AddTask,id).then(function (res) {
                        if (res.status === 200) {
                            $scope.loading = false;
                            $scope.SaveAddTaskId = res.data.result.task_id;
                            $rootScope.showToster('success', 'Updated Successfully', "AddTask Detail");
                            // $scope.AddTask.DateofBirth = new Date($scope.AddTask.DateofBirth);
                            // $scope.AddTask.DateofJoin = new Date($scope.AddTask.DateofJoin);
                        } else {
                            $rootScope.showToster('error', 'Load Failed! Try Again', "AddTask Detail");
                        }
                    }, function (err) {
                        $rootScope.showToster('error', 'Error! Try Again', "AddTask Detail");
                    });


                } else {
                    AddTask.CreatedBy = $rootScope.loggedUserId;
                    AddTaskService.saveAddTask($scope, $rootScope, $http, AddTask).then(function (res) {
                        if (res.status === 200) {
                            $scope.loading = false;
                            $scope.SaveAddTaskId = res.data.result.task_id;
                            $scope.VerifyDetailForm = true;
                            $scope.FamilydetailForm = true;
                            $rootScope.showToster('success', 'Added Successfully', "AddTask Detail");
                        } else {
                            $rootScope.showToster('error', 'Load Failed! Try Again', "AddTask Detail");
                        }
                    }, function (err) {
                        $rootScope.showToster('error', 'Error! Try Again', "AddTask Detail");
                    });
                }

            };

});


