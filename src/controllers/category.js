var User = require('../models/User');
var Tag = require('../models/Tag');
var cmp = require('../middlewares/cmp');
var filter = require('../middlewares/filter');

// interface : category?tag_id=***&sorted=lastest&page=#
// interface : category?tag_id=***&sorted=lastest
exports.showCategory = function(req, res, next) {
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
			var tag_music_list = filter.filterPublicMusic(tag == null ? [] : tag.music_list);
			// sort musics of tag0 , get newest musics and hotest music.
			var music_list = tag == null ? null : ( sorted == 'latest' ? tag_music_list.sort(cmp.newest_cmp).slice(page*newest_count, (page+1)*newest_count) : tag_music_list.sort(cmp.hotest_cmp).slice(page*hotest_count, (page+1)*hotest_count));

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
								tot_count: tag_music_list.length,
								sorted: sorted,
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
						tot_count: tag_music_list.length
					});
					// json end.
				}
				
			});
			// render end

		}
	});
	// finding tag3 end
}