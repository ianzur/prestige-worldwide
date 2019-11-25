// server.js

/** Define constants for mongoDB connection
 *  You may need to change mongoURI if you did not use default mongo set-up
 */
const mongoURI = 'mongodb://localhost:27017/test' // 27027 default mongoDB port database name = 'test'
const port = process.env.PORT || 8080; // use port 8080 unless a preconfigure port exists

/* Import required packages */
const bodyParser = require('body-parser'); // package to handle form input from user
const colors = require('colors'); // because I like colored console messages
const express  = require('express'); // simple web framework to make my life easier 
const expressValidator = require('express-validator'); // middleware to validate user input on server-side
const flash = require('express-flash'); // middleware for handling single read messages to the client
const mongoose = require('mongoose'); 
const morgan = require('morgan'); // for logging requests
const passport = require('passport'); // package to keep authentication simple
const session = require('express-session'); // package to persist user data server-side by saving an ID in the clients cookies 
const responseTime = require('response-time') //package to record response time for requests
const StatsD = require('node-statsd') // package to calculate statistics

var stats = new StatsD()

stats.socket.on('error', function (error) {
    console.error(error.stack)
});

/* Configure and connect to mongodb with mongoose package */
// listen for connection success
mongoose.connection.on("open", function(ref) {
    return console.log("Connected to mongo server!".green);
});

// listen for connection error
mongoose.connection.on("error", function(err) {
    console.log("Could not connect to mongo server!".yellow);
    return console.log(err.message.red);
});

// define connection options
const options = {
    useNewUrlParser: true, // use new parser (underlying mongoDB driver has depriciated)
    useUnifiedTopology: true,
    useCreateIndex: true, // use createindex() instead of ensureindex() 
    useFindAndModify: false,
    autoIndex: true, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 2500, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity       
    family: 4 // Use IPv4, skip trying IPv6
}

// connect to mongodb, catch any errors here with a more specific error message
mongoose.connect(mongoURI, options)
    .then(() => console.log("established connection to local mongoDB instance at: " + mongoURI.cyan))
    .catch(err => console.log("failed initial connection to mongoDB. Did you start mongod.service?"))

// tell mongoose to use ES6-Promise for asynchronous commands
mongoose.Promise = global.Promise

// 
require('./config/passport')(passport); 

/** create expressapp */
const app = express()

app.use(morgan('dev')); // formate logger output
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({
    secret: 'aReallYbiGsecRet', // session secret
    resave: true,
    saveUninitialized: true
}));

// required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(flash()); // use express-flash for flash messages stored in session
app.use(expressValidator())

// define how to print response time to terminal
app.use(responseTime(function (req, res, time) {
    var stat = (req.method + req.url).toLowerCase()
      .replace(/[:.]/g, '')
      .replace(/\//g, '_')
    stats.timing(stat, time)
})); 

// // Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
// app.use(function(req, res, next){
//     // if there's a flash message in the session request, make it available in the response, then delete it
//     res.locals.sessionFlash = req.session.sessionFlash;
//     delete req.session.sessionFlash;
//     next();
// });

require('./routes/routes.js')(app, passport); // load our routes and pass in our app and configured passport

// launch app



app.listen(port);
console.log('site launched at: ' + ('http://localhost:' + String(port)).cyan);
