(function () {
    'use strict';

    angular.module('ERP.pages.home', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                controller: 'HomeController',
                templateUrl: 'app/pages/home/views/home.html',
                title: 'Home',
            });
    }
})();