
(function () {
    'use strict';

    angular
        .module('ERP.pages.Build')
        .controller('BuildController', BuildController)
        .controller('BuildModelController', BuildModelController);


    BuildController.$inject = ['$scope', '$rootScope', '$http', 'BuildService', '$uibModal', 'NgTableParams','Notification' , 'AddTaskService'];
    function BuildController($scope, $rootScope, $http, BuildService, $uibModal, NgTableParams, Notification , AddTaskService) {

        $rootScope.title = "Build";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.temp_team = {};
        $scope.team = {};
        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeBuild = removeBuild;
        $scope.getTeamList = getTeamList;
    
        //loadGrid();

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
                $scope.loadGrid();
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
                $scope.loadGrid();
            }, function () {
            });
        };

        getTeamList();
        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
            promiseGet.then(function (pl) {
                 $scope.TeamList = pl.data; 
                if(pl.data.length > 1) {
                   if ($scope.isEditing) { 
                                   for (var team in $scope.TeamList) {
                                    if ($scope.TeamList[team].team_id == $scope.Build.team_id) {
                                       $scope.team.selected = $scope.TeamList[team];
                                        $scope.loadGrid();
                                 }
                            }
                         }
                        }
                else {
                    $scope.temp_team = $scope.TeamList[0].team_id;
                    $scope.loadGrid();
                }
                    
                
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.');
                  });
        }

        $scope.loadGrid = function() {
            if($rootScope.team_count > 1) {
                var id = $scope.team.selected;
            }
            else {
                  var id =  $scope.temp_team;
            }
            var self = this;
            BuildService.getAllBuildbyID($scope, $rootScope, $http , id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        };

        function removeBuild(Build) {
            if (Build.build_status === 0) {
               var id = Build.build_no;
            if (window.confirm("Do you really want to delte this Build")) {
                BuildService.deleteBuild($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.code === 200) {
                        Notification.success("Deleted Successful");
                        $scope.loadGrid();
                    } else {
                        Notification({message :"Error Occurred"} , 'error');
                        // loadGrid();
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            }
            } else {
                Notification({message : "Active Status Can't be removed" , title : "The selected build has status of active"} , 'warning');
            }
        }
    }

    BuildModelController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'items', '$uibModalInstance', 'BuildService', 'AddTaskService', 'NgTableParams', 'Notification' ];
    function BuildModelController($scope, $rootScope, $http, $filter, items, $uibModalInstance, BuildService, AddTaskService, NgTableParams, Notification) {
        $scope.items = items;
        if (items.isEditing)
            $scope.Build = angular.copy(items.Build);
        else
            $scope.Build = null;

        $scope.saveBuild = function (Build) {
            if (items.isEditing) {
                var id = Build.build_no;
                if($rootScope.team_count > 1) {
                    $scope.Build.team_id = $scope.team.selected;
                }
                else {
                    $scope.Build.team_id =  $scope.temp_team;
                } 
                $scope.Build.modified_by = $rootScope.user_id;
               
                $scope.Build.modified_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                if($scope.Build.build_status == true)
                {
                    $scope.Build.build_status = 1;
                }
                else {
                    $scope.Build.build_status = 0;
                }
                $scope.Build.modified_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                BuildService.updateBuild($scope, $rootScope, $http, $scope.Build,id).then(function (res) {
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
                // $scope.Build.last_entry_on = $rootScope.date;
                if($rootScope.team_count > 1) {
                    $scope.Build.team_id = $scope.team.selected;
                }
                else {
                    $scope.Build.team_id =  $scope.temp_team;
                } 
                $scope.Build.added_by = $rootScope.user_id;
               
                $scope.Build.modified_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                if($scope.Build.build_status == true)
                {
                    $scope.Build.build_status = 1;
                }
                else {
                    $scope.Build.build_status = 0;
                }
                $scope.Build.create_date = $filter('date')($rootScope.date, "yyyy-MM-dd");
                BuildService.addBuild($scope, $rootScope, $http, $scope.Build).then(function (res) {
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
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
            promiseGet.then(function (pl) {
                 $scope.TeamList = pl.data; 
                if(pl.data.length > 1) {
                   if ($scope.isEditing) { 
                                   for (var team in $scope.TeamList) {
                                    if ($scope.TeamList[team].team_id == $scope.Build.team_id) {
                                       $scope.team.selected = $scope.TeamList[team];
                                 }
                            }
                         }
                        }
                else {
                    $scope.temp_team = $scope.TeamList[0].team_id;
                }
                    
                $scope.loadGrid();
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.');
                  });
        }

        $scope.loadGrid = function() {
            if($rootScope.team_count > 1) {
                var id = $scope.team.selected;
            }
            else {
                  var id =  $scope.temp_team;
            }
            var self = this;
            BuildService.getAllBuildbyID($scope, $rootScope, $http , id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();