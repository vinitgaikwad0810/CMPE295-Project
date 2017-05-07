var mongo = require('./mongo');
var ctr = 0;

var users = [{
        peer: "https://c560f79422f7449b88b373e130ae3b7c-vp0.us.blockchain.ibm.com:5002",
        user: "user_type2_0"
    },
    {
        peer: "https://c560f79422f7449b88b373e130ae3b7c-vp1.us.blockchain.ibm.com:5002",
        user: "user_type2_1"
    },
    {
        peer: "https://c560f79422f7449b88b373e130ae3b7c-vp2.us.blockchain.ibm.com:5002",
        user: "user_type2_2"
    },
    {
        peer: "https://c560f79422f7449b88b373e130ae3b7c-vp3.us.blockchain.ibm.com:5002",
        user: "user_type1_3"
    }
];

exports.users = users;


exports.register = function(req, res) {

    var idx = ctr % 4;
    ctr++;

    var peerDetails = users[idx];

    mongo.createUser(req.body.user, req.body.pass, peerDetails.peer,
        peerDetails.user,
        function(result) {
            if (result && result.r && result.r.insertedCount &&
                result.r.insertedCount === 1) {
                if (req.session) {
                    req.session.user = req.body.user;
                    req.session.chain_user = peerDetails.user;
                    req.session.peer = peerDetails.peer;
                    res.send({
                        status: 'success'
                    });
                }
            } else {
                console.log(result.err);
                res.send(result.err);
            }
        });
};

exports.login = function(req, res) {
    mongo.checkCredentials(req.body.user, req.body.pass, function(result) {
        if (result.status === 'success') {
            if (req.session) {
                req.session.user = req.body.user;
                req.session.chain_user = result.chain_user;
                req.session.peer = result.peer;
                console.log(req.session);
                res.send({
                    status: 'success'
                });
            }
        } else {
            console.log(result.err);
            res.send(result.err);
        }
        res.end();
    });
};

exports.getProductIdsForUser = function(req, res) {
    mongo.getProductIdsForUser(req.session.user, function(result) {
        if (result.status === 'success') {
            res.send({
                status: 'success',
                trackedProducts: result.trackedProducts
            });
        } else {
            console.log(result.err);
            res.send(result.err);
        }
        res.end();
    });
};
