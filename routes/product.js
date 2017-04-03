var uuidV1 = require('uuid/v1');

exports.register = function(req, res) {
	console.log(uuidV1());
};
