/**
 * 
 * @Author  : ValenW
 * @Link    : https://github.com/ValenW
 * @Email   : ValenW@qq.com
 * @Date    : 2016-07-13 08:07:15
 * @Last Modified by:   ValenW
 * @Last Modified time: 2016-07-13 08:08:45
 */

var multer  = require('multer');

// 该函数返回一个可自定义命名函数和保存路径的upload中间件
// 具体用法可以参考
// https://github.com/ValenW/Online-Studio/issues/98
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
