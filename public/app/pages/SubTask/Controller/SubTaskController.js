
(function () {
    'use strict';

    angular
        .module('ERP.pages.SubTask')
        .controller('SubTaskController', SubTaskController)
        .controller('SubTaskModelController', SubTaskModelController);


    SubTaskController.$inject = ['$scope', '$rootScope', '$http', 'SubTaskService', '$uibModal', 'NgTableParams', 'AddTaskService', 'Notification'];
    function SubTaskController($scope, $rootScope, $http, SubTaskService, $uibModal, NgTableParams, AddTaskService, Notification) {

        $rootScope.title = "SubTask";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.temp_team = {};
        $scope.team = {};
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
            }, function () {
            });
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
                                    if ($scope.TeamList[team].team_id == $scope.SubTask.team_id) {
                                       $scope.team.selected = $scope.TeamList[team];
                                        $scope.loadGrid();
                                 }
                            }
                         }
                        }
                else {
                    $scope.temp_team = $scope.TeamList[0].team_id;
                    $scope.loadGrid();
                }
               
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.');
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
            SubTaskService.getAllSubTaskbyID($scope, $rootScope, $http , id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        };

        function removeSubTask(SubTask) {
            if (SubTask.deletion === 1) {
               var id = SubTask.SubTask_id;
            if (window.confirm("Do you really want to delte this SubTask")) {
                SubTaskService.deleteSubTask($scope, $rootScope, $http, id).then(function (res) {
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
                Notification({ message: "Active Status Can't be removed", title: "The selected Sub Task has status of active" }, 'warning');
            }
        }
    }

    SubTaskModelController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'items', '$uibModalInstance', 'SubTaskService', 'AddTaskService', 'NgTableParams','Notification' ];
    function SubTaskModelController($scope, $rootScope, $http, $filter, items, $uibModalInstance, SubTaskService, AddTaskService, NgTableParams, Notification) {
        $scope.items = items;
        if (items.isEditing)
            $scope.SubTask = angular.copy(items.SubTask);
        else
            $scope.SubTask = null;

        $scope.saveSubTask = function (SubTask) {
            if (items.isEditing) {
                
                var id = SubTask.sub_task_id;

                $scope.SubTask.task_id = $scope.task.selected;
                
                if($rootScope.team_count > 1) {
                    $scope.SubTask.team_id = $scope.team.selected;
                }
                else {
                    $scope.SubTask.team_id =  $scope.temp_team;
                } 
                $scope.SubTask.last_modified_by = $rootScope.user_id;
               
                $scope.SubTask.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                if ($scope.SubTask.task_status == true)
                {
                    $scope.SubTask.task_status = 1;
                }
                else {
                    $scope.SubTask.task_status = 0;
                }

                if ($scope.SubTask.op_type == true) {
                    $scope.SubTask.op_type = 1;
                }
                else {
                    $scope.SubTask.op_type = 0;
                }


                if ($scope.SubTask.deletion == undefined || $scope.SubTask.deletion == 1 )
                {
                    $scope.SubTask.deletion = 1;
                }
                else {
                    $scope.SubTask.deletion = 0;
                }

                if ($scope.SubTask.about_cf == '') {
                    $scope.SubTask.about_cf = null;
                }
                else {
                    $scope.SubTask.about_cf = $scope.SubTask.about_cf;
                }

                // if($scope.SubTask.about_cf == true)
                // {
                //     $scope.SubTask.about_cf = 1;
                // }
                // else {
                //     $scope.SubTask.about_cf = 0;
                // }

                // $scope.SubTask.modified_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                SubTaskService.updateSubTask($scope, $rootScope, $http, $scope.SubTask,id).then(function (res) {
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
                if($rootScope.team_count > 1) {
                    $scope.SubTask.team_id = $scope.team.selected;
                }
                else {
                    $scope.SubTask.team_id =  $scope.temp_team;
                } 
                $scope.SubTask.last_modified_by = $rootScope.user_id;
              //  $scope.SubTask.added_by = $rootScope.user_id;
               
                $scope.SubTask.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                if ($scope.SubTask.task_status == true)
                {
                    $scope.SubTask.task_status = 1;
                }
                else {
                    $scope.SubTask.task_status = 0;
                }
                

                if ($scope.SubTask.deletion == undefined || $scope.SubTask.deletion == 1) {
                    $scope.SubTask.deletion = 1;
                }
                else {
                    $scope.SubTask.deletion = 0;
                }

                // if($scope.SubTask.about_cf == true)
                // {
                //     $scope.SubTask.about_cf = 1;
                // }
                // else {
                //     $scope.SubTask.about_cf = 0;
                // }
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

        getTeamList();
        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
            promiseGet.then(function (pl) {
                 $scope.TeamList = pl.data; 
                if(pl.data.length > 1) {
                   if ($scope.isEditing) { 
                                   for (var team in $scope.TeamList) {
                                    if ($scope.TeamList[team].team_id == $scope.SubTask.team_id) {
                                       $scope.team.selected = $scope.TeamList[team];
                                 }
                            }
                         }
                        }
                else {
                    $scope.temp_team = $scope.TeamList[0].team_id;
                }
                $scope.selectTask();
                $scope.loadGrid();
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.');
                  });
        }

        $scope.selectTask = function() {
            //var team_id = $scope.team.selected;
            if($rootScope.team_count > 1) {
              var id = $scope.team.selected;
          }
          else {
                var id =  $scope.temp_team;
          }

            var promiseGet = AddTaskService.getLoadedTasks($scope, $rootScope, $http ,id );
            promiseGet.then(function (pl) {
                 $scope.TaskList = pl.data; 
         if ($scope.isEditing) {
                 for (var task in $scope.TaskList) {
                    if ($scope.TaskList[task].task_id == $scope.AddTask.tasks_id) {
                        $scope.task.selected = $scope.TaskList[task];
                    }
                }
             }
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.');
                 });
         };


        $scope.loadGrid = function() {
            if($rootScope.team_count > 1) {
                var id = $scope.team.selected;
            }
            else {
                var id =  $scope.temp_team;
            }
            var self = this;
            SubTaskService.getAllSubTaskbyID($scope, $rootScope, $http , id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();