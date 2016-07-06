var Spectrum = require('../models/Spectrum');
var Music = require('../models/Music');
var User = require('../models/User');
var Tag = require('../models/Tag');
var Comment = require('../models/Comment');


exports.showEditor = function(req, res, next) {

	if (req.query.spectrum_id == undefined) {
		// first time create Spectrum
		res.render('editor', {
			spectrum: null
		});

	} else {
		// revise Spectrum according to spectrum_id
		var spectrum_id = req.query.spectrum_id;
		console.log(req.query);

		Spectrum.find({_id: spectrum_id}, function(err, spectrums) {
			if (err) {
				console.log ('Error in /editor interface.');
			} else {
				res.render('editor', {
					spectrum: spectrums[0]
				});
			}
		});

	}
};


// if spectrum_param has no _id, the new method create one.
// elif spectrum_param has _id, just update the exist spectrum.
exports.saveSpectrum = function(req, res, next) {
	spectrum_param = JSON.parse(req.body.spectrum);

	if (spectrum_param._id == undefined) {	// create Spectrum document
		// create Music document and set relationship between User and Music
		var user = req.session.user;
		// create Spectrum
		var spectrum = new Spectrum(spectrum_param);
		spectrum.save();

		// cascaded in save method ?
		// create Music info for Spectrum
		var tag_name_list = new Array('抒情', '恐怖', '空灵', '浪漫');
		var r = parseInt(Math.random() * 100 % tag_name_list.length);

		// find tag begin.
		Tag.findOne({
			tag_name: tag_name_list[r]
		}, function(err, tag) {
			if (err) {
				console.log ('Error in /editor/save interface in finding tag.');
			} else {
				var data = new Data();
				var music = new Music({
					created_by: user,
					spectrum: spectrum,
					name: date,
					author: user,
					cover: 'default_cover.png',
					date: data,
					tags: [tag],	// for debug
					// tags: [],	// release version
					ranks: [],
					comments: [],
					listenN: 0,
					collectN: 0,
					commentN: 0,
					shareN: 0,
					is_music_public: true,
					is_spectrum_public: false,
					introduction: 'I am a music.'
				});
				music.save();

				// Tag relate to Music
				tag.music_list.push(music);
				tag.save();

				// set relationship
				user.musics.push(music);

				User.update({_id: user._id}, user, {}, function(err, info) {
					if (err) {
						console.log ('Error in /editor/save updating User.');
					}  else {
						console.log('Update User with Music successfully.');
						res.json({
							_id: spectrum._id
						});
					}
				});

			}
		});
		// find tag end.
		

	} else {	// update Spectrum document
		Spectrum.update({_id: spectrum_param._id}, spectrum_param, {}, function(err, info) {
			if (err) {
				console.log ('Error in /editor/save updating Spectrum.');
			} else {
				console.log ('Updating Spectrum ', spectrum_param._id,' Success.');
				res.json({
					_id: spectrum_param._id
				});
			}
		});
	}

};
