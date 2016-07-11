var User    = require('../models/User');
var Music   = require('../models/Music');
var fs      = require('fs');

var uploadImg   = require('../middlewares/uploadImg');

// define music cover uploader
var headUploader = uploadImg('heads/', function(req, file) {
    console.log(file, '\n', req.session.user);
    return req.session.user._id + '_head';
});

// request: /user
exports.showIndividual = function(req, res, next) {
    var user_id = req.query.user_id;    
    console.log(user_id);

    var isUser = {};
    if (req.session.user == undefined || user_id != req.session.user._id) {   // should be !=
        isUser.is_music_public = true;
    }
    User.findOne({_id: user_id}, '-password')
        .populate({path: 'musics', match: isUser, select: '_id name cover'})
        .populate({path: 'original_musics', match: isUser, select: '_id name cover'})
        .populate({path: 'collected_musics', match: isUser, select: '_id name cover'})
        .populate({path: 'derivative_musics', match: isUser, select: '_id name cover'})
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
                userInfo: user,
                user:  req.session.user == undefined ? null : {
                        _id: req.session.user._id,
                        username: req.session.user.username,
                        profile: req.session.user.profile
                    }
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
            var username     = req.body.username;
            var password     = req.body.password;
            var profile      = req.body.profile;
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

exports.showUserUpdate = function(req, res, next) {
    var user_id = req.params.user_id;
    User.findOne({_id: user_id}, function(err, user) {
        console.log(user);
        res.render('user/userUpdate', {
            user_id: user._id,
            username: user.username,
            email: user.email,
            introduction: user.introduction,
            profile: user.profile
        });
    });
}

exports.updateUsername = function(req, res, next) {
    var userId = req.body.id;
    var username = req.body.username;
    User.findOne({_id: userId}, function(err, user) {
        user.update({$set: {username: username} }, function(err) {
            res.json({"message": "success"});
        });
    });
}

exports.updateIntroduction = function(req, res, next) {
    var userId = req.body.id;
    var introduction = req.body.introduction;
    User.findOne({_id: userId}, function(err, user) {
        user.update({$set: {introduction: introduction}}, function(err) {
            res.json({"message": "success"});
        });
    });
}

exports.updatePassword = function(req, res, next) {
    var userId = req.body.id;
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    User.findOne({_id: userId}, function(err, user) {
        if (user.password !== password) {
            return res.json({"message": "password error"});
        } else {
            user.update({ $set: {password: newPassword} }, function(err) {
                return res.json({"message": "success"});
            });
        }
    });
}
