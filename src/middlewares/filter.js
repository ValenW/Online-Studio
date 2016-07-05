exports.filterPublicMusic = function(music_list) {
	rst_list = [];
	for (m_i in music_list) {
		music = music_list[m_i];
		if (music.is_music_public) {
			rst_list.push(music);
		}
	}
	return rst_list;
};
