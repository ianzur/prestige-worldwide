/** server.js
 * 
 * main, run project with "node server.js" 
 * 
 * Ian Zurutuza
 * last modified: 29 Nov 2019
 */

 
/** 
 * Define constants for mongoDB connection
 * You may need to change mongoURI if you did not use default mongo set-up
 */
const mongoURI = 'mongodb://localhost:27017/test' // 27027 default mongoDB port database name = 'test'

const port = process.env.PORT || 8080; // use port 8080 unless a preconfigure port exists

/* Import required packages */
const bodyParser = require('body-parser'); // package to handle form input from user
const colors = require('colors'); // because I like colored console messages
const express  = require('express'); // simple web framework to make my life easier 
const flash = require('express-flash'); // middleware for handling single read messages to the client
const mongoose = require('mongoose'); 
const morgan = require('morgan'); // for logging requests
const passport = require('passport'); // package to keep authentication simple
const session = require('express-session'); // package to persist user data server-side by saving an ID in the clients cookies 

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
    useUnifiedTopology: true, // add this to silence depriciation warning
    useCreateIndex: true, // use createindex() instead of ensureindex() 
    autoIndex: true, // build indexes
}

// connect to mongodb, catch any errors here with a more specific error message
mongoose.connect(mongoURI, options)
    .then(() => console.log("established connection to local mongoDB instance at: " + mongoURI.cyan))
    .catch(err => console.log("failed initial connection to mongoDB. Did you start mongod.service?"))

// tell mongoose to use ES6-Promise for asynchronous commands
mongoose.Promise = global.Promise

// import passport config, how we persist user login information
require('./config/passport')(passport); 

/** create expressapp */
const app = express()

app.use(morgan('dev')); // formate logger output

// get information from html forms (set up body-parser)
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({
    secret: 'aReallYbiGsecRet', // session secret
    resave: true,
    saveUninitialized: true
}));

// required for passport
app.use(passport.initialize());
app.use(passport.session()); // persist login sessions

app.use(flash()); // use express-flash for flash messages stored in session

require('./routes/routes.js')(app, passport); // load our routes and pass in our app and configured passport

// launch app
app.listen(port);
console.log('site launched at: ' + ('http://localhost:' + String(port)).cyan);
