var express = require('express'), routes = require('./routes'), user = require('./routes/user'), product = require('./routes/product'), http = require('http'), path = require('path');

var sessions = require("client-sessions");
var contract = require('./routes/contract');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

//app.use(session({
//	secret : 'Blockchain',
//	resave : true,
//	saveUninitialized : false,
//	cookie : {
//		secure : true
//	}
//}));

app.use(sessions({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'blockchain', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.post('/register', user.register);
app.post('/login', user.login);

app.post('/register-product', product.register);
app.post('/registercontract', contract.registercontract);
app.post('/getcontract', contract.getcontract);
app.get('/register-product', product.register);
app.get('/track/:productId', product.track);


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
