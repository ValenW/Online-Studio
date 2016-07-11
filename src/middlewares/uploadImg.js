var multer  = require('multer');

var uploadImg = function(path, renameFuntion) {
    var uploadStorage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './bin/public/uploads/' + path)
        },
        filename: function(req, file, cb) {
            cb(null, renameFuntion(req, file))
        }
    });

    var uploader = multer({
        storage: uploadStorage
    });

    return uploader;
}

var musicCoverUploader = uploadImg('covers/', function(req, file) {
    return req.body.music_id + '_cover';
});

var headUploader = uploadImg('heads/', function(req, file) {
    return req.session.user._id + '_head';
});

exports.uploadImg = uploadImg;
exports.musicCoverUploader = musicCoverUploader;
exports.headUploader = headUploader;
