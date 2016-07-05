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
var sign        = require('../controllers/sign');
var home        = require('../controllers/home');
var editor      = require('../controllers/editor');
var category    = require('../controllers/category');
var individual  = require('../controllers/individual');

var debug       = require('../controllers/debug');

var musicDetail = require('../controllers/musicDetail');


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

// home
router.get('/home', home.showHome);

// editor
router.get('/editor', editor.showEditor);
router.post('/editor/save', editor.saveSpectrum);

// category
router.get('/category', category.showCategory);

// individual
router.get('/individual', auth.isTempAuthenticated, individual.showIndividual);

// musicDetail
router.get('/music', musicDetail.showMusicDetail);

// debug
router.get('/create_tags', debug.createTags);
router.get('/look_tags', debug.lookTags);
router.get('/clear_data', debug.clearData);
router.get('/look_musics', debug.lookMusics);
router.get('/look_users', debug.lookUsers);
router.get('/look_commments', debug.lookComments);
router.get('/look_spectrums', debug.lookSpectrums);

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
