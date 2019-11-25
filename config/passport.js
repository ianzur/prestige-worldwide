// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');

module.exports = function(passport) {

    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // See: http://www.passportjs.org/docs/

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // LOGIN
    passport.use('login', new LocalStrategy({
        usernameField : 'email', // by default, local strategy uses username and password, we are using email
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email) {
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        }

        // validate data before search database
        req.checkBody('email').isEmail().withMessage('Please enter your email');
        req.checkBody('password').notEmpty().withMessage('Please enter your password');

        var errors = req.validationErrors();

        // handle data validation errors
        if (errors) {
            var messages = [];
            errors.forEach(function(error){
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }

        process.nextTick(function() {
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('error', 'User does not exist.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('error', 'Incorrect password.'));

                // no errors, so return user
                return done(null, user);
            });
        });

    }));

    // Create new user 
    passport.use('signup', new LocalStrategy({
        usernameField : 'email', // by default, local strategy uses username and password, we are using email
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {

        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        console.log(req.body.passwordConfirm, password)

        // validate data before appending to database
        // req.checkBody('email').isEmail().withMessage('Misformatted email');
        // req.checkBody('password').isLength({ min: 5 }).withMessage('Password must be >5 characters long');
        // req.checkBody('passwordConfirm').equals(password).withMessage('password doesn\'t match');
        // req.checkBody('firstName').isLength({ min: 1 }).withMessage('first name required');

        var errors = req.validationErrors();

        // handle data validation errors
        if (errors) {
            var messages = [];
            errors.forEach(function(error){
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
 
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('error', 'That email is already taken.'));
                    } else {

                        // create the user
                        let newUser = new User();

                        newUser.name.first = req.body.firstName;
                        newUser.name.middle = req.body.middleName;
                        newUser.name.middle = req.body.lastName;
                        newUser.phone = req.body.phone;
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }
        });
    }));
};
