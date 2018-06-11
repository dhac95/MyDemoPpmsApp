(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('TeamMateService', TeamMateService);

    TeamMateService.$inject = [];

    function TeamMateService() {
        this.deleteTeamMate = deleteTeamMate;
        this.getAllTeamMatebyID = getAllTeamMatebyID;
        this.promoteTeamMate = promoteTeamMate;
        this.updateTeamMate = updateTeamMate;

        /////////////



        function getAllTeamMatebyID($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'TeamMates/', obj);
        }

        // function addTeamMate($scope, $rootScope, $http, TeamMate) {
        //     return $http.post($rootScope.endPoint + 'TeamMate/', TeamMate);
        // }

        function promoteTeamMate($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'TeamMates/promote', obj);
        }

        function deleteTeamMate($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'TeamMates/remove/', obj);
        }

        function updateTeamMate($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'TeamMates/user/', obj);
        }

    }

})();