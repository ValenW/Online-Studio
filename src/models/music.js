var mongoose = require('mongoose');

MusicSchema = new mongoose.Schema({
  created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  // original User
  spectrum: [{type: mongoose.Schema.Types.ObjectId, ref: 'Spectrum'}],
  name: String,
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  // revise User
  cover: String,
  date: {type: Date, default: Date.now},
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
  ranks: [Number],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  listenN: Number,
  collectN: Number,
  commentN: Number,
  shareN: Number,
  is_music_public: Boolean,  // indicate whether music is public
  is_spectrum_public: Boolean,  // indicate whether spectrum is public
  introduction: String
});

MusicSchema.static('findMusicById', function(_id, callback) {
  return this.find({_id: _id}, callback);
});

module.exports = mongoose.model('Music', MusicSchema);
