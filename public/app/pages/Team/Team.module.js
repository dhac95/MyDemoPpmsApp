(function () {
    'use strict';

    angular.module('ERP.pages.Team', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('Team', {
                url: '/Team',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'Team',
                data: {
                    needSda: true
                }
            })
            .state('Team.master', {
                url: '/master',
                controller: 'TeamController',
                templateUrl: 'app/pages/Team/views/Team.html',
                title: 'Team Master',
                data : {
                        needSda : true
                }
            });
    }
})();