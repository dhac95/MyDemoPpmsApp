(function () {
    'use strict';

    angular
        .module('ERP.pages.DailyTarget')
        .controller('DailyTargetController', DailyTargetController)
        .controller('DailyTargetModelController', DailyTargetModelController);


    DailyTargetController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'DailyTargetService', '$uibModal', 'NgTableParams', 'AddTaskService', 'Notification', '$timeout', '$state'];

    function DailyTargetController($scope, $rootScope, $http, $filter, DailyTargetService, $uibModal, NgTableParams, AddTaskService, Notification, $timeout, $state) {

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
        $scope.deviceFlag = false;
        $scope.DailyTarget = {};
        $scope.switchFlag = true;

        $scope.removeDailyTarget = removeDailyTarget;
        $scope.getTeamList = getTeamList;
        $scope.saveDailyTarget = saveDailyTarget;
        $scope.setAutoTarget = setAutoTarget;
        $scope.setNonTarget = setNonTarget;
        $scope.setManualTarget = setManualTarget;
        $scope.setManualTargetByPrev = setManualTargetByPrev;
        $scope.setTargets = setTargets;
        $scope.setDeviceCountByPrev = setDeviceCountByPrev;
        // $scope.selectTask = selectTask;
        $scope.DailyTarget.noofdevice = 1;
        $scope.DeviceCounts = [

            {
                "id": 1,
                "Value": 1
            },
            {
                "id": 2,
                "Value": 2
            },
            {
                "id": 3,
                "Value": 3
            },
            {
                "id": 4,
                "Value": 4
            },
            {
                "id": 5,
                "Value": 5
            },
            {
                "id": 6,
                "Value": 6
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
                        $scope.loadDeviceCounts();
                    } else {
                        $scope.deviceFlag = false;
                    }
                }
            }

        };

        $scope.EnableSwitch = function () {
            if ($scope.switchFlag) {
                $scope.DailyTarget.noofdevice = 2;
                $scope.loadDeviceCounts();
                $scope.switchFlag = false;
                $scope.deviceFlag = true;
            } else {
                $scope.DailyTarget.noofdevice = 1;
                $scope.loadGrid();
                $scope.switchFlag = true;
                $scope.deviceFlag = false;
            }
        };

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

        $scope.editDeviceCountModel = function (DailyTarget) {
            $scope.items.isEditing = true;
            $scope.items.DailyTarget = DailyTarget;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/DailyTarget/views/DeviceCountModel.html',
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
                $scope.loadDeviceCounts();
            }, function () {});
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
                $scope.loadDeviceCounts();
            }, function () {});
        };

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
                 saveAs(blob, $scope.myMonth.name +  " DailyTarget.xls");
             }, 100);
             //$timeout(function(){location.href=exportHref;},100); // trigger download
         };

           $scope.exportToExcelCount = function (tableId) {
               //initialize an empty array ready for export as csv


               $timeout(function () {


                   var blob = new Blob([document.getElementById('countData').innerHTML], {
                       type: 'data:application/vnd.ms-excel;base64,'
                   });
                   saveAs(blob, $scope.myMonth.name + " DeviceCount.xls");
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
                                if ($scope.TeamList[team].team_id == $scope.DailyTarget.team_id) {
                                    $scope.team.selected = $scope.TeamList[team].team_id;
                                    $scope.loadGrid();
                                    $scope.loadDeviceCounts();
                                    $scope.selectTask();
                                }

                            }
                        } else {
                            $scope.team.selected = $scope.TeamList[0].team_id;
                            $scope.loadGrid();
                            $scope.loadDeviceCounts();
                            $scope.selectTask();
                        }
                    } else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                        $scope.loadGrid();
                        $scope.loadDeviceCounts();
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

                            }
                        }
                    }
                    $scope.selectsubTask();
                    $scope.EnableDeviceCount();
                },
                function (errorPl) {
                    Notification({
                        message: 'Some Error in Getting Records.'
                    }, 'error');
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
                    Notification({
                        message: 'Some Error in Getting Records.'
                    }, 'error');
                });
        };

        function setTargets() {
            var obj = {};
            // if ($rootScope.team_count > 1) {
            obj = {
                team_id: $scope.team.selected,
                month: $scope.myMonth.name + " " + $scope.myYear,
                user_id: $rootScope.user_id,
            };

            if (window.confirm("***Note*** : You are about to calcute monthly targets \n Click Ok to continue")) {
                DailyTargetService.setTargets($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Loaded Successful");
                        $timeout(function () {
                            window.location.replace("/main.html#/SdaReport/master");
                        }, 750);

                    } else {
                        Notification.error("Error while saving! Try Again.");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        }

        function setAutoTarget() {
            var obj = {};
            // if ($rootScope.team_count > 1) {
            obj = {
                team_id: $scope.team.selected,
                month: $scope.myMonth.name + " " + $scope.myYear,
                user_id: $rootScope.user_id,
            };
            // }
            // else {
            //     $scope.temp_team = $scope.TeamList[0].team_id;

            //      obj = {
            //         team_id: $scope.temp_team,
            //         month: $scope.myMonth.name + " " + $scope.myYear,
            //         user_id: $rootScope.user_id,
            //     };
            // }
            if (window.confirm("***Note*** :  Auto Targets cannot be modified Once set! \n If you want change Auto to manual you have to first change the task or subtask before you set Auto target \n Click OK to contiune ")) {
                DailyTargetService.setAutoTarget($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Added Successful");
                        $timeout(function () {
                            $scope.loadGrid();
                            $scope.loadDeviceCounts();
                        }, 50);
                    } else if (res.data.code === 300) {
                        Notification.warning("Auto target already set for selected date and team");
                    } else {
                        Notification.error("Error while saving! Try Again.");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        }

        function setManualTarget() {
            var obj = {};
            // if ($rootScope.team_count > 1) {
            obj = {
                team_id: $scope.team.selected,
                month: $scope.myMonth.name + " " + $scope.myYear,
                user_id: $rootScope.user_id,
            };

            if (window.confirm("***Note*** : Use this feature only if you are unsure of how many tasks and subtasks the team have.. \nLoad this Only before adding Manual count by yourself \nClick OK to contiune ")) {
                DailyTargetService.setManualTarget($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Loaded Successful");
                        $timeout(function () {
                            $scope.loadGrid();
                            $scope.loadDeviceCounts();
                        }, 250);

                    } else if (res.data.code === 300) {
                        Notification.warning("Manual target already Loaded for selected date and team");
                    } else {
                        Notification.error("Error while saving! Try Again.");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        }

        function setManualTargetByPrev() {
            var obj = {};
            // if ($rootScope.team_count > 1) {
            obj = {
                team_id: $scope.team.selected,
                month: $scope.myMonth.name + " " + $scope.myYear,
                user_id: $rootScope.user_id,
            };

            if (window.confirm("***Note*** : This will set daily target same as previous month's target \nUse this feature only if maximum number of counts are same \nClick OK to contiune ")) {
                DailyTargetService.setManualTargetByPrev($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Loaded Successful");
                        $timeout(function () {
                            $scope.loadGrid();
                            $scope.loadDeviceCounts();
                        }, 250);

                    } else if (res.data.code === 304) {
                        Notification.warning("No Count set for previous month! Set that first");
                    } else if (res.data.code === 300) {
                        Notification.warning("Can't Load targets again if you are already started to add manual targets by yourself!! Even if one target added this feature cannot be used!");
                    } else {
                        Notification.error("Error while saving! Try Again.");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        }


          function setDeviceCountByPrev() {
              var obj = {};
              // if ($rootScope.team_count > 1) {
              obj = {
                  team_id: $scope.team.selected,
                  month: $scope.myMonth.name + " " + $scope.myYear,
                  user_id: $rootScope.user_id,
              };

              if (window.confirm("***Note*** : This will set daily target same as previous month's target \nUse this feature only if maximum number of counts are same \nClick OK to contiune ")) {
                  DailyTargetService.setDeviceCountByPrev($scope, $rootScope, $http, obj).then(function (res) {
                      if (res.data.code === 200) {
                          Notification.success("Loaded Successful");
                          $timeout(function () {
                              $scope.loadGrid();
                              $scope.loadDeviceCounts();
                          }, 250);

                      } else if (res.data.code === 304) {
                          Notification.warning("No Count set for previous month! Set that first");
                      } else if (res.data.code === 300) {
                             Notification.warning("No Count set for previous month! Set that first");
                      } else {
                          Notification.error("Error while saving! Try Again.");
                      }
                  }, function (err) {
                      Notification("Error in processing sever error 500! Try Again.");
                  });
              }
          }


        function setNonTarget() {
            var obj = {};
            // if ($rootScope.team_count > 1) {
            obj = {
                team_id: $scope.team.selected,
                month: $scope.myMonth.name + " " + $scope.myYear,
                user_id: $rootScope.user_id,
            };

            if (window.confirm("***Note*** :  Non Targets cannot be modified Once set! \n If you want change  to manual you have to first change the task or subtask before you set Auto target \n Click OK to contiune ")) {
                DailyTargetService.setNonTarget($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Added Successful");
                        $timeout(function () {
                            $scope.loadGrid();
                            $scope.loadDeviceCounts();
                        }, 50);
                    } else if (res.data.code === 300) {
                        Notification.warning("NoN target already set for selected date and team");
                    } else {
                        Notification.error("Error while saving! Try Again.");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        }

        $scope.loadGrid = function () {
            var obj = {
                team_id: $scope.team.selected,
                month: $scope.myMonth.name + " " + $scope.myYear,
            };

            var self = this;
            DailyTargetService.getAllDailyTargetbyID($scope, $rootScope, $http, obj).then(function (responce) {
                $scope.switchFlag = true;
                $scope.resultList = responce.data;
                $scope.LastValue = $scope.resultList.length;
                $scope.tableParams = new NgTableParams({}, {
                    dataset: responce.data
                });

            });

        };

        $scope.loadDeviceCounts = function () {

            var obj = {
                team_id: $scope.team.selected,
                month: $scope.myMonth.name + " " + $scope.myYear,
            };

            var self = this;
            DailyTargetService.getDeviceCountList($scope, $rootScope, $http, obj).then(function (responce) {
                $scope.countList = responce.data;
                $scope.LastValue = $scope.countList.length;
                $scope.switchFlag = false;
                $scope.tableParamsForDC = new NgTableParams({}, {
                    dataset: responce.data
                });

            });
        };

        function saveDailyTarget(DailyTarget) {

            $scope.DailyTarget.team_id = $scope.team.selected;


            $scope.DailyTarget.month = $scope.myMonth.name + " " + $scope.myYear;
            $scope.DailyTarget.task_id = $scope.task.selected;
            $scope.DailyTarget.sub_task_id = $scope.subtask.selected;
            $scope.DailyTarget.action = $rootScope.user_id;
            $scope.DailyTarget.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
            $scope.DailyTarget.create_date = $filter('date')($rootScope.date, "yyyy-MM-dd");

            if ($scope.deviceFlag && $scope.DailyTarget.noofdevice > 1) {
                $scope.DailyTarget.noofdevice = $scope.DailyTarget.noofdevice;
                $scope.DailyTarget.percentage = $scope.DailyTarget.percentage;
                DailyTargetService.saveDeviceCountList($scope, $rootScope, $http, $scope.DailyTarget).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Added Successful");
                        $scope.loadDeviceCounts();
                        $scope.loadGrid();
                    } else if (res.data.code == 405) {
                        Notification.error("Set daily target first and then set device count.");
                    } else {
                        Notification.error("Error while saving! Try Again.");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            } else {
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
        }

        function removeDailyTarget(DailyTarget) {
            // if (DailyTarget.deletion === 1) {
            var obj = {
                s_no: DailyTarget.s_no
            };
            if (window.confirm("Do you really want to delete this DailyTarget")) {
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

    function removeDailyCount(DailyTarget) {
        // if (DailyTarget.deletion === 1) {
        var obj = {
            s_no: DailyTarget.s_no
        };
        if (window.confirm("Do you really want to delete this DailyTarget")) {
            DailyTargetService.deleteDeviceCountList($scope, $rootScope, $http, obj).then(function (res) {
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

                $scope.DailyTarget.team_id = $scope.team.selected;

                // if ($rootScope.team_count > 1) {
                //     $scope.DailyTarget.team_id = $scope.team.selected;
                // }
                // else {
                //     $scope.DailyTarget.team_id = $scope.temp_team;
                // }
                //var id = DailyTarget.s_no;
                $scope.DailyTarget.task_id = $scope.task.selected;
                $scope.DailyTarget.sub_task_id = $scope.subtask.selected;
                $scope.DailyTarget.action = $rootScope.user_id;
                $scope.DailyTarget.month = $scope.DailyTarget.month_from;
                $scope.DailyTarget.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");

                if ($scope.deviceFlag && $scope.DailyTarget.noofdevice > 1) {
                    $scope.DailyTarget.noofdevice = $scope.DailyTarget.noofdevice;
                    $scope.DailyTarget.percentage = $scope.DailyTarget.percentage;
                    DailyTargetService.saveDeviceCountList($scope, $rootScope, $http, $scope.DailyTarget).then(function (res) {
                        if (res.data.code === 200) {
                            Notification.success("Updated Successfully");
                            $uibModalInstance.close();
                        } else {
                            Notification.error("Error while saving! Try Again.");
                        }
                    }, function (err) {
                        Notification("Error in processing sever error 500! Try Again.");
                    });
                }
                DailyTargetService.addDailyTarget($scope, $rootScope, $http, $scope.DailyTarget).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Updated Successfully");
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

                $scope.DailyTarget.team_id = $scope.team.selected;

                // if ($rootScope.team_count > 1) {
                //     $scope.DailyTarget.team_id = $scope.team.selected;
                // }
                // else {
                //     $scope.DailyTarget.team_id = $scope.temp_team;
                // }
                $scope.DailyTarget.last_modified_by = $rootScope.user_id;
                //  $scope.DailyTarget.added_by = $rootScope.user_id;

                $scope.DailyTarget.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                $scope.DailyTarget.create_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                $scope.DailyTarget.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");

                if ($scope.deviceFlag && $scope.DailyTarget.noofdevice > 1) {
                    $scope.DailyTarget.noofdevice = $scope.DailyTarget.noofdevice;
                    $scope.DailyTarget.percentage = $scope.DailyTarget.percentage;
                    DailyTargetService.saveDeviceCountList($scope, $rootScope, $http, $scope.DailyTarget).then(function (res) {
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

        $scope.saveDeviceCount = function (DailyTarget) {
            if (items.isEditing) {

                $scope.DailyTarget.team_id = $scope.team.selected;
                $scope.DailyTarget.task_id = $scope.task.selected;
                $scope.DailyTarget.sub_task_id = $scope.subtask.selected;
                $scope.DailyTarget.action = $rootScope.user_id;
                $scope.DailyTarget.month = $scope.DailyTarget.month;
                $scope.DailyTarget.maintain_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                $scope.DailyTarget.noofdevice = $scope.DailyTarget.noofdevice;
                $scope.DailyTarget.percentage = $scope.DailyTarget.percentage;
                DailyTargetService.saveDeviceCountList($scope, $rootScope, $http, $scope.DailyTarget).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Updated Successfully");
                        $uibModalInstance.close();
                    } else if(res.data.code == 405) {
                        Notification.warning("Set the Daily target first and then set the Count");
                    }
                    
                    else {
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
                    if ($rootScope.team_count > 1) {
                        if (items.isEditing) {
                            for (var team in $scope.TeamList) {
                                if ($scope.TeamList[team].team_id == $scope.DailyTarget.team_id) {
                                    $scope.team.selected = $scope.TeamList[team].team_id;

                                    // $scope.selectTask();
                                }

                            }
                        } else {
                            $scope.team.selected = $scope.TeamList[0].team_id;

                            // $scope.selectTask();
                        }
                    } else {
                        $scope.team.selected = $scope.TeamList[0].team_id;

                        // $scope.selectTask();
                    }

                    $scope.selectTask();

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
                    if (items.isEditing) {
                        for (var task in $scope.TaskList) {
                            if ($scope.TaskList[task].task_id == $scope.DailyTarget.task_id) {
                                $scope.task.selected = $scope.TaskList[task].task_id;
                                $scope.selectsubTask();
                            }
                        }
                    }
                    $scope.EnableDeviceCount();
                    $scope.selectsubTask();
                },
                function (errorPl) {
                    Notification({
                        message: 'Some Error in Getting Records.'
                    }, 'error');
                });
        };

        $scope.selectsubTask = function () {
            //  $scope.task.selected = {};
            var task_id = $scope.task.selected;

            var promiseGet = DailyTargetService.getSubTaskswithManualCF($scope, $rootScope, $http, task_id);
            promiseGet.then(function (pl) {
                    $scope.subTaskList = pl.data;
                    if (items.isEditing) {
                        for (var subtask in $scope.subTaskList) {
                            if ($scope.subTaskList[subtask].sub_task_id == $scope.DailyTarget.sub_task_id) {
                                $scope.subtask.selected = $scope.subTaskList[subtask].sub_task_id;

                            }

                        }

                    }

                },
                function (errorPl) {
                    Notification({
                        message: 'Some Error in Getting Records.'
                    }, 'error');
                });
        };

        $scope.DeviceCounts = [

            {
                "id": 1,
                "Value": 1
            },
            {
                "id": 2,
                "Value": 2
            },
            {
                "id": 3,
                "Value": 3
            },
            {
                "id": 4,
                "Value": 4
            },
            {
                "id": 5,
                "Value": 5
            },
            {
                "id": 6,
                "Value": 6
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