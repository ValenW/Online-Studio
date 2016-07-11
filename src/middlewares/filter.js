exports.filterPublicMusic = function(music_list) {
	var rst_list = [];
	for (var m_i = 0; m_i < music_list.length; m_i += 1) {
		var music = music_list[m_i];
		if (music.is_music_public) {
			rst_list.push(music);
		}
	}
	return rst_list;
};
