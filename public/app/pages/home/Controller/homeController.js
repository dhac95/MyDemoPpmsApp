(function () {
    'use strict';

    angular
        .module('ERP.pages.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'AddTaskService', 'homeService', 'Notification'];
    function HomeController($scope, $rootScope, $http, $filter, AddTaskService, homeService, Notification) {
        $scope.hello = "Welcome";
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        var lastDay = new Date(y, m + 1, 0);

        getTotalTime();
        function getTotalTime() {
            var Date = $scope.date.selected;
            var formatDate = $filter('date')(Date, "yyyy-MM-dd");
            var obj = {
                date: formatDate,
                user_id: $rootScope.user_id
            };
            var promiseGet = AddTaskService.getRemaingTime($scope, $rootScope, $http, obj);
            promiseGet.then(function (pl) {
                $scope.remTime = pl.data;
                //var grandTot = $scope.remTime.time;
                // $scope.AddTask.TotalTime = grandTot;
                // return grandTot;
            },
                function (errorPl) {
                    Notification({ message: 'Some Error in Getting Records.' }, 'error');
                });
        }


        //  getTaskbyDate();

        $scope.getTaskbyDate = function () {
            var myDate = $scope.date.selected;
            var formatDate = $filter('date')(myDate, "yyyy-MM-dd");
            var obj = {
                date: formatDate,
                user_id: $rootScope.user_id
            };

            var creDate = $filter('date')($rootScope.create_date, "yyyy-MM-dd");
            if (creDate > formatDate) {
                Notification({ message: "You are now redirected to Today\'s Date", title: "That action is restricted" }, 'Warning');
                getRemaingDate();

            }

            else {
                var promiseGet = AddTaskService.getAddedTask($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                    $scope.Addedtasklist = pl.data;
                    if ($scope.isEditing) {
                        for (var i in $scope.Addedtasklist) {
                            if ($scope.Addedtasklist[i].date == $scope.AddTask.date) {
                                $scope.date.selected = $scope.Addedtasklist[i];
                            }
                        }
                    }
                },
                    function (errorPl) {
                        Notification({ message: 'Some Error in Getting Records.' }, 'error');
                    });
            }
        };
        ////////////////
    }
})();