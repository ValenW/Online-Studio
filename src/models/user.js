var mongoose = require('mongoose');

UserSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
  createDate: Date
});

module.exports = mongoose.model('User', UserSchema);