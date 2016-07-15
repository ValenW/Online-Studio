var Music = require('../models/Music');
var User = require('../models/User');
var Comment = require('../models/Comment');


/**
 * showMusicDetail() returns the information needed by music detail's page.
 * @method get
 * @params music_id the id of music which details will be returned.
 * @url /music
 * example: /music?music_id=123
 */
exports.showMusicDetail = function(req, res, next) {
    var music_id = req.query.music_id;
    console.log("music ID: "+ music_id);

    // find the music with _id equals to music_id
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
                    // further populate the music to get comments' users' profiles and usernames
                    var opts = [{
                        path: "comments.comment_userId",
                        select: "profile username",
                        model: 'User'
                    }];
                    Music.populate(music, opts, function(err, populatedMusic) {
                        if (err) {
                            console.log("err when loading music with ID: "+music_id);
                        } else {
                            // if the user is logged in, we will first update the session
                            if (req.session.user != undefined) {
                                User.findOne({
                                    _id : req.session.user._id
                                }, function(err, user) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        if (user === null) {
                                            console.log("err in musicDetail");
                                        } else {
                                            // update the session
                                            req.session.user = user;

                                            console.log(req.session.user);

                                            // tell if the music is collected
                                            var isHaving = false;
                                            for (var i = 0; i < user.collected_musics.length; i++) {
                                                if (music_id == user.collected_musics[i]) {
                                                    isHaving = true;
                                                    break;
                                                }
                                            }
                                            console.log(isHaving);

                                            res.render('music_detail', {
                                                music: populatedMusic,
                                                user:  {
                                                    _id: req.session.user._id,
                                                    username: req.session.user.username,
                                                    profile: req.session.user.profile,
                                                    confed: req.session.user.confed,
                                                    is_collect: isHaving
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                //response user with null if not logs in.
                                res.render('music_detail', {
                                    music: populatedMusic,
                                    user:  null
                                });
                            }
                        }
                    });
                }
            }
        });
};

/**
 * saveMusicToRepo() collects the music to current user and returns the new number of collecting
 * @method get
 * @params music_id the id of music which will be collected.
 * @url /music/saveMusicToRepo
 * example: /music/saveMusicToRepo?music_id=123
 */
exports.saveMusicToRepo = function(req, res, next) {
    var user_id = req.session.user._id;
    var music_id = req.query.music_id;
    console.log("user ID: "+ user_id);

    // retrieve the use from the db even exists in session for the information of user in session might be out of date.
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

                                    // tell if the music was collected.If is, removes it from the list
                                    var isHad = false;
                                    for (var i = 0; i < user.collected_musics.length; i++) {
                                        if (music_id == user.collected_musics[i]) {
                                            user.collected_musics.splice(i, 1);
                                            music.collectN-=1;
                                            isHad = true;
                                            break;
                                        }
                                    }
                                    console.log(isHad);
                                    // otherwise, push it into the list
                                    if (!isHad) {
                                        music.collectN+=1;
                                        user.collected_musics.push(music_id);
                                    }

                                    music.save();
                                    user.save();
                                    // update the session
                                    req.session.user = user;
                                    res.json({
                                        collectN: music.collectN,
                                        is_collect: !isHad
                                    });

                                }
                            }
                         });
                }
            }
        });
}

/**
 * insertComment() adds new comment to the music and return the update comments list back
 * @method post
 * @params music_id the id of music which will be collected.
 * @params comment_string is the comment content which will be inserted.
 * @url /music/insertComment
 */
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
    // retrieve the use from the db even exists in session for the information of user in session might be out of date. 
    User
        .findOne({_id: user_id})
        .exec(function(err, user) {
            if (err) {
                console.log("err when find user by ID: "+err);
                throw err;
            } else {
                if (user === null) console.log("no such user with ID: "+ user_id);
                else {
                    // find music with all its comments
                    Music
                        .findOne({_id: music_id})
                        .populate('comments')
                        .exec(function(err, music) {
                            if (err) {
                                console.log("err when find music by ID: "+ err);
                                throw err;
                            } else {
                                if (music === null) console.log("no such music with ID: "+ music_id);
                                else {
                                    // insert a new comment to the music
                                    var comment = new Comment({
                                        comment_userId: user_id,
                                        comment_content: comment_string
                                    });
                                    comment.save();
                                    music.comments.push(comment);
                                    music.commentN+=1;
                                    music.save();

                                    // further populate the music to get comments' users' profiles and usernames
                                    var opts = [{
                                        path: "comments.comment_userId",
                                        select: "profile username",
                                        model: 'User'
                                    }];
                                    Music.populate(music, opts, function(err, populatedMusic) {
                                        if (err) {
                                            console.log("err when loading music with ID: "+music_id);
                                        } else {
                                            console.log(music.comments);
                                            res.json({
                                                comment_list: populatedMusic.comments
                                            });
                                        }
                                    });

                                    //res.send(Comment.findByMusicId(music_id));
                                    // console.log(music.comments);
                                    // res.json({
                                    //     comment_list: music.comments
                                    // });
                                }
                            }
                        });
                    }
            }
        });
}

/**
 * share() shares the music and returns the new number of sharing (still implementing)
 * @method get
 * @params music_id the id of music which will be shared
 * @url /music/share
 * example: /music/share?music_id=123
 */
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
                    // add up the counts for sharing and do nothing else
                    music.shareN+=1;
                    music.save();
                }
                res.json({
                    shareN: music.shareN
                });
            }
        });
}

/**
 * listen() returns the new number of listening
 * @method get
 * @params music_id the id of music which will be listened
 * @url /music/listen
 * example: /music/listen?music_id=123
 */
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
                    // add up the counts for listening and do nothing else
                    music.listenN+=1;
                    music.save();
                }
                res.json({
                    listenN: music.listenN
                });
            }
        });
}

/**
 * is_collect() returns true or not for collecting (not used)
 * @method get
 * @params music_id the id of music needed to know whether is already collected
 * @url /music/isCollect
 * example: /music/isCollect?music_id=123
 */
exports.is_collect = function(req, res, next) {
    var user_id = req.session.user._id;
    var music_id = req.query.music_id;
    console.log("user ID:"+user_id);

    // retrieve the use from the db even exists in session for the information of user in session might be out of date. 
    User
        .findOne({_id: user_id})
        .exec(function(err, user) {
            if (err) {
                console.log("err when find user by ID: "+ err);
                throw err;
            } else {
                if (user === null) console.log("no such user with ID: "+user_id);
                else {
                    // find music with all its collections
                    Music.findOne({_id: music_id})
                         .exec(function(err, music) {
                            if (err) {
                                console.log("err when find music by ID: "+ err);
                                throw err;
                            } else {
                                if (music === null) console.log("no such music with ID: "+ music_id);
                                else {
                                    // tell if the music is already collected
                                    var isHaving = false;
                                    for (var i = 0; i < user.collected_musics.length; i++) {
                                        if (music_id == user.collected_musics[i]) {
                                            isHaving = true;
                                            break;
                                        }
                                    }

                                    res.json({
                                        is_collect: isHaving
                                    });

                                }
                            }
                         });
                }
            }
        });
}