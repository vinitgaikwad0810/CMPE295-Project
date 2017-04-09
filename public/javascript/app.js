var app = angular.module('blockchainApp', [ 'ngRoute']);

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
	.when('/register-product', {
		templateUrl : 'views/product-register.html',
		controller : 'registerProductController'
	})
	.otherwise({
		redirectTo : '/register-product'
	});
});

app.controller('TestController', function($scope){	
    $scope.message = "Details";	
});
