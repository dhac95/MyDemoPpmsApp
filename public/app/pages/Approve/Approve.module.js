(function () {
    'use strict';

    angular.module('ERP.pages.Approve', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('Approve', {
                url: '/Approve',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Approve',
                
            })
            .state('Approve.master', {
                url: '/master',
                controller: 'ApproveController',
                templateUrl: 'app/pages/Approve/views/Approve.html',
                title: 'Approve Master',
            });
    }
})();