var https = require("https");
var mongodb = require("./mongo");
var chaincodeId = require("./chaincodeId");
var gitpath = "https://github.com/jagrutipatil/Blockchain_SmartContractEditor";
//var chaincodeName = "f9d4aaf6c78d583c13ce5c411b6658bcb52c68b09f7e9d7ed8fb8f3f8ccec69e3e0df981aeed7eabcf3f7e7ec971c445fba6dff1a4d3f19ced58e6e056f3be7e";
var chaincodeName = chaincodeId.chaincodeName;

var options = {
    hostname: 'e57848b76d894377a7f176f544757add-vp0.us.blockchain.ibm.com',
    port: 5001,
    path: '/chaincode',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
};


function generateInitJSON(functionName, var1, userId) {

    var registrarApiSchema = {
        jsonrpc: "2.0",
        method: "deploy",
        params: {
            type: 1,
            chaincodeID: {
                path: gitpath
            },
            ctorMsg: {
                function: functionName,
                args: [
                    var1
                ]
            },
            secureContext: userId
        },
        id: 4
    };

    return JSON.stringify(registrarApiSchema);
}

exports.validate = function(request, response) {

    var validateJson = {};
    console.log(request.body);
    validateJson = request.body;



    mongodb.queryProduct(validateJson.qrcode, function(result) {
        if (result.status != 'error') {
            var productid = result.productId;

            //console.log(id);
            //get peer id from mongodb

            mongodb.getPeerPutProductId(validateJson.username, validateJson.qrcode, function(status, chain_user, peerid) {

                if (status != "error") {

                    var params = {
                        qrcode: request.body.qrcode,
                        lng: request.body.lng,
                        lat: request.body.lat,
                        username: request.body.username,
                        params: request.body.params
                    };

                    console.log(peerid);
                    var eventOptions = {
                        //hostname: 'demo2367382.mockable.io',         //PASS PEERID LATER and add port number
                        hostname: "e57848b76d894377a7f176f544757add-vp0.us.blockchain.ibm.com",
                        port: 5001,
                        path: '/chaincode',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    };

                    var data = constructValidateJSON('invoke', chaincodeName, 'validate', validateJson, productid, chain_user);
                    console.log(data);
                    var req = https.request(eventOptions, function(res) {
                        res.setEncoding('utf8');
                        res.on('data', function(body) {
                            if (body) {
                                console.log(body);
                                body = JSON.parse(body);
                                if (body.result.status == "OK") {
                                    response.send({
                                        "status": "success"
                                    });
                                } else {
                                    response.send({
                                        "status": "error"
                                    });
                                }
                            } else {
                                response.send({
                                    "status": "Error on calling blockchain API"
                                });
                            }
                        });
                    });

                    req.on('error', function(e) {
                        response.send('problem with request: ' + e.message);
                    });

                    req.write(data);
                    req.end();
                } else {
                    response.send({
                        "status": "error"
                    });
                }
            });

        } else {
            response.send({
                "status": "error"
            });
        }
    });
};

exports.init = function() {
    if (chaincodeName === null || chaincodeName === undefined) {
        var data = generateInitJSON('init', "Hello", "user_type2_0");

        var req = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(body) {
                if (body) {
                    console.log(body);
                    body = JSON.parse(body);
                    chaincodeName = body.result.message;
                }
            });
        });

        req.on('error', function(e) {
            console.log(e);
        });

        req.write(data);
        req.end();
    }
}

function constructValidateJSON(methodname, nameparam, functionName, paramsjson, productid, userId) {

    var obj = JSON.stringify(paramsjson);
    var userId = "user_type2_0";
    console.log("obj" + obj)
    var queryApiSchema = {
        jsonrpc: "2.0",
        method: methodname,
        params: {
            type: 1,
            chaincodeID: {
                name: nameparam
            },
            ctorMsg: {
                function: functionName,
                args: [
                    obj, productid
                ]
            },
            secureContext: userId
        },
        id: 4
    };

    return JSON.stringify(queryApiSchema);

}

function constructPutContractJSON(methodname, nameparam, functionName, var1, product_type, var2, userId) {

    var queryApiSchema = {
        jsonrpc: "2.0",
        method: methodname,
        params: {
            type: 1,
            chaincodeID: {
                name: nameparam
            },
            ctorMsg: {
                function: functionName,
                args: [
                    var1, product_type, var2
                ]
            },
            secureContext: userId
        },
        id: 4
    };

    return JSON.stringify(queryApiSchema);

}

function constructGetJSON(methodname, nameparam, functionName, var1, userId) {

    var queryApiSchema = {
        jsonrpc: "2.0",
        method: methodname,
        params: {
            type: 1,
            chaincodeID: {
                name: nameparam
            },
            ctorMsg: {
                function: functionName,
                args: [
                    var1
                ]
            },
            secureContext: userId
        },
        id: 4
    };

    return JSON.stringify(queryApiSchema);

}

function ContractJson(contractid, product_type, params) {
    this.contractId = contractid;
    this.productType = product_type;
    this.params = params;
}


function registercontract(request, response) {
    if (chaincodeName && chaincodeName != undefined) {



        var contractId = request.body.contractid;
        var productType = request.body.product_type;


        var params = JSON.parse(request.body.params);
        console.log(params);
        var contractjson = new ContractJson(contractId, productType, params);

        console.log(contractjson);
        console.log(JSON.stringify(contractjson));

        console.log("Registering the contract for Product Type:" + contractjson.productType);
        console.log("Parameters: " + contractjson);
        var data = constructPutContractJSON('invoke', chaincodeName, 'putcontract', contractjson.contractId, contractjson.productType, JSON.stringify(contractjson), "user_type2_0");
        var req = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(body) {
                if (body) {
                    console.log(body);
                    body = JSON.parse(body);
                    if (body.result && body.result.status === "OK") {
                        response.send("Success");
                    }
                } else {
                    response.send("Error on calling blockchain API");
                }
            });
        });

        req.on('error', function(e) {
            response.send('problem with request: ' + e.message);
        });

        req.write(data);
        req.end();
    } else {
        console.log("chaincode not defined yet");
    }
};

exports.getcontract = function(request, response) {

    var product_type = request.body.product_type;
    console.log("Getting contract for product_type: " + product_type);
    console.log(chaincodeName);

    if (chaincodeName && chaincodeName != undefined) {
        var data = constructGetJSON("query", chaincodeName, 'getcontract', "" + product_type, "user_type2_0");

        var req = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(body) {
                if (body) {
                    console.log(body);
                    body = JSON.parse(body);
                    if (body.result && body.result.status === "OK") {
                        response.send("Success");
                    }
                } else {
                    response.send("Error on calling blockchain API");
                }
            });
        });

        req.on('error', function(e) {
            response.send('problem with request: ' + e.message);
        });

        req.write(data);
        req.end();
    } else {
        console.log("No Chaincode ID");
    }
};

exports.modifycontract = function(req, res) {
    var json = req.body;

    //call block chain get json API
};



exports.registercontract = registercontract;
