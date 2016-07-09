var Tag = require('../models/Tag');
var Music = require('../models/Music');
var User = require('../models/User');
var cmp = require('../middlewares/cmp');
var filter = require('../middlewares/filter');

// interface /home or /
exports.showHome = function(req, res, next) {
	var bg_image_url = '***';
	var tot_hotest_count = 8;
	var newest_count = 10;
	var hotest_count = 8;

	Tag.findByDefaultTagNameList(null, function(err, tags) {
		if (err) {
			console.log ('Error in showHome Page Controller.');
		} else {
			Music.populate(tags, {path: 'music_list'}, function(err, tags_pm) {
				if (err) {
					console.log ('Error in show Home Page Controller while populating tags\'s music_list');
				} else {
					console.log ('The size of tags_pm is : ', tags_pm.length);
					
					// construct music_list
					var music_list = [];

					// construct newest_music and hotest_music.
					var newest_music = [];
					var hotest_music = [];

					for (t_i in tags_pm) {
						var tag = tags_pm[t_i];
						music_list.push( filter.filterPublicMusic(tag.music_list) );
						newest_music.push( music_list[t_i].sort(cmp.newest_cmp).slice(0, newest_count) );
						hotest_music.push( music_list[t_i].sort(cmp.hotest_cmp).slice(0, hotest_count) );
					}

					// Music find begin.
					Music.find({},function(err, musics) {
						if (err) {
							console.log('Error in /home interface.');
						} else {
							var tot_music_list = filter.filterPublicMusic(musics);
							// get tot_hotest_music
							var tot_hotest_music = tot_music_list.sort(cmp.hotest_cmp).slice(0, tot_hotest_count);
							
							// render begin.
							User.populate(tot_hotest_music,{path:'author'}, function(err, tot_hotest_music_pu ){
							User.populate(newest_music, {path: 'author'}, function(err, newest_music_pu) {
							User.populate(hotest_music, {path: 'author'}, function(err, hotest_music_pu) {
								ret_tags = {};
								for (var t_i in tags) {
									ret_tags[t_i] = {
										tag: tags[t_i],
										newest_music: newest_music_pu[t_i],
										hotest_music: hotest_music_pu[t_i]
									};
								}

								res.render('home', {
									bg_image_url: bg_image_url,
									tot_hotest_music: tot_hotest_music_pu,
									tags: ret_tags,
									user: req.session.user === undefined ? null : {
										_id: req.session.user._id,
										username: req.session.user.username,
										profile: req.session.user.profiles
									}
								});
							}); }); });
							// render end

						}
					});
					// Music find end.

				}
			});
		}
	});

	// Tag.findOne({
	// 	tag_name: tag_name_list[0]
	// }).populate('music_list').exec(function(err, tag0) {
	// 	if (err) {
	// 		console.log('Error in finding tag0.');
	// 	} else {
	// 		var tag0_music_list = filter.filterPublicMusic(tag0 == null ? [] : tag0.music_list);
	// 		// sort musics of tag0 , get newest musics and hotest music.
	// 		var tag0_newest_music = tag0 == null ? null : tag0_music_list.sort(cmp.newest_cmp).slice(0, newest_count);
	// 		var tag0_hotest_music = tag0 == null ? null : tag0_music_list.sort(cmp.hotest_cmp).slice(0, hotest_count);

	// 		// finding tag1 begin
	// 		Tag.findOne({
	// 			tag_name: tag_name_list[1]
	// 		}).populate('music_list').exec(function(err, tag1) {
	// 			if (err) {
	// 				console.log('Error in finding tag1.');
	// 			} else {
	// 				var tag1_music_list = filter.filterPublicMusic(tag1 == null ? [] : tag1.music_list);
	// 				// sort musics of tag0 , get newest musics and hotest music.
	// 				var tag1_newest_music = tag1== null ? null : tag1_music_list.sort(cmp.newest_cmp).slice(0, newest_count);
	// 				var tag1_hotest_music = tag1== null ? null : tag1_music_list.sort(cmp.hotest_cmp).slice(0, hotest_count);

	// 				// finding tag2 begin
	// 				Tag.findOne({
	// 					tag_name: tag_name_list[2]
	// 				}).populate('music_list').exec(function(err, tag2) {
	// 					if (err) {
	// 						console.log('Error in finding tag2.');
	// 					} else {
	// 						var tag2_music_list = filter.filterPublicMusic(tag2 == null ? [] : tag2.music_list);
	// 						// sort musics of tag0 , get newest musics and hotest music.
	// 						var tag2_newest_music = tag2== null ? null : tag2_music_list.sort(cmp.newest_cmp).slice(0, newest_count);
	// 						var tag2_hotest_music = tag2== null ? null : tag2_music_list.sort(cmp.hotest_cmp).slice(0, hotest_count);

	// 						// finding tag3 begin
	// 						Tag.findOne({
	// 							tag_name: tag_name_list[3]
	// 						}).populate('music_list').exec(function(err, tag3) {
	// 							if (err) {
	// 								console.log('Error in finding tag3.');
	// 							} else {
	// 								var tag3_music_list = filter.filterPublicMusic(tag3 == null ? [] : tag3.music_list);
	// 								// sort musics of tag0 , get newest musics and hotest music.
	// 								var tag3_newest_music = tag3 == null ? null : tag3_music_list.sort(cmp.newest_cmp).slice(0, newest_count);
	// 								var tag3_hotest_music = tag3 == null ? null : tag3_music_list.sort(cmp.hotest_cmp).slice(0, hotest_count);

	// 								// Music find begin.
	// 								Music.find({},function(err, musics) {
	// 									if (err) {
	// 										console.log('Error in /home interface.');
	// 									} else {
	// 										tot_music_list = filter.filterPublicMusic(musics);
	// 										// get tot_hotest_music
	// 										var tot_hotest_music = tot_music_list.sort(cmp.hotest_cmp).slice(0, tot_hotest_count);
											
	// 										// render begin.
	// 										User.populate(tot_hotest_music,  {path:'author'}, function(err, tot_hotest_music_pu){
	// 										User.populate(tag0_newest_music, {path:'author'}, function(err, tag0_newest_music_pu){
	// 										User.populate(tag0_hotest_music, {path:'author'}, function(err, tag0_hotest_music_pu){
	// 										User.populate(tag1_hotest_music, {path:'author'}, function(err, tag1_newest_music_pu){
	// 										User.populate(tag1_hotest_music, {path:'author'}, function(err, tag1_hotest_music_pu){
	// 										User.populate(tag2_hotest_music, {path:'author'}, function(err, tag2_newest_music_pu){
	// 										User.populate(tag2_hotest_music, {path:'author'}, function(err, tag2_hotest_music_pu){
	// 										User.populate(tag3_hotest_music, {path:'author'}, function(err, tag3_newest_music_pu){
	// 										User.populate(tag3_hotest_music, {path:'author'}, function(err, tag3_hotest_music_pu){
	// 											res.render('home', {
	// 												bg_image_url: bg_image_url,
	// 												tot_hotest_music: tot_hotest_music_pu,
	// 												tags: {
	// 													tag0: {
	// 														tag: tag0,
	// 														newest_music: tag0_newest_music_pu,
	// 														hotest_music: tag0_hotest_music_pu
	// 													},
	// 													tag1: {
	// 														tag: tag1,
	// 														newest_music: tag1_newest_music_pu,
	// 														hotest_music: tag1_hotest_music_pu
	// 													},
	// 													tag2: {
	// 														tag: tag2,
	// 														newest_music: tag2_newest_music_pu,
	// 														hotest_music: tag2_hotest_music_pu
	// 													},
	// 													tag3: {
	// 														tag: tag3,
	// 														newest_music: tag3_newest_music_pu,
	// 														hotest_music: tag3_hotest_music_pu
	// 													},
	// 												},
	// 												user: {
	// 													username: req.session.user == undefined ? null : req.session.user.username,
	// 													profile: req.session.user == undefined ? null : req.session.user.profiles
	// 												}
	// 											});
	// 										}); }); }); }); }); }); }); }); });
	// 										// render end

	// 									}
	// 								});
	// 								// Music find end.
	// 							}
	// 						});
	// 						// finding tag3 end

	// 					}
	// 				});
	// 				// finding tag2 end

	// 			}
	// 		});
	// 		// finding tag1 end
	// 	}
	// });
};
