var Spectrum = require('../models/Spectrum');
var Music = require('../models/Music');
var User = require('../models/User');
var Tag = require('../models/Tag');
var Comment = require('../models/Comment');

// interface : /editor?spectrum_id=***  or  /editor
exports.showEditor = function(req, res, next) {

	if (req.query.spectrum_id === undefined) {
		// first time create Spectrum
		res.render('editor', {
			spectrum: null,
			user: req.session.user === undefined ? null : {
				username: req.session.user.username,
				profile: req.session.user.profiles
			}
		});

	} else {
		// revise Spectrum according to spectrum_id
		var spectrum_id = req.query.spectrum_id;

		Spectrum.find({_id: spectrum_id}, function(err, spectrums) {
			if (err) {
				console.log ('Error in /editor interface.');
			} else {
				res.render('editor', {
					spectrum: spectrums[0],
					user: req.session.user === undefined ? null : {
						username: req.session.user.username,
						profile: req.session.user.profiles
					}
				});
			}
		});

	}
};


// if spectrum_param has no _id, the new method create one.
// elif spectrum_param has _id, just update the exist spectrum.
exports.saveSpectrum = function(req, res, next) {

	// user not login, need to notice it
	var user = req.session.user;
	if (user === undefined) {	// user not login
		res.json({
			is_login: false
		});
		return;
	}

	// user login, continue to create or save spectrum
	spectrum_param = JSON.parse(req.body.spectrum);

	if (spectrum_param._id === undefined) {	// create Spectrum document
		// create Music document and set relationship between User and Music
		// create Spectrum
		var date = new Date();
		var spectrum = new Spectrum({
		    tempo : spectrum_param.tempo,
		    volume : spectrum_param.volumn,
		    createDate : date,
		    lastModificationDate : date,
		    channels : spectrum_param.channels
		});
		spectrum.save();
		console.log ('Create Spectrum ', spectrum._id);

		// cascaded in save method ?
		// create Music info for Spectrum
		var tag_name_list = new Array('抒情', '恐怖', '空灵', '浪漫');
		var r = parseInt(Math.random() * 100 % tag_name_list.length);

		// find tag begin.
		Tag.findOne({
			tag_name: tag_name_list[r]
		}, function(err, tag) {
			if (err) {
				console.log ('Error in /editor/save interface in finding tag.');
			} else {
				var date = new Date();
				var music = new Music({
					based_on: null,
					spectrum: spectrum,
					name: date,
					author: user,
					cover: 'default_cover.png',
					date: date,
					tags: [tag],	// for debug
					// tags: [],	// release version
					ranks: [],
					comments: [],
					listenN: 0,
					collectN: 0,
					commentN: 0,
					shareN: 0,
					is_music_public: true,
					is_spectrum_public: false,
					introduction: 'I am a music.'
				});
				music.save();
				console.log ('Create Music ', music._id);

				// Tag correlate with Music
				tag.music_list.push(music);
				tag.save();

				// set relationship
				user.original_musics.push(music);

				User.update({_id: user._id}, user, {}, function(err, info) {
					if (err) {
						console.log ('Error in /editor/save updating User.');
					}  else {
						console.log('Update User ', user._id ,' with Music ', music._id,' successfully.');
						res.json({
							is_login: true,
							_id: spectrum._id
						});
					}
				});

			}
		});
		// find tag end.
		

	} else {	// update Spectrum document
		// if spectrum is in user's collected_musics list, <??remove it from user's collected_musics list and??> create a new Spectrum,a new Music and correlate with User's derivative_musics list.
		// elif sppectrum is in user's original_musics list or user's derivative_musics list, just update the spectrum.
		User.findOne({
			_id: user._id
		}, function(err, user) {
			if (err) {
				console.log ('Error in /save request while finding user.');
			} else {
				Music.populate(user, {path: 'collected_musics', select: 'spectrum'}, function(err, user) {
					// judege whether spectrum is in user's collected_musics list
					var based_on = null;
					for (var cm_i in user.collected_musics) {
						var c_music = user.collected_musics[cm_i];
						if (c_music.spectrum === spectrum_param._id) {
							based_on = c_music._id;
							break;
						}
					}

					if (based_on !== null) {	// act when in
						// create a new Spectrum the same as the spectrum_param
						// create Spectrum begin.
						var date = new Date();
						Spectrum.create({
						    tempo : spectrum_param.tempo,
						    volume : spectrum_param.volumn,
						    createDate : date,
						    lastModificationDate : date,
						    channels : spectrum_param.channels
						}, function(err, spectrum) {
							if (err) {
								console.log ('Error in /save request, Spectrum.create method');
							} else {
								console.log ('Create Spectrum ', spectrum._id);
								console.log ('Spectrum.create', '\n', spectrum);

								// create Music begin.
								Music.create({
									based_on: based_on,
									spectrum: spectrum,
									name: date,
									author: user,
									cover: 'default_cover.png',
									date: date,
									// tags: [],	// release version
									ranks: [],
									comments: [],
									listenN: 0,
									collectN: 0,
									commentN: 0,
									shareN: 0,
									is_music_public: true,
									is_spectrum_public: false,
									introduction: 'I am a music.'
								}, function(err, music) {
									if (err) {
										console.log ('Error in /save request, Music.create method.');
									} else {
										console.log ('Create Music ', music._id);
										console.log ('Music.create', '\n', music);
										user.derivative_musics.push(music);
										user.save();

										res.json({
											is_login: true,
											_id		: spectrum._id
										})

									}
								});
								// create Music end.
							}
						});
						// create Spectrum end.
					} else {	// act when not
						spectrum_param.lastModificationDate = new Date();
						Spectrum.update({
							_id: spectrum_param._id
						}, spectrum_param, {}, function(err, info) {
							if (err) {
								console.log ('Error in /save request, Spectrum.update method.');
							} else {
								console.log ('Update Spectrum ', spectrum_param._id);
								res.json({
									is_login: true,
									_id: spectrum_param._id
								});
							}
						});

					}

				});
			}
		});
	}

};

