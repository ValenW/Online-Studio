var mongoose = require('mongoose');

CommentSchema = new mongoose.Schema({
    comment_date: {type: Date, default: Date.now},
    comment_content: String
});

CommentSchema.static('findByMusicId', function(music_id, callback) {
    // 将音乐相关的所有评论找出
    // 实际上可以只找前十条评论
    return this.find({music_id: music_id}, callback);
});

module.exports = mongoose.model('Comment', CommentSchema);
