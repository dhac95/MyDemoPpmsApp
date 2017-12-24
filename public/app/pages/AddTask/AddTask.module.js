(function () {
    'use strict';

    angular.module('ERP.pages.AddTask', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('AddTask', {
                url: '/AddTask',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'AddTask',
            })
            .state('AddTask.master', {
                url: '/master',
                controller: 'AddTaskController',
                templateUrl: 'app/pages/AddTask/views/AddTask.html',
                title: 'AddTask Master',
            })
    }
})();