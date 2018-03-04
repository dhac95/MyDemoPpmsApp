(function () {
    'use strict';

    angular.module('ERP.pages.Employee', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('Employee', {
                url: '/Employee',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Employee',
                data: {
                    needSda: true
                }
            })
            .state('Employee.master', {
                url: '/master',
                controller: 'EmployeeController',
                templateUrl: 'app/pages/Employee/views/Employee.html',
                title: 'Employee Master',
                data: {
                    needSda: true
                }
            });
    }
})();