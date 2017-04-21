app.controller('registerContractController',['$scope', '$http', function($scope, $http) {
	$scope.product = {};
	var counter=0;
    $scope.questionelemnt = [ {id:counter, key : '', value : '', empty : ''} ];


	$scope.registercontract = function(){
		console.log($scope.product);
		console.log('sending product register post');
		var paramsJSON = "{";
		
    angular.forEach($scope.questionelemnt, function(order) {
        paramsJSON += "\"" + order.key + "\" : \"" + order.value + "\", ";
    });

    paramsJSON += "\"contractName\":\"" + $scope.contract.name + "\" }";

		var data = {
				params: paramsJSON,
				contractid: $scope.contract.id,
				product_type: $scope.contract.category 				
      };
		
        $http.post("/registercontract", data).then(function(data, status) {
           console.log(data);
           alert("Contract Created");
           $scope.contract.id = "";
           $scope.contract.name = "";
           $scope.contract.key1 = "";
           $scope.contract.key2 = "";
           $scope.contract.key3 = "";
           $scope.contract.key4 = "";
           $scope.contract.key5 = "";

           $scope.contract.value1 = "";
           $scope.contract.value2 = "";
           $scope.contract.value3 = "";
           $scope.contract.value4 = "";
           $scope.contract.value5 = "";
        });
		
	};

	$scope.newItem = function($event){
        counter++;
        $scope.questionelemnt.push(  { id:counter, key : '', value : '', empty : ''} );
        $event.preventDefault();
    }
 }]);