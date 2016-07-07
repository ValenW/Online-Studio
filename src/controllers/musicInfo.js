var Music 	= require('../models/Music');
var Tag   	= require('../models/Tag');

// /music_info?music_id=***
exports.showMusicInfo = function(req, res, next) {
	var user = req.session.user;
	var music_id = req.query.music_id;
	Music.findOne({
		_id: music_id
	}, function(err, music) {
		if (err) {
			console.log ('Error in /music_info request.');
		} else {
			if (music.author !== user._id) {	// user is not music's author
				console.log('User is not the author of the music.');
				res.redirect('/');
			} else {	// user is the author of the music.
				Tag.findByDefaultTagNameList(null, function(err, tags) {
					res.render('music_info', {
						music: music,
						tags: tags,
						user: req.session.user == undefined ? null : {
							_id: req.session.user._id,
							username: req.session.user.username,
							profile: req.session.user.profiles
						}
					});
				});	
			}
		}
	});
	
};


// /update_music_info POST music
// Request: /update_music_info
// param: music_id
// param: name
// param: introduction
// param: tags
// param: is_specturm_public
// param: is_music_public
exports.updateMusicInfo = function(req, res, next) {
	var music_id	= req.body.music_id;
	var name 		= req.body.name;
	var introduction= req.body.introduction;
	var tags 		= req.body.tags;
	var is_spectrum_public 	= req.body.is_spectrum_public;
	var is_music_public		= req.body.is_music_public;

	Music.update({
		_id: music_id
	}, {
		name: name,
		introduction: introduction,
		tags: tags,	// Format of music.tags is [tag0_id, tag1_id, tag2_id]
		is_spectrum_public: is_spectrum_public,
		is_music_public: is_music_public
	}, {}, function(err, info) {
		if (err) {
			console.log('Error in /update_music_info request.');
		} else {
			console.log ('Update music(', music_id ,') info successfully.');
			res.redirect('/individual');
		}
	});
};
