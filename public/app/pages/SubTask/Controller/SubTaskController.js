(function () {
    'use strict';

    angular
        .module('ERP.pages.SubTask')
        .controller('SubTaskController', SubTaskController)
        .controller('SubTaskModelController', SubTaskModelController)
         .factory('team', function () {
             return {
                 selected: ''
             };
         });


    SubTaskController.$inject = ['$scope', '$rootScope', '$http', 'SubTaskService', '$uibModal', 'NgTableParams', 'AddTaskService', 'Notification' , 'team'];

    function SubTaskController($scope, $rootScope, $http, SubTaskService, $uibModal, NgTableParams, AddTaskService, Notification , team) {

        $rootScope.title = "SubTask";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.temp_team = {};
        $scope.team = team;
        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeSubTask = removeSubTask;
        $scope.getTeamList = getTeamList;

        //loadGrid();

        $scope.addSubTaskModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/SubTask/views/SubTaskModel.html',
                controller: 'SubTaskModelController',
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

        $scope.editSubTaskModel = function (SubTask) {
            $scope.items.isEditing = true;

            $scope.items.SubTask = SubTask;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/SubTask/views/SubTaskModel.html',
                controller: 'SubTaskModelController',
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
        //                             if ($scope.TeamList[team].team_id == $scope.SubTask.team_id) {
        //                                $scope.team.selected = $scope.TeamList[team];
        //                                 $scope.loadGrid();
        //                          }
        //                     }
        //                  }
        //                 }
        //         else {
        //             $scope.temp_team = $scope.TeamList[0].team_id;
        //             $scope.loadGrid();
        //         }

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
                                if ($scope.TeamList[team].team_id == $scope.SubTask.team_id) {
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
            //     id = $scope.team.selected;
            // }
            // else {
            //     id =  $scope.temp_team;
            // }
            var self = this;
            SubTaskService.getAllSubTaskbyID($scope, $rootScope, $http, id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, {
                    dataset: responce.data
                });
                $scope.showLoader = false;

            });

        };

        function removeSubTask(SubTask) {
            if (SubTask.task_status == 0) {
                var obj = {
                    sub_task_id: SubTask.sub_task_id
                };
                if (window.confirm("Do you really want to delete this SubTask")) {
                    SubTaskService.deleteSubTask($scope, $rootScope, $http, obj).then(function (res) {
                        if (res.data.code === 200) {
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
                    title: "The selected Sub Task has status of active"
                }, 'warning');
            }
        }
    }

    SubTaskModelController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'items', '$uibModalInstance', 'SubTaskService', 'AddTaskService', 'NgTableParams', 'Notification' , 'team'];

    function SubTaskModelController($scope, $rootScope, $http, $filter, items, $uibModalInstance, SubTaskService, AddTaskService, NgTableParams, Notification, team) {
        $scope.team = team;
        $scope.items = items;
        if (items.isEditing)
            $scope.SubTask = angular.copy(items.SubTask);
        else
            $scope.SubTask = null;

        $scope.saveSubTask = function (SubTask) {
            if (items.isEditing) {

                var id = SubTask.sub_task_id;

                $scope.SubTask.task_id = $scope.task.selected;

                // if($rootScope.team_count > 1) {
                //     $scope.SubTask.team_id = $scope.team.selected;
                // }
                // else {
                //     $scope.SubTask.team_id =  $scope.temp_team;
                // } 

                $scope.SubTask.team_id = $scope.team.selected;

                $scope.SubTask.last_modified_by = $rootScope.user_id;

                $scope.SubTask.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                if ($scope.SubTask.task_status == true) {
                    $scope.SubTask.task_status = 1;
                } else {
                    $scope.SubTask.task_status = 0;
                }

                if ($scope.SubTask.op_type == true) {
                    $scope.SubTask.op_type = 1;
                } else {
                    $scope.SubTask.op_type = 0;
                }

                for (var i in $scope.ChartList) {
                    if ($scope.ChartList[i].id == $scope.SubTask.about_chart) {
                        $scope.SubTask.about_chart = $scope.ChartList[i].id;
                    }
                }
                for (var j in $scope.cfList) {
                    if ($scope.cfList[j].id == $scope.SubTask.about_cf) {
                        $scope.SubTask.about_cf = $scope.cfList[j].id;
                    }
                }

                SubTaskService.updateSubTask($scope, $rootScope, $http, $scope.SubTask, id).then(function (res) {
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
                $scope.SubTask.task_id = $scope.task.selected;
                // $scope.SubTask.last_entry_on = $rootScope.date;
                // if($rootScope.team_count > 1) {
                //     $scope.SubTask.team_id = $scope.team.selected;
                // }
                // else {
                //     $scope.SubTask.team_id =  $scope.temp_team;
                // } 

                $scope.SubTask.team_id = $scope.team.selected;

                $scope.SubTask.last_modified_by = $rootScope.user_id;
                //  $scope.SubTask.added_by = $rootScope.user_id;

                $scope.SubTask.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                if ($scope.SubTask.task_status == true) {
                    $scope.SubTask.task_status = 1;
                } else {
                    $scope.SubTask.task_status = 0;
                }

                if ($scope.SubTask.op_type == true) {
                    $scope.SubTask.op_type = 1;
                } else {
                    $scope.SubTask.op_type = 0;
                }

                $scope.SubTask.create_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                $scope.SubTask.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                SubTaskService.addSubTask($scope, $rootScope, $http, $scope.SubTask).then(function (res) {
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

        $scope.ChartList = [{
            "id": 0,
            "name": "No Chart"
        }, {
            "id": 1,
            "name": "Task Wise"
        }, {
            "id": 2,
            "name": "SubTask Wise"
        }];
        $scope.cfList = [{
            "id": 0,
            "name": "Auto Calculation"
        }, {
            "id": 1,
            "name": "Manual Calculations"
        }];

        getTeamList();

        function getTeamList() {
            $scope.storedTeamValue = $scope.team.selected;
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                    $scope.TeamList = pl.data;
                    if ($rootScope.team_count > 1) {
                        if (items.isEditing) {
                            for (var team in $scope.TeamList) {
                                if ($scope.TeamList[team].team_id == $scope.SubTask.team_id) {
                                    $scope.team.selected = $scope.TeamList[team].team_id;
                                }
                            }
                        } else {
                            $scope.team.selected = $scope.storedTeamValue;
                        }
                    } else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                    }
                    $scope.selectTask();
                    $scope.loadGrid();
                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }

        $scope.selectTask = function () {
            var id = $scope.team.selected;
            //     if($rootScope.team_count > 1) {
            //        id = $scope.team.selected;
            //   }
            //   else {
            //          id =  $scope.temp_team;
            //   }

            var promiseGet = SubTaskService.getTaskByHaveST($scope, $rootScope, $http, id);
            promiseGet.then(function (pl) {
                    $scope.TaskList = pl.data;
                    if ($scope.isEditing) {
                        for (var task in $scope.TaskList) {
                            if ($scope.TaskList[task].task_id == $scope.SubTask.task_id) {
                                $scope.task.selected = $scope.TaskList[task];
                            }
                        }
                    }
                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        };


        $scope.loadGrid = function () {
            var id = $scope.team.selected;
            // if($rootScope.team_count > 1) {
            //      id = $scope.team.selected;
            // }
            // else {
            //      id =  $scope.temp_team;
            // }
            var self = this;
            SubTaskService.getAllSubTaskbyID($scope, $rootScope, $http, id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, {
                    dataset: responce.data
                });

            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();