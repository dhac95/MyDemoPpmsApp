(function () {

    'use strict';


    angular
         .module('ERP.service')
         .service('SubTaskService', SubTaskService);

    SubTaskService.$inject = [];

    function SubTaskService() {
        this.addSubTask = addSubTask;
        this.updateSubTask = updateSubTask;
        this.deleteSubTask = deleteSubTask;
        this.getAllSubTask = getAllSubTask;
        this.getAllSubTaskbyID = getAllSubTaskbyID;
        this.getTaskByHaveST = getTaskByHaveST;

        /////////////

        function getAllSubTask($scope, $rootScope, $http) {
            return $http.get($rootScope.endPoint + 'SubTasks/');
        }

        function getAllSubTaskbyID($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'SubTasks/' + id);
        }

        function addSubTask($scope, $rootScope, $http, SubTask) {
            return $http.post($rootScope.endPoint + 'SubTasks/', SubTask);
        }

        function updateSubTask($scope, $rootScope, $http, SubTask, id) {
            return $http.put($rootScope.endPoint + 'SubTasks/' + id , SubTask);
        }

        function deleteSubTask($scope, $rootScope, $http, id) {
            return $http.delete($rootScope.endPoint + 'SubTasks/' + id);
        }
        function getTaskByHaveST($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'loadcftasks/Tasks/HaveSt/' + id);
        }

    }

})();