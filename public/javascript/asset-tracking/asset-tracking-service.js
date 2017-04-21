
angular.module('blockchainApp').factory('AssetTrackingService',
	[ '$http', '$cookieStore', '$rootScope', '$timeout',

	function ( $http, $cookieStore, $rootScope, $timeout) {
        var service = {};

        service.getProfileDetails = function (id, callback) {

            $http.get('/api/getProfileDetails/'+id).success(function(response){
               	console.log(response);
               	callback(response);
            });

        };
        service.editProfileDetails = function (name, city, username, email, password, callback) {

            $http.post('/api/editProfileDetails',{ name: name , city:city, username: username, email:email, password: password }).success(function(response){
               	console.log(response);
               	callback(response);
            });

        };

        service.getAssetDetails = function(clientSideId) {

          console.log(clientSideId);
          // $http.get('').success(function(response){
          //
          //   console.log(response);
          //
          //
          // }

        }

       return service;
 }]);
