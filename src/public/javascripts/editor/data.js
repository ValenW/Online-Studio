window.addEventListener("load", init, false);

function init() {
	// channelList is used for local edition
	window.channelList = new Array();

	// create a new spectrum if there is no record
	if (spectrum == null) {
		window.spectrum = {
			// "_id": null,
			"tempo": 110,
			"volume": 10,
			"channels": channelList,
			"createDate": null,
			"lastModificationDate": null
		}
	}

	/**
	 * addNote() insert a new note object to channelList
	 *
	 * @param <int> channel
	 * @param <int> key
	 * @param <int> head
	 * @param <int> tail
	 * @param <int> played
	 */
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

    /**
	 * updateNote() update a note object in channelList
	 *
	 * @param <int> channel
	 * @param <int> key
	 * @param <int> head
	 * @param <int> tail
	 * @param <int> played
	 */
	window.updateNote = function(channel, index, key, head, tail, played) {
		var _channel = channel - 1;
		if (channelList[_channel] == null) return;
		channelList[_channel][index].key = key;
		channelList[_channel][index].head = head;
		channelList[_channel][index].tail = tail;
		channelList[_channel][index].played = played;
	}

	/**
	 * removeNote() set a note object to null in channelList
	 *
	 * @param <int> channel
	 * @param <int> index
	 */
	window.removeNote = function(channel, index) {
		var _channel = channel - 1;
		if (channelList[_channel] == null) return;
		channelList[_channel][index] = null;
	}

	/**
	 * save() ajax post to update spectrum data in database
	 */
	window.save = function() {
		// spectrum notes in database don't have attribute 'played'
		// so we need to create a new channel array partially copies
		// channelList
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

		// ajax post spectrum data
		$.ajax({  
			url: 'editor/save',
			data: {'spectrum': JSON.stringify(spectrum)},
			dataType: "json",
			type: "POST",
			success: function (responseJSON) {
				if (responseJSON.is_login) {
					// record spectrum's id, so next post would be update action
					spectrum._id = responseJSON._id;
					// display messages to indicate the post was successful
					$('#saving-modal')
						.modal({ blurring: true })
						.modal('show');
					setTimeout(function(){
						$('#saving-modal').modal('hide');
					}, 1000);
				} else {
					// if user is offline, login first 
					$('#signin-modal').modal('show');
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert('Oops 服务器出故障了！请检查网络是否顺畅，刷新界面将丢失编辑信息！');
			}
		});
	}

	// init editor engine
	if (spectrum != null) {
		// local notes need additional attribute 'played'
		// so channelList will copy from spectrum channels
		// but add attribute 'played' for each note
		for (var i = 0; i < spectrum.channels.length; ++i) {
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
	} else {
		window.initEditor();
	}
}
