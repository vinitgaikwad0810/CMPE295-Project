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
