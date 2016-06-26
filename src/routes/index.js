var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var URL = require('url');
var assert = require('assert');

var sign = require('../contorllers/sign');
var User = require('../models/User');
var TempUser = require('../models/tempUser');
var MailSender = require('../models/mailsender.js');

var isAuthenticated = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

var isTempAuthenticated = function(req, res, next) {
  if (req.session.tuser) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
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

router.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  User.find({$or: [ {'username': username}, {'email': email} ]}, function(err, users) {
    if (users.length > 0) {
      req.flash('error', 'The username has been used');
      res.redirect('/signup');
    } else {
      TempUser.find({$or: [ {'username': username}, {"email": email} ]}, function(err, users) {
        if (users.length > 0) {
          req.flash('error', 'The username hasn\'t been confired');
          res.redirect('/signup');
        } else {
          var id = shortid.generate();
          var date = new Date();

          console.log(typeof(id), id);

          TempUser.create({
            'id': id,
            'username': username,
            'password': password,
            'email': email,
            'createDate': date
          }, function(err, newTUser) {
			if (err) {
			  console.log('error when create tUser!');
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
			  req.session.tuser = newTUser;
			  res.redirect('/wait');
			}
		  });
        }
      });
    }
  });
});

router.get('/wait', isTempAuthenticated, function(req, res, next) {
  res.render('wait', {email: req.session.tuser.email, tlink: "/sendagain?id=" + req.session.tuser.id});
});

router.get('/sendagain', isTempAuthenticated, function(req, res, next) {
  var arg = URL.parse(req.url, true).query;
  var id2conf = arg.id;
  TempUser.find({"id": id2conf}, function(err, users) {
    if (users.length == 1) {
      MailSender.singup({
		to: users[0].email
	  }, {
		username: users[0].username,
		link: 'http://localhost:3000/conf?id=' + users[0].id // TODO
	  }, function(err, info){
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

  TempUser.find({"id": id2conf}, function(err, users) {
    if (users.length == 1) {
      User.create({
        'id': users[0].id,
        'username': users[0].username,
        'password': users[0].password,
        'email': users[0].email,
        'createDate': users[0].date
      }, function(err, newUser) {
        if (err) {
          console.log('error when create user.');
        } else {
		  TempUser.findByIdAndRemove(users[0]._id, function(err, result) {
			assert.equal(null, err);
		  });
		  req.session.user = newUser;
		  res.redirect('/');
		}
      });
      } else {
        assert(users.length == 0);
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
      }
    });
});

router.get('/logout', sign.logout);


module.exports = router;
