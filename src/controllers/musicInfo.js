var Music = require('../models/Music');

// /music_info?music_id=***
exports.showMusicInfo = function(req, res, next) {
	user = req.session.user;
	if (user == undefined) {	// user does not login in.
		console.log ('Uesr hasn\'t login in.');
		res.redirect('/login');
	} else {
		var music_id = req.query.music_id;
		Music.findOne({
			_id: music_id
		}, function(err, music) {
			if (err) {
				console.log ('Error in /music_info request.');
			} else {
				if (music.author != user._id) {	// user is not music's author
					console.log('User is not the author of the music.');
					res.redirect('/');
				} else {	// user is the author of the music.
					res.render('music_info', {
						music: music
					});	
				}
			}
		});
	}
	
};


// /update_music_info POST music
exports.updateMusicInfo = function(req, res, next) {
	var music = req.body.music;
	Music.update({
		_id: music._id
	}, music, {}, function(err, info) {
		if (err) {
			console.log('Error in /update_music_info request.');
		} else {
			console.log ('Update music(', music._id ,') info successfully.');
			res.redirect('/individual');
		}
	});
};
