(function () {
    'use strict';

    angular.module('ERP.pages.Build', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('Build', {
                url: '/Build',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Build',
                data: {
                    needSda: true
                }
            })
            .state('Build.master', {
                url: '/master',
                controller: 'BuildController',
                templateUrl: 'app/pages/Build/views/Build.html',
                title: 'Build Master',
                data: {
                    needSda: true
                }
            });
    }
})();