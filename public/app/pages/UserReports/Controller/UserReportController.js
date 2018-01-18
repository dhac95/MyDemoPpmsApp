
(function () {
    'use strict';

    angular
        .module('ERP.pages.UserReport')
        .controller('UserReportController', UserReportController)
        .controller('UserReportModelController', UserReportModelController);


    UserReportController.$inject = ['$scope', '$rootScope', '$http', '$filter', '$timeout', 'Excel', 'UserReportService', 'AddTaskService', '$uibModal', 'NgTableParams', 'Notification'];
    function UserReportController($scope, $rootScope, $http, $filter, $timeout, Excel, UserReportService, AddTaskService, $uibModal, NgTableParams, Notification) {

        $rootScope.title = "UserReport";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        //$scope.getTotalTime = getTotalTime;
        $scope.getTotalCount = getTotalCount;
        $scope.itemsByPage = 15;

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeUserReport = removeUserReport;
        $scope.showUserReports = showUserReports;
       

        $scope.team = {};
        $scope.build = {};
        $scope.task = {};
        $scope.subtask = {};
        $scope.date = {};
        $scope.getTeamList = getTeamList;
      
      //  loadGrid();

    


        $scope.editUserReportModel = function (UserReport) {
            $scope.items.isEditing = true;
            $scope.items.UserReport = UserReport;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/UserReports/views/UserReportModel.html',
                controller: 'UserReportModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.getTotalTime();
                        showUserReports();
            }, function () {
            });
        };

            getTeamList();

            function getTeamList() {
                var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
                promiseGet.then(function (pl) {
                     $scope.TeamList = pl.data; 
                       if ($scope.isEditing) {
                                       for (var team in $scope.TeamList) {
                                        if ($scope.TeamList[team].team_id == $scope.UserReport.team_id) {
                                           $scope.team.selected = $scope.TeamList[team];
                                          }
                    }
                 }
                    $scope.selectTask();
                },
                      function (errorPl) {
                          Notification('Some Error in Getting Records.');
                      });
            }
    
    
    
            $scope.selectTask = function() {
                  //  $scope.task.selected = {};
                    var team_id = $scope.team.selected;
                    var promiseGet = AddTaskService.getLoadedTasks($scope, $rootScope, $http ,team_id );
                    promiseGet.then(function (pl) {
                         $scope.TaskList = pl.data; 
                 if ($scope.isEditing) {
                         for (var task in $scope.TaskList) {
                            if ($scope.TaskList[task].task_id == $scope.UserReport.tasks_id) {
                                $scope.task.selected = $scope.TaskList[task];
                            }
                        }
                     }
                        $scope.selectsubTask();
                    },
                          function (errorPl) {
                              Notification('Some Error in Getting Records.');
                         });
                 };
    
            $scope.selectsubTask = function() {
                //  $scope.task.selected = {};
                  var task_id = $scope.task.selected;
                  var promiseGet = AddTaskService.getLoadedsubTasks($scope, $rootScope, $http ,task_id );
                  promiseGet.then(function (pl) {
                       $scope.subTaskList = pl.data; 
                    if ($scope.isEditing) {
                       for (var subtask in $scope.subTaskList) {
                          if ($scope.subTaskList[subtask].sub_task_id == $scope.UserReport.sub_task_id) {
                              $scope.subtask.selected = $scope.subTaskList[subtask];
                          }
                      }
                 }
                  },
                        function (errorPl) {
                            Notification('Some Error in Getting Records.');
                        });
          };

          function getTotalCount() {
            var totCount = 0;
            for (var i in $scope.ReportList) {
                totCount += $scope.ReportList[i].count;
            }

            // $scope.UserReport.TotalTime = grandTot;
            return totCount;
        }

        
        function showUserReports() {
            var Date1 = $scope.UserReport.From;
            var formatDate1 =  $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.UserReport.To;
            var formatDate2 =  $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.UserReport.task_desc;
            var task = $scope.task.selected;
            var subtask = $scope.subtask.selected;
            var obj = {
                From : formatDate1,
                To : formatDate2,
                user_id : $rootScope.user_id,
                team_id : teamID,
                tasks_id : task,
                sub_task_id : subtask,
                task_desc : taskDesc
            };
            if (formatDate1 > formatDate2) {
                    Notification({ message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>" }, 'warning');
            } 
            else {
            var promiseGet = UserReportService.getUserReports($scope, $rootScope, $http ,obj );
            promiseGet.then(function (pl) {
                 $scope.ReportList = pl.data;
                 $scope.getTotalTime(); 
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.');
                });
            }

        }

        // $scope.exportData = function () {
        //     var name = $rootScope.user_name;
        //     var blob = new Blob([document.getElementById('exportable').innerHTML], {
        //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        //     });
        //     saveAs(blob, name + " Report.xls");
        // };

        $scope.exportToExcel=function(tableId){ // ex: '#my-table'
        var name = $rootScope.user_name;
            var exportHref = Excel.tableToExcel(tableId,'sheet name');
            $timeout(function () {
            var link = document.createElement('a');
            document.body.appendChild(link);  // For Mozilla
            link.href = exportHref;
            link.download = name + ' Reports';
            link.click();
            }, 100);
       // $timeout(function(){location.href=exportHref;},100); // trigger download
    };

       // getTotalTime();
         $scope.getTotalTime =function getTotalTime() {
            var Date1 = $scope.UserReport.From;
            var formatDate1 =  $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.UserReport.To;
            var formatDate2 =  $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.UserReport.task_desc;
            var task = $scope.task.selected;
            var subtask = $scope.subtask.selected;
            var obj = {
                From : formatDate1,
                To : formatDate2,
                user_id : $rootScope.user_id,
                team_id : teamID,
                tasks_id : task,
                sub_task_id : subtask,
                task_desc : taskDesc
            };
            var promiseGet = UserReportService.getRemaingReportsTime($scope, $rootScope, $http ,obj );
            promiseGet.then(function (pl) {
                 $scope.remTime = pl.data; 
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.');
                });
        };


        function removeUserReport(UserReport) {
            //if (UserReport.Active === 0) {
               var id = UserReport.task_id;
            //    id :  UserReport.UserReport_id
            // //     //Active: UserReport.Active,
            // //     //ActionBy: $rootScope.loggedUserId
           //   };
            if (window.confirm("Do you really want to delte this UserReport")) {
                AddTaskService.deleteAddTask($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Deleted Successful");
                        $scope.getTotalTime();
                        showUserReports();
                    } else {
                        Notification.error("Try Again");
                        
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            }
            //} else {
            //    alert("Active Status Can't be Delete")
            //}
        }
    }

    UserReportModelController.$inject = ['$scope', '$rootScope', '$http', 'items', '$uibModalInstance', 'AddTaskService' , 'UserReportService'];
    function UserReportModelController($scope, $rootScope, $http, items, $uibModalInstance, AddTaskService ,UserReportService ) {
        $scope.items = items; 
        if (items.isEditing)
            $scope.UserReport = angular.copy(items.UserReport);
        else
            $scope.UserReport = null;

        $scope.saveUserReport = function (UserReport) {
            if (items.isEditing) {
                //$scope.UserReport.ModifiedBy = "1";
                var id = UserReport.task_id;
                $scope.UserReport.user_id = $rootScope.user_id;
                UserReport.team_id = $scope.team.selected;
                UserReport.tasks_id = $scope.task.selected;
                UserReport.sub_task_id = $scope.subtask.selected;
                UserReport.build = $scope.build.selected;
                //UserReport.date = $scope.date.selected;
               // $scope.UserReport.create_date = $rootScope.date;
               AddTaskService.updateAddTask($scope, $rootScope, $http, $scope.UserReport,id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Updated Successful");
                        $uibModalInstance.close();
                        // $scope.getTotalTime();
                        // showUserReports();
                    } else if(res.data.results){
                        Notification({ message: "Time must be total of 8 hours", title: "Error! Check entered time" }, 'error');
                    }
                    else {
                        Notification.error("Error occoured !! Please try again");
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            } else {
                $scope.UserReport.user_id = $rootScope.user_id;
                UserReport.team_id = $scope.team.selected;
                UserReport.tasks_id = $scope.task.selected;
                UserReport.sub_task_id = $scope.subtask.selected;
                UserReport.build = $scope.build.selected;
                
                UserReport.addUserReport($scope, $rootScope, $http, $scope.UserReport).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Added Successful");
                        $uibModalInstance.close();
                    } else if(res.data.results){
                        Notification({ message: "Time must be total of 8 hours", title: "Error! Check entered time" }, 'error');
                    }
                    else {
                        Notification("Error occoured !! Please try again");
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
                   if ($scope.isEditing) {
                                   for (var team in $scope.TeamList) {
                                    if ($scope.TeamList[team].team_id == $scope.UserReport.team_id) {
                                       $scope.team.selected = $scope.TeamList[team];
                                      }
                }
             }
                $scope.selectTask();
                $scope.selectBuild();
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.');
                  });
        }

        $scope.selectBuild = function() {
            //  $scope.task.selected = {};
              var team_id = $scope.team.selected;
              var promiseGet = AddTaskService.getLoadedBuilds($scope, $rootScope, $http ,team_id );
              promiseGet.then(function (pl) {
                   $scope.BuildList = pl.data;
                 if ($scope.isEditing) { 
                   for (var build in $scope.BuildList) {
                      if ($scope.BuildList[build].build_no == $scope.AddTask.build) {
                          $scope.build.selected = $scope.BuildList[build];
                      }
                  }
                 }
              },
                    function (errorPl) {
                        $log.error('Some Error in Getting Records.', errorPl);
                    });
      };

        $scope.selectTask = function() {
              //  $scope.task.selected = {};
                var team_id = $scope.team.selected;
                var promiseGet = AddTaskService.getLoadedTasks($scope, $rootScope, $http ,team_id );
                promiseGet.then(function (pl) {
                     $scope.TaskList = pl.data; 
             if ($scope.isEditing) {
                     for (var task in $scope.TaskList) {
                        if ($scope.TaskList[task].task_id == $scope.UserReport.tasks_id) {
                            $scope.task.selected = $scope.TaskList[task];
                        }
                    }
                 }
                    $scope.selectsubTask();
                },
                      function (errorPl) {
                          Notification('Some Error in Getting Records.');
                     });
             };

        $scope.selectsubTask = function() {
            //  $scope.task.selected = {};
              var task_id = $scope.task.selected;
              var promiseGet = AddTaskService.getLoadedsubTasks($scope, $rootScope, $http ,task_id );
              promiseGet.then(function (pl) {
                   $scope.subTaskList = pl.data; 
                if ($scope.isEditing) {
                   for (var subtask in $scope.subTaskList) {
                      if ($scope.subTaskList[subtask].sub_task_id == $scope.UserReport.sub_task_id) {
                          $scope.subtask.selected = $scope.subTaskList[subtask];
                      }
                  }
             }
              },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                    });
      };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();