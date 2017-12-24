/// <reference path="TypeController.js" />
(function () {
    'use strict';

    angular
        .module('ERP.pages.Type')
        .controller('TypeController', TypeController)
        .controller('TypeModelController', TypeModelController);


    TypeController.$inject = ['$scope', '$rootScope', '$http', 'TypeService', '$uibModal', 'NgTableParams'];
    function TypeController($scope, $rootScope, $http, TypeService, $uibModal, NgTableParams) {

        $rootScope.title = "Type";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeType = removeType;

        loadGrid();

        $scope.addTypeModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Type/views/TypeModel.html',
                controller: 'TypeModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                loadGrid();
            }, function () {
            });
        };

        $scope.editTypeModel = function (Type) {
            $scope.items.isEditing = true;
            $scope.items.Type = Type;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Type/views/TypeModel.html',
                controller: 'TypeModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                loadGrid();
            }, function () {
            });
        };

        function loadGrid() {
            var self = this;
            TypeService.getAllType($scope, $rootScope, $http).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        };

        //function loadGrid() {
        //    TypeService.getAllType($scope, $rootScope, $http).then(function (res) {
        //        if (res.status === 200) {
        //            $scope.TypeList = res.data.result;
        //        }
        //    }, function (err) {

        //    });
        //}

        function removeType(Type) {
            //if (Type.Active === 0) {
            var removeType = {
                TypeID: Type.TypeID,
                //Active: Type.Active,
                ActionBy: $rootScope.loggedUserId
            }
            if (window.confirm("Do you really want to delte this Type")) {
                TypeService.deleteType($scope, $rootScope, $http, removeType).then(function (res) {
                    if (res.data.result) {
                        alert("Deleted Successful")
                        loadGrid();
                    } else {
                        alert("Error! Try Again.")
                    }
                }, function (err) {
                    alert("Error! Try Again.")
                });
            }
            //} else {
            //    alert("Active Status Can't be Delete")
            //}
        }
    }

    TypeModelController.$inject = ['$scope', '$rootScope', '$http', 'items', '$uibModalInstance', 'TypeService'];
    function TypeModelController($scope, $rootScope, $http, items, $uibModalInstance, TypeService) {
        $scope.items = items;
        if (items.isEditing)
            $scope.Type = angular.copy(items.Type);
        else
            $scope.Type = null;

        $scope.saveType = function (Type) {
            if (items.isEditing) {
                $scope.Type.ModifiedBy = "1";
                TypeService.updateType($scope, $rootScope, $http, $scope.Type).then(function (res) {
                    if (res.data.result) {
                        alert("Update Successful")
                        $uibModalInstance.close();
                    } else {
                        alert("Error! Try Again.")
                    }
                }, function (err) {
                    alert("Error! Try Again.")
                });
            } else {
                $scope.Type.CreatedBy = "1";
                $scope.Type.ModifiedBy = "1";
                TypeService.addType($scope, $rootScope, $http, $scope.Type).then(function (res) {
                    if (res.data.result) {
                        alert("Added Successful")
                        $uibModalInstance.close();
                    } else {
                        alert("Error! Try Again.")
                    }
                }, function (err) {
                    alert("Error! Try Again.")
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    };
})();