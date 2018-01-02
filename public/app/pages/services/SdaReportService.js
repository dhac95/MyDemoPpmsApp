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

    }

})();