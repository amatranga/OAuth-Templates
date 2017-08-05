const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  github: {
    id: String,
    login: String,
    name: String,
    username: String,
  }
});

module.exports = mongoose.model('user', userSchema);
