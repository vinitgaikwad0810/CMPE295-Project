var blockchain = require('./blockchain');
var mongo = require('./mongo');


exports.register = function(request, response) {

    var transactions = []
    blockchain.write(request.body.stakeHolder + ":stakeholder", {
        balance: 10,
        transactions: transactions
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
            if (n <= 1) {
                console.log("There is no party to make payment to")
                return
            }
            var toParty = productSchema.states[n - 1].address;

            if(fromParty === toParty)
            {
              console.log("Same party. There is no payment.")
              return
            }

            deductFromFromParty(fromParty, amount, chain_user, peer, productId, toParty, creditToToParty);
            console.log("Money is being transferred to " + toParty + "from " +  fromParty)
        }


    });





    //
    // deductTheAmount()        //Call to stakeholder schema
    // payThePreviousParty(amount);
    //

}

function creditToToParty(fromParty, amount, chain_user, peer, productId, toParty, callback) {
    console.log("creditToToParty")

    var toStakeHolderKey = toParty + ":stakeholder"
    blockchain.queryProduct(toStakeHolderKey, chain_user, peer, function(responseObj) {
        var stakeHolderData = responseObj.product;

        stakeHolderData.balance = stakeHolderData.balance + amount;
        // var toAppend = {};
        // toAppend.productId = productId;
        // toAppend.amount = amount;
        // toAppend.paidTo = toParty;
        // stakeHolderData.transactions[stakeHolderData.transactions.length] = toAppend;

        blockchain.write(toStakeHolderKey, stakeHolderData, peer, chain_user, function(status) {

            if (status.status === "success") {

                console.log("Successfully Credited to " + toParty)
                //callback(fromParty, amount, chain_user, peer, productId, toParty, callback);
            }

        });



    });



}

function deductFromFromParty(fromParty, amount, chain_user, peer, productId, toParty, callback) {
    console.log("deductFromFromParty"),
        console.log(chain_user)
    var fromStakeHolderKey = fromParty + ":stakeholder"

    blockchain.queryProduct(fromStakeHolderKey, chain_user, peer, function(responseObj) {
        var stakeHolderData = responseObj.product;

        stakeHolderData.balance = stakeHolderData.balance - amount;
        var toAppend = {};
        toAppend.productId = productId;
        toAppend.amount = amount;
        toAppend.paidTo = toParty;
        stakeHolderData.transactions[stakeHolderData.transactions.length] = toAppend;

        blockchain.write(fromStakeHolderKey, stakeHolderData, peer, chain_user, function(status) {

            if (status.status === "success") {

                console.log("Successfully deducted from " + fromParty)
                callback(fromParty, amount, chain_user, peer, productId, toParty, callback);
            }

        });



    });


}
