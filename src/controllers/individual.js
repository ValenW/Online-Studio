var User 	= require('../models/User');
var Music 	= require('../models/Music');
var fs      = require('fs');

var uploadImg 	= require('../middlewares/uploadImg');

// define music cover uploader
var headUploader = uploadImg('heads/', function(req, file) {
	console.log(file, '\n', req.session.user);
	return req.session.user._id + '_head';
});

// request: /individual
exports.showIndividual = function(req, res, next) {
	var user_id = req.session.user._id;     // ??
	console.log(user_id);
	User.findOne({_id: user_id}, '-password')
	    .populate('musics original_musics collected_musics derivative_musics')
	    .exec(function(err, user) {
		if (err) {
			console.log ('Error in /individual interface...');
		} else {
			if (user === null) {
				console.log("no such user with ID: ", user_id);
			}
			console.log (user);
			headPath = './bin/public/uploads/heads/' + user_id + '_head';
			try {
			  fs.accessSync(headPath, fs.R_OK);
			  console.log("ok: " + headPath);
			} catch (e) {
			  headPath = './bin/public/uploads/heads/guest';
			}

			user.headPath = headPath;
			res.render('user/individual', {
				user: user
			});
		}
	});
};

exports.updateIndividual = function(req, res, next) {
	var user = req.session.user;
	var upload = headUploader.single('head');
	upload(req, res, function(err) {
		if (err) {
			console.log ('Error in upload individual:\n', err);
		} else {
			var username	 = req.body.username;
			var password 	 = req.body.password;
			var profile		 = req.body.profile;
			var introduction = req.body.introduction;
			User.update({
				_id: user._id
			}, {
				username: username,
				password: password,
				profile: profile,
				introduction: introduction
			}, {}, function(err, info) {
				if (err) {
					console.log('Error in update individual:\n', err);
				} else {
					console.log(info);
					res.redirect('/individual');
				}
			});
		}
	});
}