// Request: /editor/login POST username&password
exports.login = function(req, res, next) {
    User.findOne({
        'username': req.body.username,
        'password': req.body.password
    }, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user === null) {
                req.flash('error', 'The username or password is not correct');
                res.json({
                	login_rst: 'fail'
                });
            } else {
                req.session.user = user;
                res.json({
                	login_rst: 'success',
                	user: user
                })
            }
        }
    });
};

// Request: /editor/signup POST username&password&email
exports.signup = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    User.find({$or: [ {'username': username}, {'email': email} ]}, function(err, users) {
        if (users.length > 0) {
            if (users[0].confed) {
                console.log(users[0].confed);
                req.flash('error', 'The username or email has been used');
            } else {
                req.flash('error', 'The username hasn\'t been confired');
            }
            res.json({
            	signup_rst: 'fail'
            });
        } else {
            var date = new Date();
            User.create({
                'username': username,
                'password': password,
                'email': email,
                'confed': false,
                'createDate': date
            }, function(err, newUser) {
                var id = newUser._id.toString();
                if (err) {
                    console.log('error when create User!');
                } else {
                    MailSender.singup({
                        to: email
                    }, {
                        username: username,
                        link: 'http://localhost:3000/conf?id=' + id // TODO
                    }, function(err, info){
                        if(err){
                            console.log('Error');
                        } else {
                            console.log('Account Confer email sent');
                        }
                    });
                    req.flash('error', 'The account confiring email has been send.');
                    req.session.user = newUser;
                    console.log("new user: ", req.session.user);
                    res.json({
                    	signup_rst: 'success',
                    	user: newUser
                    });
                }
            });
        }
    });
}

// Request: /editor/logout GET
exports.logout = function(req, res, next) {
    req.session.destroy();
    res.json({
    	logout: 'success'
    });
}
