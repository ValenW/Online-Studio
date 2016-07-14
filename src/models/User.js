var mongoose = require('mongoose');

UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    confed: Boolean,
    profile: String,
    introduction: String,
    original_musics  : [{type: mongoose.Schema.Types.ObjectId, ref: 'Music'}],
    collected_musics : [{type: mongoose.Schema.Types.ObjectId, ref: 'Music'}],
    derivative_musics: [{type: mongoose.Schema.Types.ObjectId, ref: 'Music'}],
    createDate: Date
});

UserSchema.method('addOriginalMusic', function(music_id) {
    this.original_musics.push(music_id);
    console.log ('Add original music ', music_id, ' for user ', this._id);
});

UserSchema.method('addDerivativeMusic', function(music_id) {
    this.derivative_musics.push(music_id);
    console.log ('Add derivative music ', music_id, ' for user ', this._id);
});

UserSchema.static('addOriginalMusicForUser', function(info, callback) {
    // console.log(info);
    this.findOne({
        _id: info.user_id
    }, function(err, user) {
        if (err) {
            console.log('Error in User.addOriginalMusicForUser method.');
        } else {
            user.addOriginalMusic(info.music_id);
            user.save();
            callback(true);
        }
    });
});

UserSchema.static('addDerivativeMusicForUser', function(info, callback) {
    // console.log(info);
    this.findOne({
        _id: info.user_id
    }, function(err, user) {
        if (err) {
            console.log('Error in User.addDerivativeMusicForUser method.');
        } else {
            user.addDerivativeMusic(info.music_id);
            user.save();
            callback(true);
        }
    });
});


UserSchema.static('findByUsername', function(username, callback) {
    return this.find({username: username}, callback);
});

UserSchema.static('findByEmail', function(email, callback) {
    return this.find({email: email}, callback);
});

module.exports = mongoose.model('User', UserSchema);
