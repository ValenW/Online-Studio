var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
  id: String,
  tag_name: String,
  music_list: [{type: mongoose.Schema.Types.ObjectId, ref: 'Music'}]
});

TagSchema.static('findByTagName', function(tag_name, callback) {
  return this.find({tag_name: tag_name}, callback);
});

// TagSchema.static('getNewestMusics', function(tag_name_list, callback) {
	
// });

module.exports = mongoose.model('Tag', TagSchema);
