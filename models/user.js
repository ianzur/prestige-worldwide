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
        type: String,
        validate: {
          validator: function(v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    email_authenticated: { type: Boolean, default: false },
    
});

// hash the password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.virtual('fullName').get( function () {

    if (this.name.last && this.name.middle)
        return this.name.first + ' ' + this.name.middle + ' ' + this.name.last;
    
    if (this.name.last)
        return this.name.first + ' ' + this.name.last;
    
    if (this.name.middle)
        return this.name.first + ' ' + this.name.middle;

    return this.name.first
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
