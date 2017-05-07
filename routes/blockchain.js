var https = require("https");
var chaincodeId = require("./chaincodeId");


//var chainCodeName = 'f9d4aaf6c78d583c13ce5c411b6658bcb52c68b09f7e9d7ed8fb8f3f8ccec69e3e0df981aeed7eabcf3f7e7ec971c445fba6dff1a4d3f19ced58e6e056f3be7e';

var chainCodeName = chaincodeId.chaincodeName

function getProductQueryApiSchema(productId, userId) {

    var queryApiSchema = {
        jsonrpc: "2.0",
        method: "query",
        params: {
            type: 1,
            chaincodeID: {
                name: chainCodeName
            },
            ctorMsg: {
                function: "read",
                args: [
                    "" + productId
                ]
            },
            secureContext: userId
        },
        id: 2
    };

    return JSON.stringify(queryApiSchema);

}


function getProductRequestApiSchema(product, user) {

    var productApiRequestSchema = {
        jsonrpc: "2.0",
        method: "invoke",
        params: {
            type: 1,
            chaincodeID: {
                name: chainCodeName
            },
            ctorMsg: {
                function: "register",
                args: [
                    "" + product.productId,
                    JSON.stringify(product)
                ]
            },
            secureContext: user
        },
        id: 3
    };

    return JSON.stringify(productApiRequestSchema);
}


function getWriteAPISchema(key, value, user) {

    var writeAPISchema = {
        jsonrpc: "2.0",
        method: "invoke",
        params: {
            type: 1,
            chaincodeID: {
                name: chainCodeName
            },
            ctorMsg: {
                function: "register",
                args: [
                    key,
                    JSON.stringify(value)
                ]
            },
            secureContext: user
        },
        id: 3
    };

    return JSON.stringify(writeAPISchema);

}

exports.write = function(key, value, peer, user, callback) {

    //  key = key + ":" + "stakeholder";



    if (peer === undefined) {

        //peer = 'https://e57848b76d894377a7f176f544757add-vp2.us.blockchain.ibm.com:5001'
        console.log("PEER IS UNDEFINED")
    }

    if (user === undefined) {
        //user = 'user_type2_2'
        console.log("USER IS UNDEFINED")
    }

    var target = peer.split(":");
    console.log(peer + " " + user)

    var data = getWriteAPISchema(key, value, user);

    console.log(data);

    var options = {
        hostname: target[1].replace("//", ""),
        port: target[2],
        path: '/chaincode',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    var chnk = '';

    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(body) {
            chnk += body;
        });
        res.on('end', function() {
            if (chnk) {
                chnk = JSON.parse(chnk);
                console.log("response from blockchain write")
                console.log(chnk)
                if (chnk.result && chnk.result.status === "OK") {
                    callback({
                        status: "success"
                    });
                }
            } else {
                callback({
                    status: "Error on calling blockchain API"
                });
            }
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        callback({
            status: "Error on calling blockchain API"
        });
    });

    req.write(data);
    req.end();




}


exports.registerProduct = function(product, user, peer, callback) {

    var target = peer.split(":");
    var data = getProductRequestApiSchema(product, user);

    var options = {
        hostname: target[1].replace("//", ""),
        port: target[2],
        path: '/chaincode',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    var chnk = '';

    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(body) {
            chnk += body;
        });
        res.on('end', function() {
            if (chnk) {
                chnk = JSON.parse(chnk);
                if (chnk.result && chnk.result.status === "OK") {
                    callback({
                        status: "success"
                    });
                }
            } else {
                callback({
                    status: "Error on calling blockchain API"
                });
            }
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        callback({
            status: "Error on calling blockchain API"
        });
    });

    req.write(data);
    req.end();

};

exports.queryProduct = function(productId, user, peer, callback) {
    var target = peer.split(":");
    var data = getProductQueryApiSchema(productId, user);

    var options = {
        hostname: target[1].replace("//", ""),
        port: target[2],
        path: '/chaincode',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    var chnk = '';
    var req = https.request(options, function(res) {
        res.setEncoding('utf8');

        res.on('data', function(body) {
            chnk += body;
        });

        res.on('end', function() {

            if (chnk) {
                console.log(chnk);
                try {
                    chnk = JSON.parse(chnk);
                } catch (err) {
                    console.log('error parsing response body');
                    callback({
                        status: "error",
                        err: "Error on calling blockchain API"
                    });
                }

                if (chnk.result && chnk.result.status === "OK" && chnk.result.message) {
                    callback({
                        status: "success",
                        product: JSON.parse(chnk.result.message)
                    });
                } else {
                    callback({
                        status: "error",
                        err: "Product not found!"
                    });
                }
            } else {
                callback({
                    status: "error",
                    err: "Error on calling blockchain API"
                });
            }
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(data);
    req.end();
};
