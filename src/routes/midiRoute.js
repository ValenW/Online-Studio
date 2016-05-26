var express = require('express');
var router = express.Router();
var midgen = require('./midgen');


router.route('/')
.get(function(req, res, next) {
	res.render('midiPlay');
});

router.route('/:midiId')
.get(function(req, res, next) {
	console.log(req.params.midiId+"is located!");
	res.end(midgen.exec(), 'binary');
});

module.exports = router;
