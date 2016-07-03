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
		console.log(spectrum_id);

		Spectrum.find({_id: spectrum_id}, function(err, spectrums) {
			if (err) {
				console.log ('Error in /editor interface.');
			} else {
				console.log (spectrums);
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
	spectrum = new Spectrum(spectrum_param);
	console.log (spectrum);
	console.log (spectrum.channels);
	spectrum.save(function(err) {
		if (err) {
			console.log ('Error in /editor/save interface. ');
		} else {
			Spectrum.find({
				_id: spectrum._id
			}).exec(function(err, spectrums) {
				if (err) {
					console.log ('Error in find Spectrum. 【/editor/save】');
				} else {
					res.json({
						_id: spectrums[0]._id
					});
				}
			});
		}
	});

});

// // requestSpectrum
// router.route('/')
// .get(function(req, res, next) {
// 	console.log (req.params.spectrum_id);
// 	Spectrum.find({_id : req.params.spectrum_id}, function(err, spectrum) {
// 		if (err) {
// 			console.log ('Error in requestSpectrum interface .');
// 		} else {
// 			res.render('editor', {
// 				spectrum: spectrum
// 			});	
// 		}
// 	});
// });


module.exports = router;
