var app = angular.module('blockchainApp', [ 'ngRoute' ]);

app.config(function($routeProvider) {
	$routeProvider
	.when('/Page1', {
		templateUrl : 'views/test.html',
		controller : 'TestController'
	})
	.when('/Page2', {
		templateUrl : 'views/test2.html',
		controller : 'TestController'
	})
	.otherwise({
		redirectTo : '/Page1'
	});
});

app.controller('TestController', function($scope){	
    $scope.message = "Details";	
});
