var express = require('express');
var router = express.Router();
var Spectrum = require('../models/Spectrum');
var Music = require('../models/Music');
var User = require('../models/User')

router.route('/')
.get(function(req, res, next) {

	if (req.query.spectrum_id == undefined) {
		// first time create Spectrum
		res.render('editor', {
			spectrum: null
		});

	} else {
		// revise Spectrum according to spectrum_id
		spectrum_id = req.query.spectrum_id;
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

});

// if spectrum_param has no _id, the new method create one.
// elif spectrum_param has _id, just update the exist spectrum.
router.route('/save')
.post(function(req, res, next) {
	spectrum_param = JSON.parse(req.body.spectrum);

	if (spectrum_param._id == undefined) {	// create Spectrum document
		// create Music document and set relationship between User and Music
		user = req.session.user;
		// create Spectrum
		spectrum = new Spectrum(spectrum_param);
		spectrum.save();

		// cascaded in save method ?
		// create Music info for Spectrum
		music = new Music({
			spectrum: spectrum,
			name: 'music',
			author: user,
			cover: 'none',
			date: new Date(),
			tags: [],
			ranks: [],
			comments: [],
			listenN: 0,
			collectN: 0,
			commentN: 0,
			shareN: 0
		});
		music.save();

		// set relationship
		user.musics.push(music);

		User.update({_id: user._id}, user, {}, function(err, info) {
			if (err) {
				console.log ('Error in /editor/save updating User.');
			}  else {
				// Music.find({},function(err, musics) {
				// 	console.log(musics);
				// });
				// User.find({}, function(err, users) {
				// 	console.log (users);
				// });
				// console.log (info);
				console.log('Update User with Music successfully.');
			}
		});

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

});

module.exports = router;
