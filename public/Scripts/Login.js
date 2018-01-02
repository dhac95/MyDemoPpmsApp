
  (function () {
      angular.module('LoginApp', ['ngCookies']).controller('LoginController', function ($scope, $http, $cookieStore) {
          var endPoint = "login";
        
          $scope.isPassword = false;

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

                          window.location.replace("/main.html");
                      }
                  }
                  else {
                      $scope.loginSts = response.Message;
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
        

                  }
              }).error(function (response) {
                  $scope.loginSts = "Server is Busy!!! Try Again After Sometime!!!";
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
              });
          };


          $scope.forgotPassword = function () {
              $scope.isPassword = true;
          };
          $scope.isLogin = function () {
              $scope.isPassword = false;
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