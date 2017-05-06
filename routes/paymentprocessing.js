var blockchain = require('./blockchain');
var mongo = require('./mongo');


exports.register = function(request, response) {


    blockchain.write(request.body.stakeHolder, {
        balance: "10"
    }, request.session.peer, request.session.chain_user, function(result) {
        // blockchain.registerProduct(product, "user_type2_0", "https://e57848b76d894377a7f176f544757add-vp0.us.blockchain.ibm.com:5001", function(result){
        console.log(result);
        if (result.status === "success")
            response.send({
                status: 'success'
            });
        else
            response.send({
                status: 'error'
            });

    });


}


exports.automatedPaymentProcessing = function(productId, username, amount, chain_user, peer) {

    console.log("Payment Processing Module");
    console.log(productId)
    console.log(username)
    console.log(amount)
    console.log(chain_user)
    console.log(peer)

    var fromParty = username;

    blockchain.queryProduct(productId, chain_user, peer, function(responseObj) {

        if (responseObj.status === "success") {
            console.log("responseObj0");
            console.log(responseObj.product)

            var productSchema = responseObj.product
            var n = productSchema.states.length
            if (n == 1) {
                console.log("There is no party to make payment to")
                return
            }
            var toParty = productSchema.states[n - 2].address;
            deductFromFromParty(fromParty, amount, creditToToParty);
            console.log("Money is being transferred to " + toParty + "from " + fromParty)
        }


    });





    //
    // deductTheAmount()        //Call to stakeholder schema
    // payThePreviousParty(amount);
    //

}

function creditToToParty(toParty, amount) {
    console.log("creditToToParty")

}

function deductFromFromParty(fromParty, amount, callback) {
    console.log("deductFromFromParty")

}
