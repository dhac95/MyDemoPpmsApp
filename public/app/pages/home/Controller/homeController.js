(function () {
    'use strict';

    angular
        .module('ERP.pages.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'AddTaskService', 'homeService', 'Notification', 'SdaReportService'];
    function HomeController($scope, $rootScope, $http, $filter, AddTaskService, homeService, Notification, SdaReportService) {
        $scope.hello = "Welcome";
      //  $scope.getTotalTime = getTotalTime;
      //  $scope.checkDailyEntryStatus = checkDailyEntryStatus;
      //  $scope.isStatus = isStatus;
        $scope.chartData = [];
        $scope.getTeamList = getTeamList;
        $scope.team = {};
       // $scope.getChartData = getChartData;
        $scope.ChartList = [];
        $scope.exampleData = exampleData;
       // $scope.createBasicChart1 = createBasicChart1;

        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);

     

        var pFirstDay = new Date(y, m - 1, 1);
        var pLastDay = new Date(y , m , 0);

           var fMonth = $filter('date')(firstDay, "MMMM");
        var pMonth = $filter('date')(pFirstDay , "MMMM");

        var checkDate = new Date(y, m, 28);
        var ThresholdDate = new Date();

        //createBasicChart1();
         $scope.createBasicChart1 = function() {
        // var chart;
        // nv.addGraph(function () {
        //      chart = nv.models.multiBarChart()
        //     //     .x(function (d) { return d.TaskName ; })    //Specify the data accessors.
        //     //     .y(function (d) { return d.Count; })
        //     //     .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
        //     //      //.tooltips(true)        //Don't show tooltips
        //     //     .showValues(true)       //...instead, show the bar value right on top of each bar.
        //     //    // .transitionDuration(350)
        //     //     ;

        //     // d3.select('#basicChart')
        //     //     .datum(exampleData())
        //     //     .call(chart);

        //     //     nv.utils.windowResize(chart.update);
        //     chart.xAxis
        //         .tickFormat(d3.format(',f'));

        //     chart.yAxis
        //         .tickFormat(d3.format(',.1f'));

        //     d3.select('#basicChart')
        //         .datum(exampleData())
        //         .transition().duration(500).call(chart);

        //     nv.utils.windowResize(chart.update);

        //         return chart;
        //     });
             var chart = nv.models.multiBarChart()
                 .x(function (d) { return d.TaskName; })    //Specify the data accessors.
                 .y(function (d) { return d.Count; })
                // .transitionDuration(350)
                 .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                 .rotateLabels(0)      //Angle to rotate x-axis labels.
                 .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                 .groupSpacing(0.1)    //Distance between each group of bars.
                 ;

            //  chart.xAxis
            //      .tickFormat(d3.format(',f'));

            //  chart.yAxis
            //      .tickFormat(d3.format(',.1f'));

             d3.select('#basicChart').datum([
                 {
                     key: pMonth,
                     color: "#51A351",
                     values: $scope.ChartList2
                 },
                 {
                     key: fMonth,
                     color: "#BD362F",
                     values:  $scope.ChartList
                 }
             ]).transition().duration(500).call(chart);
        };

        function exampleData() {
            return [
            {
                key : pMonth,
                values : $scope.ChartList2
                }, {
                    key: fMonth,
                    values: $scope.ChartList
                }

        ];
        }

        // Notification to manager and sda
        // isStatus();
        // function isStatus() {
        //     if ($rootScope.user_type == 2 && checkDate >= ThresholdDate) {
        //     checkDailyEntryStatus();
        //         }
        //     }

        // function checkDailyEntryStatus() {

        // }

        // getTotalTime();
        // function getTotalTime() {
        //     var Date = $scope.date.selected;
        //     var formatDate = $filter('date')(Date, "yyyy-MM-dd");
        //     var obj = {
        //         date: formatDate,
        //         user_id: $rootScope.user_id
        //     };
        //     var promiseGet = AddTaskService.getRemaingTime($scope, $rootScope, $http, obj);
        //     promiseGet.then(function (pl) {
        //         $scope.remTime = pl.data;
        //         //var grandTot = $scope.remTime.time;
        //         // $scope.AddTask.TotalTime = grandTot;
        //         // return grandTot;
        //     },
        //         function (errorPl) {
        //             Notification({ message: 'Some Error in Getting Records.' }, 'error');
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
                            if ($scope.TeamList[team].team_id == $scope.DailyTarget.team_id) {
                                $scope.team.selected = $scope.TeamList[team];
                               
                            }
                          
                        }
                        $scope.getChartData();
                        $scope.getChartData2();
                    }
                    else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                        $scope.getChartData();
                        $scope.getChartData2();
                    }
                }
                else {
                    $scope.temp_team = $scope.TeamList[0].team_id;
                    $scope.getChartData();
                    $scope.getChartData2();
                }

            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }

        
        $scope.getChartData =  function() {
            var sDate = $filter('date')(firstDay, "yyyy-MM-dd");
            var eDate = $filter('date')(lastDay, "yyyy-MM-dd");
        
            if($rootScope.team_count > 1) {
              var teamID = $scope.team.selected;
            } else {
              var teamID = $scope.temp_team;
            }
            var obj = {
                From: sDate,
                To : eDate,
                team_id : teamID,
                user_id: $rootScope.user_id
            };
            var promiseGet = SdaReportService.getProductiviyByTask($scope, $rootScope, $http, obj);
            promiseGet.then(function (pl) {
                    $scope.ChartList = pl.data;
                    $scope.createBasicChart1();
            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });

        };

        $scope.getChartData2 = function () {
            var sDate = $filter('date')(pFirstDay, "yyyy-MM-dd");
            var eDate = $filter('date')(pLastDay, "yyyy-MM-dd");

            if ($rootScope.team_count > 1) {
                var teamID = $scope.team.selected;
            } else {
                var teamID = $scope.temp_team;
            }
            var obj = {
                From: sDate,
                To: eDate,
                team_id: teamID,
                user_id: $rootScope.user_id
            };
            var promiseGet = SdaReportService.getProductiviyByTask($scope, $rootScope, $http, obj);
            promiseGet.then(function (pl) {
                $scope.ChartList2 = pl.data;
                $scope.createBasicChart1();
            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });

        };



        //  getTaskbyDate();

        // $scope.getTaskbyDate = function () {
        //     var myDate = $scope.date.selected;
        //     var formatDate = $filter('date')(myDate, "yyyy-MM-dd");
        //     var obj = {
        //         date: formatDate,
        //         user_id: $rootScope.user_id
        //     };

        //     var creDate = $filter('date')($rootScope.create_date, "yyyy-MM-dd");
        //     if (creDate > formatDate) {
        //         Notification({ message: "You are now redirected to Today\'s Date", title: "That action is restricted" }, 'Warning');
        //         getRemaingDate();

        //     }

        //     else {
        //         var promiseGet = AddTaskService.getAddedTask($scope, $rootScope, $http, obj);
        //         promiseGet.then(function (pl) {
        //             $scope.Addedtasklist = pl.data;
        //             if ($scope.isEditing) {
        //                 for (var i in $scope.Addedtasklist) {
        //                     if ($scope.Addedtasklist[i].date == $scope.AddTask.date) {
        //                         $scope.date.selected = $scope.Addedtasklist[i];
        //                     }
        //                 }
        //             }
        //         },
        //             function (errorPl) {
        //                 Notification({ message: 'Some Error in Getting Records.' }, 'error');
        //             });
        //     }
        // };
        ////////////////
    }
})();