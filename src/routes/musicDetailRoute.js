var express = require('express');
var router = express.Router();


router.route('/')
.get(function(req, res, next) {
	Music.find({
		id : req.query.music_id
	}).populate('comments').exec(function(err, music) {
		if (err) {
			console.log('Error in finding music by id.');
		} else {
			res.render('music_detail', { music: music });
		}
	});
});


module.exports = router;
