const { check, validationResult } = require('express-validator');

var Package = require('../models/package');

module.exports = function(app, passport) {

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs', {
            messages: req.flash(),
        });
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user,
            messages: req.flash(),
        });
    });

    // TRACK PACKAGE
    app.get('/track', isLoggedIn, function(req, res) {

        Package.find().or([
            {'from.contact.email': req.user.email},
            {'to.contact.email': req.user.email}
        ]).exec(
            function(err, items) {
                if (err) { return res.send(500, err) }
                if (items) {
                    res.render('track.ejs', {
                        user : req.user,
                        messages: req.flash(),
                        pkgs: items,
                    });
                }
            }
        )
        
    });

    app.get('/track/:pkgID', isLoggedIn, function(req, res) {

        Package.find({ '_id': req.params.pkgID}).exec(
            function(err, items) {
                if (err) { return res.send(500, err) }
                if (items) {
                    res.render('track.ejs', {
                        user : req.user,
                        messages: req.flash(),
                        pkgs: items,
                    });
                }
            }
        )
        
    });
  
    // SHIP PACKAGE
    app.get('/ship', isLoggedIn, function(req, res) {
        res.render('ship.ejs', {
            user : req.user,
            messages: req.flash(),
        });
    });

    app.post('/ship', [
        isLoggedIn,
        // check that user is the user logged in
        check('nameFrom')
            .custom((value, { req }) => {
                if (value !== req.user.fullName) {
                  throw new Error('Signed in user must send package');
                }
                return true; 
            }),
        // check that email matches logged in user
        check('emailFrom')
            .custom((value, { req }) => {
                if (value !== req.user.email) {
                    throw new Error('Email must match signed in user');
                }
                return true; 
            }),
        check('phoneFrom')
            .blacklist('A-z\\s-+.') //remove any non-numerics, -, +, . 
            .trim()
            .isNumeric({ no_symbols: true }).withMessage('please remove symbols from your phone number')
            .isLength({max: 14}).withMessage('too many digits in your phone number'),
        check('addressFrom')
            .not().isEmpty().withMessage('Must contain from address'),
        check('cityFrom')
            .not().isEmpty(),
        check('stateFrom')
            .not().isEmpty(),
        check('zipFrom')
            .blacklist('-')
            .isNumeric()
            .not().isEmpty().withMessage('must ship from a zip code')
            .isLength({ max: 9 }).withMessage('zip code is too long'),
        check('countryFrom')
            .not().isEmpty(),
        check('nameTo')
            .not().isEmpty().withMessage('Recipiant must have name'),
        check('emailTo')
            .isEmail()    
            .normalizeEmail(), // canonicalizes an email address (validatorjs)
        check('phoneTo')
            .blacklist('A-z\\s-+.') //remove any non-numerics, -, +, . 
            .trim()
            .isNumeric({ no_symbols: true }).withMessage('please remove symbols from your phone number')
            .isLength({max: 14}).withMessage('too many digits in your phone number'),
        check('addressTo')
            .not().isEmpty().withMessage('Must contain To address'),
        check('cityTo')
            .not().isEmpty(),
        check('stateTo')
            .not().isEmpty().withMessage('must ship to state'),
        check('zipTo')
            .blacklist('-')
            .isNumeric()
            .not().isEmpty().withMessage('must ship To a zip code')
            .isLength({ max: 9 }).withMessage('zip code is too long'),
        check('countryTo')
            .not().isEmpty(),
    ], function(req, res, done) {

        // handle data validation errors
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            var messages = [];
            errors.array().forEach(function(error){
                console.log(error);
                messages.push(error.msg);
            });
            req.flash('error', messages);
            res.redirect('/ship');
        }
        else {
            let newPackage = new Package();
            
            newPackage.weight = req.body.weight;
            newPackage.size.length = req.body.length;
            newPackage.size.width = req.body.width;
            newPackage.size.height = req.body.height;

            newPackage.from.name = req.body.nameFrom
            newPackage.from.email = req.body.emailFrom
            newPackage.from.phone = req.body.phoneFrom
            newPackage.from.country = req.body.countryFrom
            newPackage.from.street = req.body.addressFrom
            newPackage.from.street2 = req.body.address2From
            newPackage.from.city = req.body.cityFrom
            newPackage.from.state = req.body.stateFrom
            newPackage.from.zip = req.body.zipFrom

            newPackage.to.name = req.body.nameTo
            newPackage.to.email = req.body.emailTo
            newPackage.to.phone = req.body.phoneTo
            newPackage.to.country = req.body.countryTo
            newPackage.to.street = req.body.addressTo
            newPackage.to.street2 = req.body.address2To
            newPackage.to.city = req.body.cityTo
            newPackage.to.state = req.body.stateTo
            newPackage.to.zip = req.body.zipTo

            newPackage.save(function(error) {
                if (error) { return done(error) }
            });

            req.flash('success', 'Package shipped! (added to database)');
            res.redirect('/track');

        }
        
      
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(); // from passport module -> remove req.user property and clear login session
        res.redirect('/'); // redirect to home page
    });
   
    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', { 
            messages: req.flash(),
        });
    });

    // process the login form
    app.post('/login', [
        check('email')
            .normalizeEmail()
            .isEmail().withMessage('Misformatted email'),
        check('password')
            .not().isEmpty().withMessage('Please enter a password'),
    ], passport.authenticate('login',  {
        successRedirect: '/profile', // redirect to the secure profile section
        successFlash: 'Login successful!',
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { 
            messages: req.flash()
        });
    });

    // process the signup form
    app.post('/signup', [ // first we sanitize and validate our input
        check('email', 'Misformatted email')
            .isEmail()    
            .normalizeEmail(), // canonicalizes an email address (validatorjs)
        check('password', 'Password must be >5 characters long')
            .exists({ checkNull: true, checkFalsy: true })
            .isLength({ min: 5 }),
        check('passwordConfirm', 'passwords do NOT match')
            .exists({ checkNull: true, checkFalsy: true })
            .custom((value, { req }) => value === req.body.password), //passwords must match 
        check('firstName', 'first name required')
            .exists({ checkNull: true, checkFalsy: true })
            .trim(), //remove whitespace
        check('middleName')
            .trim(),
        check('lastName')
            .trim(),
        check('phone')
            .blacklist('\\s-+.') //remove any whitespace, -, +, . 
            .trim()
            .isNumeric({ no_symbols: true }).withMessage('please remove symbols from your phone number')
            .isLength({max: 14}).withMessage('too many digits in your phone number')
    ], passport.authenticate('signup', {
                successRedirect: '/profile', // redirect to the secure profile section
                successFlash: 'Account created!',
                failureRedirect: '/signup', // redirect back to the signup page if there is an error
                failureFlash: true // allow flash messages
            })
    );

    // Delete User Account, irreverisible. USER IS LOST FOREVER (not their packages)
    app.get('/delete', isLoggedIn, function(req, res) {

        // delete user
        req.user.delete(function(err) {
            if (err) { 
                throw err;
            };
        });

        req.flash('success', 'Account Deleted!');
        // since no error redirect to home page
        res.redirect('/');
    });


// Todo: ship package


// Todo track package


};

// route middleware to ensure user is logged in
// https://github.com/jaredhanson/passport
function isLoggedIn(req, res, next) {
    console.log('authCheck isLoggedIn() => ' + req.isAuthenticated());

    // test if request is authenticated
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
