window.addEventListener("load", init, false);

function init() {
	window.patternList = new Array();
	window.addNote = function(pattern, key, head, tail, played) {
		var _pattern = pattern - 1;
		if (patternList[_pattern] == null) {
			patternList[_pattern] = new Array();
		}
		note = {
			key: key,
			head: head,
			tail: tail,
			played: played
		}
		patternList[_pattern].push(note);
		return patternList[_pattern].length - 1;
	}

	window.updateNote = function(pattern, index, key, head, tail, played) {
		var _pattern = pattern - 1;
		if (patternList[_pattern] == null) return;
		patternList[_pattern][index].key = key;
		patternList[_pattern][index].head = head;
		patternList[_pattern][index].tail = tail;
		patternList[_pattern][index].played = played;
	}

	window.removeNote = function(pattern, index) {
		var _pattern = pattern - 1;
		if (patternList[_pattern] == null) return;
		patternList[_pattern][index] = null;
	}
}


