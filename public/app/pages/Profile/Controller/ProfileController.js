(function () {
    'use strict';

    angular
        .module('ERP.pages.Profile')
        .controller('ProfileController', ProfileController)
        .controller('ProfileModelController', ProfileModelController);


    ProfileController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'ProfileService', 'AddTaskService', '$uibModal', 'Notification', 'NgTableParams'];

    function ProfileController($scope, $rootScope, $http, $filter, ProfileService, AddTaskService, $uibModal, Notification, NgTableParams) {

        $rootScope.title = "Profile";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.Profile = {};

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;
        //$scope.loadGrid = loadGrid;

        loadGrid();

        $scope.addProfileModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Profile/views/ProfileModel.html',
                controller: 'ProfileModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function () {
                loadGrid();
            }, function () {});
        };


        $scope.editProfileModel = function (Profile) {
            $scope.items.isEditing = true;
            $scope.items.Profile = Profile;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Profile/views/ProfileModel.html',
                controller: 'ProfileModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                loadGrid();
            }, function () {});
        };

        function loadGrid() {
            var id = $rootScope.user_id;
            var self = this;
            ProfileService.getAllProfilebyID($scope, $rootScope, $http, id).then(function (responce) {
                $scope.ProfileList = responce.data;
                $scope.tableParams = new NgTableParams({}, {
                    dataset: responce.data
                });

            });

        }

    }



    ProfileModelController.$inject = ['$scope', '$rootScope', '$http', '$filter', '$cookieStore', 'items', '$uibModalInstance', 'Notification', 'ProfileService'];

    function ProfileModelController($scope, $rootScope, $http, $filter, $cookieStore, items, $uibModalInstance, Notification, ProfileService) {

        $scope.items = items;

        if (items.isEditing)
            $scope.Profile = angular.copy(items.Profile);
        else
            $scope.Profile = null;

        $scope.saveProfile = function (Profile) {
            if (items.isEditing) {
                var id = $rootScope.user_id;
                $rootScope.first_name = $scope.Profile.first_name;
                sessionStorage.setItem('first_name', $scope.Profile.first_name);
                $rootScope.last_name = $scope.Profile.last_name;
                sessionStorage.setItem('last_name', $scope.Profile.last_name);
                if ($scope.Profile.pic == undefined) {
                    sessionStorage.setItem('below_on', "null");
                    $rootScope.below_on = "null";
                } else {
                    sessionStorage.setItem('below_on', $scope.Profile.pic);
                    $rootScope.below_on = $scope.Profile.pic;
                }

                ProfileService.updateProfile($scope, $rootScope, $http, $scope.Profile, id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Profile Updated");
                        $uibModalInstance.close();
                    } else {
                        Notification({
                            message: "Error occoured !! Please try again"
                        }, 'error');
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            } else {

                if (Profile.new !== Profile.conf) {
                    Notification("Passwords doesnt match! please verify ", 'warning');
                } else {
                    Profile.user_id = $rootScope.user_id;

                    ProfileService.ChangePassword($scope, $rootScope, $http, Profile).then(function (res) {
                        if (res.data.code == 200) {
                            Notification.success("Password Updated Successfully");
                            $uibModalInstance.close();
                        } else if (res.data.code == 400) {
                            Notification("Password is wrong!! verify the old password", 'error');
                        } else {
                            Notification("Error occoured !! Please try again");
                        }
                    }, function (err) {
                        Notification.error("Error in processing sever error 500! Try Again.");
                    });
                }
            }
        };




        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }




})();