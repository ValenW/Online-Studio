var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
    tag_name: String,
    music_list: [{type: mongoose.Schema.Types.ObjectId, ref: 'Music'}]
});

TagSchema.static('findByTagName', function(tag_name, callback) {
  return this.find({tag_name: tag_name}, callback);
});

TagSchema.static('findByDefaultTagNameList', function(tag_name, callback) {	// tag_name is not used
	var tag_name_list = new Array('抒情', '恐怖', '空灵', '浪漫');
	return 	this.find({
				tag_name: {
					$in: tag_name_list
				}
			}, callback);
});

module.exports = mongoose.model('Tag', TagSchema);
