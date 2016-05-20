var express = require('express');
var router = express.Router();
var shortid = require('shortid');

var User = require('../models/User');

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

router.get('/editor', isAuthenticated, function(req, res, next) {
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
  User.find({'username': username}, function(err, users) {
    if (users.length > 0) {
      req.flash('error', 'The username has been used');
      res.redirect('/signup');
    } else {
      var id = shortid.generate();
      var date = new Date();
      
      User.create({
        'id': id,
        'username': username,
        'password': password,
        'createData': date
      }, function(err, newUser) {
        if (err) {
          console.log('error');
        }
        res.redirect('/');
      });
    }
  });
  
  
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
