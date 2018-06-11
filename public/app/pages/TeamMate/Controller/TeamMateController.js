(function () {
    'use strict';

    angular
        .module('ERP.pages.TeamMate')
        .controller('TeamMateController', TeamMateController)
        .controller('TeamMateModelController', TeamMateModelController);


    TeamMateController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'TeamMateService', 'AddTaskService', '$uibModal', 'Notification', 'NgTableParams'];

    function TeamMateController($scope, $rootScope, $http, $filter, TeamMateService, AddTaskService, $uibModal, Notification, NgTableParams) {

        $rootScope.title = "TeamMate";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        $scope.Type = {};
        $scope.activeUsers = false;
        $scope.promoteTeamMate = promoteTeamMate;

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeTeamMate = removeTeamMate;
        // $scope.getTypeList = getTypeList;


        $scope.team = {};
        $scope.getTeamList = getTeamList;

        $scope.UserTypes = [{
                "id": 1,
                "Name": "DA"
            },
            {
                "id": 2,
                "Name": "SDA"
            },
            {
                "id": 3,
                "Name": "Manager"
            },
            {
                "id": 4,
                "Name": "Admin"
            }
        ];


        $scope.editTeamMateModel = function (TeamMate) {
            $scope.items.isEditing = true;
            $scope.items.TeamMate = TeamMate;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/TeamMate/views/TeamMateModel.html',
                controller: 'TeamMateModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.loadGrid();
            }, function () {});
        };

        // function loadGrid() {
        //     var self = this;
        //     TeamMateService.getAddedTask($scope, $rootScope, $http, $scope.TeamMate).then(function (responce) {
        //         $scope.tableParams = new NgTableParams({}, { 
        //             dataset: responce.data 
        //         });
        //     });
        // }


        getTeamList();

        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                    $scope.TeamList = pl.data;
                    if (pl.data.length > 1) {
                        if ($scope.isEditing) {
                            for (var team in $scope.TeamList) {
                                if ($scope.TeamList[team].team_id == $scope.TeamMate.team_id) {
                                    $scope.team.selected = $scope.TeamList[team];

                                }

                            }
                            $scope.loadGrid();
                        } else {
                            $scope.team.selected = $scope.TeamList[0].team_id;
                            $scope.loadGrid();
                        }
                    } else {
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
            if ($rootScope.team_count > 1) {
                var obj = {
                    team_id: $scope.team.selected,
                };
            } else {
                var obj = {
                    team_id: $scope.team.selected,
                };
            }
            var self = this;
            TeamMateService.getAllTeamMatebyID($scope, $rootScope, $http, obj).then(function (responce) {

                $scope.activeUsers = true;
                var myData = [];
                for (var i in responce.data) {
                    myData.push(responce.data[i].result[0]);
                }
                //   $scope.TeamMateList = $filter('orderBy')(myData);
                $scope.TeamMateList = myData;

                $scope.tableParams = new NgTableParams({}, {
                    dataset: $scope.TeamMateList
                });
                $scope.showLoader = false;

            });

        };

        function promoteTeamMate(TeamMate) {
            var obj = {
                user_id: TeamMate.user_id,
                user_type: $scope.Type.selected,
                Modify: $rootScope.user_name,
            };

            if (window.confirm("Do you want give this user the level " + $scope.Type.selected + " access")) {
                TeamMateService.promoteTeamMate($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("User have been granded with the level " + $scope.Type.selected + " access");
                        $scope.loadGrid();
                    } else {
                        Notification({
                            message: "Try Again"
                        }, 'error');

                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            }

        }

        function removeTeamMate(TeamMate) {
            if ($rootScope.team_count > 1) {
                var obj = {
                    team_id: $scope.team.selected,
                    user_id: TeamMate.user_id,
                    Modify: $rootScope.user_name,
                };
            } else {
                var obj = {
                    team_id: $scope.team.selected,
                    user_id: TeamMate.user_id,
                    Modify: $rootScope.user_name,
                };
            }
            if (window.confirm("Do you want to remove this user from your team ? \n ***Note*** : If you want to permantly remove this user from team after removing from here go to Approve User and remove the request ")) {
                TeamMateService.deleteTeamMate($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("User removed from team, and user can\'t request your team again");
                        $scope.loadGrid();
                    } else {
                        Notification({
                            message: "Try Again"
                        }, 'error');

                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            }
        }
    }


    TeamMateModelController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'items', '$uibModalInstance', 'Notification', 'TeamMateService'];

    function TeamMateModelController($scope, $rootScope, $http, $filter, items, $uibModalInstance, Notification, TeamMateService) {

        $scope.items = items;

        if (items.isEditing)
            $scope.TeamMate = angular.copy(items.TeamMate);
        else
            $scope.TeamMate = null;

        $scope.saveTeamMate = function (TeamMate) {
            if (items.isEditing) {
                TeamMate.modify = $rootScope.user_id;
                if ($rootScope.user_type != 4) {
                    if (TeamMate.user_type == 4 || TeamMate.user_type == 3) {
                        Notification.error("Only Admin can give Admin or Manager level Access")
                    } else {
                        TeamMateService.updateTeamMate($scope, $rootScope, $http, $scope.TeamMate).then(function (res) {
                            if (res.data.code == 200) {
                                Notification.success("User Detail Changed");
                                $uibModalInstance.close();
                            } else {
                                Notification({
                                    message: "Error occoured !! Please try again"
                                }, 'error');
                            }
                        }, function (err) {
                            Notification("Error while processing! Try Again.");
                        });
                    }
                } else {
                    TeamMateService.updateTeamMate($scope, $rootScope, $http, $scope.TeamMate).then(function (res) {
                        if (res.data.code == 200) {
                            Notification.success("User Detail Changed");
                            $uibModalInstance.close();
                        } else {
                            Notification({
                                message: "Error occoured !! Please try again"
                            }, 'error');
                        }
                    }, function (err) {
                        Notification("Error while processing! Try Again.");
                    });
                }
            } else {

                TeamMateService.addTeamMate($scope, $rootScope, $http, $scope.TeamMate).then(function (res) {
                    if (res.data.code == 200) {
                        alert("Added Successful");
                        $uibModalInstance.close();
                    } else if (res.data.results) {
                        alert("Error occoured !! Check the entered time");
                    } else {
                        alert("Error occoured !! Please try again");
                    }
                }, function (err) {
                    alert("Error in processing sever error 500! Try Again.");
                });
            }
        };

        $scope.UserTypes = [{
                "id": 1,
                "Name": "DA"
            },
            {
                "id": 2,
                "Name": "SDA"
            },
            {
                "id": 3,
                "Name": "Manager"
            },
            {
                "id": 4,
                "Name": "Admin"
            }
        ];

        // changeTypes();
        // function changeTypes() {

        // }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();