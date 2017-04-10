//var app = angular.module('blockchainApp', ['ngRoute']);

app.controller('assetTrackingController',['$scope', '$http', function($scope, $http) {
	$scope.product = {};
	console.log('loaded');
	$scope.register = function(){
		console.log($scope.product);
		console.log('sending product register post');
		var data = {
				productName: $scope.product.name,
				description: $scope.product.description,
				category: $scope.product.category,
				qrCode: $scope.product.id
            };

        $http.post("/register-product", data).then(function(data, status) {
           console.log(data);
        });

	};
 }]);
