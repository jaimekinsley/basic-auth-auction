const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
      delete ret.passwordHash;
    }
  }
});

schema.virtual('password').set(function(password){
  this.passwordHash = bcrypt.hashSync(password, +process.env.SALT_Rounds || 8);
});

schema.statics.authorized = function(email, password){
  return this.findOne({ email })
    .then(user => {
      if(!user) {
        throw new Error('Invalid email/password');
      }
      if(!user.compare(password)) {
        throw new Error('Invalid email/password');
      }
      return user;
    });
};

schema.methods.compare = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

module.exports = mongoose.model('User', schema);
