var express     = require('express');
var router      = express.Router();
var fs          = require('fs');

var auth        = require('../middlewares/auth');
var uploadImg   = require('../middlewares/uploadImg');
var sign        = require('../controllers/sign');
var home        = require('../controllers/home');
var editor      = require('../controllers/editor');
var category    = require('../controllers/category');
var individual  = require('../controllers/individual');
var musicDetail = require('../controllers/musicDetail');
var musicInfo   = require('../controllers/musicInfo');

var debug       = require('../controllers/debug');


var data = require('../data/data');

router.get('/', home.showHome);

//debug
router.get('/music_detail', function(req, res, next) {
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
router.post('/editor/login', editor.login);
router.post('/editor/signup', editor.signup);
router.get('/editor/logout', editor.logout);

// category
router.get('/category', category.showCategory);

// individual
router.get('/user', individual.showIndividual);
router.get('/user/update/:user_id', auth.isAuthenticated, individual.showUserUpdate);
router.post('/user/update/name/:user_id', auth.isAuthenticated, individual.updateUsername);
router.post('/user/update/introduction/:user_id', auth.isAuthenticated, individual.updateIntroduction);
router.post('/user/update/password/:user_id', auth.isAuthenticated, individual.updatePassword);
router.post('/user/update/profile', auth.isAuthenticated, individual.updateProfile);

// musicDetail
router.get('/music', musicDetail.showMusicDetail);
router.get('/music/saveMusicToRepo', auth.isAuthenticated, musicDetail.saveMusicToRepo);
router.get('/music/share', musicDetail.share);
router.get('/music/listen', musicDetail.listen);
router.get('/music/isCollect', auth.isAuthenticated, musicDetail.is_collect);
router.post('/music/insertComment', auth.isAuthenticated,  musicDetail.insertComment);

// music_info
router.get('/music_info', auth.isAuthenticated, musicInfo.showMusicInfo);
router.post('/update_music_info', auth.isAuthenticated, musicInfo.updateMusicInfo);

// debug
router.get('/create_tags', debug.createTags);
router.get('/look_tags', debug.lookTags);
router.get('/clear_data', debug.clearData);
router.get('/look_musics', debug.lookMusics);
router.get('/look_users', debug.lookUsers);
router.get('/look_commments', debug.lookComments);
router.get('/look_spectrums', debug.lookSpectrums);
router.get('/look_uploadImage', debug.lookUploadImg);
router.post('/look_uploadImage', debug.uploadImg);

// create data
router.get('/create_data', data.createData);
router.get('/update_data', data.updateData);

module.exports = router;
