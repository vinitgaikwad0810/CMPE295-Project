var app = angular.module('blockchainLogin', []);

app.controller('loginController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.loginErr = '';
    $scope.signupErr = '';

    $scope.register = function (user, pass) {
        console.log(user);
        console.log(pass);
        if (user === '' || pass === '' || user === undefined || pass === undefined) {
            $scope.signupErr = 'Credentials cannot be empty';
            return;
        }

        console.log('sending register post');
        var data = {
            user: user,
            pass: pass
        };

        $http.post("/register", data).then(function (data, status) {
            console.log(data.data);
            if (data.data.status === 'success') {
                $scope.signupErr = '';
                $scope.login(user, pass);
            } else {
                $scope.signupErr = data.data;
            }
        });

    };

    $scope.login = function (user, pass) {
        if (user === '' || pass === '' || user === undefined || pass === undefined) {
            $scope.loginErr = 'Credentials cannot be empty';
            return;

        }

        console.log('sending login post');
        var data = {
            user: user,
            pass: pass
        };

        $http.post("/login", data).then(function (data, status) {
            console.log(data);
            if (data.data.status === 'success') {
                $scope.loginErr = '';
                $window.location.href = '/index.html';
            } else {
                $scope.loginErr = data.data;
            }
        });
    };
}]);