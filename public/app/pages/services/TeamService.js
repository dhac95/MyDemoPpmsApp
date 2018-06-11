(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('TeamService', TeamService);

    TeamService.$inject = [];

    function TeamService() {
        this.addTeam = addTeam;
        this.updateTeam = updateTeam;
        this.deleteTeam = deleteTeam;
        this.getAllTeam = getAllTeam;
        this.getAllTeambyID = getAllTeambyID;

        /////////////

        function getAllTeam($scope, $rootScope, $http) {
            return $http.get($rootScope.endPoint + 'Teams/');
        }

        function getAllTeambyID($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'Teams/' + id);
        }

        function addTeam($scope, $rootScope, $http, Team) {
            return $http.post($rootScope.endPoint + 'Teams/', Team);
        }

        function updateTeam($scope, $rootScope, $http, Team, id) {
            return $http.put($rootScope.endPoint + 'Teams/' + id, Team);
        }

        function deleteTeam($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'Teams/remove/', obj);
        }
    }

})();