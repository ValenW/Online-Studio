var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
    tag_name: String,
    music_list: [{type: mongoose.Schema.Types.ObjectId, ref: 'Music'}]
});

TagSchema.method('removeMusicById', function(music_id) {
	for (var m_i = 0; m_i < this.music_list.length; m_i += 1) {
		if (this.music_list[m_i].toString() == music_id) {
			this.music_list.splice(m_i, 1);
			console.log ('Remove music_id ', music_id, ' in tag ', this._id);
			break;
		}
	}
});

TagSchema.method('addMusicById', function(music_id) {
	this.music_list.push(music_id);
	console.log ('Add music_id ', music_id, ' in tag ', this._id);
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
