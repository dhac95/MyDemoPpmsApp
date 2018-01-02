(function () {
    'use strict';

    angular.module('ERP.pages.SdaReport', ['ngTable']).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('SdaReport', {
                url: '/SdaReport',
                template: '<ui-view></ui-view>',
                abstract: true,
                title: 'SdaReport',
                
            })
            .state('SdaReport.master', {
                url: '/master',
                controller: 'SdaReportController',
                templateUrl: 'app/pages/SdaReports/views/SdaReport.html',
                title: 'SdaReport Master',
            })
    }
})();