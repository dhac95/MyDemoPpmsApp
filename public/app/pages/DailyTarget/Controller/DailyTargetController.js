
(function () {
    'use strict';

    angular
        .module('ERP.pages.DailyTarget')
        .controller('DailyTargetController', DailyTargetController)
        .controller('DailyTargetModelController', DailyTargetModelController);


    DailyTargetController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'DailyTargetService', '$uibModal', 'NgTableParams', 'AddTaskService', 'Notification', '$timeout'];
    function DailyTargetController($scope, $rootScope, $http, $filter, DailyTargetService, $uibModal, NgTableParams, AddTaskService, Notification, $timeout) {

        $rootScope.title = "DailyTarget";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.temp_team = {};
        $scope.team = {};
        $scope.task = {};
        $scope.subtask = {};
        $scope.month = {};
        $scope.years = [];
        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;
        //$scope.date.selected = $filter('date')(new Date(), "MMMM YYYY");

        $scope.removeDailyTarget = removeDailyTarget;
        $scope.getTeamList = getTeamList;
        $scope.saveDailyTarget = saveDailyTarget;
        $scope.setAutoTarget = setAutoTarget;
        $scope.setNonTarget = setNonTarget;
        $scope.setManualTarget = setManualTarget;
        $scope.setManualTargetByPrev = setManualTargetByPrev;
        // $scope.selectTask = selectTask;

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
                                $scope.selectTask();
                            }
                            
                        }
                    }
                    else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                        $scope.loadGrid();
                        $scope.selectTask();
                    }
                }
                else {
                    $scope.temp_team = $scope.TeamList[0].team_id;
                    $scope.loadGrid();
                    $scope.selectTask();
                }

            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }



        $scope.selectTask = function () {
            //  $scope.task.selected = {};
            var team_id = $scope.team.selected;
            var promiseGet = DailyTargetService.getTaskswithManualCF($scope, $rootScope, $http, team_id);
            promiseGet.then(function (pl) {
                $scope.TaskList = pl.data;
                if ($scope.isEditing) {
                    for (var task in $scope.TaskList) {
                        if ($scope.TaskList[task].task_id == $scope.DailyTarget.task) {
                            $scope.task.selected = $scope.TaskList[task];
                            $scope.selectsubTask();
                        }
                    }
                }
                
            },
                function (errorPl) {
                    Notification({ message: 'Some Error in Getting Records.' }, 'error');
                });
        };

        $scope.selectsubTask = function () {
            //  $scope.task.selected = {};
            var task_id = $scope.task.selected;
            var promiseGet = DailyTargetService.getSubTaskswithManualCF($scope, $rootScope, $http, task_id);
            promiseGet.then(function (pl) {
                $scope.subTaskList = pl.data;
                if ($scope.isEditing) {
                    for (var subtask in $scope.subTaskList) {
                        if ($scope.subTaskList[subtask].sub_task_id == $scope.DailyTarget.sub_task) {
                            $scope.subtask.selected = $scope.subTaskList[subtask];

                        }

                    }

                }

            },
                function (errorPl) {
                    Notification({ message: 'Some Error in Getting Records.' }, 'error');
                });
        };

        function setAutoTarget(){
            var obj = {};
            if ($rootScope.team_count > 1) {
                 obj = {
                    team_id: $scope.team.selected,
                    month: $scope.myMonth.name + " " + $scope.myYear,
                    user_id : $rootScope.user_id,
                };
            }
            else {
                $scope.temp_team = $scope.TeamList[0].team_id;

                 obj = {
                    team_id: $scope.temp_team,
                    month: $scope.myMonth.name + " " + $scope.myYear,
                    user_id: $rootScope.user_id,
                };
            }
            if (window.confirm("***Note*** :  Auto Targets cannot be modified Once set! \n If you want change Auto to manual you have to first change the task or subtask before you set Auto target \n Click OK to contiune ")) {
            DailyTargetService.setAutoTarget($scope, $rootScope, $http, obj).then(function (res) {
                if (res.data.code === 200) {
                    Notification.success("Added Successful");
                    $timeout(function () {
                        $scope.loadGrid();
                    }, 50);
                }
                else if (res.data.code === 300) {
                    Notification.warning("Auto target already set for selected date and team");
                }
                 else {
                    Notification.error("Error while saving! Try Again.");
                }
            }, function (err) {
                Notification("Error in processing sever error 500! Try Again.");
            });
        }
        }

        function setManualTarget() {
            var obj = {};
            if ($rootScope.team_count > 1) {
                obj = {
                    team_id: $scope.team.selected,
                    month: $scope.myMonth.name + " " + $scope.myYear,
                    user_id: $rootScope.user_id,
                };
            }
            else {
                $scope.temp_team = $scope.TeamList[0].team_id;

                obj = {
                    team_id: $scope.temp_team,
                    month: $scope.myMonth.name + " " + $scope.myYear,
                    user_id: $rootScope.user_id,
                };
            }
            if (window.confirm("***Note*** : Use this feature only if you are unsure of how many tasks and subtasks the team have.. \nLoad this Only before adding Manual count by yourself \nClick OK to contiune ")) {
                DailyTargetService.setManualTarget($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Loaded Successful");
                        $timeout(function () {
                        $scope.loadGrid();
                        } , 250);
                        
                    }
                    else if (res.data.code === 300) {
                        Notification.warning("Manual target already Loaded for selected date and team");
                    }
                    else {
                        Notification.error("Error while saving! Try Again.");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        }

        function setManualTargetByPrev() {
            var obj = {};
            if ($rootScope.team_count > 1) {
                obj = {
                    team_id: $scope.team.selected,
                    month: $scope.myMonth.name + " " + $scope.myYear,
                    user_id: $rootScope.user_id,
                };
            }
            else {
                $scope.temp_team = $scope.TeamList[0].team_id;

                obj = {
                    team_id: $scope.temp_team,
                    month: $scope.myMonth.name + " " + $scope.myYear,
                    user_id: $rootScope.user_id,
                };
            }
            if (window.confirm("***Note*** : This will set daily target same as previous month's target \nUse this feature only if maximum number of counts are same \nClick OK to contiune ")) {
                DailyTargetService.setManualTargetByPrev($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Loaded Successful");
                        $timeout(function () {
                            $scope.loadGrid();
                        }, 250);

                    }
                    else if (res.data.code === 304) {
                        Notification.warning("No Count set for previous month! Set that first");
                    }
                    else {
                        Notification.error("Error while saving! Try Again.");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        }


        function setNonTarget() {
            var obj = {};
            if ($rootScope.team_count > 1) {
                obj = {
                    team_id: $scope.team.selected,
                    month: $scope.myMonth.name + " " + $scope.myYear,
                    user_id: $rootScope.user_id,
                };
            }
            else {
                $scope.temp_team = $scope.TeamList[0].team_id;

                obj = {
                    team_id: $scope.temp_team,
                    month: $scope.myMonth.name + " " + $scope.myYear,
                    user_id: $rootScope.user_id,
                };
            }
            if (window.confirm("***Note*** :  Non Targets cannot be modified Once set! \n If you want change  to manual you have to first change the task or subtask before you set Auto target \n Click OK to contiune ")) {
                DailyTargetService.setNonTarget($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Added Successful");
                        $timeout(function () {
                            $scope.loadGrid();
                        }, 50);
                    }
                    else if (res.data.code === 300) {
                        Notification.warning("NoN target already set for selected date and team");
                    }
                    else {
                        Notification.error("Error while saving! Try Again.");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        }

        $scope.loadGrid = function () {
            var obj = {};
            if ($rootScope.team_count > 1) {
                 obj = {
                    team_id : $scope.team.selected , 
                    month: $scope.myMonth.name + " " + $scope.myYear,
                };
            }
            else {
                $scope.temp_team = $scope.TeamList[0].team_id;
                
                 obj = {
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


        function saveDailyTarget(DailyTarget) {
            if ($rootScope.team_count > 1) {
                $scope.DailyTarget.team_id = $scope.team.selected;
            }
            else {
                $scope.DailyTarget.team_id = $scope.temp_team;
            }
             $scope.DailyTarget.month = $scope.myMonth.name + " " + $scope.myYear;
            $scope.DailyTarget.task_id = $scope.task.selected;
            $scope.DailyTarget.sub_task_id = $scope.subtask.selected;
            $scope.DailyTarget.action = $rootScope.user_id;
            $scope.DailyTarget.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
            $scope.DailyTarget.create_date = $filter('date')($rootScope.date, "yyyy-MM-dd");

            DailyTargetService.addDailyTarget($scope, $rootScope, $http, $scope.DailyTarget).then(function (res) {
                if (res.data.code === 200) {
                    Notification.success("Added Successful");
                    $scope.loadGrid();
                } else {
                    Notification.error("Error while saving! Try Again.");
                }
            }, function (err) {
                Notification("Error in processing sever error 500! Try Again.");
            });
        }

        function removeDailyTarget(DailyTarget) {
           // if (DailyTarget.deletion === 1) {
                var obj ={ 
                         s_no : DailyTarget.s_no
                     };
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

                if ($rootScope.team_count > 1) {
                    $scope.DailyTarget.team_id = $scope.team.selected;
                }
                else {
                    $scope.DailyTarget.team_id = $scope.temp_team;
                }
                //var id = DailyTarget.s_no;
                $scope.DailyTarget.task_id = $scope.task.selected;
                $scope.DailyTarget.sub_task_id = $scope.subtask.selected;
                $scope.DailyTarget.action = $rootScope.user_id;
                $scope.DailyTarget.month = $scope.DailyTarget.month_from;
                $scope.DailyTarget.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");

                DailyTargetService.addDailyTarget($scope, $rootScope, $http, $scope.DailyTarget).then(function (res) {
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
                               
                                $scope.selectTask();
                            }

                        }
                    }
                    else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                      
                        $scope.selectTask();
                    }
                }
                else {
                    $scope.temp_team = $scope.TeamList[0].team_id;
                    
                    $scope.selectTask();
                }

            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }



        $scope.selectTask = function () {
            //  $scope.task.selected = {};
            var team_id = $scope.team.selected;
            var promiseGet = DailyTargetService.getTaskswithManualCF($scope, $rootScope, $http, team_id);
            promiseGet.then(function (pl) {
                $scope.TaskList = pl.data;
                if ($scope.isEditing) {
                    for (var task in $scope.TaskList) {
                        if ($scope.TaskList[task].task_id == $scope.DailyTarget.task) {
                            $scope.task.selected = $scope.TaskList[task];
                            $scope.selectsubTask();
                        }
                    }
                }
                $scope.selectsubTask();
            },
                function (errorPl) {
                    Notification({ message: 'Some Error in Getting Records.' }, 'error');
                });
        };

        $scope.selectsubTask = function () {
            //  $scope.task.selected = {};
            var task_id = $scope.task.selected;
            var promiseGet = DailyTargetService.getSubTaskswithManualCF($scope, $rootScope, $http, task_id);
            promiseGet.then(function (pl) {
                $scope.subTaskList = pl.data;
                if ($scope.isEditing) {
                    for (var subtask in $scope.subTaskList) {
                        if ($scope.subTaskList[subtask].sub_task_id == $scope.DailyTarget.sub_task) {
                            $scope.subtask.selected = $scope.subTaskList[subtask];

                        }

                    }

                }

            },
                function (errorPl) {
                    Notification({ message: 'Some Error in Getting Records.' }, 'error');
                });
        };



        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();