var express = require('express');
var router = express.Router();
var Tag = require('../models/Tag');
var Music = require('../models/Music');
// var showHomePage = function(req, res, next) {
// 	var tag_name_list = new Array('抒情', '恐怖', '空灵', '浪漫');
// 	// Tag.getNewestMusics(tag_name_list);

// };

var newest_cmp = function(music1, music2) {
	console.log (music1.date);
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

router.route('/')
.get(function(req, res, next) {
	var bg_image_url = '***';
	var tag_name_list = new Array('抒情', '恐怖', '空灵', '浪漫');

	Tag.findOne({
		tag_name: tag_name_list[0]
	}).populate('music_list').exec(function(err, tag0) {
		if (err) {
			console.log('Error in finding tag0.');
		} else {
			// sort musics of tag0 , get newest musics and hotest music.
			tag0_newest_music = tag0 == null ? null : tag0.music_list.sort(newest_cmp).slice(0, 6);
			tag0_hotest_music = tag0 == null ? null : tag0.music_list.sort(hotest_cmp).slice(0, 10);

			// finding tag1 begin
			Tag.findOne({
				tag_name: tag_name_list[1]
			}).populate('music_list').exec(function(err, tag1) {
				if (err) {
					console.log('Error in finding tag1.');
				} else {
					// sort musics of tag0 , get newest musics and hotest music.
					tag1_newest_music = tag1== null ? null : tag1.music_list.sort(newest_cmp).slice(0, 6);
					tag1_hotest_music = tag1== null ? null : tag1.music_list.sort(hotest_cmp).slice(0, 10);

					// finding tag2 begin
					Tag.findOne({
						tag_name: tag_name_list[2]
					}).populate('music_list').exec(function(err, tag2) {
						if (err) {
							console.log('Error in finding tag2.');
						} else {
							// sort musics of tag0 , get newest musics and hotest music.
							tag2_newest_music = tag2== null ? null : tag2.music_list.sort(newest_cmp).slice(0, 6);
							tag2_hotest_music = tag2== null ? null : tag2.music_list.sort(hotest_cmp).slice(0, 10);

							// finding tag3 begin
							Tag.findOne({
								tag_name: tag_name_list[3]
							}).populate('music_list').exec(function(err, tag3) {
								if (err) {
									console.log('Error in finding tag3.');
								} else {
									// sort musics of tag0 , get newest musics and hotest music.
									tag3_newest_music = tag3== null ? null : tag3.music_list.sort(newest_cmp).slice(0, 6);
									tag3_hotest_music = tag3== null ? null : tag3.music_list.sort(hotest_cmp).slice(0, 10);

									// Music find begin.
									Music.find({}, function(err, musics) {
										if (err) {
											console.log('Error in /home interface.');
										} else {
											tot_hotest_music = musics.sort(hotest_cmp).slice(0, 9);
											// render begin
											// console.log ({
											// 	bg_image_url: bg_image_url,
											// 	tot_hotest_music: tot_hotest_music,
											// 	tags: {
											// 		tag0: {
											// 			tag: tag0,
											// 			newest_music: tag0_newest_music,
											// 			hotest_music: tag0_hotest_music
											// 		},
											// 		tag1: {
											// 			tag: tag1,
											// 			newest_music: tag1_newest_music,
											// 			hotest_music: tag1_hotest_music
											// 		},
											// 		tag2: {
											// 			tag: tag2,
											// 			newest_music: tag2_newest_music,
											// 			hotest_music: tag2_hotest_music
											// 		},
											// 		tag3: {
											// 			tag: tag3,
											// 			newest_music: tag3_newest_music,
											// 			hotest_music: tag3_hotest_music
											// 		},
											// 	},
											// 	user: {
											// 		username: req.session.user == undefined ? null : req.session.user.username,
											// 		profile: req.session.user == undefined ? null : req.session.user.profiles
											// 	}
											// });
											res.render('home', {
												bg_image_url: bg_image_url,
												tot_hotest_music: tot_hotest_music,
												tags: {
													tag0: {
														tag: tag0,
														newest_music: tag0_newest_music,
														hotest_music: tag0_hotest_music
													},
													tag1: {
														tag: tag1,
														newest_music: tag1_newest_music,
														hotest_music: tag1_hotest_music
													},
													tag2: {
														tag: tag2,
														newest_music: tag2_newest_music,
														hotest_music: tag2_hotest_music
													},
													tag3: {
														tag: tag3,
														newest_music: tag3_newest_music,
														hotest_music: tag3_hotest_music
													},
												},
												user: {
													username: req.session.user == undefined ? null : req.session.user.username,
													profile: req.session.user == undefined ? null : req.session.user.profiles
												}
											});
											// render end
										}
									});
									// Music find end.
								}
							});
							// finding tag3 end

						}
					});
					// finding tag2 end

				}
			});
			// finding tag1 end
		}
	});
});

module.exports = router;
