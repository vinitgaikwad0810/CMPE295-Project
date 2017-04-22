//var app = angular.module('blockchainApp', ['ngRoute']);

app.controller('registerProductController',['$scope', '$http', '$interval', '$location', function($scope, $http, $interval, $location) {
	$scope.product = {};
	$scope.showMsg = false;
	$scope.registerErr = "";
	$scope.timer = 0;

	$scope.register = function(){
        $scope.showMsg = false;
        $scope.registerErr = "";

		if($scope.product.name === "" || $scope.product.name === undefined || $scope.product.description === "" || $scope.product.description === undefined || $scope.product.category === "" || $scope.product.category === undefined || $scope.product.id === "" || $scope.product.id === undefined){
			$scope.registerErr = "One or more values have not been entered";
			return;
		}

		console.log($scope.product);
		console.log('sending product register post');
		var data = {
				productName: $scope.product.name,
				description: $scope.product.description,
				category: $scope.product.category,
				qrCode: $scope.product.id				
            };
		
        $http.post("/register-product", data).then(function(data, status) {
           if(data.data.status === "success"){
               $scope.timer = 5;
			   $scope.showMsg = true;

               $interval(function () {
                   $scope.timer-=1;
                   if($scope.timer === 0){
                       $location.path( "/asset-tracking" );
				   }
               }, 1000);

		   } else {
               $scope.registerErr = data.data;
		   }
        });
		
	};
 }]);