
exports.registercontract = function(req, res) {
	var json = req.body;
	console.log(json);
	res.send("Success");
	//call block chain save json API
};

exports.getcontract = function(req, res) {
	var json = req.body;
	var response = {
			id : json.id,
			name: 'dummy'
	};
	res.send(response);
	//call block chain get json API
};

exports.modifycontract = function(req, res) {
	var json = req.body;
	
	//call block chain get json API
};



