var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Tag = require('../models/Tag');

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

var filterPublicMusic = function(music_list) {
	rst_list = [];
	for (var music in music_list) {
		if (music.is_music_public) {
			rst_list.push(music);
		}
	}
	return rst_list;
};

// interface : category?tag_id=***&sorted=lastest&page=#
// interface : category?tag_id=***&sorted=lastest
router.route('/')
.get(function(req, res, next) {
	var newest_count = 20;
	var hotest_count = 20;
	var page = req.query.page == undefined ? 0 :  req.query.page - 1;
	var tag_name_list = new Array('抒情', '恐怖', '空灵', '浪漫');
	var sorted = req.query.sorted;

	// finding tag3 begin
	Tag.findOne({
		_id: req.query.tag_id
	}).populate('music_list').exec(function(err, tag) {

		if (err) {
			console.log('Error in finding tag.');
		} else {
			var tag_music_list = filterPublicMusic(tag == null ? [] : tag.music_list);
			// sort musics of tag0 , get newest musics and hotest music.
			var music_list = tag == null ? null : ( sorted == 'latest' ? tag_music_list.sort(newest_cmp).slice(page*newest_count, (page+1)*newest_count) : tag_music_list.sort(hotest_cmp).slice(page*hotest_count, (page+1)*hotest_count));

			// render begin
			User.populate(music_list, {path:'author'}, function(err, music_list_pu) {

				if (req.query.page == undefined) {	// page request

					Tag.find({
						tag_name: {
							$in: tag_name_list
						}
					}, function(err, tags) {
						if (err) {
							console.log ('Error in /category of Tag.find action.');
						} else {
							// render begin.
							res.render('category', {
								tag: tag,	// tag requested
								tags: tags,	// tags showed in Home Page
								music_list: music_list_pu,
								user: {
									username: req.session.user == undefined ? null : req.session.user.username,
									profile: req.session.user == undefined ? null : req.session.user.profiles
								}
							});
							// render end.
						}
					});

				} else {	// ajax request
					// json begin.
					res.json({
						// newest_music: tag_newest_music_pu,
						// hotest_music: tag_hotest_music_pu,
						music_list: music_list_pu,
					});
					// json end.
				}
				
			});
			// render end

		}
	});
	// finding tag3 end
});


module.exports = router;
