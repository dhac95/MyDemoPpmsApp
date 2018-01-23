
  (function () {
      angular.module('LoginApp', ['ngCookies', 'ui-notification']).controller('LoginController', function ($scope, $http, $cookieStore,Notification) {
        angular.module('LoginApp', ['ui-notification']) 
        .config(function(NotificationProvider) {
            NotificationProvider.setOptions({
                delay: 10000,
                startTop: 20,
                startRight: 10,
                verticalSpacing: 20,
                horizontalSpacing: 20,
                positionX: 'left',
                positionY: 'bottom'
            });
        });
          var endPoint = "login";
          var forgot = "fp";
          var register = "reg";
          var team = "myTeam";
        
          $scope.isPassword = false;
          $scope.isReg = false;

          if (localStorage.getItem('IsAuth') == "false" && sessionStorage.getItem('IsAuth') == "false") {
              sessionStorage.removeItem('user_id');
            //   sessionStorage.removeItem('first_name');
            //   sessionStorage.removeItem('last_name');
              sessionStorage.removeItem('IsAuth');
              sessionStorage.removeItem('user_name');
            //   sessionStorage.removeItem('team_count');
              sessionStorage.removeItem('user_type');
              sessionStorage.removeItem('user_mail');
              sessionStorage.removeItem('token');
            //   sessionStorage.removeItem('host_name_1');
            //   sessionStorage.removeItem('host_name_2');
            //   sessionStorage.removeItem('below_on');
            //   sessionStorage.removeItem('manager');
            //   sessionStorage.removeItem('user_status');


              localStorage.removeItem('user_id');
            //   localStorage.removeItem('first_name');
            //   localStorage.removeItem('last_name');
              localStorage.removeItem('IsAuth');
              localStorage.removeItem('user_name');
            //  localStorage.removeItem('team_count');
              localStorage.removeItem('user_type');
              localStorage.removeItem('user_mail');
            //   localStorage.removeItem('host_name_1');
            //   localStorage.removeItem('host_name_2');
            //   localStorage.removeItem('below_on');
            //   localStorage.removeItem('manager');
            //   localStorage.removeItem('user_status');
                localStorage.removeItem('token');
                alert("User name or password is wrong");
               $scope.LoginBanner = { 'display': 'inline' };
          }
          else if ((localStorage.getItem('user_id')&&localStorage.getItem('user_name')&&localStorage.getItem('user_type')&&localStorage.getItem('user_mail')&&(localStorage.getItem('IsAuth') == "true")) || (sessionStorage.getItem('user_id')&&sessionStorage.getItem('user_name')&&sessionStorage.getItem('user_type')&&sessionStorage.getItem('user_mail')&&(sessionStorage.getItem('IsAuth') == "true"))) {
              window.location.replace("/index.html");
          }

          else {
              sessionStorage.removeItem('user_id');
          //    sessionStorage.removeItem('first_name');
           //   sessionStorage.removeItem('last_name');
              sessionStorage.removeItem('IsAuth');
              sessionStorage.removeItem('user_name');
           //   sessionStorage.removeItem('team_count');
              sessionStorage.removeItem('user_type');
              sessionStorage.removeItem('user_mail');
           //   sessionStorage.removeItem('host_name_1');
           //   sessionStorage.removeItem('host_name_2');
           //   sessionStorage.removeItem('below_on');
           //   sessionStorage.removeItem('manager');
            //  sessionStorage.removeItem('user_status');


              localStorage.removeItem('user_id');
             // localStorage.removeItem('first_name');
             // localStorage.removeItem('last_name');
              localStorage.removeItem('IsAuth');
              localStorage.removeItem('user_name');
             // localStorage.removeItem('team_count');
              localStorage.removeItem('user_type');
              localStorage.removeItem('user_mail');
            //   localStorage.removeItem('host_name_1');
            //   localStorage.removeItem('host_name_2');
            //   localStorage.removeItem('below_on');
            //   localStorage.removeItem('manager');
            //   localStorage.removeItem('user_status');
             //   alert('UserName or password mismatch');
               $scope.LoginBanner = { 'display': 'inline' };
          }
          $scope.subBtn = "Log In";

          $scope.login = function (User) {
              $scope.subBtn = "Processing.......";
              $http.post(endPoint, User).success(function (response) {
                  $scope.loginSts = response.Message;
                  if (response.IsAuth) {
                      if ($scope.remember) {
                          localStorage.setItem('user_id', response.data[0].user_id);
                          localStorage.setItem('first_name', response.data[0].first_name);
                          localStorage.setItem('last_name', response.data[0].last_name);
                          localStorage.setItem('IsAuth', response.data[0].IsAuth);
                          localStorage.setItem('user_name', response.data[0].user_name);
                          localStorage.setItem('team_count', response.data[0].team_count);
                          localStorage.setItem('user_type', response.data[0].user_type);
                          localStorage.setItem('user_mail', response.data[0].user_mail);
                          localStorage.setItem('host_name_1', response.data[0].host_name_1);
                          localStorage.setItem('host_name_2', response.data[0].host_name_2);
                          localStorage.setItem('below_on', response.data[0].below_on);
                          localStorage.setItem('manager', response.data[0].manager);
                          localStorage.setItem('user_status', response.data[0].user_status);
                          localStorage.setItem('user_activation', response.data[0].user_activation);
                          localStorage.setItem('user_deletion', response.data[0].user_deletion);
                          localStorage.setItem('last_entry_on', response.data[0].last_entry_on);
                          localStorage.setItem('create_date', response.data[0].create_date);
                          localStorage.setItem('maintain_date', response.data[0].maintain_date);
                          window.location.replace("/main.html");
                      }
                      else {
                        sessionStorage.setItem('user_id', response.data[0].user_id);
                        sessionStorage.setItem('first_name', response.data[0].first_name);
                        sessionStorage.setItem('last_name', response.data[0].last_name);
                        sessionStorage.setItem('IsAuth', response.data[0].IsAuth);
                        sessionStorage.setItem('user_name', response.data[0].user_name);
                        sessionStorage.setItem('team_count', response.data[0].team_count);
                        sessionStorage.setItem('user_type', response.data[0].user_type);
                        sessionStorage.setItem('user_mail', response.data[0].user_mail);
                        sessionStorage.setItem('host_name_1', response.data[0].host_name_1);
                        sessionStorage.setItem('host_name_2', response.data[0].host_name_2);
                        sessionStorage.setItem('below_on', response.data[0].below_on);
                        sessionStorage.setItem('manager', response.data[0].manager);
                        sessionStorage.setItem('user_status', response.data[0].user_status);
                          sessionStorage.setItem('user_activation', response.data[0].user_activation);
                          sessionStorage.setItem('user_deletion', response.data[0].user_deletion);
                          sessionStorage.setItem('last_entry_on', response.data[0].last_entry_on);
                          sessionStorage.setItem('create_date', response.data[0].create_date);
                          sessionStorage.setItem('maintain_date', response.data[0].maintain_date);

                          window.location.replace("/main.html");
                      }
                  }
                  else {
                      $scope.loginSts = response.Message;
                      $scope.subBtn = "Log In";
                      //$scope.loginSts = "User name or password is wrong!!! ";
                      Notification({ message: 'User Name or password is wrong!!! <iframe src="https://giphy.com/embed/11SJ52YouBaDFS" width="280" height="260" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>'} , 'error');
                      sessionStorage.removeItem('user_id');
                      sessionStorage.removeItem('first_name');
                      sessionStorage.removeItem('last_name');
                      sessionStorage.removeItem('IsAuth');
                      sessionStorage.removeItem('user_name');
                      sessionStorage.removeItem('team_count');
                      sessionStorage.removeItem('user_type');
                      sessionStorage.removeItem('user_mail');
                      sessionStorage.removeItem('host_name_1');
                       sessionStorage.removeItem('host_name_2');
                      sessionStorage.removeItem('below_on');
                       sessionStorage.removeItem('manager');
                      sessionStorage.removeItem('user_status');
                      sessionStorage.removeItem('user_activation');
                      sessionStorage.removeItem('user_deletion');
                      sessionStorage.removeItem('last_entry_on');
                      sessionStorage.removeItem('create_date');
                      sessionStorage.removeItem('maintain_date');

      
                  
                        localStorage.removeItem('user_id');
                        localStorage.removeItem('first_name');
                        localStorage.removeItem('last_name');
                        localStorage.removeItem('IsAuth');
                        localStorage.removeItem('user_name');
                        localStorage.removeItem('team_count');
                        localStorage.removeItem('user_type');
                        localStorage.removeItem('user_mail');
                        localStorage.removeItem('host_name_1');
                        localStorage.removeItem('host_name_2');
                        localStorage.removeItem('below_on');
                        localStorage.removeItem('manager');
                        localStorage.removeItem('user_status');
                      localStorage.removeItem('user_activation');
                      localStorage.removeItem('user_deletion');
                      localStorage.removeItem('last_entry_on');
                      localStorage.removeItem('create_date');
                      localStorage.removeItem('maintain_date'); 

                    

                  }
              }).error(function (response) {
                  //$scope.loginSts = "Server is Busy!!! Try Again After Sometime!!!";
                  Notification({ message: 'Server is Busy!!! Try Again After Sometime!!! <iframe src="https://giphy.com/embed/r7zNTsMZ1XV6g" width="280" height="260" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>'} , 'warning');
                  
                  $scope.subBtn = "Log In";
                  sessionStorage.removeItem('user_id');
                  sessionStorage.removeItem('first_name');
                  sessionStorage.removeItem('last_name');
                  sessionStorage.removeItem('IsAuth');
                  sessionStorage.removeItem('user_name');
                  sessionStorage.removeItem('team_count');
                  sessionStorage.removeItem('user_type');
                  sessionStorage.removeItem('user_mail');
                  sessionStorage.removeItem('host_name_1');
                  sessionStorage.removeItem('host_name_2');
                  sessionStorage.removeItem('below_on');
                  sessionStorage.removeItem('manager');
                  sessionStorage.removeItem('user_status');
                  sessionStorage.removeItem('user_activation');
                  sessionStorage.removeItem('user_deletion');
                  sessionStorage.removeItem('last_entry_on');
                  sessionStorage.removeItem('create_date');
                  sessionStorage.removeItem('maintain_date');

                  localStorage.removeItem('user_id');
                  localStorage.removeItem('first_name');
                  localStorage.removeItem('last_name');
                  localStorage.removeItem('IsAuth');
                  localStorage.removeItem('user_name');
                  localStorage.removeItem('team_count');
                  localStorage.removeItem('user_type');
                  localStorage.removeItem('user_mail');
                  localStorage.removeItem('host_name_1');
                  localStorage.removeItem('host_name_2');
                  localStorage.removeItem('below_on');
                  localStorage.removeItem('manager');
                  localStorage.removeItem('user_status');
                  localStorage.removeItem('user_activation');
                  localStorage.removeItem('user_deletion');
                  localStorage.removeItem('last_entry_on');
                  localStorage.removeItem('create_date');
                  localStorage.removeItem('maintain_date');
              });
          };

          $scope.Reset = function(Reset) {
            var obj = { name : $scope.Reset.user_name };
          $http.post(forgot, obj).then(function(response) { 
                  if(response.data.code === 200) {
                      Notification.success('Success password updated! Check the mail <iframe src="https://giphy.com/embed/6brH8dM3zeMyA" width="280" height="260" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>' );
                  }
                  else if(response.data.code === 300){
                      Notification({ message: 'User does not exist !!! Register first <iframe src="https://giphy.com/embed/3ohzdYt5HYinIx13ji" width="280" height="260" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>'} , 'warning');
                  }
                  else {
                      Notification({ message: 'Password not updated!!! Error occoured <iframe src="https://giphy.com/embed/r7zNTsMZ1XV6g" width="280" height="260" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>'}, 'error' );
                  }
           },function(eresponse) {
               Notification({ message: 'Password not updated!!! Error occoured <iframe src="https://giphy.com/embed/r7zNTsMZ1XV6g" width="280" height="260" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>' }, 'error');  
           });
        };

          $scope.forgotPassword = function () {
              $scope.isPassword = true;
              $scope.isReg = false;
          };

        getTeamList();
        function getTeamList() {
            $http.get(team).then(function(response) { 
                    $scope.TeamList = response.data;
            }); 
        }

          $scope.Register = function(Register) {
              var obj = {
                    user_name : $scope.Register.user_name,
                    team_id : $scope.Register.team_id
              };
              $http.post(register, obj).then(function(response) { 
                if(response.data.code === 200) {
                    Notification.success('success ' + 'Check the mail '  );
                }
                else if(response.data.code === 300){
                    Notification({message: 'error ' +  'user already registered in team'}, 'warning' );
                }
                else if(response.data.code === 204) {
                    Notification('User already registerd Wait for approval' );
                }
                else {
                    Notification({message :'Processing error , Try after sometimes !!!'} , 'error');
                }
         },
         function(errorresponse) {
             Notification({ message : 'An Error has occured while resetting password! <iframe src="https://giphy.com/embed/r7zNTsMZ1XV6g" width="280" height="260" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>'} , 'warning') ;  
       });
    };

         
      $scope.isLogin = function () {
              $scope.isPassword = false;
              $scope.isReg = false;
            };

          $scope.Reg = function() {
                $scope.isPassword = false ; 
                //$scope.isLogin = false;
                $scope.isReg = true;
          };

          $scope.inputType = 'password';
          $scope.hideShowPassword = function () {
              if ($scope.inputType == 'password')
                  $scope.inputType = 'text';
              else
                  $scope.inputType = 'password';
          };
      });
  })();