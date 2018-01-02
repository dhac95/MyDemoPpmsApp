(function () {

    'use strict';


    angular
         .module('ERP.service')
         .service('UserReportService', UserReportService);

         UserReportService.$inject = [];

    function UserReportService() {
        this.getUserReports = getUserReports;
        this.getRemaingReportsTime = getRemaingReportsTime;

        /////////////


        function getUserReports($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'userReports/', obj);
        }

        function getRemaingReportsTime($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'userReports/getTotalTime/' , obj);
        }

    }

})();