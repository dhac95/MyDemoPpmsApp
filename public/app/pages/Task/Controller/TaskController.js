
(function () {
    'use strict';

    angular
        .module('ERP.pages.Task')
        .controller('TaskController', TaskController)
        .controller('TaskModelController', TaskModelController);


    TaskController.$inject = ['$scope', '$rootScope', '$http', 'TaskService', '$uibModal', 'NgTableParams', 'AddTaskService'];
    function TaskController($scope, $rootScope, $http, TaskService, $uibModal, NgTableParams , AddTaskService) {

        $rootScope.title = "Task";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.temp_team = {};
        $scope.team = {};
        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeTask = removeTask;
        $scope.getTeamList = getTeamList;
    
        //loadGrid();

        $scope.addTaskModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Task/views/TaskModel.html',
                controller: 'TaskModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.loadGrid();
            }, function () {
            });
        };

        $scope.editTaskModel = function (Task) {
            $scope.items.isEditing = true;
            $scope.items.Task = Task;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Task/views/TaskModel.html',
                controller: 'TaskModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.loadGrid();
            }, function () {
            });
        };

        getTeamList();
        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
            promiseGet.then(function (pl) {
                 $scope.TeamList = pl.data; 
                if(pl.data.length > 1) {
                   if ($scope.isEditing) { 
                                   for (var team in $scope.TeamList) {
                                    if ($scope.TeamList[team].team_id == $scope.Task.team_id) {
                                       $scope.team.selected = $scope.TeamList[team];
                                 }
                            }
                         }
                        }
                else {
                    $scope.temp_team = $scope.TeamList[0].team_id;
                }
                    
                $scope.loadGrid();
            },
                  function (errorPl) {
                    alert('Some Error in Getting Records.', errorPl);
                  });
        }

        $scope.loadGrid = function() {
            if($rootScope.team_count > 1) {
                var id = $scope.team.selected;
            }
            else {
                  var id =  $scope.temp_team;
            }
            var self = this;
            TaskService.getAllTaskbyID($scope, $rootScope, $http , id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        };

        function removeTask(Task) {
            if (Task.deletion === 1) {
               var id = Task.task_id;
            if (window.confirm("Do you really want to delte this Task")) {
                TaskService.deleteTask($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.code === 200) {
                        alert("Deleted Successful");
                        $scope.loadGrid();
                    } else {
                        alert("Error Occurred");
                        // loadGrid();
                    }
                }, function (err) {
                    alert("Error while processing! Try Again.");
                });
            }
            } else {
                alert("Active Status Can't be Delete");
            }
        }
    }

    TaskModelController.$inject = ['$scope', '$rootScope', '$http','$filter' ,'items', '$uibModalInstance', 'TaskService' ,'AddTaskService','NgTableParams' ];
    function TaskModelController($scope, $rootScope, $http,$filter ,items, $uibModalInstance, TaskService , AddTaskService, NgTableParams) {
        $scope.items = items;
        if (items.isEditing)
            $scope.Task = angular.copy(items.Task);
        else
            $scope.Task = null;

        $scope.saveTask = function (Task) {
            if (items.isEditing) {
                var id = Task.task_id;
                if($rootScope.team_count > 1) {
                    $scope.Task.team_id = $scope.team.selected;
                }
                else {
                    $scope.Task.team_id =  $scope.temp_team;
                } 
                $scope.Task.last_modified_by = $rootScope.user_id;
               
                $scope.Task.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                if($scope.Task.status == true)
                {
                    $scope.Task.status = 1;
                }
                else {
                    $scope.Task.status = 0;
                }

                if($scope.Task.deletion == true)
                {
                    $scope.Task.deletion = 0;
                }
                else {
                    $scope.Task.deletion = 1;
                }

                if($scope.Task.about_cf == true)
                {
                    $scope.Task.about_cf = 1;
                }
                else {
                    $scope.Task.about_cf = 0;
                }

                $scope.Task.modified_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                TaskService.updateTask($scope, $rootScope, $http, $scope.Task,id).then(function (res) {
                    if (res.data.code === 200) {
                        alert("Update Successful");
                        $uibModalInstance.close();
                    } else {
                        alert("Error while updating! Try Again.");
                    }
                }, function (err) {
                    alert("Error while processing! Try Again.");
                });
            } else {
                // $scope.Task.last_entry_on = $rootScope.date;
                if($rootScope.team_count > 1) {
                    $scope.Task.team_id = $scope.team.selected;
                }
                else {
                    $scope.Task.team_id =  $scope.temp_team;
                } 
                $scope.Task.last_modified_by = $rootScope.user_id;
                $scope.Task.added_by = $rootScope.user_id;
               
                $scope.Task.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                if($scope.Task.status == true)
                {
                    $scope.Task.status = 1;
                }
                else {
                    $scope.Task.status = 0;
                }
                

                if($scope.Task.deletion == true)
                {
                    $scope.Task.deletion = 0;
                }
                else {
                    $scope.Task.deletion = 1;
                }

                if($scope.Task.about_cf == true)
                {
                    $scope.Task.about_cf = 1;
                }
                else {
                    $scope.Task.about_cf = 0;
                }
                $scope.Task.create_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                TaskService.addTask($scope, $rootScope, $http, $scope.Task).then(function (res) {
                    if (res.data.code === 200) {
                        alert("Added Successful");
                        $uibModalInstance.close();
                    } else {
                        alert("Error while saving! Try Again.");
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
                if(pl.data.length > 1) {
                   if ($scope.isEditing) { 
                                   for (var team in $scope.TeamList) {
                                    if ($scope.TeamList[team].team_id == $scope.Task.team_id) {
                                       $scope.team.selected = $scope.TeamList[team];
                                 }
                            }
                         }
                        }
                else {
                    $scope.temp_team = $scope.TeamList[0].team_id;
                }
                    
                $scope.loadGrid();
            },
                  function (errorPl) {
                    alert('Some Error in Getting Records.', errorPl);
                  });
        }

        $scope.loadGrid = function() {
            if($rootScope.team_count > 1) {
                var id = $scope.team.selected;
            }
            else {
                  var id =  $scope.temp_team;
            }
            var self = this;
            TaskService.getAllTaskbyID($scope, $rootScope, $http , id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();