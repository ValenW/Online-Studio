var mongoose = require('mongoose');
var Music = require('../models/Music');


CommentSchema = new mongoose.Schema({
	comment_userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    comment_date: {type: Date, default: Date.now},
    comment_content: String
});

CommentSchema.static('findByMusicId', function(music_id, callback) {
    // 将音乐相关的所有评论找出
    // 实际上可以只找前十条评论
    Music
        .findOne({_id: music_id})
        .populate('comments')
        .exec(function(err, music) {
            if (err) {
                console.log("err when find music by ID: ", err);
                throw err;
            } else {
                if (music === null) console.log("no such music with ID: ", music_id);
                else {
                    return music.comments.exec(callback);
                }
            }
        });
    //return this.find({music_id: music_id}).populate("comment_userId").exec(callback);
});

module.exports = mongoose.model('Comment', CommentSchema);
