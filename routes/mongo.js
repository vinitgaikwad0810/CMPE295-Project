var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://blockchain:blockchain@ds149700.mlab.com:49700/blockchain';

exports.createUser = function(username, pass, peer, chain_user, callback) {

	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log(err);
			callback({
				err : 'Internal server error'
			});
		} else {
			db.collection('users').find({
				email : username
			}).toArray(function(err, docs) {
				if (err) {
					console.log(err);
					db.close();
					callback({
						err : 'Internal server error'
					});
				} else {
					if (docs.length === 0) {
						// console.log('hid' + db.collections('users'));
						db.collection('users').insertOne({
							email: username,
							pass: pass,
							peer: peer,
							chain_user: chain_user
						}, function(err, r) {
							if (err) {
								console.log(err);
								db.close();
								callback({
									err : 'Internal server error'
								});
							} else {
								db.close();
								callback(r);
							}
						});
					} else {
						db.close();
						callback({
							err : 'User already exists'
						});
					}
				}
			});
		}
	});
};

exports.checkCredentials = function(username, pass, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log(err);
			callback({
				err : 'Internal server error'
			});
		} else {
			db.collection('users').find({
				email : username,
				pass : pass
			}).toArray(function(err, docs) {
				if (err) {
					console.log(err);
					db.close();
					callback({
						err : 'Internal server error'
					});
				} else {
					if (docs.length === 1) {
						db.close();
						callback({
							status : 'success'
						});
					} else {
						db.close();
						callback({
							status : 'error'
						});
					}
				}
			});
		}
	});
};
