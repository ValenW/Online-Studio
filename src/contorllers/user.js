var User = require('../models/User');

// just an example for population
exports.getAllMusic = function(req, res, next) {
    var id = '123123';
    User.findOne({'id':id}).populate('muiscs').exec(function(err, user) {
        console.log(user);
    });
};