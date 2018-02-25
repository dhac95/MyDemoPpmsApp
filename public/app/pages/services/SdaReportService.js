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

        /////////////


        function getSdaReports($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'SdaReports/', obj);
        }

        function getRemaingReportsTime($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'SdaReports/getTotalTime/' , obj);
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

    }

})();