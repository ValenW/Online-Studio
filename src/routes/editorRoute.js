var express = require('express');
var router = express.Router();
var Spectrum = require('../models/Spectrum');

// requestSpectrum
router.route('/:spectrum_id')
.get(function(req, res, next) {
	Spectrum.find({id : spectrum_id}, function(err, spectrum) {
		if (err) {
			console.log ('Error in requestSpectrum interface .');
		} else {
			res.render('editor', {
				spectrum: spectrum
			});	
		}
	});
});


router.route('/')
.get(function(req, res, next) {
	res.render('editor', {
		spectrum: null
	});
});

module.exports = router;
