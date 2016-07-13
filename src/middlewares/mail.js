/**
 * 
 * @Author  : ValenW
 * @Link    : https://github.com/ValenW
 * @Email   : ValenW@qq.com
 * @Date    : 2016-07-13 08:07:15
 * @Last Modified by:   ValenW
 * @Last Modified time: 2016-07-13 08:09:32
 */

var nodemailer = require('nodemailer');

// 配置发信邮箱服务器
var config = {
    // service: 'QQ',
    host: "smtp.sina.cn",
    port: 25,
    auth: {
        user: 'meliodas@sina.com',
        pass: 'Meliodas'
    },
    logger: true, // log to console
    debug: true // include SMTP traffic in the logs
}

// 使用上述配置获得对应的transporter
var transporter = nodemailer.createTransport(config);

// 验证该transporter可使用
transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Server is ready to take our messages');
   }
});

// 验证邮件模板
var sendSinupConf = transporter.templateSender({
    subject: 'Online-Studio cont confire for {{username}}!',
    text: 'Hello, {{username}}, Please go here to confer your account: {{ link }}',
    html: '<b>Hello, <strong>{{username}}</strong>, Please <a href="{{ link }}">go here to confer your account in 24h.</a></p>'
}, {
    from: config.auth.user,
});

module.exports = {
    singup: sendSinupConf
}

// use template based sender to send a message
// sendSinupConf({
//     to: 'receiver@example.com'
// }, {
//     username: 'Node Mailer',
//     reset: 'https://github.com/ValenW/Online-Studio'
// }, function(err, info){
//     if(err){
//         console.log('Error');
//     } else {
//         console.log('Password reset sent');
//     }
// });