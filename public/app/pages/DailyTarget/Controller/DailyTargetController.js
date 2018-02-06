
(function () {
    'use strict';

    angular
        .module('ERP.pages.DailyTarget')
        .controller('DailyTargetController', DailyTargetController)
        .controller('DailyTargetModelController', DailyTargetModelController);


    DailyTargetController.$inject = ['$scope', '$rootScope', '$http', '$filter' ,'DailyTargetService', '$uibModal', 'NgTableParams', 'AddTaskService', 'Notification'];
    function DailyTargetController($scope, $rootScope, $http, $filter ,  DailyTargetService, $uibModal, NgTableParams, AddTaskService, Notification) {

        $rootScope.title = "DailyTarget";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.temp_team = {};
        $scope.team = {};
        $scope.month = {};
        $scope.years = [];
        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;
        //$scope.date.selected = $filter('date')(new Date(), "MMMM YYYY");

        $scope.removeDailyTarget = removeDailyTarget;
        $scope.getTeamList = getTeamList;

        $scope.months = [{"name" : "January" }, { "name" : "February" }, { "name" : "March" }, { "name" : "April" }, { "name" : "May" }, { "name" : "June" }, { "name" : "July" }, { "name" : "August" }, { "name" : "September" }, { "name" : "October" }, { "name" : "November" }, { "name" : "December" }];
       
        getYearList();
        function getYearList() {
        for(var i = 2014 ; i < 2030 ; i++) {
            $scope.years.push(i);
                }
                var tempMonth = $filter('date')(new Date(), "MMMM");
                var tempyear = $filter('date')(new Date(), "y");
                for (var mon in $scope.months) {
                    if ($scope.months[mon].name == tempMonth) {
                    $scope.myMonth = $scope.months[mon];
                }
            }
               for (var yea in $scope.years) {
                   if ($scope.years[yea] == tempyear) {
                        $scope.myYear = $scope.years[yea];
                   }
               }
               
            }

            var tempDate = new Date();
           
            // $scope.month = $filter('date')(new Date(), "MMMM");
            // $scope.year = $filter('date')(new Date(), "y");

        $scope.addDailyTargetModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/DailyTarget/views/DailyTargetModel.html',
                controller: 'DailyTargetModelController',
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

        $scope.editDailyTargetModel = function (DailyTarget) {
            $scope.items.isEditing = true;
            $scope.items.DailyTarget = DailyTarget;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/DailyTarget/views/DailyTargetModel.html',
                controller: 'DailyTargetModelController',
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
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                $scope.TeamList = pl.data;
                if (pl.data.length > 1) {
                    if ($scope.isEditing) {
                        for (var team in $scope.TeamList) {
                            if ($scope.TeamList[team].team_id == $scope.DailyTarget.team_id) {
                                $scope.team.selected = $scope.TeamList[team];
                                $scope.loadGrid();
                            }
                            
                        }
                    }
                    else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                        $scope.loadGrid();
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


        $scope.loadGrid = function () {
            if ($rootScope.team_count > 1) {
                // if ($scope.DailyTarget == undefined) {
                //     $scope.DailyTarget.month = $filter('date')(new Date(), "MMMM y");
                // } else {
                //     var tempDate = $scope.DailyTarget.month;
                // }
                var obj = {
                    team_id : $scope.team.selected , 
                    month: $scope.myMonth.name + " " + $scope.myYear,
                };
            }
            else {
                // if ($scope.DailyTarget == undefined) {
                //     $scope.DailyTarget.month = $filter('date')(new Date(), "MMMM y");
                // } else {
                //     var tempDate = $scope.DailyTarget.month;
                // }
                $scope.temp_team = $scope.TeamList[0].team_id;
                
                var obj = {
                    team_id: $scope.temp_team,
                   month: $scope.myMonth.name + " " + $scope.myYear,
                };
            }
            var self = this;
            DailyTargetService.getAllDailyTargetbyID($scope, $rootScope, $http, obj).then(function (responce) {
                $scope.resultList = responce.data;
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        };

        function removeDailyTarget(DailyTarget) {
           // if (DailyTarget.deletion === 1) {
                var obj ={ 
                         s_no : DailyTarget.s_no
                     }
                if (window.confirm("Do you really want to delte this DailyTarget")) {
                    DailyTargetService.deleteDailyTarget($scope, $rootScope, $http, obj).then(function (res) {
                        if (res.data.code === 200) {
                            Notification.success("Deleted Successful");
                            $scope.loadGrid();
                        } else {
                            Notification.error("Error Occurred");
                            
                        }
                    }, function (err) {
                        Notification("Error while processing! Try Again.");
                    });
                }
            // } 
            // else {
            //     Notification({ message: "Active Status Can't be removed", title: "The selected Sub Task has status of active" }, 'warning');
            // }
        }
    }

    DailyTargetModelController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'items', '$uibModalInstance', 'DailyTargetService', 'AddTaskService', 'NgTableParams', 'Notification'];
    function DailyTargetModelController($scope, $rootScope, $http, $filter, items, $uibModalInstance, DailyTargetService, AddTaskService, NgTableParams, Notification) {
        $scope.items = items;
        if (items.isEditing)
            $scope.DailyTarget = angular.copy(items.DailyTarget);
        else
            $scope.DailyTarget = null;

        $scope.saveDailyTarget = function (DailyTarget) {
            if (items.isEditing) {

                var id = DailyTarget.sub_task_id;

                $scope.DailyTarget.task_id = $scope.task.selected;

                if ($rootScope.team_count > 1) {
                    $scope.DailyTarget.team_id = $scope.team.selected;
                }
                else {
                    $scope.DailyTarget.team_id = $scope.temp_team;
                }
                $scope.DailyTarget.last_modified_by = $rootScope.user_id;

                $scope.DailyTarget.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                if ($scope.DailyTarget.task_status == true) {
                    $scope.DailyTarget.task_status = 1;
                }
                else {
                    $scope.DailyTarget.task_status = 0;
                }

                if ($scope.DailyTarget.op_type == true) {
                    $scope.DailyTarget.op_type = 1;
                }
                else {
                    $scope.DailyTarget.op_type = 0;
                }


                if ($scope.DailyTarget.deletion == undefined || $scope.DailyTarget.deletion == 1) {
                    $scope.DailyTarget.deletion = 1;
                }
                else {
                    $scope.DailyTarget.deletion = 0;
                }

                if ($scope.DailyTarget.about_cf == '') {
                    $scope.DailyTarget.about_cf = null;
                }
                else {
                    $scope.DailyTarget.about_cf = $scope.DailyTarget.about_cf;
                }

                // if($scope.DailyTarget.about_cf == true)
                // {
                //     $scope.DailyTarget.about_cf = 1;
                // }
                // else {
                //     $scope.DailyTarget.about_cf = 0;
                // }

                // $scope.DailyTarget.modified_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                DailyTargetService.updateDailyTarget($scope, $rootScope, $http, $scope.DailyTarget, id).then(function (res) {
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
                $scope.DailyTarget.task_id = $scope.task.selected;
                // $scope.DailyTarget.last_entry_on = $rootScope.date;
                if ($rootScope.team_count > 1) {
                    $scope.DailyTarget.team_id = $scope.team.selected;
                }
                else {
                    $scope.DailyTarget.team_id = $scope.temp_team;
                }
                $scope.DailyTarget.last_modified_by = $rootScope.user_id;
                //  $scope.DailyTarget.added_by = $rootScope.user_id;

                $scope.DailyTarget.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                if ($scope.DailyTarget.task_status == true) {
                    $scope.DailyTarget.task_status = 1;
                }
                else {
                    $scope.DailyTarget.task_status = 0;
                }


                if ($scope.DailyTarget.deletion == undefined || $scope.DailyTarget.deletion == 1) {
                    $scope.DailyTarget.deletion = 1;
                }
                else {
                    $scope.DailyTarget.deletion = 0;
                }

                // if($scope.DailyTarget.about_cf == true)
                // {
                //     $scope.DailyTarget.about_cf = 1;
                // }
                // else {
                //     $scope.DailyTarget.about_cf = 0;
                // }
                $scope.DailyTarget.create_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                $scope.DailyTarget.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                DailyTargetService.addDailyTarget($scope, $rootScope, $http, $scope.DailyTarget).then(function (res) {
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
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                $scope.TeamList = pl.data;
                if (pl.data.length > 1) {
                    if ($scope.isEditing) {
                        for (var team in $scope.TeamList) {
                            if ($scope.TeamList[team].team_id == $scope.DailyTarget.team_id) {
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

        $scope.selectTask = function () {
            //var team_id = $scope.team.selected;
            if ($rootScope.team_count > 1) {
                var id = $scope.team.selected;
            }
            else {
                var id = $scope.temp_team;
            }

            var promiseGet = AddTaskService.getLoadedTasks($scope, $rootScope, $http, id);
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


        $scope.loadGrid = function () {
            if ($rootScope.team_count > 1) {
                var id = $scope.team.selected;
            }
            else {
                var id = $scope.temp_team;
            }
            var self = this;
            DailyTargetService.getAllDailyTargetbyID($scope, $rootScope, $http, id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();