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
			headPath = './bin/public/uploads/heads/' + user._id + '_head';
			try {
			  fs.accessSync(headPath, fs.R_OK);
			  console.log("ok: " + headPath);
			} catch (e) {
			  headPath = './bin/public/uploads/heads/guest';
			}

			var postUser = {
				username:			user.username,
				email:				user.email,
				profile:			user.profile,
				introduction:		user.introduction,
				musics: 			user.musics,
				original_musics: 	user.original_musics,
				collected_musics: 	user.collected_musics,
				derivative_musics: 	user.derivative_musics,
				createDate: 		user.createDate,
				headPath: 			headPath
			}
			res.render('individual', {
				user: postUser
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