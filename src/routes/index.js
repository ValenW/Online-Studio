var express = require('express');
var router  = express.Router();
var shortid = require('shortid');

var URL     = require('url');
var assert  = require('assert');
var multer  = require('multer');
var fs      = require('fs');

var User        = require('../models/User');
var auth        = require('../middlewares/auth');
var MailSender  = require('../middlewares/mail');
var sign        = require('../contorllers/sign');
var musicDetail = require('../contorllers/musicDetail');


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
  // headPath: path to the headcut
  path = 'uploads/head/';
  headPath = "";
  if (req.session.user) {
    uid = req.session.user._id;
    fileName = uid + "_head";
    try {
      headPath = path + fileName;
      console.log("ok?: " + headPath);
      fs.accessSync('./bin/public/' + headPath, fs.R_OK);
      console.log("ok: " + headPath);
    } catch (e) {
      headPath = path + 'ghost';
    }
  } else {
    headPath = path + 'ghost';
  }
  res.render('home');
});

router.get('/category', function(req, res, next) {
  res.render('category');
});

router.get('/editor', function(req, res, next) {
  res.render('editor');
});

//调试
router.get('/effect', auth.isAuthenticated, function(req, res, next) {
  res.render('effect');
});
router.get('/music_detail', auth.isAuthenticated, function(req, res, next) {
  res.render('music_detail');
});
router.get('/share', function(req, res, next) {
  res.render('share');
});
router.get('/individual', auth.isAuthenticated, function(req, res, next) {
  res.render('individual');
});


// sign
router.get('/login', sign.showLogin);

router.post('/login', sign.login);

router.get('/signup', sign.showSignup);

router.post('/signup', sign.signup);

// music
// router.get('/music_detail', musicDetail.showMusicDetail);

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

router.get('/uploads', isAuthenticated, function(req, res, next) {
  res.render('upload');
});

router.post('/uploads', headUploader.single('image'), function(req, res, next) {
  console.log(req.file);
  username = req.session.user;
  res.redirect('/');
});

module.exports = router;
