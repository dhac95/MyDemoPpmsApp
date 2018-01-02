(function () {
    'use strict';

    angular.module('ERP.pages.UserReport', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('UserReport', {
                url: '/UserReport',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'UserReport',
                
            })
            .state('UserReport.master', {
                url: '/master',
                controller: 'UserReportController',
                templateUrl: 'app/pages/UserReports/views/UserReport.html',
                title: 'UserReport Master',
            })
    }
})();