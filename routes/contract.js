var https = require("https");

function constructputJSON(functionName, var1, var2 , userId){
	
	var queryApiSchema = {
		     jsonrpc: "2.0",
		     method: "invoke",
		     params: {
		         type: 1,
		         chaincodeID: {
		             name: "0f425020654b68ae9a741aeedb5f060fe78f304ac77ed96f6d04217bc8bf5cf2c13b35d486879cb09f45087e20edd83f249334edc13147554fff1ebf4c04ecbb"
		         },
		         ctorMsg: {
		             function: functionName,
		             args: [
		                 var1, var2
		             ]
		         },
		         secureContext: userId
		     },
		     id: 3
		 };
	
	return JSON.stringify(queryApiSchema);
	
}

function constructgetJSON(functionName, var1 , userId){
	
	var queryApiSchema = {
		     jsonrpc: "2.0",
		     method: "query",
		     params: {
		         type: 1,
		         chaincodeID: {
		             name: "0f425020654b68ae9a741aeedb5f060fe78f304ac77ed96f6d04217bc8bf5cf2c13b35d486879cb09f45087e20edd83f249334edc13147554fff1ebf4c04ecbb"
		         },
		         ctorMsg: {
		             function: functionName,
		             args: [
		                 var1
		             ]
		         },
		         secureContext: userId
		     },
		     id: 3
		 };
	
	return JSON.stringify(queryApiSchema);
	
}

exports.registercontract = function(request, response) {
	var contractid = request.body.contractid;
	var contractjson = request.body.params;
	var data = constructputJSON('putcontract', contractid , contractjson, "user_type1_0");
	
	var options = {
			hostname: '37ee9a5168d1497088ea117e68f329f0-vp0.us.blockchain.ibm.com',
			port: 5001,
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
};

exports.getcontract = function(request, response) {
	
	var contractid = request.body.contractid;
	console.log(contractid);
	var data = constructgetJSON('getcontract', "" + contractid, "user_type1_0");
	
	var options = {
			hostname: '37ee9a5168d1497088ea117e68f329f0-vp0.us.blockchain.ibm.com',
			port: 5001,
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
};

exports.modifycontract = function(req, res) {
	var json = req.body;
	
	//call block chain get json API
};



