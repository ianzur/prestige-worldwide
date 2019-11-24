module.exports = function(app, passport) {

// normal routes ===============================================================

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
        res.render('track.ejs', {
            user : req.user,
            messages: req.flash(),
        });
    });
  
    // SHIP PACKAGE
    app.get('/ship', isLoggedIn, function(req, res) {
        res.render('ship.ejs', {
            user : req.user,
            messages: req.flash(),
        });
    });

    app.post('/ship', isLoggedIn, function(req, res, done) {
        req.flash('success', 'Package shipped! (added to database)');
        res.redirect('/track');
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
    app.post('/login', passport.authenticate('login', {
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
    app.post('/signup',  
        passport.authenticate('signup', {
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
