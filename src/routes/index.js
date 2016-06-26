var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var URL = require('url');
var assert = require('assert');

var sign = require('../contorllers/sign');
var User = require('../models/User');
var MailSender = require('../middlewares/mail.js');

var isAuthenticated = function(req, res, next) {
  if (req.session.user && req.session.user.confed == true) {
    next();
  } else {
    res.redirect('/login');
  }
}

var isTempAuthenticated = function(req, res, next) {
  if (req.session.user && req.session.user.confed == false) {
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

router.get('/effect', isAuthenticated, function(req, res, next) {
  res.render('effect');
});

router.get('/share', function(req, res, next) {
  res.render('share');
});

// sign
router.get('/login', sign.showLogin);

router.post('/login', sign.login);

router.get('/signup', sign.showSignup);

router.post('/signup', sign.signup);

router.get('/wait', isTempAuthenticated, function(req, res, next) {
  console.log(req.session.user);
  res.render('wait', {email: req.session.user.email, tlink: "/sendagain?id=" + req.session.user.id});
});

router.get('/sendagain', isTempAuthenticated, function(req, res, next) {
  var arg = URL.parse(req.url, true).query;
  var id2conf = arg.id;
  User.find({"id": id2conf}, function(err, users) {
    if (users.length == 1) {
      MailSender.singup({
        to: users[0].email
      }, {
        username: users[0].username,
        link: 'http://localhost:3000/conf?id=' + users[0].id // TODO
      }, function(err, info) {
        if(err){
          console.log('Error');
        } else {
          console.log('Account Confer email sent');
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
});

router.get('/conf', function(req, res, next) {
  var arg = URL.parse(req.url, true).query;
  var id2conf = arg.id;
  console.log("id2conf: " + id2conf);

  User.findOneAndUpdate({id: id2conf}, {confed: true}, function(err, user) {
    if (err) {
      console.log('conf Error');
    } else {
      user.confed = true;
      req.session.user = user;
      console.log("user:", user);
      res.redirect('/');
    }
  });
});

router.get('/logout', sign.logout);

module.exports = router;
