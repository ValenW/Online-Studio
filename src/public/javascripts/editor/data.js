window.addEventListener("load", init, false);

function init() {
	window.channelList = new Array();
	window.spectrum = {
		// "_id": null,
		"tempo": 110,
		"volume": 10,
		"channels": channelList,
		"createDate": new Date(),
		"lastModificationDate": new Date()
	}

	/* interface */
	window.addNote = function(channel, key, head, tail, played) {
		var _channel = channel - 1;
		if (channelList[_channel] == null) {
			channelList[_channel] = new Array();
		}
		note = {
			key: key,
			head: head,
			tail: tail,
			played: played
		}
		channelList[_channel].push(note);
		return channelList[_channel].length - 1;
	}

	window.updateNote = function(channel, index, key, head, tail, played) {
		var _channel = channel - 1;
		if (channelList[_channel] == null) return;
		channelList[_channel][index].key = key;
		channelList[_channel][index].head = head;
		channelList[_channel][index].tail = tail;
		channelList[_channel][index].played = played;
	}

	window.removeNote = function(channel, index) {
		var _channel = channel - 1;
		if (channelList[_channel] == null) return;
		channelList[_channel][index] = null;
	}

	window.save = function() {
		spectrum.lastModificationDate = new Date();
		var channels = new Array();
		for (var i = 0; i < channelList.length; ++i) {
			if (channelList[i] != null) {
				channels[i] = new Array();
				for (var j = 0; j < channelList[i].length; ++j) {
					if (channelList[i][j] == null) {
						channels[i].push(null);
					} else {
						note = {
							key: channelList[i][j].key,
							head: channelList[i][j].head,
							tail: channelList[i][j].tail
						}
						channels[i].push(note);
					}
				}
			}
		}
		spectrum.channels = channels;
		console.log(spectrum);
		// $.post("editor/post",
		// 	{
		// 		"spectrum": spectrum
		// 	},
		// 	function(data) {
		// 		console.log(data);
		// 		spectrum.spectrumId = data;
		// 	}
		// );
		$.ajax({  
		    url: 'editor/save',
		    data: {'spectrum': JSON.stringify(spectrum)},
		    dataType: "json",
		    type: "POST",
		    success: function (responseJSON) {
		        // your logic
		        console.log (responseJSON);
		    }
		});
	}

	// request spectrum
	var param = location.pathname.split('/editor/');
	if (param.length > 1 && param[1].length > 0) {
		var id = param[1];
		$.get(
			"/editor/"+id,
			function(data) {
				console.log(data);
				spectrum = data;
				for (var i = 0; i < spectrum.channels; ++i) {
					if (spectrum.channels[i] != null) {
						channelList[i] = new Array();
						for (var j = 0; j < spectrum.channels[i].length; ++j) {
							if (spectrum.channels[i][j] == null) {
								channelList[i].push(null);
							} else {
								note = {
									key: spectrum.channels[i][j].key,
									head: spectrum.channels[i][j].head,
									tail: spectrum.channels[i][j].tail,
									played: false
								}
								channelList[i].push(note);
							}
						}
					}
				}
				window.setTempo(spectrum.tempo);
				window.initEditor();
			}
		);
	} else {
		window.initEditor();
	}
}


