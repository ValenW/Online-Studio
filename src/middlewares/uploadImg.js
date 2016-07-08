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

module.exports = uploadImg;
