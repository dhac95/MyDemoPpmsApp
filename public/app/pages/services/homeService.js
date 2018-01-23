(function () {

    'use strict';


    angular
        .module('ERP.service')
        .service('homeService', homeService);

    homeService.$inject = [];

    function homeService() {

        this.getUserTasksforChart = getUserTasksforChart;

        ////////////


        function getUserTasksforChart($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'chart/monthSingleUser/' , obj);
        }

    }

})();