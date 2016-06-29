var mongoose = require('mongoose');

MusicSchema = new mongoose.Schema({
  id: String,
  tracks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}],
  name: String,
  author: String,
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

module.exports = mongoose.model('Music', MusicSchema);
