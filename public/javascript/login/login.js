var app = angular.module('blockchainLogin', []);

app.controller('loginController',['$scope', '$http', function($scope, $http) {
	$scope.register = function(){
		console.log('sending post');
		var data = {
                user: $scope.signup.user,
                pass: $scope.signup.pass
            };
		
        $http.post("/register", data).then(function(data, status) {
           console.log(data);
        });
		
	};
 }]);