var mongoose = require('mongoose');

MusicSchema = new mongoose.Schema({
  id: String,
  tracks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}],
  name: String,
  author: String,
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
  ranks: [ [long] ],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  listenN: long,
  collectN: long,
  commentN: long,
  shareN: long
});

MusicSchema.static('findMusicById', function(id, callback) {
  return this.find({id: id}, callback);
});

module.exports = mongoose.model('Music', MusicSchema);
