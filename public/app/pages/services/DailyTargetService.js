(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('DailyTargetService', DailyTargetService);

    DailyTargetService.$inject = [];

    function DailyTargetService() {
        this.addDailyTarget = addDailyTarget;
        this.updateDailyTarget = updateDailyTarget;
        this.deleteDailyTarget = deleteDailyTarget;
        this.getAllDailyTarget = getAllDailyTarget;
        this.getAllDailyTargetbyID = getAllDailyTargetbyID;
        this.getTaskswithManualCF = getTaskswithManualCF;
        this.getSubTaskswithManualCF = getSubTaskswithManualCF;

        //////////////////

        function getAllDailyTarget($scope, $rootScope, $http) {
            return $http.get($rootScope.endPoint + 'wu/');
        }

        function getAllDailyTargetbyID($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'wu/Get/' , obj);
        }

        function addDailyTarget($scope, $rootScope, $http, DailyTarget) {
            return $http.post($rootScope.endPoint + 'wu/', DailyTarget);
        }

        function updateDailyTarget($scope, $rootScope, $http, DailyTarget, id) {
            return $http.put($rootScope.endPoint + 'wu/' + id, DailyTarget);
        }

        function deleteDailyTarget($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'wu/delete/' , obj);
        }

        function getTaskswithManualCF($scope, $rootScope, $http , obj) {
            return $http.post($rootScope.endPoint + 'loadcftasks/tasks/manual' , obj);
        }

        function getSubTaskswithManualCF($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'loadcftasks/subtasks/manual', obj);
        }
    }

})();