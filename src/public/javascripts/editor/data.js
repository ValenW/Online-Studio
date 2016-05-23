window.addEventListener("load", init, false);

function init() {
	window.patternList = new Array();
	window.addNote = function(pattern, key, head, tail, played) {
		if (patternList[pattern] == null) {
			patternList[pattern] = new Array();
		}
		note = {
			key: key,
			head: head,
			tail: tail,
			played: played
		}
		patternList[pattern].push(note);
		return patternList[pattern].length - 1;
	}

	window.updateNote = function(pattern, index, key, head, tail) {
		if (patternList[pattern] == null) return;
		patternList[pattern][index].key = key;
		patternList[pattern][index].head = head;
		patternList[pattern][index].tail = tail;
	}

	window.removeNote = function(pattern, index) {
		if (patternList[pattern] == null) return;
		patternList[pattern][index] = null;
	}
}


