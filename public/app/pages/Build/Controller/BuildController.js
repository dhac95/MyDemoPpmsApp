
(function () {
    'use strict';

    angular
        .module('ERP.pages.Build')
        .controller('BuildController', BuildController)
        .controller('BuildModelController', BuildModelController);


    BuildController.$inject = ['$scope', '$rootScope', '$http', 'BuildService', '$uibModal', 'NgTableParams'];
    function BuildController($scope, $rootScope, $http, BuildService, $uibModal, NgTableParams) {

        $rootScope.title = "Build";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeBuild = removeBuild;
    
        loadGrid();

        $scope.addBuildModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Build/views/BuildModel.html',
                controller: 'BuildModelController',
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

        $scope.editBuildModel = function (Build) {
            $scope.items.isEditing = true;
            $scope.items.Build = Build;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Build/views/BuildModel.html',
                controller: 'BuildModelController',
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
            BuildService.getAllBuild($scope, $rootScope, $http).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        }

        //function loadGrid() {
        //    BuildService.getAllBuild($scope, $rootScope, $http).then(function (res) {
        //        if (res.status === 200) {
        //            $scope.BuildList = res.data.result;
        //        }
        //    }, function (err) {

        //    });
        //}

        function removeBuild(Build) {
            //if (Build.Active === 0) {
               var id = Build.build_no;
            //    id :  Build.Build_id
            // //     //Active: Build.Active,
            // //     //ActionBy: $rootScope.loggedUserId
           //   };
            if (window.confirm("Do you really want to delte this Build")) {
                BuildService.deleteBuild($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.result) {
                        alert("Deleted Successful")
                        loadGrid();
                    } else {
                        alert("Build is gone")
                        loadGrid();
                    }
                }, function (err) {
                    alert("Error while processing! Try Again.")
                });
            }
            //} else {
            //    alert("Active Status Can't be Delete")
            //}
        }
    }

    BuildModelController.$inject = ['$scope', '$rootScope', '$http', 'items', '$uibModalInstance', 'BuildService'];
    function BuildModelController($scope, $rootScope, $http, items, $uibModalInstance, BuildService) {
        $scope.items = items;
        if (items.isEditing)
            $scope.Build = angular.copy(items.Build);
        else
            $scope.Build = null;

        $scope.saveBuild = function (Build) {
            if (items.isEditing) {
                //$scope.Build.ModifiedBy = "1";
                var id = Build.build_no;
                $scope.Build.last_entry_on = $rootScope.date;
                $scope.Build.create_date = $rootScope.date;
                BuildService.updateBuild($scope, $rootScope, $http, $scope.Build,id).then(function (res) {
                    if (res.data.result) {
                        alert("Update Successful")
                        $uibModalInstance.close();
                    } else {
                        alert("Error while updating! Try Again.")
                    }
                }, function (err) {
                    alert("Error while processing! Try Again.")
                });
            } else {
                $scope.Build.last_entry_on = $rootScope.date;
                $scope.Build.create_date = $rootScope.date;
                $scope.Build.maintain_date = $rootScope.date;
                //$scope.Build.CreatedBy = "1";
               // $scope.Build.ModifiedBy = "1";
                BuildService.addBuild($scope, $rootScope, $http, $scope.Build).then(function (res) {
                    if (res.data.result) {
                        alert("Added Successful")
                        $uibModalInstance.close();
                    } else {
                        alert("Error while saving! Try Again.")
                    }
                }, function (err) {
                    alert("Error in processing sever error 500! Try Again.")
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();