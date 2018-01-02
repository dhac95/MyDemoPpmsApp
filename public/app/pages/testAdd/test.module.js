(function () {
    'use strict';

    angular.module('ERP.pages.test', [
    ]).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('test', {
                url: '/test',
                controller: 'testController',
                templateUrl: 'app/pages/testAdd/views/test.html',
                title: 'test',
            });
    }
})();
