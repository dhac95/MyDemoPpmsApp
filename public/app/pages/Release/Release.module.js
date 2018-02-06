(function () {
    'use strict';

    angular.module('ERP.pages.Release', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('Release', {
                url: '/Release',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Release',
                data: {
                    needSda: true
                }
            })
            .state('Release.master', {
                url: '/master',
                controller: 'ReleaseController',
                templateUrl: 'app/pages/Release/views/Release.html',
                title: 'Release Master',
                data: {
                    needSda: true
                }
            });
    }
})();