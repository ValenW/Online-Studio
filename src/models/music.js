var mongoose = require('mongoose');

MusicSchema = new mongoose.Schema({
  id: String,
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

MusicSchema.static('findMusicById', function(id, callback) {
  return this.find({id: id}, callback);
});

module.exports = mongoose.model('Music', MusicSchema);
