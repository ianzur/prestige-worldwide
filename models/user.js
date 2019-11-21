var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({

  // index by unique email
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    index: true
  },

  // users name 
  name: {
    type: String,
    required: true,
    trim: true
  },

  // User may save addresses
  address: [
    {
      name: { type: String },
      country: {
        type: String,
        // we can only ship to these countrys
        enum: [
          'United States', 
          'Spain', 
          'Canada', 
          'Mexico',
          'Puetro Rico', 
        ]
      },
      street: { type: String, required: true, },
      type: { type: String, },
      city: { type: String, required: true, },
      state: { type: String, required: true, },
      zip: { type: Number, required: true, },
      phone: {
        number: { type: Number },
       }
    }
  ],

  // list of package ids to be recieved
  recieving: [
      {
        pkgID: String,
        delivered: Boolean
      }
  ],

  // list of package ids sent
  sent: [
    {
      pkgID: String,
      delivered: Boolean
    }
  ],

  password: {
    type: String,
    required: true,
  }

});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

var User = mongoose.model('User', UserSchema);
module.exports = User;