var Music = require('../models/Music');
var User = require('../models/User');
var Comment = require('../models/Comment');

/*Url: /music?music_id=123*/
exports.showMusicDetail = function(req, res, next) {
    var music_id = req.query.music_id;
    console.log("music ID: ", music_id);

    Music
        .findOne({_id: music_id})
        .populate('author tags comments')
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

/*Url /music/saveMusicToRepo?music_id=123*/
exports.saveMusicToRepo = function(req, res, next) {
    var user_id = req.session.user._id;
    var music_id = req.query.music_id;
    console.log("user ID:", user_id);

    User
        .findOne({_id: user_id})
        .exec(function(err, user) {
            if (err) {
                console.log("err when find user by ID: ", err);
                throw err;
            } else {
                if (user == null) console.log("no such user with ID: ", user_id);
                else {
                    Music.findOne({_id: music_id})
                         .exec(function(err, music) {
                            if (err) {
                                console.log("err when find music by ID: ", err);
                                throw err;
                            } else {
                                if (music == null) console.log("no such music with ID: ", music_id);
                                else {
                                    if (music_id in user.musics) {
                                        music.collectN-=1;
                                        delete user.musics[user.musics.indexOf(music_id)];
                                    } else {
                                        music.collectN+=1;
                                        user.musics.push(music_id);
                                    }

                                    music.save();
                                    user.save();
                                }
                            }
                         });
                }
            }
        });
}


/*Url /music/insertComment */
router.post('/music/share', musicDetail.share);*/
exports.insertComment = function(req, res, next) {
    var user_id = req.session.user._id;

    if(user_id == undefined) {
        res.redirect('/login');
    }
    var music_id = req.body.music_id;
    var comment_string = req.body.comment_string;

    console.log("user ID: ", user_id);

    User
        .findOne({_id: user_id})
        .exec(function(err, user) {
            if (err) {
                console.log("err when find user by ID: ", err);
                throw err;
            } else {
                if (user == null) console.log("no such user with ID: ", user_id);
                else {
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
                                    var comment = new Comment({
                                        comment_userId: user_id,
                                        comment_content: comment_string
                                    });
                                    comment.save();
                                    music.comments.push(comment._id);
                                    music.commentN+=1;
                                    music.save();
                                }
                            }
                        });
                    }
            }
        });
}


/*Url /music/share?music_id=123  */
exports.share = function(req, res, next) {
    var music_id = req.query.music_id;
    Music
        .findOne({_id: music_id})
        .exec(function(err, music) {
            if (err) {
                console.log("err when find music by ID: ", err);
                throw err;
            } else {
                if (music == null) console.log("no such music with ID: ", music_id);
                else {
                    music.shareN+=1;
                    music.save();
                }
            }
        });
}