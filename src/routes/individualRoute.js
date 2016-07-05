var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var User = require('../models/User');


router.route('/')
.get(auth.isAuthenticated, function(req, res, next) {
	User.findOne({_id: req.session.user._id}).populate('musics').exec(function(err, user) {
		if (err) {
			console.log ('Error in /individual interface...');
		} else {
			console.log (user);
			res.render('individual', {
				user: user
			});
		}
	});
});

module.exports = router;
