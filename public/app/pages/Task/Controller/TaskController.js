(function () {
    'use strict';

    angular
        .module('ERP.pages.uTask')
        .controller('uTaskController', uTaskController)
        .controller('uTaskModelController', uTaskModelController);


    uTaskController.$inject = ['$scope', '$rootScope', '$http', 'uTaskService', '$uibModal', 'NgTableParams'];
    function uTaskController($scope, $rootScope, $http, uTaskService, $uibModal, NgTableParams) {

        $rootScope.title = "uTask";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeuTask = removeuTask;

        loadGrid();
  
        function loadGrid() {
            var self = this;
            uTaskService.getAlluTaskbyID($scope, $rootScope, $http , $rootScope.user_id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });
        }


        $scope.adduTaskModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Task/views/TaskModel.html',
                controller: 'uTaskModelController',
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

        $scope.edituTaskModel = function (uTask) {
            $scope.items.isEditing = true;
            $scope.items.uTask = uTask;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/uTask/views/uTaskModel.html',
                controller: 'uTaskModelController',
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



        function removeuTask(uTask) {
            //if (uTask.Active === 0) {
                var removeuTask = {
                    TID: uTask.TID,
                 //   Active: uTask.Active,
                 //   ActionBy: $rootScope.loggedUserId
                }
                if (window.confirm("Do you really want to delte this uTask")) {
                    uTaskService.deleteuTask($scope, $rootScope, $http, removeuTask).then(function (res) {
                        if (res.data.result) {
                            alert("Deleted Successful");
                            loadGrid();
                        } else {
                            alert("Error! Try Again.");
                        }
                    }, function (err) {
                        alert("Error! Try Again.");
                    });
                }
        } 
    //else {
    //            alert("Active Status Can't be Delete")
    //        }
        //}
    }

    uTaskModelController.$inject = ['$scope', '$rootScope', '$http', 'items', '$uibModalInstance', 'uTaskService'];
    function uTaskModelController($scope, $rootScope, $http, items, $uibModalInstance, uTaskService) {
        $scope.items = items;
        if (items.isEditing)
            $scope.uTask = angular.copy(items.uTask);
        else
            $scope.uTask = null;

        $scope.saveuTask = function (uTask) {
            if (items.isEditing) {
                $scope.uTask.ModifiedBy = "15";
                uTaskService.updateuTask($scope, $rootScope, $http, $scope.uTask).then(function (res) {
                    if (res.data.result) {
                        alert("Update Successful");
                        $uibModalInstance.close();
                    } else {
                        alert("Error! Try Again.");
                    }
                }, function (err) {
                    alert("Error! Try Again.");
                });
            } else {
                $scope.uTask.CreatedBy = "12";
                uTaskService.adduTask($scope, $rootScope, $http, $scope.uTask).then(function (res) {
                    if (res.data.result) {
                        alert("Added Successful");
                        $uibModalInstance.close();
                    } else {
                        alert("Error! Try Again.");
                    }
                }, function (err) {
                    alert("Error! Try Again.");
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();