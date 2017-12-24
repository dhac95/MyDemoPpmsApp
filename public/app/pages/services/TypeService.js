(function () {

    'use strict';


    angular
         .module('ERP.service')
         .service('TypeService', TypeService);

    TypeService.$inject = [];

    function TypeService() {
        this.addType = addType;
        this.updateType = updateType;
        this.deleteType = deleteType;
        this.getAllType = getAllType;

        /////////////

        function getAllType($scope, $rootScope, $http) {
            return $http.get($rootScope.endPoint + 'api/Type/GetAllType');
        }

        function addType($scope, $rootScope, $http, Type) {
            return $http.post($rootScope.endPoint + 'api/Type/InsertType', Type);
        }

        function updateType($scope, $rootScope, $http, Type) {
            return $http.post($rootScope.endPoint + 'api/Type/UpdateType', Type);
        }

        function deleteType($scope, $rootScope, $http, Type) {
            return $http.post($rootScope.endPoint + 'api/Type/DeleteType', Type);
        }
    }

})();