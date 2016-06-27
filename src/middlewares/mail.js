var nodemailer = require('nodemailer');
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

var transporter = nodemailer.createTransport(config);

transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Server is ready to take our messages');
   }
});

var sendSinupConf = transporter.templateSender({
    subject: 'Online-Studio cont confire for {{username}}!',
    text: 'Hello, {{username}}, Please go here to confer your account: {{ link }}',
    html: '<b>Hello, <strong>{{username}}</strong>, Please <a href="{{ link }}">go here to confer your account</a></p>'
}, {
    from: config.auth.user,
});

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

module.exports = {
    singup: sendSinupConf,
	
}
