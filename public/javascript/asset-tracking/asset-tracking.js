//var app = angular.module('blockchainApp', ['ngRoute']);
//AIzaSyAdF4y0AjJujQ248MSKd8KC41wm9fIvpgc
app.controller('assetTrackingController', ['$scope', '$http', function($scope, $http) {
    $scope.product = {};
    console.log('loaded');

    $scope.states = [];

    $scope.states[$scope.states.length] = {
        text: "sdffsfsf",
        lat: "37.335719",
        lang: "-121.886708",
        address: "101 E San Fernando St #103, San Jose, CA, 95112",
        tests: [{
                objective: "Check if the packing is intact",

                expectedResult: "It is intact",
                actualResult: "It isn't",
                status: "VERIFIED"
            },
            {
                objective: "Check if the packing is intact",

                expectedResult: "It is intact",
                actualResult: "It isn't",
                status: "VERIFIED"
            }

        ]


    }

    $scope.states[$scope.states.length] = {
        text: "sdffsfsf",
        lat: "37.335719",
        lang: "-121.886708",
        address: "101 E San Fernando St #103, San Jose, CA, 95112",
        tests: [{
                objective: "Check if the packing is intact",

                expectedResult: "It is intact",
                actualResult: "It isn't",
                status: "VERIFIED"
            },
            {
                objective: "Check if the packing is intact",

                expectedResult: "It is intact",
                actualResult: "It isn't",
                status: "VERIFIED"
            }



        ]


    }

    $scope.states[$scope.states.length] = {
        text: "sdffsfsf",
        lat: "37.335719",
        lang: "-121.886708",
        address: "101 E San Fernando St #103, San Jose, CA, 95112",
        tests: [{
            objective: "Check if the packing is intact",

            expectedResult: "It is intact",
            actualResult: "It isn't",
            status: "VERIFIED"
        }]


    }
    // $scope.register = function(){
    // 	console.log($scope.product);
    // 	console.log('sending product register post');
    // 	var data = {
    // 			productName: $scope.product.name,
    // 			description: $scope.product.description,
    // 			category: $scope.product.category,
    // 			qrCode: $scope.product.id
    //           };
    //
    //       $http.post("/register-product", data).then(function(data, status) {
    //          console.log(data);
    //       });
    //
    // };
}]);
