(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('ProfileService', ProfileService);

    ProfileService.$inject = [];

    function ProfileService() {

        this.updateProfile = updateProfile;
        this.ChangePassword = ChangePassword;
        this.getAllProfilebyID = getAllProfilebyID;

        /////////////


        function getAllProfilebyID($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'AllUserInfo/' + id);
        }

        function ChangePassword($scope, $rootScope, $http, Profile) {
            return $http.post($rootScope.endPoint + 'cp/', Profile);
        }

        function updateProfile($scope, $rootScope, $http, Profile, id) { 
            return $http.put($rootScope.endPoint + 'cp/' + id, Profile);
        }

    }

})();