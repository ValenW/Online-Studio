var User = require('../models/User');
var shortid = require('shortid');
var MailSender = require('../middlewares/mail.js');

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
  var email = req.body.email;

  User.find({$or: [ {'username': username}, {'email': email} ]}, function(err, users) {
    if (users.length > 0) {
      if (users[0].confed) {
        console.log(users[0].confed);
        req.flash('error', 'The username or email has been used');
      } else {
        req.flash('error', 'The username hasn\'t been confired');
      }
      res.redirect('/signup');
    } else {
      var id = shortid.generate();
      var date = new Date();
      User.create({
        'id': id,
        'username': username,
        'password': password,
        'email': email,
        'confed': false,
        'createDate': date
      }, function(err, newUser) {
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

exports.logout = function(req, res, next) {
    req.session.destory();
    res.redirect('/');
}