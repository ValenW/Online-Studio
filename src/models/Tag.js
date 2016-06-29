var mongoose = require('mongoose');

TagSchema = new mongoose.Schema({
  id: String,
  tag_name: String,
  music_list: [{type: mongoose.Schema.Types.objectId, ref: 'Music'}]
});

TagSchema.static('findByTagName', function(tag_name, callback) {
  return this.find({tag_name: tag_name}, callback);
});

// TagSchema.static('getNewestMusics', function(tag_name_list, callback) {
	
// });

module.exports = mongoose.model('Tag', TagSchema);
