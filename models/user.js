/** user.js
 * 
 * define user schema
 * 
 * Ian Zurutuza
 * last modified: 29 Nov 2019
 */

// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

// define the schema for our user model
var userSchema = mongoose.Schema({
    
    name: { 
        first: { type: String, required: true},
        middle: { type: String },
        last: { type: String },
    },
    phone: { 
        number: {
            type: String,
            required: [true, 'User phone number required']
        },
        ext: {
            type: String,
        }
    },
    email: { type: String, required: true, index: true },
    password: { type: String, required: true },
    email_authenticated: { type: Boolean, default: false },
    
});

/**
 * Hash a password
 * 
 * @param {string} password - a users password
 */
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

/**
 * checking if password is valid
 * 
 * @param {string} password - a users password
 */
userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


/**
 * return full name of user
 */
userSchema.virtual('fullName').get( function () {

    if (this.name.last && this.name.middle)
        return this.name.first + ' ' + this.name.middle + ' ' + this.name.last;
    
    if (this.name.last)
        return this.name.first + ' ' + this.name.last;
    
    if (this.name.middle)
        return this.name.first + ' ' + this.name.middle;

    return this.name.first
});


/** 
 * return phone number as a human-readable string
 * eg. +1 214-435-7292 (ext#12)
 **/ 
userSchema.virtual('readablePhone').get( function () {

    var readablePhone = "";
    var phoneNumber = this.phone.number;

    if (phoneNumber.length > 10) { // remove country code
        var countryCode = phoneNumber.length - 10
        readablePhone = readablePhone.concat('+', phoneNumber.substring(0,countryCode), ' ')
        phoneNumber = phoneNumber.substring(countryCode)
    }

    // add rest of number back to string
    readablePhone = readablePhone.concat(phoneNumber.substring(0,3), '-', phoneNumber.substring(3,6), '-', phoneNumber.substring(6))
    
    // add extension
    if (this.phone.ext) {
        readablePhone = readablePhone.concat(' (ext#', this.phone.ext, ')')
    }

    return readablePhone
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
