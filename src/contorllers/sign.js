var User = require('../models/User');
var shortid = require('shortid');

exports.showLogin = function(req, res, next) {
    res.render('login', {error: req.flash('error').toString()});
}

exports.showSignup = function(req, res, next) {
    res.render('signup', {error: req.flash('error').toString()});
}

exports.login = function(req, res, next) {
    User.findOne({
        'username': req.body.username,
        'password': req.body.password
    }, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user === null) {
                req.flash('error', 'The username or password is not correct');
                res.redirect('/login');
            } else {
                req.session.user = user;
                res.redirect('/');
            }
        }
    })
};

exports.signup = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    User.findByUsername(username, function(err, users){
        if (users.length > 0) {
            req.flash('error', "The username has been used");
        } else {
            var id = shortid.generate();
            var date = new Date();

            User.create({
                'id': id,
                'username': username,
                'password': password,
                'createDate': date
            }, function(err, newUser) {
                if (err) {
                    console.log('error');
                }
                res.redirect('/');
            })
        }
    });
}

exports.logout = function(req, res, next) {
    req.session.destory();
    res.redirect('/');
}