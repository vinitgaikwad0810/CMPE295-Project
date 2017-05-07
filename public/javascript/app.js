var app = angular.module('blockchainApp', ['ngRoute', 'ngMap', 'smart-table', 'ngMaterial']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/Page1', {
            templateUrl: 'views/test.html',
            controller: 'TestController'
        })
        .when('/Page2', {
            templateUrl: 'views/test2.html',
            controller: 'TestController'
        })
        .when('/register-product', {
            templateUrl: 'views/product-register.html',
            controller: 'registerProductController'
        })
        .when('/asset-tracking', {
            templateUrl: 'views/asset-tracking.html',
            controller: 'assetTrackingController'
        })
        .when('/register-contract', {
            templateUrl: 'views/contract-register.html',
            controller: 'registerContractController'
        })
        .when('/product-history', {
            templateUrl: 'views/product-history.html',
            controller: 'userProfileController'
        })
        .otherwise({
            redirectTo: '/product-history'
        });
});

app.controller('TestController', function($scope) {
    $scope.message = "Details";
});
