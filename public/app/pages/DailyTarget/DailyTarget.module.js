(function () {
    'use strict';

    angular.module('ERP.pages.DailyTarget', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('DailyTarget', {
                url: '/DailyTarget',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'DailyTarget',
                data: {
                    needSda: true
                }
            })
            .state('DailyTarget.master', {
                url: '/master',
                controller: 'DailyTargetController',
                templateUrl: 'app/pages/DailyTarget/views/DailyTarget.html',
                title: 'DailyTarget Master',
                data: {
                    needSda: true
                }
            });
    }
})();