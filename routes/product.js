var uuidV1 = require('uuid/v1');
var blockchain = require('./blockchain');
var mongo = require('./mongo');

exports.register = function(req, res) {
	var productName = req.body.productName;
	var uuid = uuidV1(); 
	var state = [];
	var description = req.body.description;
	var category = req.body.category;
	var qrCode = req.body.qrCode;
	
	var product = {			
			productId: uuid,
			productName: productName,			
			state: state,
			description: description,
			category: category,
			qrCode: qrCode
	};
	
	blockchain.registerProduct(product, req.session.chain_user, req.session.peer, function(result){
		if(result.status === "success"){
			mongo.addProduct(product, function(result){
				if (result && result.r &&result.r.insertedCount
						&& result.r.insertedCount === 1) {
					res.send({status:'success'});
				} else {
					console.log(result.err);
					res.send(result.err);
				}
			});
		} else {
			console.log(result.status);
			res.send({status:'error'});
		}		
	});
};


