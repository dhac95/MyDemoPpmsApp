(function () {
    'use strict';

    angular.module('ERP.pages.SubTask', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('SubTask', {
                url: '/SubTask',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'SubTask',
                data: {
                    needSda: true
                }
            })
            .state('SubTask.master', {
                url: '/master',
                controller: 'SubTaskController',
                templateUrl: 'app/pages/SubTask/views/SubTask.html',
                title: 'SubTask Master',
                data: {
                    needSda: true
                }
            });
    }
})();