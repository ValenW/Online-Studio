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

var data = require('../data/data');


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

// router.get('/editor', function(req, res, next) {
//   res.render('editor');
// });

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


// sign
router.get('/login', sign.showLogin);

router.post('/login', sign.login);

router.get('/signup', sign.showSignup);

router.post('/signup', sign.signup);

router.get('/wait', auth.isTempAuthenticated, sign.getWait);

router.get('/sendagain', auth.isTempAuthenticated, sign.getSendAgain);

router.get('/conf', sign.getConf);

router.get('/logout', sign.logout);

router.get('/uploads', auth.isAuthenticated, function(req, res, next) {
  res.render('upload');
});

router.post('/uploads', headUploader.single('image'), function(req, res, next) {
  console.log(req.file);
  username = req.session.user;
  res.redirect('/');
});

router.get('/create_data', data.createData);

module.exports = router;
