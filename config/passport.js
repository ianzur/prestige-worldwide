/** passport.js
 *
 * configure passport stratageey
 * 
 * Ian Zurutuza
 * last modified: 29 Nov 2019
 */

// required packages
const { check, validationResult } = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');

module.exports = function(passport) {

    // serialize & deserialize required for persistent login sessions
    // passport needs ability to serialize and deserialize users
    // See: http://www.passportjs.org/docs/

    /** 
     * used to serialize the user for the session
     *  
     * @param {object} user - user info
     * @param done - informs that the task is completed.
     */ 
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    /** 
     * used to deserialize the user
     *  
     * @param {string} id - user id 
     * @param done - informs that the task is completed.
     */
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    /**
     * LOGIN
     * 
     * @param {object} req - request
     * @param {string} email - user email
     * @param {string} password - user password
     * @param done - informs that the task is completed.
     */
    passport.use('login', new LocalStrategy({
        usernameField : 'email', // by default, local strategy uses username and password, we are using email
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {

        // handle data validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var messages = [];
            errors.array().forEach(function(error){
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
 
        // look in database for user
        process.nextTick(function() {
            User.findOne({ 'email' :  email }, function(err, user) {
                if (err) { return done(err); }  
                if (!user) { // user not found
                    return done(null, false, req.flash('error', 'User does not exist.'));
                }
                if (!user.verifyPassword(password)) {  // incorrect password
                    return done(null, false, req.flash('error', 'Incorrect password.'));
                }
                return done(null, user); // no errors -> return user
            });
        });
    }));

    /**
     * Sign-up
     * 
     * @param {objects} req - request
     * @param {string} email - user email
     * @param {string} password - user password
     * @param done - informs that the task is completed.
     */
    passport.use('signup', new LocalStrategy({
        usernameField : 'email', // by default, local strategy uses username and password, we are using email
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {

        // handle data validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var messages = [];
            errors.array().forEach(function(error){
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }

        // console.log(req.body.phone)
 
        // check if user exists
        process.nextTick(function() {
            User.findOne({ 'email' :  email }, function(err, user) {
                if (err) { return done(err); }
                if (user) { // if the user already exists 
                    return done(null, false, req.flash('error', 'That email is already taken.'));
                } else { // else create the user
                    let newUser = new User();

                    newUser.name.first = req.body.firstName;
                    newUser.name.middle = req.body.middleName;
                    newUser.name.last = req.body.lastName;
                    newUser.phone.number = req.body.phone;
                    newUser.phone.ext = req.body.ext;
                    newUser.email = email;
                    newUser.password = newUser.generateHash(password);

                    newUser.save(function(err) {
                        if (err) { return done(err); }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};
