exports.newest_cmp = function(music1, music2) {
	console.log (music1.date);
	if (music1.date > music2.date) {
		return 1;
	} else if (music1.date < music2.date) {
		return -1;
	}
};

exports.hotest_cmp = function(music1, music2) {
	if (music1.listenN > music2.listenN) {
		return 1;
	} else if (music1.listenN < music2.listenN) {
		return -1;
	}
};
