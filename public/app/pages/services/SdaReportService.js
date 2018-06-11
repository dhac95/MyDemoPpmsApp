(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('SdaReportService', SdaReportService);

    SdaReportService.$inject = [];

    function SdaReportService() {
        this.getSdaReports = getSdaReports;
        this.getRemaingReportsTime = getRemaingReportsTime;
        this.getLoadedUsers = getLoadedUsers;
        this.getProductiviy = getProductiviy;
        this.getProductiviyByUser = getProductiviyByUser;
        this.getProductiviyByTask = getProductiviyByTask;
        this.getProductiviyBySubTask = getProductiviyBySubTask;
        this.getSubtaksByMultipleTasks = getSubtaksByMultipleTasks;

        this.getAllOldProductivity = getAllOldProductivity;
        this.getUserWiseOldProductivity = getUserWiseOldProductivity;
        this.getTaskWiseOldProductivity = getTaskWiseOldProductivity;
        this.getSubtaskWiseOldProductivity = getSubtaskWiseOldProductivity;

        /////////////


        function getSdaReports($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'SdaReports/', obj);
        }

        function getRemaingReportsTime($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'SdaReports/getTotalTime/', obj);
        }

        function getLoadedUsers($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'loadTeam/users/' + id);
        }

        function getProductiviy($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'WorkUnit/', obj);
        }

        function getProductiviyByUser($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'WorkUnit/user/', obj);
        }

        function getProductiviyByTask($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'WorkUnit/task/', obj);
        }

        function getProductiviyBySubTask($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'WorkUnit/subtask/', obj);
        }

        function getSubtaksByMultipleTasks($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'loadTasks/mulsubtask/', obj);
        }

        function getAllOldProductivity($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'oldProd/', obj);
        }

        function getUserWiseOldProductivity($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'oldProd/user/', obj);
        }

        function getTaskWiseOldProductivity($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'oldProd/task/', obj);
        }

        function getSubtaskWiseOldProductivity($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'oldProd/subtask/', obj);
        }

    }

})();