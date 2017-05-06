


app.service('PaymentProcessingService', ['$http', function($http) {

        var service = {};

        service.registrationAStakeHolder = function(stakeHolder) {

            var stakeHolderSchema = {

                stakeHolder: stakeHolder
            }

            console.log("Registering a stakeHolder");

            $http.post("/paymentprocessing/register", stakeHolderSchema).then(function(response) {
                console.log(response.data);
                if (response.data.status === "success") {

                    console.log("successfully registered")
                }

            })
        }
        return service;
    }


]);
