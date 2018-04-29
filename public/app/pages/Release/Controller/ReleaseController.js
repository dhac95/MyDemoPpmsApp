
(function () {
    'use strict';

    angular
        .module('ERP.pages.Release')
        .controller('ReleaseController', ReleaseController)
        .controller('ReleaseModelController', ReleaseModelController);


    ReleaseController.$inject = ['$scope', '$rootScope', '$http', 'ReleaseService', '$uibModal', 'NgTableParams', 'AddTaskService', 'Notification'];
    function ReleaseController($scope, $rootScope, $http, ReleaseService, $uibModal, NgTableParams, AddTaskService, Notification) {

        $rootScope.title = "Release";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.team = {};

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.getTeamList = getTeamList;

        $scope.removeRelease = removeRelease;

        //$scope.loadGrid();
        $scope.addReleaseModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Release/views/ReleaseModel.html',
                controller: 'ReleaseModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.loadGrid();
            }, function () {
            });
        };

        $scope.editReleaseModel = function (Release) {
            $scope.items.isEditing = true;
            $scope.items.Release = Release;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Release/views/ReleaseModel.html',
                controller: 'ReleaseModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.loadGrid();
            }, function () {
            });
        };

        // getTeamList();
        // function getTeamList() {
        //     var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
        //     promiseGet.then(function (pl) {
        //         $scope.TeamList = pl.data;
        //         if (pl.data.length > 1) {
        //             if ($scope.isEditing) {
        //                 for (var team in $scope.TeamList) {
        //                     if ($scope.TeamList[team].team_id == $scope.Release.team_id) {
        //                         $scope.team.selected = $scope.TeamList[team];
        //                         $scope.loadGrid();
        //                     }
        //                 }
        //             }
        //         }
        //         else {
        //             $scope.temp_team = $scope.TeamList[0].team_id;
        //             $scope.loadGrid();
        //         }
        //     },
        //         function (errorPl) {
        //             Notification('Some Error in Getting Records.');
        //         });
        // }


        getTeamList();
        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                $scope.TeamList = pl.data;
                if ($rootScope.team_count  > 1) {
                    if ($scope.isEditing) {
                        for (var team in $scope.TeamList) {
                            if ($scope.TeamList[team].team_id == $scope.Release.team_id) {
                                $scope.team.selected = $scope.TeamList[team];

                            }

                        }
                        $scope.loadGrid();
                    }
                    else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                        $scope.loadGrid();
                    }
                }
                else {
                    $scope.team.selected = $scope.TeamList[0].team_id;
                    $scope.loadGrid();
                }

            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }

        $scope.loadGrid = function () {
            $scope.showLoader = true;
            // if ($rootScope.team_count > 1) {
            //     var id = $scope.team.selected;
            // }
            // else {
            //     var id = $scope.temp_team;
            // }

            var id = $scope.team.selected;
            var self = this;
            ReleaseService.getAllReleasebyID($scope, $rootScope, $http, id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });
                $scope.showLoader = false;
            });

        };


        // function loadGrid() {
        //     var self = this;
        //     ReleaseService.getAllRelease($scope, $rootScope, $http).then(function (responce) {
        //         $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

        //     });

        // }

        //function loadGrid() {
        //    ReleaseService.getAllRelease($scope, $rootScope, $http).then(function (res) {
        //        if (res.status === 200) {
        //            $scope.ReleaseList = res.data.result;
        //        }
        //    }, function (err) {

        //    });
        //}

        function removeRelease(Release) {
            if (Release.release_status == 0) {
                var id = Release.s_no;
                if (window.confirm("Do you really want to delete this Release")) {
                    ReleaseService.deleteRelease($scope, $rootScope, $http, id).then(function (res) {
                        if (res.data.code === 200) {
                            Notification.success("Deleted Successful");
                            $scope.loadGrid();
                        } else {
                            Notification({ message: "Error Occurred" }, 'error');
                            // loadGrid();
                        }
                    }, function (err) {
                        Notification("Error while processing! Try Again.");
                    });
                }
            } else {
                Notification({ message: "Active Status Can't be removed", title: "The selected Release has status of active" }, 'warning');
            }
        }
    }

    ReleaseModelController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'items', '$uibModalInstance', 'ReleaseService', 'AddTaskService', 'NgTableParams', 'Notification'];
    function ReleaseModelController($scope, $rootScope, $http, $filter, items, $uibModalInstance, ReleaseService, AddTaskService, NgTableParams, Notification) {
        $scope.items = items;
        if (items.isEditing)
            $scope.Release = angular.copy(items.Release);
        else
            $scope.Release = null;

        $scope.saveRelease = function (Release) {
            if (items.isEditing) {
                var id = Release.s_no;
                $scope.Release.team_id = $scope.team.selected;

                // if ($rootScope.team_count > 1) {
                //     $scope.Release.team_id = $scope.team.selected;
                // }
                // else {
                //     $scope.Release.team_id = $scope.temp_team;
                // }

                $scope.Release.modified_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
               
                if ($scope.Release.release_status == true || $scope.Release.release_status == '1') {
                    $scope.Release.release_status = '1';
                }
                else {
                    $scope.Release.release_status = '0';
                }

                $scope.Release.modified_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                ReleaseService.updateRelease($scope, $rootScope, $http, $scope.Release, id).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Updated Successful");
                        $uibModalInstance.close();
                    } else {
                        Notification.error("Error while updating! Try Again.");
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            } else {
                // $scope.Release.last_entry_on = $rootScope.date;
                // if ($rootScope.team_count > 1) {
                //     $scope.Release.team_id = $scope.team.selected;
                // }
                // else {
                //     $scope.Release.team_id = $scope.temp_team;
                // }
                $scope.Release.team_id = $scope.team.selected;

                $scope.Release.added_by = $rootScope.user_id;

                $scope.Release.modified_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                
                if ($scope.Release.release_status == true) {
                    $scope.Release.release_status = '1';
                }
                else {
                    $scope.Release.release_status = '0';
                }
                $scope.Release.create_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                ReleaseService.addRelease($scope, $rootScope, $http, $scope.Release).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Added Successful");
                        $uibModalInstance.close();
                    } else {
                        Notification.error("Error while saving! Try Again.");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        };

        getTeamList();
        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                $scope.TeamList = pl.data;
                if ($rootScope.team_count > 1) {
                    if (items.isEditing) {
                        for (var team in $scope.TeamList) {
                            if ($scope.TeamList[team].team_id == $scope.Release.team_id) {
                                $scope.team.selected = $scope.TeamList[team].team_id;
                            }
                        }
                    }
                    else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                    }
                }
                else {
                    $scope.team.selected = $scope.TeamList[0].team_id;
                }

                $scope.loadGrid();
            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }

        $scope.loadGrid = function () {
            // if ($rootScope.team_count > 1) {
            //     var id = $scope.team.selected;
            // }
            // else {
            //     var id = $scope.temp_team;
            // }

            var id = $scope.team.selected;

            var self = this;
            ReleaseService.getAllReleasebyID($scope, $rootScope, $http, id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();