window.addEventListener("load", init, false);

var context;
var bufferList;

var tempo = 110;
var unitTime  = 15 / tempo;

function init() {
	loadSource();
}

/**
 * loadSource() uses WebAudio API to load sound resouces
 */
function loadSource() {
	// fix up prefixing
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();

	// show progress modal
	$('#progress-modal')
		.modal({closable: false, blurring: true})
		.modal('show');

	// store audio urls
	urlList = new Array();
	for (var i = 108; i >= 21; --i) {  // 88 keys
		// urlList.push("sounds/piano1/"+getKeyName(i)+".mp3");
		index = i < 100 ? "0" + i.toString() : i.toString();
		audioPath = "resources/sounds/piano2/GermanConcertD_"+index+"_083.wav";
		urlList.push(audioPath);
	}

	// create BufferLoader object
	bufferLoader = new BufferLoader(context, urlList, finishedLoading);

	// start loading
	bufferLoader.load();
}

/**
 * BufferLoader() assgined basic information for loading
 *
 * @param <AudioContext> context [window.AudioContext]
 * @param <List<string>> urlList [list that store url strings]
 * @param <Function> callback [callback function]
 */
function BufferLoader(context, urlList, callback) {
	this.context = context;
	this.urlList = urlList;
	this.onload = callback;
	this.bufferList = new Array();
	this.loadCount = 0;
}

/**
 * loadBuffer() loads and decode audio resources
 *
 * @param <string> url
 * @param <int> index
 */
BufferLoader.prototype.loadBuffer = function(url, index) {
	// Load buffer asynchronously
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	var loader = this;

	request.onload = function() {
		// Asynchronously decode the audio file data in request.response
		loader.context.decodeAudioData(
			request.response,
			function(buffer) {
				if (!buffer) {
					alert('error decoding file data: ' + url);
					return;
				}
				loader.bufferList[index] = buffer;
				// indicate progress
				$('#loading').progress('increment');

				if (++loader.loadCount == loader.urlList.length)
				loader.onload(loader.bufferList);
			},
			function(error) {
				console.error('decodeAudioData error', error);
			}
		);
	}

	request.onerror = function() {
		alert('BufferLoader: XHR error');
	}

	request.send();
}

BufferLoader.prototype.load = function() {
	for (var i = 0; i < this.urlList.length; ++i)
	this.loadBuffer(this.urlList[i], i);
}

// receive buffer result 
function finishedLoading(buffer) {
	bufferList = buffer;
	$('#progress-modal').modal('hide');
}

/**
 * playSound() plays buffer
 *
 * @param <object> buffer [bufferList item]
 * @param <int> head [grid index that note starts]
 * @param <int> tail [grid index that note ends]
 */
function playSound(buffer, head, tail) {
	var startTime = context.currentTime + head * unitTime;
	var endTime = context.currentTime + tail * unitTime;

	var source = context.createBufferSource();
	var gainNode = context.createGain ? context.createGain() : context.createGainNode();
	source.connect(gainNode);
	gainNode.connect(context.destination);

	source.buffer = buffer;
	gainNode.gain.linearRampToValueAtTime(1, endTime - 1);
	gainNode.gain.linearRampToValueAtTime(0, endTime);

	if (!source.start)
		source.start = source.noteOn;
	source.start(startTime);
	source.stop(endTime);
}

/**
 * playNote() plays a note
 * 
 * @param <object> note [a note contains key, head, tail]
 */
window.playNote = function(note) {
	if (note)
		playSound(bufferList[note.key], 0, note.tail - note.head + 1);
}

// reset tempo
window.setTempo = function(_tempo) {
	if (_tempo > 0) {
		tempo = _tempo;
		unitTime  = 15 / tempo;
		window.spectrum.tempo = tempo;
	}
}

/* utility function */
// get key name from index
window.getKeyName = function(i) {
	var labels = ['B', 'A_', 'A', 'G_', 'G', 'F_', 'F', 'E', 'D_', 'D', 'C_', 'C'];
	var key = labels[(i+11)%12];
	key += (Math.floor((88+8-i)/12)+1).toString();
	return key;
}
