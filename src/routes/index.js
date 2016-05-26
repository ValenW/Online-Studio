var express = require('express');
var router = express.Router();
var shortid = require('shortid');

var User = require('../models/User');
var TempUser = require('../models/tempUserSchema');
var MailSender = require('../models/mailsender.js');

var isAuthenticated = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/editor', function(req, res, next) {
  res.render('editor');
});

router.get('/login', function(req, res, next) {
  res.render('login', {error: req.flash('error').toString()});
});

router.post('/login', function(req, res, next) {
  User.findOne({
    'username': req.body.username,
    'password': req.body.password
  }, function(err, user) {
    if (err) {
      console.log('error');
    } else {
      if (user === null) {
        req.flash('error', 'The username or password is not correct');
        res.redirect('/login');
      } else {
        req.session.user = user;
        res.redirect('/');
      }
    }
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {error: req.flash('error').toString()});
});

router.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  User.find({'username': username}, function(err, users) {
    if (users.length > 0) {
      req.flash('error', 'The username has been used');
      res.redirect('/signup');
    } else {
      tempUser.find({'username': username}, function(err, users) {
        if (users.length > 0) {
          req.flash('error', 'The username hasn\'t been confired');
          res.redirect('/signup');
        } else {
          var id = shortid.generate();
          var date = new Date();
          tempUser.create({
            'id': id,
            'username': username,
            'password': password,
            'email': email,
            'createDate': date
          });
          MailSender({
            to: email
          }, {
            username: username,
            reset: 'https://github.com/ValenW/Online-Studio' // TODO
          }, function(err, info){
            if(err){
              console.log('Error');
            } else {
              console.log('Account Confer email sent');
            }
          });

          // TODO move
          // User.create({
          //   'id': id,
          //   'username': username,
          //   'password': password,
          //   'createDate': date
          // }, function(err, newUser) {
          //   if (err) {
          //     console.log('error');
          //   }
          //   res.redirect('/');
          // });
        }
      });
    }
  });
  
  
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
