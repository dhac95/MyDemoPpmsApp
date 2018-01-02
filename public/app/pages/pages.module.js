
(function () {
    'use strict';
    angular.module('ERP.pages', [
        'ERP.pages.Team',
        'ERP.pages.home',
        'ERP.pages.Employee',
        'ERP.pages.Build',
        'ERP.pages.Task',
        'ERP.pages.AddTask',
        'ERP.pages.SubTask',
        'ERP.pages.UserOT',
        'ERP.pages.UserReport',
        'ERP.pages.SdaReport'
        
    ]).config(['$urlRouterProvider', '$stateProvider', routeConfig]);

    function routeConfig($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.when('', ['$state', '$match', function ($state, $match) {
            $state.go('home');
        }]);
    }
})();