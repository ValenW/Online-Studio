var User = require('../models/User');
/*
// just an example for population
exports.getAllMusic = function(req, res, next) {
    var id = '123123';
    User.findOne({'id':id}).populate('muiscs').exec(function(err, user) {
        console.log(user);
    });
};*/

exports.getUserInfo = function(req, res, next) {
	var id = req.params.userId;
	User.findOne({'id': id}, function(err, user) {
        if (err) console.log(err);
        else {
        	if (user === null) {
                req.flash('error', 'User not exists!');
        	} else {
        		res.render('user', {userinfo: user});
        	}
        }
	});
}

exports.getAllMusic = function(req, res, next) {
	var id = req.params.userId;
	User.findOne({'id': id}).populate('musics').exec(function(err, user) {
		if (err) console.log(err);
		else {
			if (user == null) {
				req.flash('error', 'User not exists!');
			} else {
				res.render('user', {musics: user.musics});
			}
		}
	});
}