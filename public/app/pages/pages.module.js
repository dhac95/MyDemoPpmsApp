
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
        'ERP.pages.SdaReport',
        'ERP.pages.Approve',
        'ERP.pages.Profile',
        'ERP.pages.Release',
        'ERP.pages.DailyTarget',
        'ERP.pages.Charts'
        
    ]).config(['$urlRouterProvider', '$stateProvider', routeConfig])
        .run(function ($rootScope, $state) {
            $rootScope.$on('$stateChangeStart', function (event, next, nextParams, prev, prevParams) {
                if (next.data && next.data.needSda && $rootScope.user_type == 1 || undefined) {
                    event.preventDefault();
                    $state.go(prev.name, prevParams); //send to previous
                    $state.go('home'); //send to some other state

                } 
                else if (next.data && next.data.needManager && $rootScope.user_type == 1 || $rootScope.user_type == 2 || undefined) {
                    event.preventDefault();
                    $state.go(prev.name, prevParams); //send to previous
                    $state.go('home'); //send to some other state
                } 
                else if (next.data && next.data.needAdmin && $rootScope.user_type != 4  || undefined) {
                    event.preventDefault();
                    $state.go(prev.name, prevParams); //send to previous
                    $state.go('home'); //send to some other state
                } 
            });
        });

    function routeConfig($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.when('', ['$state', '$match', function ($state, $match) {
            $state.go('home');
        }]);
    }
})();