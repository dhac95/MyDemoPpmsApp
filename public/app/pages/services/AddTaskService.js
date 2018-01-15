(function () {

    'use strict';


    angular
         .module('ERP.service')
         .service('AddTaskService', AddTaskService);

    AddTaskService.$inject = [];

    function AddTaskService() {
        this.addAddTask = addAddTask;
        this.updateAddTask = updateAddTask;
        this.deleteAddTask = deleteAddTask;
        this.getAllAddTask = getAllAddTask;
        this.getAllAddTaskbyID = getAllAddTaskbyID;
        this.getLoadedTeam = getLoadedTeam;
        this.getLoadedTasks = getLoadedTasks;
        this.getLoadedsubTasks = getLoadedsubTasks;
        this.getLoadedBuilds = getLoadedBuilds;
        this.getRemaingTime = getRemaingTime;
        this.getAddedTask = getAddedTask;
        this.getRemaingDate = getRemaingDate;

        /////////////

        function getAllAddTask($scope, $rootScope, $http) {
            return $http.get($rootScope.endPoint + 'AddTasks/');
        }

        function getAllAddTaskbyID($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'test/' + id);
        }

        function addAddTask($scope, $rootScope, $http, AddTask) {
            return $http.post($rootScope.endPoint + 'test/', AddTask);
        }
        function getAddedTask($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'getAddedTask/', obj);
        }

        function updateAddTask($scope, $rootScope, $http, AddTask, id) {
            return $http.put($rootScope.endPoint + 'test/' + id , AddTask);
        }

        function deleteAddTask($scope, $rootScope, $http, id) {
            return $http.delete($rootScope.endPoint + 'test/' + id);
        }
        function getRemaingDate($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'testGetDate/' , obj);
        }

        function getRemaingTime($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'test/getTime/' , obj);
        }

        function getLoadedTeam($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'loadTeam/' + id);
        }
        function getLoadedTasks($scope, $rootScope, $http, team_id) {
            return $http.get($rootScope.endPoint + 'loadTasks/' + team_id);
        }
        function getLoadedsubTasks($scope, $rootScope, $http, task_id) {
            return $http.get($rootScope.endPoint + 'loadTasks/subtask/' + task_id);
        }
        function getLoadedBuilds($scope, $rootScope, $http, team_id) {
            return $http.get($rootScope.endPoint + 'loadBuilds/' + team_id);
        }

    }

})();