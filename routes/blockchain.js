var https = require("https");

var productApiRequestSchema = {
		jsonrpc: "2.0",
		method: "invoke",
		params: {
			type: 1,
			chaincodeID: {
				name: "02c911a97e94abeb71d2475c3e4563ed959e25307c81166fa7e1b9e504cc3d6cccf2c3f67f01f434be684a62a5f1ed1980646d4cdc5743c3c37ca263a30216f6"
			},
			ctorMsg: {
				function: "register",
				args: [
					"uuid",
					"product JSON"
					]
			},
			secureContext: "user_type2_0"
		},
		id: 3
};

function getProductRequestApiSchema(){
	return JSON.parse(JSON.stringify(productApiRequestSchema)); 
}

exports.registerProduct = function(product, user, peer, callback){

	var target = peer.split(":");
	var data = getProductRequestApiSchema();
	data.params.secureContext = user;
	data.params.ctorMsg.args[0] = ""+product.productId;
	data.params.ctorMsg.args[1] = JSON.stringify(product);

	var options = {
			hostname: target[1].replace("//",""),
			port: target[2],
			path: '/chaincode',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			}
	};

	var req = https.request(options, function(res) {
		console.log('Status: ' + res.statusCode);
		console.log('Headers: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (body) {
			if(body){
				body = JSON.parse(body);
				if(body.result && body.result.status === "OK"){
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
	});

	// write data to request body

	req.write(JSON.stringify(data));
	req.end();

};



