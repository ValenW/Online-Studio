var User = require('../models/User');
var Comment = require('../models/Comment');
var Tag = require('../models/Tag');
var Spectrum = require('../models/Spectrum');
var Music = require('../models/Music');

exports.createData = function(req, res, next) {
    // console.log("Remove all data");
    User.remove({}, function(err) {});
    Comment.remove({}, function(err) {});
    Tag.remove({}, function(err){});
    Spectrum.remove({}, function() {});
    Music.remove({}, function(){});
    
    user_create_date = new Date(2016, 7, 1, 9);
    
    comment_create_date = new Date(2016, 7, 2, 12);
    
    spectrum_create_date = new Date(2016, 7, 1, 10);
    spectrum_modification_date = new Date(2016, 7, 1, 11);

    music_create_date = new Date(2016, 7, 1, 14);

    // // create data
    Spectrum.create({
        tempo: 110,
        volume: 10,
        channels: [[
            { key: 40, head: 19, tail: 21 },
            { key: 46, head: 29, tail: 31 },
            { key: 50, head: 40, tail: 42 },
            { key: 47, head: 52, tail: 54 },
            { key: 39, head: 54, tail: 56 } ]],
        createDate: spectrum_create_date,
        lastModificationDate: spectrum_modification_date
    }, function(err, spectrum) {
        console.log(spectrum);
        Comment.create({
            comment_date: comment_create_date,
            comment_content: "好听，赞赞赞"
        }, function(err, comment) {
            console.log(comment);
            console.log(spectrum);
            Music.create({
                based_on: null,
                spectrum: [spectrum._id],
                name: "好听的歌",
                author: null,
                cover: "nice_song.png",
                date: music_create_date,
                tags: [],
                ranks: [3.5],
                comments: [comment._id],
                listenN: 10,
                collectN: 2,
                commentN: 1,
                shareN: 1,
                is_music_pubic: true,
                is_spectrum_pubic: true,
                introduction: "这是一首好听的歌"
            }, function(err, music1) {
                if (err) {
                    console.log("发生了错误！！！！！！！");
                }
                console.log(music1);
                Tag.create({
                    tag_name: "流行",
                    music_list: [music1._id]
                }, function(err, tag) {
                    music1.update({$push: {tags: tag._id}}, function(err) {
                        Music.create({
                            based_on: music1._id,
                            spectrum: [spectrum._id],
                            name: "悲伤的歌",
                            author: null,
                            cover: "sad_song.png",
                            date: music_create_date,
                            tags: [],
                            ranks: [4.5],
                            comments: [comment._id],
                            listenN: 10,
                            collectN: 2,
                            commentN: 2,
                            shareN: 1,
                            is_music_pubic: true,
                            is_spectrum_pubic: true,
                            introduction: "这是一首悲伤的歌"
                        }, function(err, music2) {
                            tag.update({$push: {music_list: music2._id}}, function(err) {
                                User.create({
                                    username: "linytsysu",
                                    email: "linytsysu@163.com",
                                    password: "password",
                                    confed: true,
                                    profile: "linytsysu.png",
                                    introduction: "hello world",
                                    musics: [music1._id],
                                    original_musics: [music1._id],
                                    collected_musics: [music1._id, music2._id],
                                    derivative_musics: [],
                                    createData: user_create_date
                                }, function(err, user) {
                                    console.log(user);
                                    music1.update( {$set: {author: user._id}}, function(err) {
                                        music2.update( {$set: {author: user._id}}, function(err) {
                                            res.redirect('/');
                                        });
                                    });
                                });
                            });
                        });
                        
                    });
                });
            });
        });
    });
    

    // test - query
    // var promise = User.findOne({username: "linytsysu"}).exec();
    // promise.then(function(user) {
    //     console.log(user);
    //     var one_music_id = user.musics[0];
    //     return Music.findOne({_id: one_music_id}).exec();
    // }).then(function(music) {
    //     console.log(music);
    // }).catch(function(err) {
    //     console.log("Error!!!!!!!!!!!!!!'");
    //     console.log(err);
    // });
}
