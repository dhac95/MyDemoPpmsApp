(function () {
    'use strict';

    angular
        .module('ERP.pages.Task')
        .controller('TaskController', TaskController)
        .controller('TaskModelController', TaskModelController)
         .factory('team', function () {
             return {
                 selected: ''
             };
         });


    TaskController.$inject = ['$scope', '$rootScope', '$http', 'TaskService', '$uibModal', 'NgTableParams', 'AddTaskService', 'Notification', 'team'];

    function TaskController($scope, $rootScope, $http, TaskService, $uibModal, NgTableParams, AddTaskService, Notification, team) {

        $rootScope.title = "Task";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.temp_team = {};
        $scope.team = team;
        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeTask = removeTask;
        $scope.getTeamList = getTeamList;

        //loadGrid();

        $scope.DailyTargetTypes = [{
                "id": 0,
                "Name": "Auto Target"
            },
            {
                "id": 1,
                "Name": "Manual Target"
            }
        ];

        $scope.ChartTypes = [{
                "id": 0,
                "Name": "No Chart"
            },
            {
                "id": 1,
                "Name": "Task Wise"
            },
            {
                "id": 2,
                "Name": "SubTask Wise"
            },
        ];

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
            }, function () {});
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
            }, function () {});
        };

        // getTeamList();
        // function getTeamList() {
        //     var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
        //     promiseGet.then(function (pl) {
        //          $scope.TeamList = pl.data; 
        //         if(pl.data.length > 1) {
        //            if ($scope.isEditing) { 
        //                            for (var team in $scope.TeamList) {
        //                             if ($scope.TeamList[team].team_id == $scope.Task.team_id) {
        //                                $scope.team.selected = $scope.TeamList[team];
        //                          }
        //                     }
        //                  }
        //                 } 
        //         else {
        //             $scope.temp_team = $scope.TeamList[0].team_id;
        //         }

        //         $scope.loadGrid();
        //     },
        //           function (errorPl) {
        //               Notification('Some Error in Getting Records.');
        //           });
        // }


        getTeamList();

        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                    $scope.TeamList = pl.data;
                    if (pl.data.length > 1) {
                        if ($scope.isEditing) {
                            for (var team in $scope.TeamList) {
                                if ($scope.TeamList[team].team_id == $scope.Task.team_id) {
                                    $scope.team.selected = $scope.TeamList[team].team_id;

                                }

                            }
                            $scope.loadGrid();
                        } else {
                            $scope.team.selected = $scope.TeamList[0].team_id;
                            $scope.loadGrid();
                        }
                    } else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                        $scope.loadGrid();
                    }

                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }

        $scope.loadGrid = function () {
            $scope.showLoader = true;
            var id = $scope.team.selected;
            // if($rootScope.team_count > 1) {
            //     var id = $scope.team.selected;
            // }
            // else {
            //       var id =  $scope.temp_team;
            // }
            var self = this;
            TaskService.getAllTaskbyID($scope, $rootScope, $http, id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, {
                    dataset: responce.data
                });
                $scope.showLoader = false;

            });

        };

        function removeTask(Task) {
            if (Task.status == 0) {
                var obj = {
                    task_id: Task.task_id
                };
                if (window.confirm("Do you really want to delete this Task")) {
                    TaskService.deleteTask($scope, $rootScope, $http, obj).then(function (res) {
                        if (res.data.code == 200) {
                            Notification.success("Deleted Successful");
                            $scope.loadGrid();
                        } else {
                            Notification.error("Error Occurred");
                            // loadGrid();
                        }
                    }, function (err) {
                        Notification("Error while processing! Try Again.");
                    });
                }
            } else {
                Notification({
                    message: "Active Status Can't be removed",
                    title: "The selected Task has status of active"
                }, 'warning');
            }
        }
    }

    TaskModelController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'items', '$uibModalInstance', 'TaskService', 'AddTaskService', 'NgTableParams', 'Notification', 'team'];

    function TaskModelController($scope, $rootScope, $http, $filter, items, $uibModalInstance, TaskService, AddTaskService, NgTableParams, Notification, team) {
        $scope.team = team;
        $scope.items = items;
        if (items.isEditing)
            $scope.Task = angular.copy(items.Task);
        else
            $scope.Task = null;

        $scope.saveTask = function (Task) {
            if (items.isEditing) {
                var id = Task.task_id;

                $scope.Task.team_id = $scope.team.selected;

                // if($rootScope.team_count > 1) {
                //     $scope.Task.team_id = $scope.team.selected;
                // }
                // else {
                //     $scope.Task.team_id =  $scope.temp_team;
                // } 
                $scope.Task.last_modified_by = $rootScope.user_id;

                $scope.Task.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");

                if ($scope.Task.status == true || $scope.Task.status == 1) {
                    $scope.Task.status = 1;
                } else {
                    $scope.Task.status = 0;
                }

                if ($scope.Task.device_count == true || $scope.Task.device_count == 1) {
                    $scope.Task.device_count = 1;
                } else {
                    $scope.Task.device_count = 0;
                }


                if ($scope.Task.op_type == true || $scope.Task.op_type == 1) {
                    $scope.Task.op_type = 1;
                } else {
                    $scope.Task.op_type = 0;
                }

                // if ($scope.Task.deletion == undefined || $scope.Task.deletion == 1) {
                //     $scope.Task.deletion = 1;
                // }
                // else {
                //     $scope.Task.deletion = 0;
                // }

                if ($scope.Task.have_st == "true" || $scope.Task.have_st == 1) {
                    $scope.Task.have_st = 1;
                } else {
                    $scope.Task.have_st = 0;
                }

                // if($scope.Task.about_cf == '')
                // {
                //     $scope.Task.about_cf = null;
                // }
                // else {
                //     $scope.Task.about_cf = $scope.Task.about_cf;
                // }

                $scope.Task.modified_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                TaskService.updateTask($scope, $rootScope, $http, $scope.Task, id).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Update Successful");
                        $uibModalInstance.close();
                    } else {
                        Notification.error("Error while updating! Try Again.");
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            } else {
                // $scope.Task.last_entry_on = $rootScope.date;
                $scope.Task.team_id = $scope.team.selected;

                // if($rootScope.team_count > 1) {
                //     $scope.Task.team_id = $scope.team.selected;
                // }
                // else {
                //     $scope.Task.team_id =  $scope.temp_team;
                // } 
                $scope.Task.last_modified_by = $rootScope.user_id;
                $scope.Task.added_by = $rootScope.user_id;

                $scope.Task.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                if ($scope.Task.status == true || $scope.Task.status == 1) {
                    $scope.Task.status = 1;
                } else {
                    $scope.Task.status = 0;
                }

                if ($scope.Task.device_count == true || $scope.Task.device_count == 1) {
                    $scope.Task.device_count = 1;
                } else {
                    $scope.Task.device_count = 0;
                }


                if ($scope.Task.op_type == true || $scope.Task.op_type == 1) {
                    $scope.Task.op_type = 1;
                } else {
                    $scope.Task.op_type = 0;
                }


                if ($scope.Task.have_st == "true" || $scope.Task.have_st == 1) {
                    $scope.Task.have_st = 1;
                } else {
                    $scope.Task.have_st = 0;
                }

                $scope.Task.create_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                TaskService.addTask($scope, $rootScope, $http, $scope.Task).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Added Successful");
                        $uibModalInstance.close();
                    } else {
                        Notification.error("Error while saving! Try Again.");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        };

        getTeamList();

        function getTeamList() {
            $scope.storedTeamValue = $scope.team.selected;
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                    $scope.TeamList = pl.data;
                    if (pl.data.length > 1) {
                        if (items.isEditing) {
                            for (var team in $scope.TeamList) {
                                if ($scope.TeamList[team].team_id == $scope.Task.team_id) {
                                    $scope.team.selected = $scope.TeamList[team].team_id;
                                }
                            }
                        } else {
                            $scope.team.selected = $scope.storedTeamValue;
                        }
                    } else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                    }

                    $scope.loadGrid();
                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }

        $scope.loadGrid = function () {

            var id = $scope.team.selected;

            // if($rootScope.team_count > 1) {
            //     var id = $scope.team.selected;
            // }
            // else {
            //       var id =  $scope.temp_team;
            // }
            var self = this;
            TaskService.getAllTaskbyID($scope, $rootScope, $http, id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, {
                    dataset: responce.data
                });

            });

        };

        $scope.DailyTargetTypes = [{
                "id": 0,
                "Name": "Auto Target"
            },
            {
                "id": 1,
                "Name": "Manual Target"
            }
        ];
        $scope.ChartTypes = [{
                "id": 0,
                "Name": "No Chart"
            },
            {
                "id": 1,
                "Name": "Task Wise"
            },
            {
                "id": 2,
                "Name": "SubTask Wise"
            },
        ];

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();