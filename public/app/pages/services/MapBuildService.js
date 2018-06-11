(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('MapBuildService', MapBuildService);

    MapBuildService.$inject = [];

    function MapBuildService() {
        this.addMapBuild = addMapBuild;
        this.updateMapBuild = updateMapBuild;
        this.deleteMapBuild = deleteMapBuild;
        this.getAllMapBuild = getAllMapBuild;
        this.getAllMapBuildbyID = getAllMapBuildbyID;
        this.getReleaseById = getReleaseById;

        /////////////

        function getAllMapBuild($scope, $rootScope, $http) {
            return $http.get($rootScope.endPoint + 'mapbuild/');
        }

        function getAllMapBuildbyID($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'mapbuild/' + id);
        }

        function addMapBuild($scope, $rootScope, $http, MapBuild) {
            return $http.post($rootScope.endPoint + 'mapbuild/', MapBuild);
        }

        function updateMapBuild($scope, $rootScope, $http, MapBuild, id) {
            return $http.put($rootScope.endPoint + 'mapbuild/' + id, MapBuild);
        }

        function deleteMapBuild($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'mapbuild/remove/', obj);
        }

        function getReleaseById($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'loadBuilds/release/' + id);
        }
    }

})();