
(function () {
    'use strict';

    angular
        .module('ERP.pages.Approve')
        .controller('ApproveController', ApproveController)
        .controller('ApproveModelController', ApproveModelController);


    ApproveController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'ApproveService','AddTaskService' ,'$uibModal','NgTableParams'];
    function ApproveController($scope, $rootScope, $http, $filter, ApproveService, AddTaskService,$uibModal, NgTableParams) {

        $rootScope.title = "Approve";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeApprove = removeApprove;
       

        $scope.team = {};
        $scope.getTeamList = getTeamList;
      

        $scope.editApproveModel = function (Approve) {
            $scope.items.isEditing = true;
            $scope.items.Approve = Approve;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/Approve/views/ApproveModel.html',
                controller: 'ApproveModelController',
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

        // function loadGrid() {
        //     var self = this;
        //     ApproveService.getAddedTask($scope, $rootScope, $http, $scope.Approve).then(function (responce) {
        //         $scope.tableParams = new NgTableParams({}, { 
        //             dataset: responce.data 
        //         });
        //     });
        // }

        
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
                    alert('Some Error in Getting Records.', errorPl);
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
            ApproveService.getRegisteredUsers($scope, $rootScope, $http , id).then(function (responce) {
                $scope.tableParams = new NgTableParams({}, { dataset: responce.data });

            });

        };

        function removeApprove(Approve) {
        
               var id = Approve.s_no;
            if (window.confirm("Do you really want to delete this Request !!! this action can't be undone")) {
                ApproveService.deleteApprove($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.code == 200) {
                        alert("Request Denied");
                        $scope.loadGrid();
                    } else {
                        alert("Try Again");
                        
                    }
                }, function (err) {
                    alert("Error while processing! Try Again.");
                });
            }
        }
    }

       
    ApproveModelController.$inject = ['$scope', '$rootScope', '$http','$filter' ,'items', '$uibModalInstance', 'ApproveService'];
    function ApproveModelController($scope, $rootScope, $http,$filter ,items, $uibModalInstance, ApproveService) {

        $scope.items = items;
     
        if (items.isEditing)
            $scope.Approve = angular.copy(items.Approve);
        else
            $scope.Approve = null;

        $scope.saveApprove = function (Approve) {
            if (items.isEditing) {
                
                // Approve.user_id = $scope.Approve.user_id;
                // Approve.team_id = $scope.team.selected;
                Approve.modify = $rootScope.user_id;

                ApproveService.updateApprove($scope, $rootScope, $http, $scope.Approve).then(function (res) {
                    if (res.data.code == 200) {
                        alert("Request Approved");
                        $uibModalInstance.close();
                    } 
                    else {
                        alert("Error occoured !! Please try again");
                    }
                }, function (err) {
                    alert("Error while processing! Try Again.");
                });
            } else {

                ApproveService.addApprove($scope, $rootScope, $http, $scope.Approve).then(function (res) {
                    if (res.data.code == 200) {
                        alert("Added Successful");
                        $uibModalInstance.close();
                    } else if(res.data.results){
                        alert("Error occoured !! Check the entered time");
                    }
                    else {
                        alert("Error occoured !! Please try again");
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