var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://blockchain:blockchain@ds149700.mlab.com:49700/blockchain';

exports.createUser = function(username, pass, peer, chain_user, callback) {

    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log(err);
            callback({
                status : 'error',
                err : 'Internal server error: '+err
            });
        } else {
            db.collection('users').find({
                email : username
            }).toArray(function(err, docs) {
                if (err) {
                    console.log(err);
                    db.close();
                    callback({
                        status : 'error',
                        err : 'Internal server error: '+err
                    });
                } else {
                    if (docs.length === 0) {
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
                                    status : 'error',
                                    err : 'Internal server error: '+err
                                });
                            } else {
                                db.close();
                                callback({
                                    status: 'success',
                                    r: r
                                });
                            }
                        });
                    } else {
                        db.close();
                        callback({
                            status : 'error',
                            err : 'User already exists'
                        });
                    }
                }
            });
        }
    });
};

exports.getpeerid = function(username, callback) {
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log(err);
			callback({
				status : 'error',
				err : 'Internal server error: ' + err
			});
		} else {
			db.collection('users').find({
				email : username
			}).toArray(function(err, docs) {
				if (err) {
					console.log(err);
					db.close();
					callback({
						status : 'error',
						err : 'Internal server error: '+err
					});
				} else {
					if( docs.length === 0){
						db.close();
						callback({
							status : 'error',
							err: 'Invalid username/password'
						});
					}
					else if (docs.length === 1) {
						var chain_user = docs[0].chain_user;
						var peer = docs[0].peer;
						db.close();
						callback({
							status : 'success',
							chain_user: chain_user,
							peer: peer
						});
					} else {
						db.close();
						callback({
							status : 'error',
							err: 'Multiple users exist with same credentials'
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
                status : 'error',
                err : 'Internal server error: '+err
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
                        status : 'error',
                        err : 'Internal server error: '+err
                    });
                } else {
                    if( docs.length === 0){
                        db.close();
                        callback({
                            status : 'error',
                            err: 'Invalid username/password'
                        });
                    }
                    else if (docs.length === 1) {
                        var chain_user = docs[0].chain_user;
                        var peer = docs[0].peer;
                        db.close();
                        callback({
                            status : 'success',
                            chain_user: chain_user,
                            peer: peer
                        });
                    } else {
                        db.close();
                        callback({
                            status : 'error',
                            err: 'Multiple users exist with same credentials'
                        });
                    }
                }
            });
        }
    });
};


exports.addProduct = function(product, callback){
    MongoClient.connect(url, function(err, db) {
        if(err) {
            console.log(err);
            callback({
                status : 'error',
                err: 'Internal server error: '+err
            });
        } else {
            db.collection('products').find({
                qrCode : product.qrCode
            }).toArray(function(err, docs) {
                if (err) {
                    console.log(err);
                    db.close();
                    callback({
                        status: 'error',
                        err: 'Internal server error: ' + err
                    });
                } else {
                    if (docs.length === 0) {
                        db.collection('products').insertOne({
                            qrCode: product.qrCode,
                            productId: product.productId
                        }, function (err, r) {
                            if (err) {
                                console.log(err);
                                db.close();
                                callback({
                                    status: 'error',
                                    err: 'Internal server error: ' + err
                                });
                            } else {
                                db.close();
                                callback({
                                    status: 'success',
                                    r: r
                                });
                            }
                        });
                    } else {
                        db.close();
                        callback({
                            status: 'error',
                            err: 'Product already exists'
                        });
                    }
                }
            });
        }
    });
};

exports.queryProduct = function(qrCode, callback){
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log(err);
            callback({
                status : 'error',
                err : 'Internal server error: '+err
            });
        } else {
            db.collection('products').find({
                "qrCode" : ""+qrCode
            }).toArray(function(err, docs) {
                if (err) {
                    console.log(err);
                    db.close();
                    callback({
                        status : 'error',
                        err : 'Internal server error: '+err
                    });
                } else {
                    if(docs.length === 0){
                        db.close();
                        callback({
                            status : 'error',
                            err: 'No products found with QR code: ' + qrCode
                        });
                    }
                    else if (docs.length === 1) {
                        var productId = docs[0].productId;
                        db.close();
                        callback({
                            status : 'success',
                            productId: productId
                        });
                    } else {
                        db.close();
                        callback({
                            status : 'error',
                            err: 'Multiple products exist in the database with the same qrCode'
                        });
                    }
                }
            });
        }
    });
};

