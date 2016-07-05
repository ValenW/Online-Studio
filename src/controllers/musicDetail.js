var Music = require('../models/Music');
var User = require('../models/User');

exports.showMusicDetail = function(req, res, next) {
    var music_id = req.query.music_id;
    console.log("music ID: ", music_id);

    Music
        .findOne({_id: music_id})
        .populate('tracks tags comments')
        .exec(function(err, music) {
            if (err) {
                console.log("err when find music by ID: ", err);
                throw err;
            } else {
                if (music == null) console.log("no such music with ID: ", music_id);
                else {
                    res.render('music_detail', {music: music});
                }
            }
        });
};

