(function () {
    'use strict';

    angular.module('ERP.pages.Profile', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('Profile', {
                url: '/Profile',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Profile',

            })
            .state('Profile.master', {
                url: '/master',
                controller: 'ProfileController',
                templateUrl: 'app/pages/Profile/views/Profile.html',
                title: 'Profile Master',
            });
    }
})();