var express = require('express');
var router = express.Router();



router.route('/')
.get(function(req, res, next) {
	console.log (req.session.user);
});

module.exports = router;
