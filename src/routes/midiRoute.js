var express = require('express');
var router = express.Router();
var midgen = require('./midgen');


router.route('/')
.get(function(req, res, next) {
	res.render('midiPlay');
});

router.route('/:midiId')
.get(function(req, res, next) {
	if (err) throw err;
	console.log(req.params.dishId);
	res.send(midgen.exec(), 'binary');
});