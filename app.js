var express = require('express'), routes = require('./routes'), user = require('./routes/user'), product = require('./routes/product'), http = require('http'), path = require('path');
var session = require('express-session');
var contract = require('./routes/contract');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(session({
	secret : 'Blockchain',
	resave : false,
	saveUninitialized : true,
	cookie : {
		secure : true
	}
}));
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.post('/register', user.register);
app.post('/login', user.login);
app.post('/registercontract', contract.registercontract);
app.post('/getcontract', contract.getcontract);
app.get('/register-product', product.register);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
