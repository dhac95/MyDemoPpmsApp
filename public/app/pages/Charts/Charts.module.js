(function () {
    'use strict';

    angular.module('ERP.pages.Charts', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('Charts', {
                url: '/Charts',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Charts',
                data: {
                    needSda: true
                }
            })
            .state('Charts.master', {
                url: '/master',
                controller: 'ChartsController',
                templateUrl: 'app/pages/Charts/views/Charts.html',
                title: 'Charts Master',
                data: {
                    needSda: true
                }
            });
    }
})();