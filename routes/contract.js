var https = require("https");
var gitpath = "https://github.com/jagrutipatil/Blockchain_SmartContractEditor";
var chaincodeName = "f09e34c80249efb2a219da77e0c5cc8222cadb80e8a992f23f30c3265f701f8b9362e57f2b241e643b4e07ea57076e68f59402f2288adb3fb97909432c041cce";

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