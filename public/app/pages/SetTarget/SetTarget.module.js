(function () {
    'use strict';

    angular.module('ERP.pages.SetTarget', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('SetTarget', {
                url: '/SetTarget',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'SetTarget',
                data: {
                    needSda: true
                }
            })
            .state('SetTarget.master', {
                url: '/master',
                controller: 'SetTargetController',
                templateUrl: 'app/pages/SetTarget/views/SetTarget.html',
                title: 'SetTarget Master',
                data: {
                    needSda: true
                }
            });
    }
})();