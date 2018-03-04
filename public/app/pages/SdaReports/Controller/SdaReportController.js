
(function () {
    'use strict';

    angular
        .module('ERP.pages.SdaReport')
        .controller('SdaReportController', SdaReportController)
        .controller('SdaReportModelController', SdaReportModelController);


    SdaReportController.$inject = ['$scope', '$rootScope', '$http', '$filter', 'Excel', '$timeout', 'SdaReportService', 'AddTaskService', '$uibModal', 'NgTableParams', 'Notification'];
    function SdaReportController($scope, $rootScope, $http, $filter, Excel, $timeout, SdaReportService, AddTaskService, $uibModal, NgTableParams, Notification) {

        $rootScope.title = "SdaReport";
        $rootScope.isLoginPage = false;
        $scope.noOfRows = "10";
        $scope.items = {};
        //$scope.getTotalTime = getTotalTime;
        $scope.getTotalCount = getTotalCount;
        $scope.itemsByPage = 15;

        $scope.isEditing = false;
        $scope.items.isEditing = $scope.isEditing;

        $scope.removeSdaReport = removeSdaReport;
        $scope.showSdaReports = showSdaReports;
        $scope.showProductivity = showProductivity;
        $scope.showProductivityByUser = showProductivityByUser;
        $scope.showProductivityByTask = showProductivityByTask;
        $scope.showProductivityBySubTask = showProductivityBySubTask;
       

        $scope.team = {};
        $scope.build = {};
        $scope.task = {};
        $scope.subtask = {};
        $scope.date = {};
        $scope.user = {};
        $scope.getTeamList = getTeamList;
        $scope.isProd = false;
        $scope.hideProd = false;
        $scope.isTask = false;
        $scope.isSubTask = false;
        $scope.isUser = false;
      
      //  loadGrid();

        $scope.editSdaReportModel = function (SdaReport) {
            $scope.items.isEditing = true;
            $scope.items.SdaReport = SdaReport;
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/pages/SdaReports/views/SdaReportModel.html',
                controller: 'SdaReportModelController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.getTotalTime();
                showSdaReports();
            }, function () {
            });
        };

        $scope.LeaveTypes = [
            { "id": 0, "Name": "Not a Leave" },
            { "id": 1, "Name": "Manager Approved" },
            { "id": 2, "Name": "Manager Not Approved" },
            { "id": 3, "Name": "Unexpected" }
        ];

            // getTeamList();

            // function getTeamList() {
            //     var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
            //     promiseGet.then(function (pl) {
            //          $scope.TeamList = pl.data; 
            //            if ($scope.isEditing) {
            //                            for (var team in $scope.TeamList) {
            //                             if ($scope.TeamList[team].team_id == $scope.SdaReport.team_id) {
            //                                $scope.team.selected = $scope.TeamList[team];
            //                               }
            //         }
            //      }
            //         $scope.selectTask();
            //         $scope.selectUsers();
            //     },
            //           function (errorPl) {
            //               Notification('Some Error in Getting Records.');
            //           });
            // }
        //$scope.SdaReport.To = new Date();
        getTeamList();
        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http, $rootScope.user_id);
            promiseGet.then(function (pl) {
                $scope.TeamList = pl.data;
                if (pl.data.length > 1) {
                    if ($scope.isEditing) {
                        for (var team in $scope.TeamList) {
                            if ($scope.TeamList[team].team_id == $scope.SdaReport.team_id) {
                                $scope.team.selected = $scope.TeamList[team];

                            }

                        }
                        $scope.selectTask();
                        $scope.selectUsers();
                    }
                    else {
                        $scope.team.selected = $scope.TeamList[0].team_id;
                        $scope.selectTask();
                        $scope.selectUsers();
                    }
                }
                else {
                    $scope.team.selected = $scope.TeamList[0].team_id;
                    $scope.selectTask();
                    $scope.selectUsers();
                }

            },
                function (errorPl) {
                    Notification('Some Error in Getting Records.');
                });
        }


            $scope.selectUsers = function() {
                //  $scope.task.selected = {};
                  var team_id = $scope.team.selected;
                  var promiseGet = SdaReportService.getLoadedUsers($scope, $rootScope, $http ,team_id );
                  promiseGet.then(function (pl) {
                       $scope.UserList = pl.data; 
               if ($scope.isEditing) {
                       for (var user in $scope.UserList) {
                          if ($scope.UserList[user].user_id == $scope.SdaReport.user_id) {
                              $scope.user.selected = $scope.UserList[user];
                          }
                      }
                   }
    
                  },
                        function (errorPl) {
                            Notification('Some Error in Getting Records.');
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
                            if ($scope.TaskList[task].task_id == $scope.SdaReport.tasks_id) {
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
                          if ($scope.subTaskList[subtask].sub_task_id == $scope.SdaReport.sub_task_id) {
                              $scope.subtask.selected = $scope.subTaskList[subtask];
                          }
                      }
                 }
                  },
                        function (errorPl) {
                            Notification('Some Error in Getting Records.');
                        });
          };

          $scope.exportToExcel=function(tableId){ // ex: '#my-table'
          for (var i in $scope.UserList) {
              if( $scope.UserList[i].user_id == $scope.user.selected)
              {
                    var uname =  $scope.UserList[i].user_name;
              }
          }
          for(var j in $scope.TeamList) {
              if ($scope.TeamList[j].team_id == $scope.team.selected) {
                  var tname = $scope.TeamList[j].team_name;
              }
          }
          if(uname == undefined) {
              uname="All Team Members";
          }
              var name = "Reports For " + uname + " in Team " + tname +" From " + $filter('date')($scope.SdaReport.From, "dd-MM-yyyy") + " To " + $filter('date')($scope.SdaReport.To, "dd-MM-yyyy") ;
          var exportHref=Excel.tableToExcel(tableId,'User Data');
              $timeout(function () {
                  var link = document.createElement('a');
              document.body.appendChild(link);  // For Mozilla
                  link.href = exportHref;
            
                  link.download = name + '.xls';
                  link.click();
              }, 100);
          //$timeout(function(){location.href=exportHref;},100); // trigger download
      };

          function getTotalCount() {
            var totCount = 0;
            for (var i in $scope.ReportList) {
                totCount += $scope.ReportList[i].count;
            }

            // $scope.SdaReport.TotalTime = grandTot;
            return totCount;
        }

        function showProductivity() {
            var Date1 = $scope.SdaReport.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.SdaReport.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.SdaReport.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
            var userOtTasks = $scope.SdaReport.Ot;
            $scope.isProd = true;
            $scope.hideProd = true;

            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: user,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc,
                user_ot: userOtTasks

            };
            if (formatDate1 > formatDate2) {
                Notification({ message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>" }, 'warning');
            }
            else {
                var promiseGet = SdaReportService.getProductiviy($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                    $scope.ProdList = pl.data;
                },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                    });
            }
        }

        function showProductivityByUser() {
            var Date1 = $scope.SdaReport.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.SdaReport.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.SdaReport.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
            var userOtTasks = $scope.SdaReport.Ot;
            $scope.isProd = true;
            $scope.isUser = true;
            $scope.isTask = false;
            $scope.isSubTask = false;
            $scope.hideProd = false;

            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: user,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc,
                user_ot: userOtTasks

            };
            if (formatDate1 > formatDate2) {
                Notification({ message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>" }, 'warning');
            }
            else {
                var promiseGet = SdaReportService.getProductiviyByUser($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                    $scope.ProdList = "";
                    $scope.ProdList = pl.data;
                },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                    });
            }
        }

        function showProductivityByTask() {
            var Date1 = $scope.SdaReport.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.SdaReport.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.SdaReport.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
            var userOtTasks = $scope.SdaReport.Ot;
            $scope.isProd = true;
            $scope.isUser = false;
            $scope.isTask = true;
            $scope.isSubTask = false;
            $scope.hideProd = false;

            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: user,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc,
                user_ot: userOtTasks

            };
            if (formatDate1 > formatDate2) {
                Notification({ message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>" }, 'warning');
            }
            else {
                var promiseGet = SdaReportService.getProductiviyByTask($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                    $scope.ProdList = "";
                    $scope.ProdList = pl.data;
                },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                    });
            }
        }

        function showProductivityBySubTask() {
            var Date1 = $scope.SdaReport.From;
            var formatDate1 = $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.SdaReport.To;
            var formatDate2 = $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.SdaReport.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
            var userOtTasks = $scope.SdaReport.Ot;
            $scope.isProd = true;
            $scope.isUser = false;
            $scope.isTask = false;
            $scope.isSubTask = true;
            $scope.hideProd = false;

            var obj = {
                From: formatDate1,
                To: formatDate2,
                user_id: user,
                team_id: teamID,
                tasks_id: task,
                sub_task_id: subtask,
                task_desc: taskDesc,
                user_ot: userOtTasks

            };
            if (formatDate1 > formatDate2) {
                Notification({ message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>" }, 'warning');
            }
            else {
                var promiseGet = SdaReportService.getProductiviyBySubTask($scope, $rootScope, $http, obj);
                promiseGet.then(function (pl) {
                    $scope.ProdList = "";
                    $scope.ProdList = pl.data;
                },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.');
                    });
            }
        }

      
        function showSdaReports() {
            var Date1 = $scope.SdaReport.From;
            var formatDate1 =  $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.SdaReport.To;
            var formatDate2 =  $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.SdaReport.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
            var userOtTasks = $scope.SdaReport.Ot;
            $scope.isProd = false;

            var obj = {
                From : formatDate1,
                To : formatDate2,
                user_id : user,
                team_id : teamID,
                tasks_id : task,
                sub_task_id : subtask,
                task_desc : taskDesc,
                user_ot: userOtTasks

            };
            if (formatDate1 > formatDate2 ) {
                Notification({ message: "The From date cannot be greater than To date <b> Try chaning the date 🤦</b>"} , 'warning');
            }
            else {
            var promiseGet = SdaReportService.getSdaReports($scope, $rootScope, $http ,obj );
            promiseGet.then(function (pl) {
                 $scope.ReportList = pl.data;
                 $scope.getTotalTime(); 
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.');
                });
        }
    }
       // getTotalTime();
         $scope.getTotalTime =function() {
            var Date1 = $scope.SdaReport.From;
            var formatDate1 =  $filter('date')(Date1, "yyyy-MM-dd");
            var Date2 = $scope.SdaReport.To;
            var formatDate2 =  $filter('date')(Date2, "yyyy-MM-dd");
            var teamID = $scope.team.selected;
            var taskDesc = $scope.SdaReport.task_desc;
            var task = $scope.task.selected;
            var user = $scope.user.selected;
            var subtask = $scope.subtask.selected;
             var userOtTasks = $scope.SdaReport.Ot;
            var obj = {
                From : formatDate1,
                To : formatDate2,
                user_id : user,
                team_id : teamID,
                tasks_id : task,
                sub_task_id : subtask,
                task_desc : taskDesc,
                user_ot: userOtTasks

            };
            var promiseGet = SdaReportService.getRemaingReportsTime($scope, $rootScope, $http ,obj );
            promiseGet.then(function (pl) {
                 $scope.remTime = pl.data; 
            },
                  function (errorPl) {
                      Notification('Some Error in Getting Records.');
                });
        };


        function removeSdaReport(SdaReport) {
            //if (SdaReport.Active === 0) {
               var id = SdaReport.task_id;
            //    id :  SdaReport.SdaReport_id
            // //     //Active: SdaReport.Active,
            // //     //ActionBy: $rootScope.loggedUserId
           //   };
            if (window.confirm("Do you really want to delte this SdaReport")) {
                AddTaskService.deleteAddTask($scope, $rootScope, $http, id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Deleted Successful");
                        $scope.getTotalTime();
                        showSdaReports();
                    } else {
                        Notification.error("Try Again");
                        
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            }
            //} else {
            //    Notification("Active Status Can't be Delete")
            //}
        }
    }

       


    SdaReportModelController.$inject = ['$scope', '$rootScope', '$http', 'items', '$uibModalInstance', 'AddTaskService' , 'SdaReportService'];
    function SdaReportModelController($scope, $rootScope, $http, items, $uibModalInstance, AddTaskService ,SdaReportService ) {
        $scope.items = items; 
        if (items.isEditing)
            $scope.SdaReport = angular.copy(items.SdaReport);
        else
            $scope.SdaReport = null;

        $scope.saveSdaReport = function (SdaReport) {
            if (items.isEditing) {
                //$scope.SdaReport.ModifiedBy = "1";
                var id = SdaReport.task_id;
                $scope.SdaReport.user_id = $rootScope.user_id;
                SdaReport.team_id = $scope.team.selected;
                SdaReport.tasks_id = $scope.task.selected;
                SdaReport.sub_task_id = $scope.subtask.selected;
                SdaReport.build = $scope.build.selected;
                //SdaReport.date = $scope.date.selected;
               // $scope.SdaReport.create_date = $rootScope.date;
               AddTaskService.updateAddTask($scope, $rootScope, $http, $scope.SdaReport,id).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Updated Successful");
                        $uibModalInstance.close();
                        // $scope.getTotalTime();
                        // showSdaReports();
                    } else if(res.data.results){
                        Notification({message : "Error occoured !! Check the entered time" , title : "Time total must be total of 8 hours"} , 'error');
                    }
                    else {
                        Notification.error("Error occoured !! Please try again");
                    }
                }, function (err) {
                    Notification("Error while processing! Try Again.");
                });
            } else {
                $scope.SdaReport.user_id = $rootScope.user_id;
                SdaReport.team_id = $scope.team.selected;
                SdaReport.tasks_id = $scope.task.selected;
                SdaReport.sub_task_id = $scope.subtask.selected;
                SdaReport.build = $scope.build.selected;
                
                SdaReport.addSdaReport($scope, $rootScope, $http, $scope.SdaReport).then(function (res) {
                    if (res.data.code == 200) {
                        Notification.success("Added Successful");
                        $uibModalInstance.close();
                    } else if(res.data.results){
                        Notification.error("Error occoured !! Check the entered time");
                    }
                    else {
                        Notification.error("Error occoured !! Please try again");
                    }
                }, function (err) {
                    Notification("Error in processing sever error 500! Try Again.");
                });
            }
        };

        $scope.LeaveTypes = [
            { "id": 0, "Name": "Not a Leave" },
            { "id": 1, "Name": "Manager Approved" },
            { "id": 2, "Name": "Manager Not Approved" },
            { "id": 3, "Name": "Unexpected" }
        ];

        getTeamList();

        function getTeamList() {
            var promiseGet = AddTaskService.getLoadedTeam($scope, $rootScope, $http ,$rootScope.user_id );
            promiseGet.then(function (pl) {
                 $scope.TeamList = pl.data; 
                   if ($scope.isEditing) {
                                   for (var team in $scope.TeamList) {
                                    if ($scope.TeamList[team].team_id == $scope.SdaReport.team_id) {
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
                        if ($scope.TaskList[task].task_id == $scope.SdaReport.tasks_id) {
                            $scope.task.selected = $scope.TaskList[task];
                        }
                    }
                 }
                    $scope.selectsubTask();
                },
                      function (errorPl) {
                          Notification('Some Error in Getting Records.', 'error');
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
                      if ($scope.subTaskList[subtask].sub_task_id == $scope.SdaReport.sub_task_id) {
                          $scope.subtask.selected = $scope.subTaskList[subtask];
                      }
                  }
             }
              },
                    function (errorPl) {
                        Notification('Some Error in Getting Records.', errorPl);
                    });
      };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();