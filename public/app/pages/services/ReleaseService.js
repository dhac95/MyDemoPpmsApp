(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('ReleaseService', ReleaseService);

    ReleaseService.$inject = [];

    function ReleaseService() {
        this.addRelease = addRelease;
        this.updateRelease = updateRelease;
        this.deleteRelease = deleteRelease;
        this.getAllRelease = getAllRelease;
        this.getAllReleasebyID = getAllReleasebyID;

        /////////////

        function getAllRelease($scope, $rootScope, $http) {
            return $http.get($rootScope.endPoint + 'Release/');
        }

        function getAllReleasebyID($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'Release/' + id);
        }

        function addRelease($scope, $rootScope, $http, Release) {
            return $http.post($rootScope.endPoint + 'Release/', Release);
        }

        function updateRelease($scope, $rootScope, $http, Release, id) {
            return $http.put($rootScope.endPoint + 'Release/' + id, Release);
        }

        function deleteRelease($scope, $rootScope, $http, id) {
            return $http.delete($rootScope.endPoint + 'Release/' + id);
        }
    }

})();