(function () {
    'use strict';

    angular.module('ERP.pages.Task', ['ngTable'])
    .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('Task', {
                url: '/Task',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Task',
                data: {
                    needSda: true
                }
            })
            .state('Task.master', {
                url: '/master',
                controller: 'TaskController',
                templateUrl: 'app/pages/Task/views/Task.html',
                title: 'Task Master',
                data: {
                    needSda: true
                }
            });
    }


})();