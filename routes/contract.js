var https = require("https");
var mongodb = require("./mongo");
var gitpath = "https://github.com/jagrutipatil/Blockchain_SmartContractEditor";
var chaincodeName = "04428fa8936e5d5a40703dfb6ed361cfaae81fe8c7777e318428e2d4ce476c8ff84e3579f37c1af7ea37a2deb29b30f0d5433ca5064eb5a3bc0be0f2cad59422";

var options = {
		hostname: 'e57848b76d894377a7f176f544757add-vp0.us.blockchain.ibm.com',
		port: 5001,
		path: '/chaincode',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		}
};


function generateInitJSON(functionName, var1, userId){
	
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

exports.validate = function(req, res) {
	var qrCode = request.body.qrcode;
	mongodb.queryProduct(qrCode, function (status, id) {
		if (status != 'error') {	
			var productid = id;
			var params = request.body.params;
			var lat = request.body.lat;
			var lng = request.body.lng;
			var username = request.body.username;
			//get peer id from mongodb
			mongodb.getpeerid(username, function(status, chain_user, peerid) {
				if (status != "error") {
					//create options 
					//send status
					var eventOptions = {
							hostname: peerid,
							port: 5001,
							path: '/chaincode',
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							}
					};
					
					var data = constructValidateJSON(methodname, chaincodeName, 'validate', productid, username, lat, lng, params , chain_user);
					var req = https.request(options, function(res) {
						res.setEncoding('utf8');
						res.on('data', function (body) {
							if(body){
								console.log(body);
								body = JSON.parse(body);
								if(body.result && body.result.status === "OK"){
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
					res.send("status : error");
				}
			});
			
		} else {
			res.send("status : error");
		}
	});	
};

exports.init = function() {
	if (chaincodeName === null || chaincodeName === undefined) {
		var data = generateInitJSON('init', "Hello" , "user_type2_0");

		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (body) {
				if(body){
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

function constructValidateJSON(methodname, nameparam, functionName, productid, username, lat, lng, paramsjson , userId){
	
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
		                 productid, username, lat, lng, paramsjson
		             ]
		         },
		         secureContext: userId
		     },
		     id: 4
		 };
	
	return JSON.stringify(queryApiSchema);
	
}

function constructJSON(methodname, nameparam, functionName, var1, product_type, var2 , userId){
	
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

function constructGetJSON(methodname, nameparam, functionName, var1,  userId){
	
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

function registercontract (request, response) {
	if (chaincodeName && chaincodeName != undefined) {
			var contractid = request.body.contractid;
			var product_type = request.body.product_type;
			var contractjson = request.body.params;
			
			console.log("Registering the contract for Id:" + contractid);
			var data = constructJSON('invoke', chaincodeName, 'putcontract', contractid , product_type, contractjson, "user_type2_0");
			var req = https.request(options, function(res) {
				res.setEncoding('utf8');
				res.on('data', function (body) {
					if(body){
						console.log(body);
						body = JSON.parse(body);
						if(body.result && body.result.status === "OK"){
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
	
	var contractid = request.body.contractid;
	console.log(contractid);
	console.log(chaincodeName);
	
	if (chaincodeName && chaincodeName != undefined) { 
		var data = constructGetJSON("query", chaincodeName, 'getcontract', "" + contractid, "user_type2_0");
		
		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (body) {
				if(body){
					console.log(body);
					body = JSON.parse(body);
					if(body.result && body.result.status === "OK"){					
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