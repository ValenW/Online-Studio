var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var multer = require('multer');
var fs = require('fs');

var User = require('../models/User');

var headUploaderStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './bin/public/uploads/head/')
  },
  filename: function (req, file, cb) {
	typename = file.originalname.slice(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, req.session.user._id + '_head')// + typename)
  }
});

var headUploader = multer({
	dest: './uploads/head/',
	rename: function (fieldname, filename) {
        return filename+"_"+Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done=true;
    },
	storage: headUploaderStorage
});

var isAuthenticated = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  path = './uploads/head/';
  headPath = "";
  if (req.session.user) {
	uid = req.session.user._id;
	fileName = uid + "_head";
	try {
	  console.log("ok?: " + path + 'ghost.jpg');
	  fs.accessSync(path + fileName, fs.F_OK);
	  headPath = path + fileName;
	  console.log("ok: " + headPath);
    } catch (e) {
      headPath = path + 'ghost';
    }
  } else {
	headPath = path + 'ghost';
  }
  console.log("final: " + headPath);
  res.render('index', { title: 'Express', headPath: headPath });
});

router.get('/editor', function(req, res, next) {
  res.render('editor');
});

router.get('/effect', isAuthenticated, function(req, res, next) {
  res.render('effect');
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

router.get('/uploads', isAuthenticated, function(req, res, next) {
	res.render('upload');
});

router.post('/uploads', headUploader.single('image'), function(req, res, next) {
  console.log(req.file);
  username = req.session.user;
  res.redirect('/');
});
module.exports = router;
