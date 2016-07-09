var Music = require('../models/Music');
var User = require('../models/User');
var Comment = require('../models/Comment');

/*Url: get /music?music_id=123*/
exports.showMusicDetail = function(req, res, next) {
    var music_id = req.query.music_id;
    console.log("music ID: "+ music_id);

    Music
        .findOne({_id: music_id})
        .populate('author tags comments spectrum')
        .exec(function(err, music) {
            if (err) {
                console.log("err when find music by ID: "+err);
                throw err;
            } else {
                if (music === null) console.log("no such music with ID: "+music_id);
                else {

                    var opts = [{
                        path: "comments.comment_userId",
                        select: "profile",
                        model: 'User'
                    }];
                    Music.populate(music, opts, function(err, populatedMusic) {
                        if (err) {
                            console.log("err when loading music with ID: "+music_id);
                        } else {

                            res.render('music_detail', {
                                music: populatedMusic,
                                user: req.session.user == undefined ? null : {
                                    username: req.session.user.username,
                                    profile: req.session.user.profiles,
                                    is_collect: music_id in req.session.user.collected_musics
                                }
                            });
                        }
                    });
                }
            }
        });
};

/*Url get /music/saveMusicToRepo?music_id=123*/
exports.saveMusicToRepo = function(req, res, next) {
    var user_id = req.session.user._id;
    var music_id = req.query.music_id;
    console.log("user ID: "+ user_id);

    User
        .findOne({_id: user_id})
        .exec(function(err, user) {
            if (err) {
                console.log("err when find user by ID: "+err);
                throw err;
            } else {
                if (user === null) console.log("no such user with ID: "+ user_id);
                else {
                    Music.findOne({_id: music_id})
                         .exec(function(err, music) {
                            if (err) {
                                console.log("err when find music by ID: "+ err);
                                throw err;
                            } else {
                                if (music === null) console.log("no such music with ID: "+ music_id);
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

                                    res.json({
                                        collectN: music.collectN
                                    });

                                }
                            }
                         });
                }
            }
        });
}


/*Url post {music_id, comment_string}  /music/insertComment */
exports.insertComment = function(req, res, next) {
    var user_id = req.session.user._id;
    console.log("user ID: "+user_id);

    if(user_id === undefined) {
        res.redirect('/login');
    }
    var music_id = req.body.music_id;
    var comment_string = req.body.comment_string;

    console.log("music_id: "+ music_id);
    console.log("comment_string: "+ comment_string);

    User
        .findOne({_id: user_id})
        .exec(function(err, user) {
            if (err) {
                console.log("err when find user by ID: "+err);
                throw err;
            } else {
                if (user === null) console.log("no such user with ID: "+ user_id);
                else {
                    Music
                        .findOne({_id: music_id})
                        .populate('tracks tags comments')
                        .exec(function(err, music) {
                            if (err) {
                                console.log("err when find music by ID: "+ err);
                                throw err;
                            } else {
                                if (music === null) console.log("no such music with ID: "+ music_id);
                                else {
                                    var comment = new Comment({
                                        comment_userId: user_id,
                                        comment_content: comment_string
                                    });
                                    comment.save();
                                    music.comments.push(comment);
                                    music.commentN+=1;
                                    music.save();

                                    //res.send(Comment.findByMusicId(music_id));
                                    console.log(music.comments);
                                    res.json({
                                        comment_list: music.comments
                                    });
                                }
                            }
                        });
                    }
            }
        });
}


/*Url get /music/share?music_id=123  */
exports.share = function(req, res, next) {
    var music_id = req.query.music_id;
    Music
        .findOne({_id: music_id})
        .exec(function(err, music) {
            if (err) {
                console.log("err when find music by ID: "+err);
                throw err;
            } else {
                if (music === null) console.log("no such music with ID: "+music_id);
                else {
                    music.shareN+=1;
                    music.save();
                }
                res.json({
                    shareN: music.shareN
                });
            }
        });
}


/*Url get /music/listen?music_id=123  */
exports.listen = function(req, res, next) {
    var music_id = req.query.music_id;
    Music
        .findOne({_id: music_id})
        .exec(function(err, music) {
            if (err) {
                console.log("err when find music by ID: "+ err);
                throw err;
            } else {
                if (music === null) console.log("no such music with ID: "+ music_id);
                else {
                    music.listenN+=1;
                    music.save();
                }
                res.json({
                    listenN: music.listenN
                });
            }
        });
}

/*Url get /music/isCollect?music_id=123  */
exports.is_collect = function(req, res, next) {
    var user_id = req.session.user._id;
    var music_id = req.query.music_id;
    console.log("user ID:"+user_id);

    User
        .findOne({_id: user_id})
        .exec(function(err, user) {
            if (err) {
                console.log("err when find user by ID: "+ err);
                throw err;
            } else {
                if (user === null) console.log("no such user with ID: "+user_id);
                else {
                    Music.findOne({_id: music_id})
                         .exec(function(err, music) {
                            if (err) {
                                console.log("err when find music by ID: "+ err);
                                throw err;
                            } else {
                                if (music === null) console.log("no such music with ID: "+ music_id);
                                else {

                                    res.json({
                                        is_collect: music_id in user.collected_musics
                                    });

                                }
                            }
                         });
                }
            }
        });
}