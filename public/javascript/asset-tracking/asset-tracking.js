//var app = angular.module('blockchainApp', ['ngRoute']);
//AIzaSyAdF4y0AjJujQ248MSKd8KC41wm9fIvpgc
app.controller('assetTrackingController', ['$scope', '$http', 'NgMap', function ($scope, $http, NgMap, AssetTrackingService) {
    var vm = $scope;
    $scope.product = {};
    $scope.states = [];

    $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAdF4y0AjJujQ248MSKd8KC41wm9fIvpgc";

    $scope.searchButtonClick = function () {
        //  AssetTrackingService.getAssetDetails($scope.searchTerm);
        // Test it with Qr Code 3fdsf-324-234-fdsf
        var url = '/track/' + $scope.searchTerm;
        niceURI = url.replace(/[^a-zA-Z0-9-_]/g, '');
        $http.get(url).then(function (response) {
            console.log(response.data);
            if (response.data.status === "success") {
                $scope.product = response.data.product;
                $scope.states = $scope.product.states;
                $scope.setMap();
            }
        });
    }

    $scope.setMap = function () {

        NgMap.getMap().then(function (map) {

            var flightPlanCoordinates = [];
            var markers = [];
            var infoWindows = [];

            for (var i = 0; i < vm.states.length; i++) {

                var func = function (index) {
                    var myLatlng = new google.maps.LatLng(vm.states[index].lat, vm.states[index].lang);

                    flightPlanCoordinates[flightPlanCoordinates.length] = myLatlng;

                    markers[markers.length] = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        title: 'Hello World!'
                    });

                    var infoWindow = new google.maps.InfoWindow();
                    var marker = markers[markers.length - 1];
                    var test = vm.states[i].tests;

                    var testsLen = test.length;
                    var testContent = '<ul class="featureList">';

                    for (var x = 0; x < testsLen; x++) {
                        testContent += '<li class="' + (test[x].expectedResult === test[x].actualResult ? 'tick' : 'cross') + '">';
                        testContent += '&nbsp;&nbsp;' + test[x].objective;
                        testContent += '</li>';
                    }
                    testContent += '</ul>';

                    var content = "<strong>STEP " + (index + 1) + "</strong><br>" + testContent;
                    google.maps.event.addListener(marker, 'click', (function (marker, content, infoWindow) {
                        return function () {
                            infoWindow.setContent(content);
                            infoWindow.open(map, marker);
                        }
                    })(marker, content, infoWindow));

                };

                func(i);
            }
            var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            flightPath.setMap(map);

            var bounds = new google.maps.LatLngBounds();
            $.each(markers, function (index, marker) {
                bounds.extend(marker.position);
            });
            map.fitBounds(bounds);
        });

    };
}]);
