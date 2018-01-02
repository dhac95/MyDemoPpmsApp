(function () {

    'use strict';


    angular
         .module('ERP.service')
         .service('TaskService', TaskService);

    TaskService.$inject = [];

    function TaskService() {
        this.addTask = addTask;
        this.updateTask = updateTask;
        this.deleteTask = deleteTask;
        this.getAllTask = getAllTask;
        this.getAllTaskbyID = getAllTaskbyID;

        /////////////

        function getAllTask($scope, $rootScope, $http) {
            return $http.get($rootScope.endPoint + 'Tasks/');
        }

        function getAllTaskbyID($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'Tasks/' + id);
        }

        function addTask($scope, $rootScope, $http, Task) {
            return $http.post($rootScope.endPoint + 'Tasks/', Task);
        }

        function updateTask($scope, $rootScope, $http, Task, id) {
            return $http.put($rootScope.endPoint + 'Tasks/' + id , Task);
        }

        function deleteTask($scope, $rootScope, $http, id) {
            return $http.delete($rootScope.endPoint + 'Tasks/' + id);
        }
    }

})();