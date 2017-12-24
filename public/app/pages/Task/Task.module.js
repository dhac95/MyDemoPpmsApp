(function () {
    'use strict';

    angular.module('ERP.pages.uTask', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('uTask', {
                url: '/uTask',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'uTask',
            })
            .state('uTask.master', {
                url: '/master',
                controller: 'uTaskController',
                templateUrl: 'app/pages/Task/views/Task.html',
                title: 'uTask Master',
            });
    }
})();