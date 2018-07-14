(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('SetTargetService', SetTargetService);

    SetTargetService.$inject = [];

    function SetTargetService() {
        this.addSetTarget = addSetTarget;

        this.getAllSetTargetbyID = getAllSetTargetbyID;

        /////////////

        function getAllSetTargetbyID($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'targettype/get/', obj);
        }

        function addSetTarget($scope, $rootScope, $http, SetTarget) {
            return $http.post($rootScope.endPoint + 'targettype/', SetTarget);
        }  
    }

})();