var https = require("https");
var gitpath = "https://github.com/jagrutipatil/Blockchain_SmartContractEditor";
var chaincodeName = "7a29333e30aca01146c974710c6b12e7f3a3ef3ef882f846945703e1605bd04b51a6a6d0784224e7fe1fc5c6d55f1bce5a79b8d97e64dba49436d2836ed1586a";

var options = {
		hostname: '37ee9a5168d1497088ea117e68f329f0-vp0.us.blockchain.ibm.com',
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

exports.init = function() {
	if (chaincodeName === null || chaincodeName === undefined) {
		var data = generateInitJSON('init', "Hello" , "user_type1_0");

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


function constructJSON(methodname, nameparam, functionName, var1, var2 , userId){
	
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
		                 var1, var2
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
			var contractjson = request.body.params;
			
			console.log("Registering the contract for Id:" + contractid);
			var data = constructJSON('invoke', chaincodeName, 'putcontract', contractid , contractjson, "user_type1_0");
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
		var data = constructGetJSON("query", chaincodeName, 'getcontract', "" + contractid, "user_type1_0");
		
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