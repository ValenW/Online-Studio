var URL = require('url');

var Music = require('../models/Music');
var User = require('../models/User');

var shortid = require('shortid');

exports.showMusicDetail = function(req, res, next) {
    var arg = URL.parse(req.url, true).query;
    var musicId = arg.id;
    console.log("music ID: ", musicId);

    Music
        .findOne({id: musicId})
        .populate('tracks tags comments')
        .exec(function(err, music) {
            if (err) {
                console.log("err when find music by ID: ", err);
                throw err;
            } else {
                if (music == null) console.log("no such music with ID: ", musicId);
                else {
                    res.render('music_detail', {music: music});
                }
            }
        });
}
