var User = require('../models/User');

// request: /individual
exports.showIndividual = function(req, res, next) {
	var user_id = req.query.user_id;
	User.findOne({_id: user_id}, '-password')
	    .populate('musics original_musics collected_musics derivative_musics')
	    .exec(function(err, user) {
		if (err) {
			console.log ('Error in /individual interface...');
		} else {
			if (user === null) {
				req.fresh('error', 'User not exist!');
			}
			console.log (user);
			res.render('individual', {
				user: user
			});
		}
	});
};
