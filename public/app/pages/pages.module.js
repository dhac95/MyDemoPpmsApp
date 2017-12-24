
(function () {
    'use strict';
    angular.module('ERP.pages', [
        'ERP.pages.Team',
        'ERP.pages.home',
        'ERP.pages.Employee',
        'ERP.pages.Build',
        'ERP.pages.uTask',
        'ERP.pages.AddTask'
    ]).config(['$urlRouterProvider', '$stateProvider', routeConfig]);

    function routeConfig($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.when('', ['$state', '$match', function ($state, $match) {
            $state.go('home');
        }]);
    }
})();