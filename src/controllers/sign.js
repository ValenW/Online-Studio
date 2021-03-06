var User = require('../models/User');
var MailSender = require('../middlewares/mail.js');
var URL     = require('url');
var assert  = require('assert');

/**
 * shwoLogin() show the login page
 * controller of 'GET /login' url
 */
exports.showLogin = function(req, res, next) {
    res.render('sign/login', {error: req.flash('error').toString()});
}
/**
 * showSignup() show the signup page
 * controller of 'GET /signup' url
 */
exports.showSignup = function(req, res, next) {
    res.render('sign/signup', {error: req.flash('error').toString()});
}
/**
 * login() process the login request
 * controller of 'POST /login' url
 */
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
                var fromUrl = req.query.url || '/';
                req.session.user = user;
                res.redirect(fromUrl);
            }
        }
    });
};
/**
 * signup() process the signup request
 * controller of 'POST /singup' url
 */
exports.signup = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    User.find({$or: [ {'username': username}, {'email': email} ]}, function(err, users) {
        if (users.length > 0) {
            if (users[0].confed) {
                req.flash('error', 'The username or email has been used');
            } else if (Date.now() - users[0].createDate.getTime() < 24 * 60 * 60 * 1000) {
                req.flash('error', 'The username hasn\'t been confired');
            } else {
                User.findOneAndUpdate({_id: users[0]._id}, {
                    username: username,
                    email: email,
                    password: password,
                    confed: false,
                    createDate: Date.now()
                }, function (err, user) {
                    if (err) {
                        console.log('sign up Error: ', err);
                    } else {
                        MailSender.singup({
                            to: email
                        }, {
                            username: username,
                            link: 'http://localhost:3000/conf?id=' + id // TODO
                        }, function(err, info){
                            if(err){
                                console.log('Error');
                            } else {
                                console.log('Account Confer email sent');
                            }
                        });
                        req.flash('error', 'The account confiring email has been send.');
                        req.session.user = {
                            username: username,
                            email: email
                        }
                        console.log("new user: ", req.session.user);
                        res.redirect('/wait');
                    }
                });
            }
            res.redirect('/signup');
        } else {
            var date = Date.now();
            User.create({
                'username': username,
                'password': password,
                'email': email,
                'confed': false,
                'createDate': date,
                'profile': 'default_head.jpg'
            }, function(err, newUser) {
                var id = newUser._id.toString();
                if (err) {
                    console.log('error when create User!');
                } else {
                    MailSender.singup({
                        to: email
                    }, {
                        username: username,
                        link: 'http://localhost:3000/conf?id=' + id // TODO
                    }, function(err, info){
                        if(err){
                            console.log('Error');
                        } else {
                            console.log('Account Confer email sent');
                        }
                    });
                    req.flash('error', 'The account confiring email has been send.');
                    req.session.user = newUser;
                    console.log("new user: ", req.session.user);
                    res.redirect('/wait');
                }
            });
        }
    });
}
/**
 * logout() process the logout request
 * controller of 'GET /logout' url
 */
exports.logout = function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
}
/**
 * getWait() show the wait
 * controller of 'GET /wait' url
 */
exports.getWait = function(req, res, next) {
    res.render('wait', {email: req.session.user.email, tlink: "/sendagain?id=" + req.session.user._id});
}
/**
 * getSendAgain() send the email again
 * controller of 'GET /sendagain' url
 */
exports.getSendAgain = function(req, res, next) {
    var arg = URL.parse(req.url, true).query;
    var id2conf = arg.id;
    User.find({_id: id2conf}, function(err, users) {
        if (users.length == 1) {
            MailSender.singup({
                to: users[0].email
            }, {
                username: users[0].username,
                link: 'http://localhost:3000/conf?id=' + users[0]._id // TODO
            }, function(err, info) {
                if(err){
                    console.log('Error');
                } else {
                    console.log('Account Confer email sent');
                    User.findOneAndUpdate({_id: id2conf}, {
                        createDate: Date.now()
                    }, function(err, user) {
                        if (err) {
                            console.log("err when send again: ", err);
                        } else {
                            console.log("update userinfo succeed");
                        }
                    })
                }
            });
            res.redirect('/wait');
        } else {
            assert(users.length == 0);
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    });
}
/**
 * getConf() show the conf page
 * controller of 'GET /conf' url
 */
exports.getConf = function(req, res, next) {
    var arg = URL.parse(req.url, true).query;
    var id2conf = arg.id;
    console.log("id2conf: " + id2conf);
    User.findOneAndUpdate({_id: id2conf}, {confed: true}, function(err, user) {
        if (err) {
            console.log('conf Error');
        } else {
            user.confed = true;
            req.session.user = user;
            console.log("user:", user);
            res.redirect('/');
        }
    });
}
