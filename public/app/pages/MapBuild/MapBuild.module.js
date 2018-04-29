(function () {
    'use strict';

    angular.module('ERP.pages.MapBuild', ['ngCookies']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('MapBuild', {
                url: '/MapBuild',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'MapBuild',

            })
            .state('MapBuild.master', {
                url: '/master',
                controller: 'MapBuildController',
                templateUrl: 'app/pages/MapBuild/views/MapBuild.html',
                title: 'MapBuild Master',
                data: {
                    needSda: true
                }
            });
    }
})();