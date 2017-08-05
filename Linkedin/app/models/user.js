const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  linkedin: {
    id: String,
    name: String,
    email: String,
    headline: String
  }
});

module.exports = mongoose.model('user', userSchema);
