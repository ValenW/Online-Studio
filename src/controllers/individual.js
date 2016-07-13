var User    = require('../models/User');
var Music   = require('../models/Music');
var fs      = require('fs');

var uploadImg   = require('../middlewares/uploadImg');

/**
 * showIndividual() returns the information needed by user detail's page.
 * @method get
 * @params user_id the id of user which details will be returned.
 * @url /user
 * example: /user?user_id=123
 */
exports.showIndividual = function(req, res, next) {
    var user_id = req.query.user_id;    
    console.log(user_id);

    // set up a match mode if current user is not the same as the user of the page
    var isUser = {};
    if (req.session.user == undefined || user_id != req.session.user._id) {   // should be !=
        isUser.is_music_public = true;
    }
    // find user with provided user_id and filter out the password
    User.findOne({_id: user_id}, '-password')
        .populate({path: 'original_musics', match: isUser, select: '_id name cover'})
        .populate({path: 'collected_musics', match: isUser, select: '_id name cover'})
        .populate({path: 'derivative_musics', match: isUser, select: '_id name cover'})
        .exec(function(err, user) {
        if (err) {
            console.log ('Error in /user interface...');
        } else {
            if (user === null) {
                console.log("no such user with ID: ", user_id);
            }
            console.log (user);
            headPath = "" + user_id + '_head';
            try {
              fs.accessSync(headPath, fs.R_OK);
              console.log("ok: " + headPath);
            } catch (e) {
              headPath = 'default_head.jpg';
            }
            user.profile = headPath;
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
    var upload = uploadImg.headUploader.single('head');
    upload(req, res, function(err) {
        if (err) {
            console.log ('Error in upload user:\n', err);
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
                    console.log('Error in update user:\n', err);
                } else {
                    console.log(info);
                    res.redirect('/user?user_id='+user._id);
                }
            });
        }
    });
}

exports.showUserUpdate = function(req, res, next) {
    var user_id = req.params.user_id;
    User.findOne({_id: user_id}, function(err, user) {
        console.log(user);
        res.render('user/user_update', {
            user_id: user._id,
            username: user.username,
            email: user.email,
            introduction: user.introduction,
            profile: user.profile,
            user:  req.session.user == undefined ? null : {
                _id: req.session.user._id,
                username: req.session.user.username,
                profile: req.session.user.profile
            }
        });
    });
}

exports.updateUsername = function(req, res, next) {
    var userId = req.body.id;
    var username = req.body.username;
    User.findOne({_id: userId}, function(err, user) {
        User.findOne({username: username}, function(err, user) {
            if (user) {
                res.json({"message": "username used"});
            } else {
                user.update({$set: {username: username} }, function(err) {
                    res.json({"message": "success"});
                });
            }
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

exports.updateProfile = function(req, res, next) {
    var upload = uploadImg.headUploader.single('profile');
    upload(req, res, function(err) {
        var userId = req.body.id;
        var newProfile = userId+'_head';
        if (err) {
            console.log('Error in updateProfile.');
        } else {
            console.log('Update Porfile successfully');
            User.findOne({_id: userId}, function(err, user) {
                user.update({ $set: {profile: newProfile} }, function(err) {
                    return res.redirect('/user/update/'+userId);
                });
            });
        }
    });
}
