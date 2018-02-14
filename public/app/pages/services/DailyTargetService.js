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
        this.setAutoTarget = setAutoTarget;
        this.setNonTarget = setNonTarget;
        this.setManualTarget = setManualTarget;
        this.setManualTargetByPrev = setManualTargetByPrev;

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

        function getTaskswithManualCF($scope, $rootScope, $http , team_id) {
            return $http.get($rootScope.endPoint + 'loadcftasks/tasks/manual/' + team_id);
        }

        function getSubTaskswithManualCF($scope, $rootScope, $http, task_id) {
            return $http.get($rootScope.endPoint + 'loadcftasks/subtasks/manual/' + task_id);
        }

        function setAutoTarget($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'atu/', obj);
        }
        function setNonTarget($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'ncf/', obj);
        }
        function setManualTarget($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'mcf/', obj);
        }
        function setManualTargetByPrev($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'mcf/prev/', obj);
        }
    }

})();