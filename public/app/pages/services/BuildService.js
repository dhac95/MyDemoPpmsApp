(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('BuildService', BuildService);

    BuildService.$inject = [];

    function BuildService() {
        this.addBuild = addBuild;
        this.updateBuild = updateBuild;
        this.deleteBuild = deleteBuild;
        this.getAllBuild = getAllBuild;
        this.getAllBuildbyID = getAllBuildbyID;

        /////////////

        function getAllBuild($scope, $rootScope, $http) {
            return $http.get($rootScope.endPoint + 'Builds/');
        }

        function getAllBuildbyID($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'Builds/' + id);
        }

        function addBuild($scope, $rootScope, $http, Build) {
            return $http.post($rootScope.endPoint + 'Builds/', Build);
        }

        function updateBuild($scope, $rootScope, $http, Build, id) {
            return $http.put($rootScope.endPoint + 'Builds/' + id, Build);
        }

        function deleteBuild($scope, $rootScope, $http, id) {
            return $http.delete($rootScope.endPoint + 'Builds/' + id);
        }
    }

})();