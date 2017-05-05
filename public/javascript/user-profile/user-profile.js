app.controller('userProfileController',['$scope', '$http', '$location', 'AssetTrackingService', function($scope, $http, $location, AssetTrackingService) {
    $scope.userProducts = [];

    $scope.getUserProfile = function(){

        $http.get("/user-products-list").then(function(data, status) {
            console.log(data);
            if(data.data.status === "success"){
                var trackedProducts = data.data.trackedProducts;
                console.log(trackedProducts);
                for(productId in trackedProducts){
                    $scope.getProductDetails(trackedProducts[productId]);
                }
            } else {
                $scope.registerErr = data.data;
            }
        });

    };

    $scope.getProductDetails = function(productId) {
        //  AssetTrackingService.getAssetDetails($scope.searchTerm);
        // Test it with Qr Code 3fdsf-324-234-fdsf
        var url = '/track/' + productId;
        $http.get(url).then(function(response) {
            console.log(response.data);
            if (response.data.status === "success") {
                $scope.userProducts.push(response.data.product)
            } else {
                console.log(response.data.err?response.data.err:response.data);
            }
        });
    }

    $scope.trackProduct = function(product){
        AssetTrackingService.assetData.product = product;
        $location.path( "/asset-tracking" );
    }

    $scope.getUserProfile();
}]);