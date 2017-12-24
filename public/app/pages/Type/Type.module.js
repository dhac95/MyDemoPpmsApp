(function () {
    'use strict';

    angular.module('ERP.pages.Type', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('Type', {
                url: '/Type',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Type',
            })
            .state('Type.master', {
                url: '/master',
                controller: 'TypeController',
                templateUrl: 'app/pages/Type/views/Type.html',
                title: 'Type Master',
            })
    }
})();