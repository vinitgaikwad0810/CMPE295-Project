var https = require("https");

var chainCodeName = '02c911a97e94abeb71d2475c3e4563ed959e25307c81166fa7e1b9e504cc3d6cccf2c3f67f01f434be684a62a5f1ed1980646d4cdc5743c3c37ca263a30216f6';

function getProductQueryApiSchema(productId, userId){
	
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
		                 ""+productId
		             ]
		         },
		         secureContext: userId
		     },
		     id: 2
		 };
	
	return JSON.stringify(queryApiSchema);
	
}


function getProductRequestApiSchema(product, user){
	
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
						""+product.productId,
						JSON.stringify(product)
						]
				},
				secureContext: user
			},
			id: 3
	};
	
	return JSON.stringify(productApiRequestSchema); 
}

exports.registerProduct = function(product, user, peer, callback){

	var target = peer.split(":");
	var data = getProductRequestApiSchema(product, user);
	
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

	req.write(data);
	req.end();

};

exports.queryProduct = function(productId, user, peer, callback){
	var target = peer.split(":");
	var data = getProductQueryApiSchema(productId, user);
	
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
		res.setEncoding('utf8');
		res.on('data', function (body) {
			if(body){
				body = JSON.parse(body);
				if(body.result && body.result.status === "OK"){
					callback({
						status: "success",
						product: JSON.parse(body.result.message)
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




