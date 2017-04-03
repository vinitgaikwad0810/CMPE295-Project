var mongo = require('./mongo');
var ctr = 0;

var users = [
		{
			peer : "https://e57848b76d894377a7f176f544757add-vp0.us.blockchain.ibm.com:5001",
			user : "user_type2_0"
		},
		{
			peer : "https://e57848b76d894377a7f176f544757add-vp1.us.blockchain.ibm.com:5001",
			user : "user_type2_1"
		},
		{
			peer : "https://e57848b76d894377a7f176f544757add-vp2.us.blockchain.ibm.com:5001",
			user : "user_type2_2"
		},
		{
			peer : "https://e57848b76d894377a7f176f544757add-vp3.us.blockchain.ibm.com:5001",
			user : "user_type2_3"
		} ];

exports.register = function(req, res) {

	var idx = ctr % 4;
	ctr++;

	var peerDetails = users[idx];

	mongo.createUser(req.body.user, req.body.pass, peerDetails.peer,
			peerDetails.user, function(result) {
				if (result && result.insertedCount
						&& result.insertedCount === 1) {
					res.send('Success');
				} else {
					res.send(result.err);
				}
			});
};

exports.login = function(req, res) {
	mongo.checkCredentials('dsdsdsd', '123', function(result) {
		if (result.status === 'success') {
			if (req.session) {
				req.session.user = 'dsdsdsd';
			}
			res.send('Success');
		} else {
			res.send('Error');
		}
	});
};
