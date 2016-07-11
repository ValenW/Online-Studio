var Spectrum    = require('../models/Spectrum');
var Music       = require('../models/Music');
var User        = require('../models/User');
var Tag         = require('../models/Tag');
var Comment     = require('../models/Comment');
var uploadImg   = require('../middlewares/uploadImg');

exports.createTags = function(req, res, next) {
	var tag_name_list = [ {tag_name :'抒情'}, { tag_name: '恐怖'}, {tag_name: '空灵'}, {tag_name: '浪漫'}];
	Tag.find({
		$or: tag_name_list
	}, function(err, tags) {
		if (tags != undefined && tags.length > 0) {
			console.log('Tags has been created.');
			res.send('Tags has been created.');
		} else {
			Tag.create(tag_name_list, function(err, tags) {
				if (err) {
					console.log('Error in /editor/create_tags interface of creating tags.');
				} else {
					console.log('Create tags successfully.');
					res.send(tags);
				}
			});
		}
	});
	
};

exports.lookTags = function(req, res, next) {
	Tag.find({}, function(err, tags) {
		res.send(tags);
	});
};

exports.clearData = function(req, res, next) {
    User.remove({}, function(err) {});
    Comment.remove({}, function(err) {});
    Tag.remove({}, function(err){});
    Spectrum.remove({}, function() {});
    Music.remove({}, function(){});
    res.send('Clear data successfully.');
};

exports.lookMusics = function(req, res, next) {
	Music.find({}, function(err, musics) {
		res.send(musics);
	});
};

exports.lookUsers = function(req, res, next) {
	User.find({}, function(err, users) {
		res.send(users);
	});
};

exports.lookComments = function(req, res, next) {
	Comment.find({}, function(err, comments) {
		res.send(comments);
	});
};

exports.lookSpectrums = function(req, res, next) {
	Spectrum.find({}, function(err, spectrums) {
		res.send(spectrums);
	});
};

exports.lookUploadImg = function(req, res, next) {
    res.render('upload');
};

exports.uploadImg = function(req, res, next) {
    var upload = uploadImg('test/', function(req, file) {
        console.log(file);
        return 'test';
    }).single('image');
    
    upload(req, res, function(err) {
        if (err) {
            console.log('err when test upload img:\n', err);
        }
        res.redirect('/');
    });
};
