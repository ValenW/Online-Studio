var mongoose = require('mongoose');

UserSchema = new mongoose.Schema({
  id: String,
  username: String,
  email: String,
  password: String,
  createDate: Date
});

UserSchema.static('findByUsername', function(username, callback){
  return this.find({username: username}, callback);
});

UserSchema.static('findByEmail', function(email, callback) {
  return this.find({email: email}, callback);
});

UserSchema.method('print', function() {
  console.log("hello");
});

module.exports = mongoose.model('User', UserSchema);