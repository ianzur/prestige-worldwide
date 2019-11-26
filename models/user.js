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

// hash the password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


// return full name of user
userSchema.virtual('fullName').get( function () {

    if (this.name.last && this.name.middle)
        return this.name.first + ' ' + this.name.middle + ' ' + this.name.last;
    
    if (this.name.last)
        return this.name.first + ' ' + this.name.last;
    
    if (this.name.middle)
        return this.name.first + ' ' + this.name.middle;

    return this.name.first
});


// return phone number as a human-readable string
// eg. +1 214-435-7292 (ext#12)
userSchema.virtual('readablePhone').get( function () {

    var emptyString = "";
    var phoneNumber = this.phone.number;

    if (phoneNumber.length >= 10) { // remove country code
        var countryCode = phoneNumber.length - 10
        emptyString = emptyString.concat('+', phoneNumber.substring(0,countryCode), ' ')
        phoneNumber = phoneNumber.substring(countryCode)
    }

    // add rest of number back to string
    emptyString = emptyString.concat(phoneNumber.substring(0,3), '-', phoneNumber.substring(3,6), '-', phoneNumber.substring(6))
    
    // add extension
    if (this.phone.ext) {
        emptyString = emptyString.concat(' (ext#', this.phone.ext, ')')
    }

    return emptyString
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
