var Tag = require('../models/Tag');
var Music = require('../models/Music');
var User = require('../models/User');
var cmp = require('../middlewares/cmp');
var filter = require('../middlewares/filter');

/**
 * showHome() show home view to user.
 * Based on reqest parameters, set response.
 * display hotest and lastest musics of different tags in view
 * Deal with request URL : /home
 *						 : /
 * @param <Object> req store parameters of the user request.
 * @param <Object> res encapsulate content and methods of response to user request, such as res.render, res.json and res.send methods.
 * @param <Function> next encapsulate the next function needed to be execute if necessary
 * @return nothing
 */
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

					for (var t_i = 0; t_i < tags_pm.length; t_i += 1) {
						var tag = tags_pm[t_i];
						music_list.push( filter.filterPublicMusic(tag.music_list) );
						newest_music.push( music_list[t_i].sort(cmp.newest_cmp).slice(0, newest_count) );
						hotest_music.push( music_list[t_i].sort(cmp.hotest_cmp).slice(0, hotest_count) );
					}

					// Music find begin.
					Music.find({},function(err, musics) {
						if (err) {
							console.log('Error in /home interface.');
							res.render('error/500');
						} else {
							var tot_music_list = filter.filterPublicMusic(musics);
							// get tot_hotest_music
							var tot_hotest_music = tot_music_list.sort(cmp.hotest_cmp).slice(0, tot_hotest_count);
							
							// render begin.
							User.populate(tot_hotest_music,{path:'author'}, function(err, tot_hotest_music_pu ){
							User.populate(newest_music, {path: 'author'}, function(err, newest_music_pu) {
							User.populate(hotest_music, {path: 'author'}, function(err, hotest_music_pu) {
								ret_tags = {};
								for (var t_i = 0; t_i < tags.length; t_i += 1) {
									ret_tags[t_i] = {
										tag: tags[t_i],
										newest_music: newest_music_pu[t_i],
										hotest_music: hotest_music_pu[t_i]
									};
								}

								console.log('user in home:', req.session.user);
								res.render('home', {
									bg_image_url: bg_image_url,
									tot_hotest_music: tot_hotest_music_pu,
									tags: ret_tags,
									user: req.session.user === undefined ? null : {
										_id: req.session.user._id,
										username: req.session.user.username,
										profile: req.session.user.profile
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
};
