var express = require('express');
var router = express.Router();
var Spectrum = require('../models/Spectrum');

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
		spectrum = new Spectrum(spectrum_param);
		spectrum.save(function(err, spectrumAffected, numAffected) {
			if (err) {
				console.log ('Error in /editor/save subopertion creating Spectrum.');
			} else {
				if (spectrum._id == spectrumAffected._id) {
					res.json({
						_id: spectrumAffected._id
					});
				} else {
					console.log ('Something unexpected happened in /editor/save.' );
				}
			}
		});
	} else {	// update Spectrum document
		Spectrum.update({_id: spectrum_param._id}, spectrum_param, {}, function(err, info) {
			if (err) {
				console.log ('Error in /editor/save updating Spectrum.');
			} else {
				console.log ('Updating Spectrum ', spectrum_param._id,' Success.');
			}
		});
	}

});

module.exports = router;
