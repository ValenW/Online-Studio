var mongoose = require('mongoose');

tempUserSchema = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
  email: String,
  createDate: Date
});

module.exports = mongoose.model('tempUser', tempUserSchema);