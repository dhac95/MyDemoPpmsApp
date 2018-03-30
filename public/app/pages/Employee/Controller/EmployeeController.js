
(function () {
    'use strict';

    angular
        .module('ERP.pages.Employee')
        .controller('EmployeeController', EmployeeController)
        .controller('EmployeeModelController', EmployeeModelController);


    EmployeeController.$inject = ['$scope', '$rootScope', '$http', 'EmployeeService', '$uibModal', 'NgTableParams'];
    function EmployeeController($scope, $rootScope, $http, EmployeeService, $uibModal, NgTableParams) {

        $rootScope.title = "Employee";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeEmployee = removeEmployee;
    
        loadGrid();

        $scope.addEmployeeModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Employee/views/EmployeeModel.html',
                controller: 'EmployeeModelController',
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

        $scope.editEmployeeModel = function (Employee) {
            $scope.items.isEditing = true;
            $scope.items.Employee = Employee;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Employee/views/EmployeeModel.html',
                controller: 'EmployeeModelController',
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
            EmployeeService.getAllEmployee($scope, $rootScope, $http).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        }

        //function loadGrid() {
        //    EmployeeService.getAllEmployee($scope, $rootScope, $http).then(function (res) {
        //        if (res.status === 200) {
        //            $scope.EmployeeList = res.data.result;
        //        }
        //    }, function (err) {

        //    });
        //}

        function removeEmployee(Employee) {
            //if (Employee.Active === 0) {
               var id = Employee.Employee_id;
            //    id :  Employee.Employee_id
            // //     //Active: Employee.Active,
            // //     //ActionBy: $rootScope.loggedUserId
           //   };
            if (window.confirm("Do you really want to delete this Employee")) {
                EmployeeService.deleteEmployee($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.result) {
                        alert("Deleted Successful")
                        loadGrid();
                    } else {
                        alert("Employee is gone")
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

    EmployeeModelController.$inject = ['$scope', '$rootScope', '$http', 'items', '$uibModalInstance', 'EmployeeService'];
    function EmployeeModelController($scope, $rootScope, $http, items, $uibModalInstance, EmployeeService) {
        $scope.items = items;
        if (items.isEditing)
            $scope.Employee = angular.copy(items.Employee);
        else
            $scope.Employee = null;

        $scope.saveEmployee = function (Employee) {
            if (items.isEditing) {
                //$scope.Employee.ModifiedBy = "1";
                var id = Employee.user_id;
                $scope.Employee.last_entry_on = $rootScope.date;
                $scope.Employee.create_date = $rootScope.date;
                EmployeeService.updateEmployee($scope, $rootScope, $http, $scope.Employee,id).then(function (res) {
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
                $scope.Employee.last_entry_on = $rootScope.date;
                $scope.Employee.create_date = $rootScope.date;
                $scope.Employee.maintain_date = $rootScope.date;
                //$scope.Employee.CreatedBy = "1";
               // $scope.Employee.ModifiedBy = "1";
                EmployeeService.addEmployee($scope, $rootScope, $http, $scope.Employee).then(function (res) {
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