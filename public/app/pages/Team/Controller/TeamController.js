
(function () {
    'use strict';

    angular
        .module('ERP.pages.Team')
        .controller('TeamController', TeamController)
        .controller('TeamModelController', TeamModelController);


    TeamController.$inject = ['$scope', '$rootScope', '$http', '$filter' , 'TeamService', '$uibModal', 'NgTableParams', 'Notification'];
    function TeamController($scope, $rootScope, $http, $filter , TeamService, $uibModal, NgTableParams, Notification) {

        $rootScope.title = "Team";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeTeam = removeTeam;
    
        loadGrid();

        $scope.addTeamModel = function () {
            $scope.items.isEditing = false;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Team/views/TeamModel.html',
                controller: 'TeamModelController',
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

        $scope.editTeamModel = function (Team) {
            $scope.items.isEditing = true;
            $scope.items.Team = Team;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Team/views/TeamModel.html',
                controller: 'TeamModelController',
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
            TeamService.getAllTeam($scope, $rootScope, $http).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        }

        //function loadGrid() {
        //    TeamService.getAllTeam($scope, $rootScope, $http).then(function (res) {
        //        if (res.status === 200) {
        //            $scope.TeamList = res.data.result;
        //        }
        //    }, function (err) {

        //    });
        //}

        function removeTeam(Team) {
            if (Team.status == 0) {
                var obj = { team_id: Team.team_id, last_modify : $filter('date')(new Date(), "yyyy-MM-dd") };
            //    id :  Team.team_id
            // //     //Active: Team.Active,
            // //     //ActionBy: $rootScope.loggedUserId
           //   };
            if (window.confirm("Do you really want to delte this Team")) {
                TeamService.deleteTeam($scope, $rootScope, $http, obj).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Deleted Successful");
                        loadGrid();
                    } else {
                        Notification.error('Error !! Try again');
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            }
            } else {
                Notification("Active Status Can't be Delete");
            }
        }
    }

    TeamModelController.$inject = ['$scope', '$rootScope', '$http', 'items', '$uibModalInstance', 'TeamService'];
    function TeamModelController($scope, $rootScope, $http, items, $uibModalInstance, TeamService) {
        $scope.items = items;
        if (items.isEditing)
            $scope.Team = angular.copy(items.Team);
        else
            $scope.Team = null;

        $scope.saveTeam = function (Team) {
            if (items.isEditing) {
                //$scope.Team.ModifiedBy = "1";
                var id = Team.team_id;
                $scope.Team.create_date = $rootScope.date;
                $scope.Team.last_modify = $rootScope.date;
                $scope.Team.maintain_date = $rootScope.date;
                TeamService.updateTeam($scope, $rootScope, $http, $scope.Team,id).then(function (res) {
                    if (res.data.code == 200) {
                        alert("Update Successful");
                        $uibModalInstance.close();
                    } else {
                        alert("Team Updated");
                        $uibModalInstance.close();
                    }
                }, function (err) {
                    alert("Error while processing! Try Again.");
                });
            } else {
                $scope.Team.last_modify = $rootScope.date;
                $scope.Team.create_date = $rootScope.date;
                $scope.Team.maintain_date = $rootScope.date;
                //$scope.Team.CreatedBy = "1";
               // $scope.Team.ModifiedBy = "1";
                TeamService.addTeam($scope, $rootScope, $http, $scope.Team).then(function (res) {
                    if (res.data.result) {
                        alert("Added Successful");
                        $uibModalInstance.close();
                    } else {
                        alert("Team Added");
                        $uibModalInstance.close();
                    }
                }, function (err) {
                    alert("Error in processing sever error 500! Try Again.");
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();