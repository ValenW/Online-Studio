var express = require('express');
var router = express.Router();

var newest_cmp = function(music1, music2) {
	if (music1.date > music2.date) {
		return 1;
	} else if (music1.date < music2.date) {
		return -1;
	}
};

var hotest_cmp = function(music1, music2) {
	if (music1.listenN > music2.listenN) {
		return 1;
	} else if (music1.listenN < music2.listenN) {
		return -1;
	}
};

// interface : classfication?tag_id=*** 
router.route('/')
.get(function(req, res, next) {
	// finding tag3 begin
	Tag.findOne({
		id: req.query.tag_id
	}).populate('music_list').exec(function(error, tag) {
		if (err) {
			console.log('Error in finding tag.');
		} else {
			// sort musics of tag0 , get newest musics and hotest music.
			tag_newest_music = tag == null ? null : tag.music_list.sort(newest_cmp).slice(0, 6);
			tag_hotest_music = tag == null ? null : tag.music_list.sort(hotest_cmp).slice(0, 10);

			// render begin
			res.render('***', {
				tag: tag,
				newest_music: tag_newest_music,
				hotest_music: tag_hotest_music,
				user: {
					username: req.session.user == undefined ? null : req.session.user.username,
					profile: req.session.user == undefined ? null : req.session.user.profiles
				}
			});
			// render end

		}
	});
	// finding tag3 end
});


module.exports = router;
