
exports.createTags = function(req, res, next) {
	var tag_name_list = [ {tag_name :'抒情'}, { tag_name: '恐怖'}, {tag_name: '空灵'}, {tag_name: '浪漫'}];
	Tag.create(tag_name_list, function(err, tags) {
		if (err) {
			console.log('Error in /editor/create_tags interface of creating tags.');
		} else {
			console.log('Create tags successfully.');
			res.send(tags);
		}
	});
};

exports.lookTags = function(req, res, next) {
	Tag.find({}, function(err, tags) {
		res.send(tags);
	});
};

exports.clearData = function(req, res, next) {
    User.remove({}, function(err) {});
    Comment.remove({}, function(err) {});
    Tag.remove({}, function(err){});
    Spectrum.remove({}, function() {});
    Music.remove({}, function(){});
    res.send('Clear data successfully.');
};

