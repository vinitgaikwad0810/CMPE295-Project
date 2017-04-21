var https = require("https");
var mongodb = require("./mongo");
var gitpath = "https://github.com/jagrutipatil/Blockchain_SmartContractEditor";
var chaincodeName = "46af334915753bfcadfcc0e3ac36e52e22143dcfca866a1c09605a3cf424272e1b4e11e3b0473b56ccc053cadfa19099a7931db108e8580cab984e5e775dd078";

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

exports.validate = function(request, response) {
	var qrCode = request.body.qrcode;
	var username = request.body.username;
	mongodb.queryProduct(qrCode, function (status, id) {
		if (status != 'error') {	
			var productid = id;
			//get peer id from mongodb
			mongodb.getpeerid(username, function(status, chain_user, peerid) {
				if (status != "error") {

					var params = {
							lng : request.body.lng,
							lat : request.body.lat,
							username : request.body.username, 
							params : request.body.params 
					};

					var eventOptions = {
							hostname: 'demo2367382.mockable.io',         //PASS PEERID LATER and add port number
							//port: 5001,
							path: '/chaincode',
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							}
					};
					
					var data = constructValidateJSON('invoke', chaincodeName, 'validate', params, productid , chain_user);
					var req = https.request(eventOptions, function(res) {
						res.setEncoding('utf8');
						res.on('data', function (body) {
							if(body){
								console.log(body);
								body = JSON.parse(body);
								if(body.status && body.status === "success"){
									response.send("status : success");
						  		} else {
						  			response.send("status : error");
						  		}
							} else {
								response.send("status : Error on calling blockchain API");
							}
						});
					});

					req.on('error', function(e) {
						response.send('problem with request: ' + e.message);
					});

					req.write(data);
					req.end();			
				} else {
					response.send("status : error");
				}
			});
			
		} else {
			response.send("status : error");
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

function constructValidateJSON(methodname, nameparam, functionName, paramsjson, productid , userId){
	
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
		                 paramsjson, productid
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
			
			console.log("Registering the contract for Product Type:" + product_type);
			console.log("Parameters: " + contractjson);
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
	
	var product_type = request.body.product_type;
	console.log("Getting contract for product_type: " + product_type);
	console.log(chaincodeName);
	
	if (chaincodeName && chaincodeName != undefined) { 
		var data = constructGetJSON("query", chaincodeName, 'getcontract', "" + product_type, "user_type2_0");
		
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