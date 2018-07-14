(function () {
    'use strict';

    angular
        .module('ERP.pages.SetTarget')
        .controller('SetTargetController', SetTargetController);


    SetTargetController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'SetTargetService', '$uibModal', 'NgTableParams', 'AddTaskService', 'Notification', '$timeout', '$state'];

    function SetTargetController($scope, $rootScope, $http, $filter, SetTargetService, $uibModal, NgTableParams, AddTaskService, Notification, $timeout, $state) {

        $rootScope.title = "SetTarget";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = $scope.LastValue;
        $scope.items = {};
        $scope.team = {};
        $scope.task = {};
        $scope.month = {};
        $scope.years = [];
        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;
        //$scope.date.selected = $filter('date')(new Date(), "MMMM YYYY");


        $scope.SetTarget = {};


        // $scope.loadGrid = loadGrid;

        $scope.getTeamList = getTeamList;
        $scope.saveSetTarget = saveSetTarget;
        // $scope.selectTask = selectTask;

        $scope.months = [{
            "name": "January"
        }, {
            "name": "February"
        }, {
            "name": "March"
        }, {
            "name": "April"
        }, {
            "name": "May"
        }, {
            "name": "June"
        }, {
            "name": "July"
        }, {
            "name": "August"
        }, {
            "name": "September"
        }, {
            "name": "October"
        }, {
            "name": "November"
        }, {
            "name": "December"
        }];



        getYearList();

        function getYearList() {
            for (var i = 2014; i < 2030; i++) {
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

        // $scope.SetTarget = angular.copy($scope.items.SetTarget);
        // $scope.items.SetTarget = SetTarget;
        // $scope.SetTarget = angular.copy($scope.items.SetTarget);

        $scope.editSetTargetModel = function (SetTarget) {
            $scope.items.isEditing = true;
            $scope.items.SetTarget = SetTarget;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/SetTarget/views/SetTargetModel.html',
                controller: 'SetTargetModelController',
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

        $scope.loadOperational = [{
                "id": 0,
                "Name": "None"
            },
            {
                "id": 1,
                "Name": "Opeartioanal"
            },
            {
                "id": 2,
                "Name": "OffLoad"
            }
        ];

        $scope.loadMeasurables = [{
                "id": 0,
                "Name": "None"
            },
            {
                "id": 1,
                "Name": "Measurable"
            },
            {
                "id": 2,
                "Name": "Non-Measurable"
            }
        ];

        $scope.loadReleases = [{
                "id": 0,
                "Name": "None"
            },
            {
                "id": 1,
                "Name": "Release"
            },
            {
                "id": 2,
                "Name": "Non-Release"
            }
        ];

        $scope.SetTarget.op_off = $scope.loadOperational[0].id;
        $scope.SetTarget.ms_non_ms = $scope.loadMeasurables[0].id;
        $scope.SetTarget.rele_non_rele = $scope.loadReleases[0].id;

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
                "id": 2000,
                "values": 2000
            },
            {
                "id": $scope.LastValue,
                "values": "ALL"
            }
        ];

        $scope.exportToExcel = function (tableId) {
            //initialize an empty array ready for export as csv


            $timeout(function () {


                var blob = new Blob([document.getElementById('dailyData').innerHTML], {
                    type: 'data:application/vnd.ms-excel;base64,'
                });
                saveAs(blob, $scope.myMonth.name + " SetTarget.xls");
            }, 100);
            //$timeout(function(){location.href=exportHref;},100); // trigger download
        };

        getTeamList();

        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                    $scope.TeamList = pl.data;
                    if ($rootScope.team_count > 1) {
                        if ($scope.isEditing) {
                            for (var team in $scope.TeamList) {
                                if ($scope.TeamList[team].team_id == $scope.SetTarget.team_id) {
                                    $scope.team.selected = $scope.TeamList[team].team_id;
                                    $scope.loadGrid();
                                    $scope.selectTask();
                                }

                            }
                        } else {
                            $scope.team.selected = $scope.TeamList[0].team_id;
                            $scope.loadGrid();

                            $scope.selectTask();
                        }
                    } else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
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
            var promiseGet = AddTaskService.getLoadedTasks($scope, $rootScope, $http, team_id);
            promiseGet.then(function (pl) {
                    $scope.TaskList = pl.data;
                    if ($scope.isEditing) {
                        for (var task in $scope.TaskList) {
                            if ($scope.TaskList[task].task_id == $scope.SetTarget.task) {
                                $scope.task.selected = $scope.TaskList[task].task_id;

                            }
                        }
                    } else {
                        $scope.task.selected = $scope.TaskList[0].task_id;
                    }
                },
                function (errorPl) {
                    Notification({
                        message: 'Some Error in Getting Records.'
                    }, 'error');
                });
        };


        $scope.loadGrid = function () {
            var obj = {
                team_id: $scope.team.selected,
                month: $scope.myMonth.name + " " + $scope.myYear,
            };

            var self = this;
            SetTargetService.getAllSetTargetbyID($scope, $rootScope, $http, obj).then(function (responce) {
                $scope.resultList = responce.data;
                $scope.tableParams = new NgTableParams({}, {
                    dataset: responce.data
                });

            });

        };

        function saveSetTarget(SetTarget, index) {

            $scope.SetTarget.team_id = $scope.team.selected;
            $scope.SetTarget.month = $scope.myMonth.name + " " + $scope.myYear;

            $scope.SetTarget.action = $rootScope.user_id;

            if (index != undefined) {
                $scope.SetTarget.op_off = SetTarget.op_off[index];
                $scope.SetTarget.task_id = SetTarget.task;
                $scope.SetTarget.ms_non_ms = SetTarget.ms_non_ms[index];
                $scope.SetTarget.rele_non_rele = SetTarget.rele_non_rele[index];
            } else {
                $scope.SetTarget.task_id = $scope.task.selected;
                $scope.SetTarget.op_off = $scope.SetTarget.op_off;
                $scope.SetTarget.ms_non_ms = $scope.SetTarget.ms_non_ms;
                $scope.SetTarget.rele_non_rele = $scope.SetTarget.rele_non_rele;
            }

            SetTargetService.addSetTarget($scope, $rootScope, $http, $scope.SetTarget).then(function (res) {
                if (res.data.code === 200) {
                    Notification.success("Added Successful");
                    $scope.loadGrid();
                } else if (res.data.code == 400) {
                    Notification.error("Set daily target first and then set Target Type.");
                } else if (res.data.code == 300) {
                    Notification.error("Error while saving! Try Again.");
                }
            }, function (err) {
                Notification("Error in processing sever error 500! Try Again.");
            });
        }


    }


})();