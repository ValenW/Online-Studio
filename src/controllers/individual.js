var User = require('../models/User');

exports.showIndividual = function(req, res, next) {
	User.findOne({_id: req.session.user._id}).populate('musics').exec(function(err, user) {
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
