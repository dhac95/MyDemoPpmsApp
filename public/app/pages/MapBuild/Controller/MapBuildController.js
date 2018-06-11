(function () {
    'use strict';

    angular
        .module('ERP.pages.MapBuild')
        .controller('MapBuildController', MapBuildController)
        .controller('MapBuildModelController', MapBuildModelController)
        .factory('team', function () {
            return {
                selected: ''
            };
        });


    MapBuildController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'AddTaskService', 'MapBuildService', '$uibModal', 'Notification', 'NgTableParams', 'Excel', '$timeout', 'team'];

    function MapBuildController($scope, $rootScope, $http, $filter, AddTaskService, MapBuildService, $uibModal, Notification, NgTableParams, Excel, $timeout, team) {

        $rootScope.title = "MapBuild";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.itemsByPage = 15;

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeMapBuild = removeMapBuild;
        // $scope.saveMapBuild = saveMapBuild;
        // $scope.getTaskbyDate = getTaskbyDate;


        $scope.team = team;
        $scope.date = {};
        $scope.build = {};
        $scope.release = {};
        $scope.getTeamList = getTeamList;

        $scope.loadGrid = loadGrid;

        $scope.runStatus = [{
                "id": "0",
                "Name": "Partial"
            },
            {
                "id": "1",
                "Name": "Complete"
            }
        ];

        $scope.buildInfo = [{
                "id": "0",
                "Name": "Official"
            },
            {
                "id": "1",
                "Name": "Non-Official"
            }
        ];
        loadGrid();

        function loadGrid() {
            $scope.showLoader = true;
            var id = $scope.team.selected;
            var self = this;
            MapBuildService.getAllMapBuildbyID($scope, $rootScope, $http, id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, {
                    dataset: responce.data
                });
                $scope.showLoader = false;

            });

        }

        $scope.addMapBuildModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/MapBuild/views/MapBuildModel.html',
                controller: 'MapBuildModelController',
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


        $scope.editMapBuildModel = function (MapBuild) {
            $scope.items.isEditing = true;
            $scope.isEditing = true;
            $scope.items.MapBuild = MapBuild;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/MapBuild/views/MapBuildModel.html',
                controller: 'MapBuildModelController',
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

        getTeamList();

        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                    $scope.TeamList = pl.data;
                    if ($rootScope.team_count > 1) {
                        if ($scope.isEditing) {
                            for (var team in $scope.TeamList) {
                                if ($scope.TeamList[team].team_id == $scope.MapBuild.team_id) {
                                    $scope.team.selected = $scope.TeamList[team].team_id;

                                }

                            }

                            loadGrid();
                        } else {
                            $scope.team.selected = $scope.TeamList[0].team_id;

                            loadGrid();
                        }
                    } else {
                        $scope.team.selected = $scope.TeamList[0].team_id;

                        loadGrid();
                    }

                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }


        function removeMapBuild(MapBuild) {
            // if (MapBuild.run_status === 1) {
            var obj = {
                s_no: MapBuild.s_no,
                modified_by: $rootScope.user_id
            };
            if (window.confirm("Do you really want to delete this MapBuild")) {
                MapBuildService.deleteMapBuild($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code == 200) {
                        Notification("Removed successfully");
                        loadGrid();
                    } else {
                        Notification({
                            message: "Try Again"
                        }, 'error');
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            }
            // } else {
            //     alert("Active Status Can't be Deleted");
            // }
        }
    }




    MapBuildModelController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'items', '$uibModalInstance', 'Notification', 'MapBuildService', 'AddTaskService', 'team'];

    function MapBuildModelController($scope, $rootScope, $http, $filter, items, $uibModalInstance, Notification, MapBuildService, AddTaskService, team) {
        $scope.team = team;
        $scope.items = items;

        if (items.isEditing) {
            var formatDate = $filter('date')(items.MapBuild.date, "yyyy-MM-dd");
            items.MapBuild.date = new Date(formatDate);
            $scope.MapBuild = angular.copy(items.MapBuild);
        } else {
            $scope.MapBuild = null;
        }

        $scope.saveMapBuild = function (MapBuild) {
            if (items.isEditing) {

                var id = MapBuild.s_no;
                MapBuild.release_no = $scope.release.selected;

                // if ($rootScope.team_count > 1) {
                //     MapBuild.team = $scope.team.selected;
                // }
                // else {
                //     MapBuild.team = $scope.temp_team;
                // }
                MapBuild.team = $scope.team.selected;

                // MapBuild.team = $scope.team.selected;
                MapBuild.build_no = $scope.build.selected;
                MapBuild.modified_by = $rootScope.user_id;

                MapBuildService.updateMapBuild($scope, $rootScope, $http, $scope.MapBuild, id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Updated successfully");
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

                // if ($rootScope.team_count > 1) {
                //     MapBuild.team = $scope.team.selected;
                // }
                // else {
                //     MapBuild.team = $scope.temp_team;
                // }

                MapBuild.team = $scope.team.selected;

                MapBuild.release_no = $scope.release.selected;
                MapBuild.build_no = $scope.build.selected;
                MapBuild.modified_by = $rootScope.user_id;
                MapBuild.created_by = $rootScope.user_id;
                MapBuild.create_date = $filter('date')(new Date(), "yyyy-MM-dd");

                MapBuildService.addMapBuild($scope, $rootScope, $http, $scope.MapBuild).then(function (res) {
                    if (res.data.code == 200) {
                        Notification("Added Successful");
                        $uibModalInstance.close();
                    } else if(res.data.code == 401) {
                          Notification.warning("Build Already mapped");
                    }
                    
                    else {
                        Notification.error("Error occoured !! Please try again");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        };


        // getTeamList();
        // function getTeamList() {
        //     var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
        //     promiseGet.then(function (pl) {
        //         $scope.TeamList = pl.data;
        //         if ($rootScope.team_count > 1) {
        //             if (items.isEditing) {
        //                 for (var team in $scope.TeamList) {
        //                     if ($scope.TeamList[team].team_id == $scope.MapBuild.team) {
        //                         $scope.team.selected = $scope.TeamList[team];
        //                     }
        //                 }
        //             }
        //             else {
        //                 $scope.team.selected = $scope.TeamList[0].team_id;
        //             }
        //         }
        //         else {
        //             $scope.team.selected = $scope.TeamList[0].team_id;
        //         }
        //         $scope.selectBuild();
        //         $scope.selectRelease();
        //     },
        //         function (errorPl) {
        //             Notification('Some Error in Getting Records.');
        //         });
        // }

        getTeamList();

        function getTeamList() {
            $scope.storedTeamValue = $scope.team.selected;
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                    $scope.TeamList = pl.data;
                    if ($rootScope.team_count > 1) {
                        if (items.isEditing) {
                            for (var team in $scope.TeamList) {
                                if ($scope.TeamList[team].team_id == $scope.MapBuild.team_id) {
                                    $scope.team.selected = $scope.TeamList[team].team_id;
                                }
                            }
                        } else {
                            $scope.team.selected = $scope.storedTeamValue;
                        }
                    } else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                    }
                    $scope.selectBuild();
                    $scope.selectRelease();

                },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }

        $scope.selectBuild = function () {
            var id = $scope.team.selected;
            // if ($rootScope.team_count > 1) {
            //     id = $scope.team.selected;
            // }
            // else {
            //     id = $scope.temp_team;
            // }
            var promiseGet = AddTaskService.getLoadedBuilds($scope, $rootScope, $http, id);
            promiseGet.then(function (pl) {
                    $scope.BuildList = pl.data;
                    if (items.isEditing) {
                        for (var build in $scope.BuildList) {
                            if ($scope.BuildList[build].build_no == $scope.MapBuild.build_no) {
                                $scope.build.selected = $scope.BuildList[build].build_no;
                            }
                        }
                    }
                },
                function (errorPl) {
                    Notification({
                        message: 'Some Error in Getting Records.'
                    }, 'error');
                });
        };

        $scope.selectRelease = function () {
            var id = $scope.team.selected;

            // if ($rootScope.team_count > 1) {
            //     id = $scope.team.selected;
            // }
            // else {
            //     id = $scope.temp_team;
            // }

            var promiseGet = MapBuildService.getReleaseById($scope, $rootScope, $http, id);
            promiseGet.then(function (pl) {
                    $scope.ReleaseList = pl.data;
                    if (items.isEditing) {
                        for (var release in $scope.ReleaseList) {
                            if ($scope.ReleaseList[release].s_no == $scope.MapBuild.release_no) {
                                $scope.release.selected = $scope.ReleaseList[release].s_no;
                            }
                        }
                    }
                },
                function (errorPl) {
                    Notification({
                        message: 'Some Error in Getting Records.'
                    }, 'error');
                });
        };

        $scope.runStatus = [{
                "id": "0",
                "Name": "Partial"
            },
            {
                "id": "1",
                "Name": "Complete"
            }
        ];

        $scope.buildInfo = [{
                "id": "0",
                "Name": "Official"
            },
            {
                "id": "1",
                "Name": "Non-Official"
            }
        ];

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();