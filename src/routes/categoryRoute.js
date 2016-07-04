var express = require('express');
var router = express.Router();
var User = require('../models/User');

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

// interface : classfication?tag_id=***&page=#
router.route('/')
.get(function(req, res, next) {
	var newest_count = 20;
	var hotest_count = 20;
	var page = req.query.page == undefined ? 0 :  req.query.page - 1;

	// finding tag3 begin
	Tag.findOne({
		id: req.query.tag_id
	}).populate('music_list').exec(function(error, tag) {
		if (err) {
			console.log('Error in finding tag.');
		} else {
			// sort musics of tag0 , get newest musics and hotest music.
			var tag_newest_music = tag == null ? null : tag.music_list.sort(newest_cmp).slice(page*newest_count, (page+1)*newest_count);
			var tag_hotest_music = tag == null ? null : tag.music_list.sort(hotest_cmp).slice(page*hotest_count, (page+1)*hotest_count);

			// render begin
			User.populate(tag_newest_music, {path:'author'}, function(err, tag_newest_music_pu) {
			User.populate(tag_hotest_music, {path:'author'}, function(err, tag_hotest_music_pu) {
				if (req.query.page == undefined) {	// page request
					res.render('category', {
						tag: tag,
						newest_music: tag_newest_music_pu,
						hotest_music: tag_hotest_music_pu,
						user: {
							username: req.session.user == undefined ? null : req.session.user.username,
							profile: req.session.user == undefined ? null : req.session.user.profiles
						}
					});
				} else {	// ajax request
					res.json({
						newest_music: tag_newest_music_pu,
						hotest_music: tag_hotest_music_pu,
					});
				}
				
			}); });
			// render end

		}
	});
	// finding tag3 end
});


module.exports = router;
