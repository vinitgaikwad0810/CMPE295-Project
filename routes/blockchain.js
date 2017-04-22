var https = require("https");

var chainCodeName ='deef481fb41ef34ad3fd9c97b70992795d734a20c65b7ec9083677ad7ebc12648736b381e065b1143b2ad1deeb1f892c53d8847ed2d0523402ea325cda149308';

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
				console.log(body);
				try{
                    body = JSON.parse(body);
				} catch (err) {
					console.log('error parsing response body');
                    callback({
                        status: "error",
                        err: "Error on calling blockchain API"
                    });
				}

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




