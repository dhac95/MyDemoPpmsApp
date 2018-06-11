(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('EmployeeService', EmployeeService);

    EmployeeService.$inject = [];

    function EmployeeService() {
        this.addEmployee = addEmployee;
        this.updateEmployee = updateEmployee;
        this.deleteEmployee = deleteEmployee;
        this.getAllEmployee = getAllEmployee;
        this.getAllEmployeebyID = getAllEmployeebyID;

        /////////////

        function getAllEmployee($scope, $rootScope, $http) {
            return $http.get($rootScope.endPoint + 'AllUserInfo/');
        }

        function getAllEmployeebyID($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'AllUserInfo/' + id);
        }

        function addEmployee($scope, $rootScope, $http, Employee) {
            return $http.post($rootScope.endPoint + 'AllUserInfo/', Employee);
        }

        function updateEmployee($scope, $rootScope, $http, Employee, id) {
            return $http.put($rootScope.endPoint + 'AllUserInfo/' + id, Employee);
        }

        function deleteEmployee($scope, $rootScope, $http, id) {
            return $http.delete($rootScope.endPoint + 'AllUserInfo/' + id);
        }
    }

})();