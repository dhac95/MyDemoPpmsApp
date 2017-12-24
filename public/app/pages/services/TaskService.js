(function () {

    'use strict';


    angular
         .module('ERP.service')
         .service('uTaskService', uTaskService);

    uTaskService.$inject = [];

    function uTaskService() {
        this.adduTask = adduTask;
        this.updateuTask = updateuTask;
        this.deleteuTask = deleteuTask;
        this.getAlluTask = getAlluTask;
        this.getAlluTaskbyID = getAlluTaskbyID;

        /////////////

        function getAlluTask($scope, $rootScope, $http) {
            return $http.get($rootScope.endPoint + 'uTasks/');
        }

        function getAlluTaskbyID($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'uTasks/' + id);
        }

        function adduTask($scope, $rootScope, $http, uTask) {
            return $http.post($rootScope.endPoint + 'uTasks/', uTask);
        }

        function updateuTask($scope, $rootScope, $http, uTask, id) {
            return $http.put($rootScope.endPoint + 'uTasks/' + id , uTask);
        }

        function deleteuTask($scope, $rootScope, $http, id) {
            return $http.delete($rootScope.endPoint + 'uTasks/' + id);
        }
    }

})();