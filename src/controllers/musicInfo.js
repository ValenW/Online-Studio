var Music       = require('../models/Music');
var Tag         = require('../models/Tag');
var uploadImg   = require('../middlewares/uploadImg');


/**
 * showMusicInfo() show music information update view to user.
 * Based on reqest parameters, set response.
 * display music information and allow user to modify it.
 * Deal with request URL : /music_info?music_id=***
 * @param <Object> req store parameters of the user request, such as req.session.user and req.query.music_id.
 * @param <Object> res encapsulate content and methods of response to user request, such as res.render, res.json and res.send methods.
 * @param <Function> next encapsulate the next function needed to be execute if necessary
 * @return nothing
 */
exports.showMusicInfo = function(req, res, next) {
    var user = req.session.user;
    var music_id = req.query.music_id;
    Music.findOne({
        _id: music_id
    }, function(err, music) {
        if (err) {
            console.log ('Error in /music_info request.');
            res.render('error/500');
        } else {
            if (music == null) {
                console.log ('music_id(', music_id, ') can\'t be found.');
                res.send('Error');
                return;
            }
            console.log ('music.author', music.author);
            console.log ('user._id', user._id);
            if (music.author != user._id) { // user is not music's author
                console.log('User is not the author of the music.');
                res.redirect('/');
            } else {    // user is the author of the music.
                Tag.findByDefaultTagNameList(null, function(err, tags) {
                    res.render('music_info', {
                        music: music,
                        tags: tags,
                        user: req.session.user == undefined ? null : {
                            _id: req.session.user._id,
                            username: req.session.user.username,
                            profile: req.session.user.profile
                        }
                    });
                });
            }
        }
    });
    
};


/**
 * updateMusicInfo() update music information.
 * Based on reqest parameters, set response.
 * update music information modified by user.
 * Deal with request URL : /update_music_info POST music_id&name&introduction&tag&is_spectrum_public&is_music_public
 * @param <Object> req store parameters of the user request, such as req.body.music_id,req.body.name....
 * @param <Object> res encapsulate content and methods of response to user request, such as res.render, res.json and res.send methods.
 * @param <Function> next encapsulate the next function needed to be execute if necessary
 * @return nothing
 */
exports.updateMusicInfo = function(req, res, next) {
    console.log('in updateMusicInfo');

    // if user is not login, redirect to /login 
    if (req.session.user == undefined) {
        res.redirect('/login');
        return;
    }

    var upload = uploadImg.musicCoverUploader.single('cover');
    upload(req, res, function(err) {
        if (err) {
            console.log ('Error in uploading Music Cover.\n', err);
            res.render('error/500');
        } else {
            var music_id            = req.body.music_id;
            var name                = req.body.name;
            var introduction        = req.body.introduction;
            var tags                = req.body.tag;
            var is_spectrum_public  = req.body.is_spectrum_public;
            var is_music_public     = req.body.is_music_public;

            // remove the old relation between tag and music.
            Music.findOne({_id: music_id}, function(err, music) {
                Tag.find({
                    _id: {
                        $in: music.tags
                    }
                }, function(err, n_tags) {
                    if (err) {
                        console.log('Error in /update_music_info.');
                        res.render('error/500');
                    } else {
                        for (var t_i = 0; t_i < n_tags.length; t_i += 1) {
                            var tag = n_tags[t_i];
                            tag.removeMusicById(music._id);
                            tag.save();
                        }

                        // add new relation between tag and music.
                        Tag.find({
                            _id: {
                                $in: tags
                            }
                        }, function(err, n_tags) {
                            if (err) {
                                console.log ('Error in /update_music_info.');
                                res.render('error/500');
                            } else {
                                for (var t_i = 0; t_i < n_tags.length; t_i += 1) {
                                    var tag = n_tags[t_i];
                                    tag.addMusicById(music_id);
                                    tag.save();
                                }
                            }
                        });
                        // add end.
                    }
                })
            });

            Music.update({
                _id: music_id
            }, {
                name: name,
                introduction: introduction,
                tags: tags, // Format of music.tags is [tag0_id, tag1_id, tag2_id]
                is_spectrum_public: is_spectrum_public,
                is_music_public: is_music_public,
                cover: music_id + '_cover'
            }, {}, function(err, info) {
                if (err) {
                    console.log('Error in /update_music_info request.\n', err);
                    res.render('error/500');
                } else {
                    console.log ('Update music(', music_id ,') info successfully.');

                    res.redirect('/music?music_id=' + music_id);
                }
            });
        }
    });
};
