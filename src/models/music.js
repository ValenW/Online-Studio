var mongoose = require('mongoose');

MusicSchema = new mongoose.Schema({
  spectrum: [{type: mongoose.Schema.Types.ObjectId, ref: 'Spectrum'}],
  name: String,
  author: String,
  cover: String,
  date: {type: Date, default: Date.now},
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
  ranks: [Number],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  listenN: Number,
  collectN: Number,
  commentN: Number,
  shareN: Number
});

MusicSchema.static('findMusicById', function(_id, callback) {
  return this.find({_id: _id}, callback);
});

module.exports = mongoose.model('Music', MusicSchema);
