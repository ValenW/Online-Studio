var Music 		= require('../models/Music');
var Tag   		= require('../models/Tag');
var uploadImg 	= require('../middlewares/uploadImg');

// define music cover uploader
var musicCoverUploader = uploadImg('musicCovers/', function(req, file) {
	return req.body.music_id + '_cover';
});


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
			console.log ('music.author', music.author);
			console.log ('user._id', user._id);
			if (music.author != user._id) {	// user is not music's author
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
// param: cover
exports.updateMusicInfo = function(req, res, next) {
	console.log('in updateMusicInfo');
	var music_id			= req.body.music_id;
	var name 				= req.body.name;
	var introduction		= req.body.introduction;
	var tags 				= req.body.tag;
	var is_spectrum_public 	= req.body.is_spectrum_public;
	var is_music_public		= req.body.is_music_public;

	if (req.body.cover == null) {	// secondary change music information without cover uploaded
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
				console.log('Error in /update_music_info request.\n', err);
			} else {
				console.log ('Update music(', music_id ,') info successfully.');
				console.log(info);
				res.redirect('/individual');
			}
		});
	} else {	// change music information with cover uploaded
		var upload = musicCoverUploader.single('cover');
		upload(req, res, function(err) {
			if (err) {
				console.log ('Error in uploading Music Cover.\n', err);
			} else {

				console.log ('Uploading Muisc Cover ', music_id + '_cover',' for Music ', music_id, 'successfully.');
				Music.update({
					_id: music_id
				}, {
					name: name,
					introduction: introduction,
					tags: tags,	// Format of music.tags is [tag0_id, tag1_id, tag2_id]
					is_spectrum_public: is_spectrum_public,
					is_music_public: is_music_public,
					cover: 'musicCovers/' + music_id + '_cover'
				}, {}, function(err, info) {
					if (err) {
						console.log('Error in /update_music_info request.\n', err);
					} else {
						console.log ('Update music(', music_id ,') info successfully.');
						console.log(info);
						res.redirect('/individual');
					}
				});
			}
		});
	}
};
