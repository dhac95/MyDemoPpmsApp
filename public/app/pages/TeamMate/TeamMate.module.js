(function () {
    'use strict';

    angular.module('ERP.pages.TeamMate', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('TeamMate', {
                url: '/TeamMate',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'TeamMate',
                data: {
                    needSda: true
                }
            })
            .state('TeamMate.master', {
                url: '/master',
                controller: 'TeamMateController',
                templateUrl: 'app/pages/TeamMate/views/TeamMate.html',
                title: 'TeamMate Master',
                data: {
                    needSda: true
                }
            });
    }
})();