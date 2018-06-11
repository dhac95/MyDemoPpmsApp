(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('UserOTService', UserOTService);

    UserOTService.$inject = [];

    function UserOTService() {
        this.addUserOT = addUserOT;
        this.updateUserOT = updateUserOT;
        this.deleteUserOT = deleteUserOT;
        //   this.getAllUserOT = getAllUserOT;
        this.getAllUserOTbyID = getAllUserOTbyID;
        this.getLoadedTeam = getLoadedTeam;
        this.getLoadedTasks = getLoadedTasks;
        this.getLoadedsubTasks = getLoadedsubTasks;
        this.getLoadedBuilds = getLoadedBuilds;
        this.getAddedTask = getAddedTask;
        this.getRemaingTime = getRemaingTime;

        /////////////

        // function getAllUserOT($scope, $rootScope, $http) {
        //     return $http.get($rootScope.endPoint + 'UserOTs/');
        // }

        function getAllUserOTbyID($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'userot/' + id);
        }

        function addUserOT($scope, $rootScope, $http, UserOT) {
            return $http.post($rootScope.endPoint + 'userot/', UserOT);
        }

        function getRemaingTime($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'userot/getTime/', obj);
        }

        function getAddedTask($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'userot/reports/', obj);
        }

        function updateUserOT($scope, $rootScope, $http, UserOT, id) {
            return $http.put($rootScope.endPoint + 'userot/' + id, UserOT);
        }

        function deleteUserOT($scope, $rootScope, $http, id) {
            return $http.delete($rootScope.endPoint + 'userot/' + id);
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