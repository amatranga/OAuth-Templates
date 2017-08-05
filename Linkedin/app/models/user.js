const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  linkedin: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

module.exports = mongoose.model('user', userSchema);
