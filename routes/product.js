var uuidV1 = require('uuid/v1');
var blockchain = require('./blockchain');
var mongo = require('./mongo');

exports.register = function(req, res) {
	var productName = req.body.productName;
	var uuid = uuidV1();
	var states = [];
	var description = req.body.description;
	var category = req.body.category;
	var qrCode = req.body.qrCode;


	var product = {


		productId: uuid,
		productName: productName,
		states: state,
		description: description,
		category: category,
		qrCode: qrCode
	};

	blockchain.registerProduct(product, req.session.chain_user, req.session.peer, function(result){
		if(result.status === "success"){
			mongo.addProduct(product, function(mongo_result){
				if (mongo_result && mongo_result.r &&mongo_result.r.insertedCount
					&& mongo_result.r.insertedCount === 1) {
						res.send({status:'success'});
					} else {
						console.log(mongo_result.err);
						res.send(mongo_result.err);
					}
				});
			} else {
				console.log(result.status);
				res.send({status:'error'});
			}

		});
	};

	exports.query = function(req, res){
		var qrCode = req.body.qrCode;
		//	var qrCode = "42352352523323"; //Test Value

		mongo.queryProduct(qrCode, function(result){
			if (result && result.status && result.status === "success") {
				blockchain.queryProduct(result.productId, req.session.chain_user, req.session.peer, function(blockchain_result){
					if(blockchain_result.status === "success"){
						res.send({
							status: "success",
							product: blockchain_result.product
						});
					} else {
						res.send({
							status: "error",
							err: blockchain_result.err
						});
					}

				});
			} else {
				console.log(result.err);
				res.send(result.err);
			}

		});

	};


	exports.track = function(req, res){

		console.log(req.params);




	}
