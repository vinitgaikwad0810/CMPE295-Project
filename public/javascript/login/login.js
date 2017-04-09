var app = angular.module('blockchainLogin', []);

app.controller('loginController',['$scope', '$http', '$window', function($scope, $http, $window) {
	$scope.register = function(){
		console.log('sending register post');
		var data = {
                user: $scope.signup.user,
                pass: $scope.signup.pass
            };
		
        $http.post("/register", data).then(function(data, status) {
           console.log(data);           
        });
		
	};
	
	$scope.login = function(){
		console.log('sending login post');
		var data = {
                user: $scope.login.user,
                pass: $scope.login.pass
            };
		
        $http.post("/login", data).then(function(data, status) {
           console.log(data);
           if(data.data.status === 'success'){
        	   $window.location.href = '/index.html';
           }
        });
	};
 }]);