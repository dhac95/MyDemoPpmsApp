(function () {
    'use strict';

    angular
        .module('ERP.pages.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope'];
    function HomeController($scope) {
        $scope.hello = "Welcome";

        ////////////////
    }
})();