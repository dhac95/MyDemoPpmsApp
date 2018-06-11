(function () {
    'use strict';

    angular
        .module('ERP.pages.UserReport')
        .controller('UserReportController', UserReportController)
        .controller('UserReportModelController', UserReportModelController);


    UserReportController.$inject = ['$scope', '$rootScope', '$http', '$filter', '$timeout', 'Excel', 'UserReportService', 'AddTaskService', '$uibModal', 'NgTableParams', 'Notification'];

    function UserReportController($scope, $rootScope, $http, $filter, $timeout, Excel, UserReportService, AddTaskService, $uibModal, NgTableParams, Notification) {

        $rootScope.title = "UserReport";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        //$scope.getTotalTime = getTotalTime;
        $scope.getTotalCount = getTotalCount;
        $scope.itemsByPage = 15;

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeUserReport = removeUserReport;
        $scope.showUserReports = showUserReports;

        $scope.deviceFlag = false;

        $scope.team = {};
        $scope.build = {};
        $scope.task = {};
        $scope.subtask = {};
        $scope.date = {};
        $scope.getTeamList = getTeamList;

        //  loadGrid();
        $scope.LeaveTypes = [{
                "id": 0,
                "Name": "Not a Leave"
            },
            {
                "id": 1,
                "Name": "Manager Approved"
            },
            {
                "id": 2,
                "Name": "Manager Not Approved"
            },
            {
                "id": 3,
                "Name": "Unexpected"
            }
        ];

        $scope.smartValues = [{
                "id": 10,
                "values": 10
            },
            {
                "id": 25,
                "values": 25
            },
            {
                "id": 50,
                "values": 50
            },
            {
                "id": 100,
                "values": 100
            },
            {
                "id": 200,
                "values": 200
            },
            {
                "id": 500,
                "values": 500
            },
            {
                "id": 1000,
                "values": 1000
            },
            {
                "id": $scope.LastValue,
                "values": "ALL"
            }
        ];

        $scope.editUserReportModel = function (UserReport) {
            $scope.items.isEditing = true;
            $scope.items.UserReport = UserReport;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/UserReports/views/UserReportModel.html',
                controller: 'UserReportModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.getTotalTime();
                showUserReports();
            }, function () {});
        };

        // getTeamList();

        // function getTeamList() {
        //     var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
        //     promiseGet.then(function (pl) {
        //          $scope.TeamList = pl.data; 
        //            if ($scope.isEditing) {
        //                            for (var team in $scope.TeamList) {
        //                             if ($scope.TeamList[team].team_id == $scope.UserReport.team_id) {
        //                                $scope.team.selected = $scope.TeamList[team];
        //                               }
        //         }
        //      }
        //         $scope.selectTask();
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
                                if ($scope.TeamList[team].team_id == $scope.AddTask.team_id) {
                                    $scope.team.selected = $scope.TeamList[team];

                                }

                            }
                            $scope.selectTask();
                        } else {
                            $scope.team.selected = $scope.TeamList[0].team_id;
                            $scope.selectTask();
                        }
                    } else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
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
            var promiseGet = AddTaskService.getLoadedTasks($scope, $rootScope, $http, team_id);
            promiseGet.then(function (pl) {
                    $scope.TaskList = pl.data;
                    if ($scope.isEditing) {
                        for (var task in $scope.TaskList) {
                            if ($scope.TaskList[task].task_id == $scope.UserReport.tasks_id) {
                                $scope.task.selected = $scope.TaskList[task];
                            }
                        }
                    }
                    $scope.selectsubTask();
                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        };

        $scope.selectsubTask = function () {
            //  $scope.task.selected = {};
            var task_id = $scope.task.selected;
            var promiseGet = AddTaskService.getLoadedsubTasks($scope, $rootScope, $http, task_id);
            promiseGet.then(function (pl) {
                    $scope.subTaskList = pl.data;
                    if ($scope.isEditing) {
                        for (var subtask in $scope.subTaskList) {
                            if ($scope.subTaskList[subtask].sub_task_id == $scope.UserReport.sub_task_id) {
                                $scope.subtask.selected = $scope.subTaskList[subtask];
                            }
                        }
                    }
                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        };

        function getTotalCount() {
            var totCount = 0;
            for (var i in $scope.ReportList) {
                totCount += $scope.ReportList[i].count;
            }

            // $scope.UserReport.TotalTime = grandTot;
            return totCount;
        }

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        today = yyyy + '-' + mm + '-' + dd;
        document.getElementById("datefield").setAttribute("max", today);
        document.getElementById("from").setAttribute("max", today);



        var Create = new Date($rootScope.create_date);
        var ddd = Create.getDate();
        var mmm = Create.getMonth() + 1; //January is 0!
        var yyy = Create.getFullYear();
        if (ddd < 10) {
            ddd = '0' + ddd;
        }
        if (mmm < 10) {
            mmm = '0' + mmm;
        }
        Create = yyy + '-' + mmm + '-' + ddd;
        document.getElementById("from").setAttribute("min", Create);
        document.getElementById("datefield").setAttribute("min", Create);

        // webshims.setOptions('waitReady', false);
        // webshims.setOptions('forms-ext', { types: 'date' });
        // webshims.polyfill('forms forms-ext');

        function showUserReports() {
            var Date1 = $scope.UserReport.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.UserReport.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.UserReport.task_desc;
            var task = $scope.task.selected;
            var subtask = $scope.subtask.selected;
            $scope.showLoader = true;

            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: $rootScope.user_id,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc
            };
            if (formatDate1 > formatDate2) {
                Notification({
                    message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>"
                }, 'warning');
                $scope.showLoader = false;
                $scope.ReportList = "";
            } else {
                var promiseGet = UserReportService.getUserReports($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                        $scope.ReportList = pl.data;
                        $scope.getTotalTime();
                        $scope.showLoader = false;
                        $scope.LastValue = $scope.ReportList.length;
                    },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                        $scope.showLoader = false;
                    });
            }

        }

        // $scope.exportData = function () {
        //     var name = $rootScope.user_name;
        //     var blob = new Blob([document.getElementById('exportable').innerHTML], {
        //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        //     });
        //     saveAs(blob, name + " Report.xls");
        // };

        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            var name = $rootScope.user_name;
            var exportHref = Excel.tableToExcel(tableId, 'sheet name');
            $timeout(function () {
                var blob = new Blob([document.getElementById('userData').innerHTML], {
                    // type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    type: 'data:application/vnd.ms-excel;base64,'
                });
                saveAs(blob, name + ".xls");
            }, 100);
            // $timeout(function(){location.href=exportHref;},100); // trigger download
        };

        // getTotalTime();
        $scope.getTotalTime = function getTotalTime() {
            var Date1 = $scope.UserReport.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.UserReport.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.UserReport.task_desc;
            var task = $scope.task.selected;
            var subtask = $scope.subtask.selected;
            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: $rootScope.user_id,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc
            };
            var promiseGet = UserReportService.getRemaingReportsTime($scope, $rootScope, $http, obj);
            promiseGet.then(function (pl) {
                    $scope.remTime = pl.data;
                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        };


        function removeUserReport(UserReport) {
            //if (UserReport.Active === 0) {
            var id = UserReport.task_id;
            //    id :  UserReport.UserReport_id
            // //     //Active: UserReport.Active,
            // //     //ActionBy: $rootScope.loggedUserId
            //   };
            if (window.confirm("Do you really want to delete this UserReport")) {
                AddTaskService.deleteAddTask($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Deleted Successful");
                        $scope.getTotalTime();
                        showUserReports();
                    } else {
                        Notification.error("Try Again");

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

    UserReportModelController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'items', '$uibModalInstance', 'AddTaskService', 'UserReportService', 'Notification'];

    function UserReportModelController($scope, $rootScope, $http, $filter, items, $uibModalInstance, AddTaskService, UserReportService, Notification) {
        var time = items.UserReport.time.substring(0, 5);
        var formatDate = $filter('date')(items.UserReport.date, "yyyy-MM-dd");
        items.UserReport.time = time;
        items.UserReport.date = formatDate;
        $scope.items = items;
        if (items.isEditing)
            $scope.UserReport = angular.copy(items.UserReport);
        else
            $scope.UserReport = null;

        $scope.saveUserReport = function (UserReport) {
            if (items.isEditing) {
                //$scope.UserReport.ModifiedBy = "1";
                var id = UserReport.task_id;
                $scope.UserReport.user_id = $rootScope.user_id;
                UserReport.team_id = $scope.team.selected;
                UserReport.tasks_id = $scope.task.selected;
                UserReport.sub_task_id = $scope.subtask.selected;
                UserReport.build = $scope.build.selected;
                //UserReport.date = $scope.date.selected;
                // $scope.UserReport.create_date = $rootScope.date;
                AddTaskService.updateAddTask($scope, $rootScope, $http, $scope.UserReport, id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Updated Successful");
                        $uibModalInstance.close();
                        // $scope.getTotalTime();
                        // showUserReports();
                    } else if (res.data.results) {
                        Notification({
                            message: "Time must be total of 8 hours",
                            title: "Error! Check entered time"
                        }, 'error');
                    } else {
                        Notification.error("Error occoured !! Please try again");
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            } else {
                $scope.UserReport.user_id = $rootScope.user_id;
                UserReport.team_id = $scope.team.selected;
                UserReport.tasks_id = $scope.task.selected;
                UserReport.sub_task_id = $scope.subtask.selected;
                UserReport.build = $scope.build.selected;

                UserReport.addUserReport($scope, $rootScope, $http, $scope.UserReport).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Added Successful");
                        $uibModalInstance.close();
                    } else if (res.data.results) {
                        Notification({
                            message: "Time must be total of 8 hours",
                            title: "Error! Check entered time"
                        }, 'error');
                    } else {
                        Notification("Error occoured !! Please try again");
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
                    if ($scope.isEditing) {
                        for (var team in $scope.TeamList) {
                            if ($scope.TeamList[team].team_id == $scope.UserReport.team_id) {
                                $scope.team.selected = $scope.TeamList[team].team_id;
                            }
                        }
                    }
                    $scope.selectTask();
                    $scope.selectBuild();
                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }

        $scope.selectBuild = function () {
            //  $scope.task.selected = {};
            var team_id = $scope.team.selected;
            var promiseGet = AddTaskService.getLoadedBuilds($scope, $rootScope, $http, team_id);
            promiseGet.then(function (pl) {
                    $scope.BuildList = pl.data;
                    if ($scope.isEditing) {
                        for (var build in $scope.BuildList) {
                            if ($scope.BuildList[build].build_no == $scope.AddTask.build) {
                                $scope.build.selected = $scope.BuildList[build].build_no;
                            }
                        }
                    }
                },
                function (errorPl) {
                    $log.error('Some Error in Getting Records.', errorPl);
                });
        };

        $scope.selectTask = function () {
            //  $scope.task.selected = {};
            var team_id = $scope.team.selected;
            var promiseGet = AddTaskService.getLoadedTasks($scope, $rootScope, $http, team_id);
            promiseGet.then(function (pl) {
                    $scope.TaskList = pl.data;
                    if ($scope.isEditing) {
                        for (var task in $scope.TaskList) {
                            if ($scope.TaskList[task].task_id == $scope.UserReport.tasks_id) {
                                $scope.task.selected = $scope.TaskList[task].task_id;
                            }
                        }
                    }
                    $scope.selectsubTask();
                    $scope.EnableDeviceCount();
                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        };

        $scope.selectsubTask = function () {
            //  $scope.task.selected = {};
            var task_id = $scope.task.selected;
            var promiseGet = AddTaskService.getLoadedsubTasks($scope, $rootScope, $http, task_id);
            promiseGet.then(function (pl) {
                    $scope.subTaskList = pl.data;
                    if ($scope.isEditing) {
                        for (var subtask in $scope.subTaskList) {
                            if ($scope.subTaskList[subtask].sub_task_id == $scope.UserReport.sub_task_id) {
                                $scope.subtask.selected = $scope.subTaskList[subtask].sub_task_id;
                            }
                        }
                    }
                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        };

        $scope.LeaveTypes = [{
                "id": 0,
                "Name": "Not a Leave"
            },
            {
                "id": 1,
                "Name": "Manager Approved"
            },
            {
                "id": 2,
                "Name": "Manager Not Approved"
            },
            {
                "id": 3,
                "Name": "Unexpected"
            }
        ];

        $scope.DeviceCounts = [{
                "id": 1,
                "Value": "1"
            },
            {
                "id": 2,
                "Value": "2"
            },
            {
                "id": 3,
                "Value": "3"
            },
            {
                "id": 4,
                "Value": "4"
            },
            {
                "id": 5,
                "Value": "5"
            },
            {
                "id": 6,
                "Value": "6"
            }
        ];

        $scope.EnableDeviceCount = function () {
            $scope.deviceFlag = false;
            var task = $scope.task.selected;
            for (var i in $scope.TaskList) {
                if ($scope.TaskList[i].task_id == task) {
                    var tmpList = $scope.TaskList[i];
                    if (tmpList.device_count == 1) {
                        $scope.deviceFlag = true;
                    } else {
                        $scope.deviceFlag = false;
                    }
                }
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();