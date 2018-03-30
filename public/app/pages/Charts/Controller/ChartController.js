
(function () {
    'use strict';

    angular
        .module('ERP.pages.Charts')
        .controller('ChartsController', ChartsController)
        .controller('ChartsModelController', ChartsModelController);


    ChartsController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'Excel', '$timeout', 'SdaReportService', 'AddTaskService', '$uibModal', 'NgTableParams', 'Notification'];
    function ChartsController($scope, $rootScope, $http, $filter, Excel, $timeout, SdaReportService, AddTaskService, $uibModal, NgTableParams, Notification) {

        $rootScope.title = "Charts";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        //$scope.getTotalTime = getTotalTime;
        $scope.getTotalCount = getTotalCount;
        $scope.itemsByPage = 15;

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeCharts = removeCharts;
        $scope.showCharts = showCharts;
        $scope.showProductivity = showProductivity;
        $scope.showProductivityByUser = showProductivityByUser;
        $scope.showProductivityByTask = showProductivityByTask;
        $scope.showProductivityBySubTask = showProductivityBySubTask;


        $scope.team = {};
        $scope.build = {};
        $scope.task = {};
        $scope.subtask = {};
        $scope.date = {};
        $scope.user = {};
        $scope.ProdList2 = [];
        $scope.getTeamList = getTeamList;
        $scope.isProd = false;
        $scope.hideProd = false;
        $scope.isTask = false;
        $scope.isSubTask = false;
        $scope.isUser = false;

        //  loadGrid();

        $scope.editChartsModel = function (Charts) {
            $scope.items.isEditing = true;
            $scope.items.Charts = Charts;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Chartss/views/ChartsModel.html',
                controller: 'ChartsModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.getTotalTime();
                showChartss();
            }, function () {
            });
        };

        // getTeamList();

        // function getTeamList() {
        //     var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
        //     promiseGet.then(function (pl) {
        //         $scope.TeamList = pl.data;
        //         if ($scope.isEditing) {
        //             for (var team in $scope.TeamList) {
        //                 if ($scope.TeamList[team].team_id == $scope.Charts.team_id) {
        //                     $scope.team.selected = $scope.TeamList[team];
        //                 }
        //             }
        //         }
        //         $scope.selectTask();
        //         $scope.selectUsers();
        //     },
        //         function (errorPl) {
        //             Notification('Some Error in Getting Records.');
        //         });
        // }
        getTeamList();
        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                $scope.TeamList = pl.data;
                if (pl.data.length > 1) {
                    if ($scope.isEditing) {
                        for (var team in $scope.TeamList) {
                            if ($scope.TeamList[team].team_id == $scope.Charts.team_id) {
                                $scope.team.selected = $scope.TeamList[team];

                            }

                        }
                        $scope.selectTask();
                        $scope.selectUsers();
                    }
                    else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                        $scope.selectTask();
                        $scope.selectUsers();
                    }
                }
                else {
                    $scope.team.selected = $scope.TeamList[0].team_id;
                    $scope.selectTask();
                    $scope.selectUsers();
                }

            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }

        $scope.selectUsers = function () {
            //  $scope.task.selected = {};
            var team_id = $scope.team.selected;
            var promiseGet = SdaReportService.getLoadedUsers($scope, $rootScope, $http, team_id);
            promiseGet.then(function (pl) {
                $scope.UserList = pl.data;
                if ($scope.isEditing) {
                    for (var user in $scope.UserList) {
                        if ($scope.UserList[user].user_id == $scope.Charts.user_id) {
                            $scope.user.selected = $scope.UserList[user];
                        }
                    }
                }

            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
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
                        if ($scope.TaskList[task].task_id == $scope.Charts.tasks_id) {
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
                        if ($scope.subTaskList[subtask].sub_task_id == $scope.Charts.sub_task_id) {
                            $scope.subtask.selected = $scope.subTaskList[subtask];
                        }
                    }
                }
            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        };

        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
            for (var i in $scope.UserList) {
                if ($scope.UserList[i].user_id == $scope.user.selected) {
                    var uname = $scope.UserList[i].user_name;
                }
            }
            for (var j in $scope.TeamList) {
                if ($scope.TeamList[j].team_id == $scope.team.selected) {
                    var tname = $scope.TeamList[j].team_name;
                }
            }
            if (uname == undefined) {
                uname = "All Team Members";
            }
            var name = "Reports For " + uname + " in Team " + tname + " From " + $filter('date')($scope.Charts.From, "dd-MM-yyyy") + " To " + $filter('date')($scope.Charts.To, "dd-MM-yyyy");
            var exportHref = Excel.tableToExcel(tableId, 'User Data');
            $timeout(function () {
                var link = document.createElement('a');
                document.body.appendChild(link);  // For Mozilla
                link.href = exportHref;

                link.download = name + '.xls';
                link.click();
            }, 100);
            //$timeout(function(){location.href=exportHref;},100); // trigger download
        };

        function getTotalCount() {
            var totCount = 0;
            for (var i in $scope.ReportList) {
                totCount += $scope.ReportList[i].count;
            }

            // $scope.Charts.TotalTime = grandTot;
            return totCount;
        }

        function showProductivity() {
            var Date1 = $scope.Charts.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.Charts.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.Charts.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
            var userOtTasks = $scope.Charts.Ot;
            $scope.isProd = true;
            $scope.hideProd = true;

            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: user,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc,
                user_ot: userOtTasks

            };
            if (formatDate1 > formatDate2) {
                Notification({ message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>" }, 'warning');
            }
            else {
                var promiseGet = SdaReportService.getProductiviy($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                    $scope.ProdList = "";
                    $scope.ProdList = pl.data;
                    $scope.createOverAllChart();
                    $scope.chartTitle = "Bar Chart - OverAll Productivity";
                },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                    });
            }
        }

        function showProductivityByUser() {
            var Date1 = $scope.Charts.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.Charts.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.Charts.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
            var userOtTasks = $scope.Charts.Ot;
            $scope.isProd = true;
            $scope.isUser = true;
            $scope.isTask = false;
            $scope.isSubTask = false;
            $scope.hideProd = false;

            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: user,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc,
                user_ot: userOtTasks

            };
            if (formatDate1 > formatDate2) {
                Notification({ message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>" }, 'warning');
            }
            else {
                var promiseGet = SdaReportService.getProductiviyByUser($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                    $scope.ProdList = "";
                    $scope.ProdList = pl.data;
                    $scope.createUserChart();
                    $scope.chartTitle = "Bar Chart - UserWise Productivity";
                },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                    });
            }
        }

        function showProductivityByTask() {
            var Date1 = $scope.Charts.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.Charts.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.Charts.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
            var userOtTasks = $scope.Charts.Ot;
            $scope.isProd = true;
            $scope.isUser = false;
            $scope.isTask = true;
            $scope.isSubTask = false;
            $scope.hideProd = false;

            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: user,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc,
                user_ot: userOtTasks

            };
            if (formatDate1 > formatDate2) {
                Notification({ message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>" }, 'warning');
            }
            else {
                var promiseGet = SdaReportService.getProductiviyByTask($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                    $scope.ProdList = "";
                    $scope.ProdList = pl.data;
                    $scope.createTaskChart();
                    $scope.chartTitle = "Bar Chart - Taskwise Productivity";
                },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                    });
            }
        }

        function showProductivityBySubTask() {
            var Date1 = $scope.Charts.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.Charts.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.Charts.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
            var userOtTasks = $scope.Charts.Ot;
            $scope.isProd = true;
            $scope.isUser = false;
            $scope.isTask = false;
            $scope.isSubTask = true;
            $scope.hideProd = false;

            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: user,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc,
                user_ot: userOtTasks

            };
            if (formatDate1 > formatDate2) {
                Notification({ message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>" }, 'warning');
            }
            else {
                var promiseGet = SdaReportService.getProductiviyBySubTask($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                    $scope.ProdList = "";
                    $scope.ProdList = pl.data;
                    $scope.createSubTaskChart();
                    $scope.chartTitle = "Bar Chart - SubTaskWise Productivity";
                },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                    });
            }
        }

        // $scope.exportToPng = function() {
        //     window.onload = function () {
        //         var canvas = document.getElementById("basicChart");
        //         var context = canvas.getContext("2d");
        //         context.fillStyle = "green";
        //         context.fillRect(50, 50, 100, 100);
        //         // no argument defaults to image/png; image/jpeg, etc also work on some
        //         // implementations -- image/png is the only one that must be supported per spec.
        //         window.location = canvas.toDataURL("image/png");
        //     };
        // };
        $scope.exportToPNG2 = function () {

            var svg = document.querySelector('#basicChart');

            //create a canvas
            var canvas = document.createElement("canvas");

            //set size for the canvas
            var svgSize = svg.getBoundingClientRect();
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;

            var ctx = canvas.getContext('2d');

            var data = new XMLSerializer().serializeToString(svg);

            var DOMURL = window.URL || window.webkitURL || window;

            var img = new Image();
            var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
            var url = DOMURL.createObjectURL(svgBlob);

            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                DOMURL.revokeObjectURL(url);

                var imgURI = canvas
                    .toDataURL('image/png')
                    .replace('image/png', 'image/octet-stream');

                // triggerDownload(imgURI);
                var link = document.createElement('a');
                document.body.appendChild(link);  // For Mozilla
                link.href = imgURI;

                link.download = $scope.chartTitle + '.png';
                link.click();
            };

            img.src = url;
        };

        $scope.exportToJPG = function () {

            var svg = document.querySelector('#basicChart');

            //create a canvas
            var canvas = document.createElement("canvas");

            //set size for the canvas
            var svgSize = svg.getBoundingClientRect();
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;

            var ctx = canvas.getContext('2d');

            var data = new XMLSerializer().serializeToString(svg);

            var DOMURL = window.URL || window.webkitURL || window;

            var img = new Image();
            var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
            var url = DOMURL.createObjectURL(svgBlob);

            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                DOMURL.revokeObjectURL(url);

                var imgURI = canvas
                    .toDataURL('image/jpeg')
                    .replace('image/jpeg', 'image/octet-stream');

                // triggerDownload(imgURI);
                var link = document.createElement('a');
                document.body.appendChild(link);  // For Mozilla
                link.href = imgURI;

                link.download = $scope.chartTitle + '.jpg';
                link.click();
            };

            img.src = url;
        };


        function showCharts() {
            var Date1 = $scope.Charts.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.Charts.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.Charts.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
            var userOtTasks = $scope.Charts.Ot;
            $scope.isProd = false;

            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: user,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc,
                user_ot: userOtTasks

            };
            if (formatDate1 > formatDate2) {
                Notification({ message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>" }, 'warning');
            }
            else {
                var promiseGet = SdaReportService.getChartss($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                    $scope.ReportList = pl.data;
                    $scope.getTotalTime();
                },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                    });
            }
        }
        // getTotalTime();
        $scope.getTotalTime = function () {
            var Date1 = $scope.Charts.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.Charts.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.Charts.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
            var userOtTasks = $scope.Charts.Ot;
            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: user,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc,
                user_ot: userOtTasks

            };
            var promiseGet = SdaReportService.getRemaingReportsTime($scope, $rootScope, $http, obj);
            promiseGet.then(function (pl) {
                $scope.remTime = pl.data;
            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        };

        $scope.createOverAllChart = function () {
            var chart;
            nv.addGraph(function () {
                chart = nv.models.discreteBarChart()
                     .x(function (d) { return d.total; })    //Specify the data accessors.
                     .y(function (d) { return d.AverageWorkUnit; })
                     
                    .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
                     //.tooltips(true)        //Don't show tooltips
                    .showValues(true)       //...instead, show the bar value right on top of each bar.
                   // .transitionDuration(350)
                    ;       
                chart.xAxis
                    .axisLabel('Time');

            d3.select('#basicChart').datum([
                {
                    key: "Report Chart",
                    values: [$scope.ProdList]	
                }
            ]).transition().duration(500).call(chart);
        });
    };

        $scope.createSubTaskChart = function () {
            var chart;
            nv.addGraph(function () {
                chart = nv.models.discreteBarChart()
                    .x(function (d) { return d.SubTaskName; })    //Specify the data accessors.
                    .y(function (d) { return d.AverageWorkUnit; })
                    .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
                  //  .tooltips(false)        //Don't show tooltips
                    .showValues(false)       //...instead, show the bar value right on top of each bar.
                    //.transitionDuration(350)
                    ;
                // chart.y1Axis
                //     .tickFormat(d3.format(',f'));

                // chart.y2Axis
                //     .tickFormat(function (d) { return d3.format(',f')(d); });

                // for (var i in $scope.ProdList) {
                //       $scope.ProdList2.push({  "SubTaskName" : $scope.ProdList[i].SubTaskName ,  "target" : 100 });
                // }
                    
                d3.select('#basicChart').datum([
                    {
                        key: "Actuval",
                        values: $scope.ProdList
                    }
                    // {
                        
                    //     key : "Target",
                    //     values: $scope.ProdList2
                    // }

                ]).transition().duration(500).call(chart);
            }); 
        };

        $scope.createUserChart = function () {
            var chart;
            nv.addGraph(function () {
                chart = nv.models.discreteBarChart()
                    .x(function (d) { return d.UserName; })    //Specify the data accessors.
                    .y(function (d) { return d.AverageWorkUnit; })
                    .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
                    //.tooltips(true)        //Don't show tooltips
                    .showValues(true)       //...instead, show the bar value right on top of each bar.
                    // .transitionDuration(350)
                    ;

                d3.select('#basicChart').datum([
                    {
                        key: "Report Chart",
                        values: $scope.ProdList
                    }
                ]).transition().duration(500).call(chart);
            });
        };

        $scope.createTaskChart = function () {
            var chart;
            nv.addGraph(function () {
                chart = nv.models.discreteBarChart()
                    .x(function (d) { return d.TaskName; })    //Specify the data accessors.
                    .y(function (d) { return d.AverageWorkUnit; })
                    .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
                    //.tooltips(true)        //Don't show tooltips
                    .showValues(true)       //...instead, show the bar value right on top of each bar.
                    // .transitionDuration(350)
                    ;

                d3.select('#basicChart').datum([
                    {
                        key: "Report Chart",
                        values: $scope.ProdList
                    }
                ]).transition().duration(500).call(chart);
            });
        };

        function removeCharts(Charts) {
            //if (Charts.Active === 0) {
            var id = Charts.task_id;
            //    id :  Charts.Charts_id
            // //     //Active: Charts.Active,
            // //     //ActionBy: $rootScope.loggedUserId
            //   };
            if (window.confirm("Do you really want to delete this Charts")) {
                AddTaskService.deleteAddTask($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Deleted Successful");
                        $scope.getTotalTime();
                        showChartss();
                    } else {
                        Notification.error("Try Again");

                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            }
            //} else {
            //    Notification("Active Status Can't be Delete")
            //}
        }
    }




    ChartsModelController.$inject = ['$scope', '$rootScope', '$http', 'items', '$uibModalInstance', 'AddTaskService', 'SdaReportService'];
    function ChartsModelController($scope, $rootScope, $http, items, $uibModalInstance, AddTaskService, SdaReportService) {
        $scope.items = items;
        if (items.isEditing)
            $scope.Charts = angular.copy(items.Charts);
        else
            $scope.Charts = null;

        $scope.saveCharts = function (Charts) {
            if (items.isEditing) {
                //$scope.Charts.ModifiedBy = "1";
                var id = Charts.task_id;
                $scope.Charts.user_id = $rootScope.user_id;
                Charts.team_id = $scope.team.selected;
                Charts.tasks_id = $scope.task.selected;
                Charts.sub_task_id = $scope.subtask.selected;
                Charts.build = $scope.build.selected;
                //Charts.date = $scope.date.selected;
                // $scope.Charts.create_date = $rootScope.date;
                AddTaskService.updateAddTask($scope, $rootScope, $http, $scope.Charts, id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Updated Successful");
                        $uibModalInstance.close();
                        // $scope.getTotalTime();
                        // showChartss();
                    } else if (res.data.results) {
                        Notification({ message: "Error occoured !! Check the entered time", title: "Time total must be total of 8 hours" }, 'error');
                    }
                    else {
                        Notification.error("Error occoured !! Please try again");
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            } else {
                $scope.Charts.user_id = $rootScope.user_id;
                Charts.team_id = $scope.team.selected;
                Charts.tasks_id = $scope.task.selected;
                Charts.sub_task_id = $scope.subtask.selected;
                Charts.build = $scope.build.selected;

                Charts.addCharts($scope, $rootScope, $http, $scope.Charts).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Added Successful");
                        $uibModalInstance.close();
                    } else if (res.data.results) {
                        Notification.error("Error occoured !! Check the entered time");
                    }
                    else {
                        Notification.error("Error occoured !! Please try again");
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
                        if ($scope.TeamList[team].team_id == $scope.Charts.team_id) {
                            $scope.team.selected = $scope.TeamList[team];
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
                            $scope.build.selected = $scope.BuildList[build];
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
                        if ($scope.TaskList[task].task_id == $scope.Charts.tasks_id) {
                            $scope.task.selected = $scope.TaskList[task];
                        }
                    }
                }
                $scope.selectsubTask();
            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.', 'error');
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
                        if ($scope.subTaskList[subtask].sub_task_id == $scope.Charts.sub_task_id) {
                            $scope.subtask.selected = $scope.subTaskList[subtask];
                        }
                    }
                }
            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.', errorPl);
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();