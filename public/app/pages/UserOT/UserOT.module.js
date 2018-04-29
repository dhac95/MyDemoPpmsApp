(function () {
    'use strict';

    angular.module('ERP.pages.UserOT', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('UserOT', {
                url: '/UserOT',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'UserOT',
                
            })
            .state('UserOT.master', {
                url: '/master',
                controller: 'UserOTController',
                templateUrl: 'app/pages/UserOT/views/UserOT.html',
                title: 'UserOT Master',
            });
    }
})();