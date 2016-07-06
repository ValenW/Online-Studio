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

                    var opts = [{
                        path: "comments.comment_userId",
                        select: "profile",
                        model: 'User'
                    }];
                    Music.populate(music, opts, function(err, populatedMusic) {
                        if (err) {
                            console.log("err when loading music with ID: ", music_id);
                        } else {
                            res.render('music_detail', {music: populatedMusic});
                        }
                    });
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
                                    if (music_id in user.collected_musics) {
                                        music.collectN-=1;
                                        delete user.collected_musics[user.collected_musics.indexOf(music_id)];
                                    } else {
                                        music.collectN+=1;
                                        user.collected_musics.push(music_id);
                                    }

                                    music.save();
                                    user.save();

                                    res.send(music.collectN);

                                }
                            }
                         });
                }
            }
        });
}


/*Url /music/insertComment */
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
                                    res.send(Comment.findByMusicId(music_id));
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
                res.send(music.shareN);
            }
        });
}


/*Url /music/listen?music_id=123  */
exports.listen = function(req, res, next) {
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
                    music.listenN+=1;
                    music.save();
                }
                res.send(music.listenN);
            }
        });
}