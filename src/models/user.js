var mongoose = require('mongoose');

UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    confed: Boolean,
    profile: String,
    introduction: String,
    musics: [{type: mongoose.Schema.Types.ObjectId, ref: 'Music'}],
    createDate: Date
});


UserSchema.static('findByUsername', function(username, callback){
    return this.find({username: username}, callback);
});

UserSchema.static('findByEmail', function(email, callback) {
    return this.find({email: email}, callback);
});

module.exports = mongoose.model('User', UserSchema);
