/**
 * Module dependencies.
 */
let Config = require('./config/constants');
global.C = new Config();

// Log uncaught exception as well
process.on('uncaughtException', function (exception) {
    console.log('########## SERVER CRASHED WITH UNCAUGHT EXCEPTION ##########');
    let err = exception;
    if (typeof err === 'object') {
        if (err.message) {
            console.log('\nMessage: ' + err.message)
        }
        if (err.stack) {
            console.log('\nStacktrace:')
            console.log('====================')
            console.log(err.stack);
        }
    } else {
        console.log('dumpError :: argument is not an object');
    }
    process.exit(1);
});

Object.defineProperty(global, '__stack', {
    get: function() {
        let orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        let err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        let stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
    get: function () {
        return __stack[1].getLineNumber();
    }
});

Object.defineProperty(global, '__function', {
    get: function () {
        return __stack[1].getFunctionName();
    }
});

Object.defineProperty(global, '__file', {
    get: function () {
        return __stack[1].getFileName();
    }
});

global.cl = function(data, line, func, file) {
    console.log(data);
    let str = '^';
    if(typeof func != 'undefined')
        str += ` Function ${func}`;
    if(typeof line != 'undefined')
        str += ` On line ${line}`;
    if(typeof file != 'undefined')
        str += ` In file ${file}`;
    if(str != '^')
        console.log(str);
}

global.ul = function(data, line, func, file) {
    let util = require('util');
    if(process.env.NODE_ENV !== 'production')
        console.log(util.inspect(data, false, null));
    let str = '^';
    if(typeof func != 'undefined')
        str += ` Function ${func}`;
    if(typeof line != 'undefined')
        str += ` On line ${line}`;
    if(typeof file != 'undefined')
        str += ` In file ${file}`;
    if(str != '^')
        console.log(str);
}

//------------Mongo Connection ------------//
let mongoose = require('mongoose');
let mongooseOptions = {
    server:{
        auto_reconnect: true,
        socketOptions:{
            connectTimeoutMS:3600000,
            keepAlive:120,
            socketTimeoutMS:3600000
        },
        // retry to connect for 60 times
        reconnectTries: 60,
        // wait 5 second before retrying
        reconnectInterval: 5000
    }
};
// use createConnection instead of calling mongoose.connect so we can use
// multiple connections
mongoose.connection.on('open', function (ref) {
    console.info('Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
    console.error('Could not connect to mongo server!', err);
});

mongoose.connect(C.mongodbConnection, mongooseOptions, function(error, db) {});

mongoose.Promise = global.Promise;
//------------Mongo Connection ------------//

// Importing other modules
const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    http = require('http'),
    request = require('request'),
    app = express(),
    methodOverride = require('method-override'),
    router = express.Router(),
    resp = require('./lib/responseHandler');

app.set('port', process.env.PORT || C.defaultPort);

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ type: 'text/plain', limit: '50mb' }));
app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));
app.use(methodOverride());
app.use(resp.bodyParserHandle);

let apiRoute = require('./routes/apiRoutes') (app, router);

//404
app.get('*', (req, res, next) => {
    resp.responseWithError(req, res, {status: 404, message: `Invalid path at ${req.path}`})
});
//405
app.all('*', (req, res, next) => {
    resp.responseWithError(req, res, {status: 405, message: `${req.method} method is not allowed at ${req.path}.`});
});
app.use(resp.errorHandler);

let server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.info('Express server listening on port ' + app.get('port'));
});
server.setTimeout(500000);
module.exports = server;