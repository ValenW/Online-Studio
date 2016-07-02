var stage, w, h;
var keyContainer, noteContainer, barContainer, staticContainer;

/* size */
var unitW = 20, unitH = 20;
var keyW = 80, keyH = unitH;
var keyNum = 88, cacheLength = 256;
var scrollbarH = 20, barH = 30;

/* color */
var GRID_COLOR = "#75726A";
var NOTE_COLOR = "#6FFF6E";
var KEY_WHITE_COLOR = "#FFFFFF";
var KEY_BLACK_COLOR = "#000000";
var KEY_C_COLOR = "#C2BDB4";
var KEY_PRESS_COLOR = "#FFA449";
var BRICK_COLOR = "#302F2C";
var SCROLLBAR_BG_COLOR = "#21201E";
var SCROLLBAR_BTN_COLOR = "#595751";
var BAR_COLOR = "#45433E";
var BUOY_TRI_COLOY = "yellow";
var BUOY_LINE_COLOY = "rgba(255,255,0,0.5)";
var KEY_MASK_COLOR = "rgba(0,0,0,0.1)";

/* initialization */
window.initEditor = function() {
	w = window.innerWidth;
	h = window.innerHeight - 100;
	var canvas = document.getElementById('canvas');
	canvas.setAttribute("width", w);
	canvas.setAttribute("height", h);

	initCanvas();
	initInterface();
	window.switchChannel(1);
}

function initCanvas() {
	stage = new createjs.Stage("canvas");

	// noteContainer stays on the right displaying notes
	noteContainer = new createjs.Container();
	initNoteContainer(-1);
	stage.addChild(noteContainer);

	// barContainer stays on the top displaying tools
	initBarContainer();
	stage.addChild(barContainer);

	// keyContainer stays on the left displaying keyboards
	initKeyContainer();
	stage.addChild(keyContainer);

	// staticContainer never moves displaying static object
	initStaticContainer();
	stage.addChild(staticContainer);

	extendGrid(0, 0, cacheLength);

	// add a text object to output the current FPS:
	fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#888");
	stage.addChild(fpsLabel);
	fpsLabel.x = 10;
	fpsLabel.y = 20;

	// enabled mouse over / out events
	stage.enableMouseOver();
	stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
}

function initNoteContainer(channel) {
	noteContainer.x = noteContainer.originX = keyW;
	noteContainer.y = noteContainer.originY = scrollbarH+barH;
	if (noteContainer.w == null) noteContainer.w = 0;
	noteContainer.h = unitH*keyNum;
	noteContainer.setBounds(0, 0, w-keyW-scrollbarH, h-scrollbarH-barH);
	noteContainer.tickEnabled = false;

	noteContainer.channel = channel;

	// grid is used to draw lines on the background
	var grid = new createjs.Shape();
	grid.name = "grid";
	noteContainer.addChild(grid);

	// mask is used to indicate the key involved
	var mask = new createjs.Shape();
	mask.name = "mask";
	noteContainer.addChild(mask);

	noteContainer.on("mousedown", noteContainerMouseDownHandler);
	noteContainer.on("pressup", noteContainerPressUpHandler);
}

function initBarContainer() {
	barContainer = new createjs.Container();
	barContainer.x = barContainer.originX = keyW;
	barContainer.y = barContainer.originY = scrollbarH;
	if (barContainer.w == null) barContainer.w = 0;
	barContainer.tickEnabled = false;
	barContainer.setBounds(0, 0, w-keyW-scrollbarH, barH);

	var labelbg = new createjs.Shape();
	labelbg.name = "labelbg";
	barContainer.addChild(labelbg);

	// buoy is used to indicate the progress
	var buoyContainer = new createjs.Container();
	buoyContainer.name = "buoyContainer";
	barContainer.addChild(buoyContainer);

	var buoy = new createjs.Shape();
	buoy.name = "buoy";
	buoy.graphics.f(BUOY_TRI_COLOY).mt(-barH/4,0).lt(barH/4,0).lt(0,barH/4*1.6);
	buoy.graphics.s(BUOY_LINE_COLOY).mt(0,barH).lt(0,h);
	buoyContainer.addChild(buoy);

	var buoyLight = new createjs.Shape();
	buoyLight.name = "light";
	buoyLight.graphics.lf(["rgba(117,114,106,0)",BUOY_TRI_COLOY],[0, 1],buoy.x-barH,0,buoy.x+2,0).r(buoy.x-barH,barH,barH+1,h);
	buoyLight.visible = false;
	buoyContainer.addChild(buoyLight);

	barContainer.on("mousedown", barContainerMouseDownHandler);
	barContainer.on("pressmove", barContainerPressMoveHandler);
}

function initKeyContainer() {
	keyContainer = new createjs.Container();
	keyContainer.x = keyContainer.originX = 0;
	keyContainer.y = keyContainer.originY = scrollbarH+barH-keyH/2;
	keyContainer.w = keyW;
	keyContainer.h = keyH*keyNum;
	keyContainer.setBounds(0, 0, keyW, h-scrollbarH-barH);
	keyContainer.tickEnabled = false;

	var keyClassifier = [2,4,6,9,11,0,1,7,8,3,5,10];
	var blackKeys = new Array();
	var y = 0;

	for (var i = 0; i < keyNum; ++i) {
		var key = new createjs.Shape();
		key.name = String(i);

		for (var j = 0; j < 12; ++j) {
			if (i%12 == keyClassifier[j]) {
				if (j < 5) {
					key.y = y-keyH/2;
					key.w = keyW*2/3;
					key.h = keyH;
					key.kcolor = KEY_BLACK_COLOR;
					key.graphics.f(key.kcolor).r(0, 0, keyW*2/3, keyH);
					blackKeys.push(key);
				}
				else if (j < 9) {
					key.y = y;
					key.w = keyW;
					key.h = keyH*3/2;
					if (j == 5)
						key.kcolor = KEY_C_COLOR;
					else
						key.kcolor = KEY_WHITE_COLOR;
					key.graphics.f(key.kcolor).r(0, 0, key.w, key.h);
					y = y + keyH*3/2;
					keyContainer.addChild(key);				
				}
				else {
					key.y = y;
					key.w = keyW;
					key.h = keyH*2;
					key.kcolor = KEY_WHITE_COLOR;
					key.graphics.f(key.kcolor).r(0, 0, key.w, key.h);
					y = y + keyH*2;
					keyContainer.addChild(key);
				}
			}
		}

		key.on("mousedown", keyMouseDownHandler);
		key.on("pressup", keyPressUpHandler);
	}

	for (var i = 0; i < blackKeys.length; ++i) {
		keyContainer.addChild(blackKeys[i]);
	}

	for (var i = 0; i < keyNum; ++i) {
		var key = window.getKeyName(i);
		if (key.length == 2) {
			var color = "#888"
			if (key[0] == "C") {
				color = "#000"
			}
			var label = new createjs.Text(key, "10px Arial", color);
			label.x = keyW - 20;
			label.y = i * unitH + 14;
			keyContainer.addChild(label);
		}
	}
}

function initStaticContainer() {
	staticContainer = new createjs.Container();
	staticContainer.x = 0;
	staticContainer.y = 0;
	// disable ticker since we do not need animations
	staticContainer.tickEnabled = false;

	// brick
	var brick = new createjs.Shape();
	staticContainer.addChild(brick);
	brick.graphics.f(BRICK_COLOR).r(0, 0, keyW, scrollbarH+barH).r(w-scrollbarH, 0, scrollbarH, scrollbarH);

	// add vertical scrollbar container
	initScrollbarVertical();

	// add horizontal scrollbar container
	initScrollbarHorizontal();
}

function initScrollbarVertical() {
	// create vertical scrollbar container
	var scrollbarVertical = new createjs.Container();
	scrollbarVertical.name = "scrollbarVertical";
	scrollbarVertical.x = w - scrollbarH;
	scrollbarVertical.y = scrollbarH;
	// disable ticker
	scrollbarVertical.tickEnabled = false;
	// set bounds
	var rect = new createjs.Rectangle(0, 0, scrollbarH, h-scrollbarH);
	scrollbarVertical.setBounds(0, 0, scrollbarH, h-scrollbarH);

	// add vertical scrollbar background
	var vBg = new createjs.Shape();
	scrollbarVertical.addChild(vBg);
	vBg.graphics.f(SCROLLBAR_BG_COLOR).r(0, 0, rect.width, rect.height);

	// add vertical scrollbar button
	var vBtn = new createjs.Shape();
	vBtn.name = "button";
	scrollbarVertical.addChild(vBtn);

	var length = getVDispP()*rect.height;
	vBtn.maxY = rect.height - length;
	vBtn.graphics.f(SCROLLBAR_BTN_COLOR).r(0, 0, rect.width, length);

	vBtn.on("mousedown", scrollVMouseDownHandler);
	vBtn.on("pressmove", scrollVPressMoveHandler);

	staticContainer.addChild(scrollbarVertical);

	vBtn.y = 250;
	// scroll note container and key container
	scrollVContainer(noteContainer);
	scrollVContainer(keyContainer);
}

function initScrollbarHorizontal() {
	// create horizontal scrollbar container
	var scrollbarHorizontal = new createjs.Container();
	scrollbarHorizontal.name = "scrollbarHorizontal";
	scrollbarHorizontal.x = keyW;
	scrollbarHorizontal.y = 0;
	// disable ticker
	scrollbarHorizontal.tickEnabled = false;
	// set bounds
	var rect = new createjs.Rectangle(0, 0, w-scrollbarHorizontal.x-scrollbarH, scrollbarH);
	scrollbarHorizontal.setBounds(0, 0, w-scrollbarHorizontal.x-scrollbarH, scrollbarH);

	// add horizontal scrollbar background
	var hBg = new createjs.Shape();
	scrollbarHorizontal.addChild(hBg);
	hBg.graphics.f(SCROLLBAR_BG_COLOR).r(0, 0, rect.width, rect.height);

	// add horizontal scrollbar button
	var hBtn = new createjs.Shape();
	hBtn.name = "button";
	scrollbarHorizontal.addChild(hBtn);

	hBtn.on("mousedown", scrollHMouseDownHandler);
	hBtn.on("pressmove", scrollHPressMoveHandler);

	staticContainer.addChild(scrollbarHorizontal);
}

function extendGrid(x, y, length) {
	// extend bar
	var labelbg = barContainer.getChildAt(0);
	labelbg.graphics.f(BAR_COLOR).r(x-1, y, unitW*length+1, barH);
	var startNum = x / unitW / 16;
	var endNum = (x + unitW*length) / unitW / 16;

	for (var i = startNum; i < endNum; ++i) {
		var label = new createjs.Text(i+1, "bold 10px Arial", "#888");
		label.x = i*unitW*16;
		label.y = barH/2;
		barContainer.addChild(label);
	}
	if (barContainer.w < x + unitW+length)
		barContainer.w += unitW*length;

	// extend grid
	var grid = noteContainer.getChildAt(0);
	grid.graphics.f(GRID_COLOR).r(x, y, unitW*length, unitH*keyNum);
	grid.graphics.s("black");
	for (var i = 0; i < length; ++i) {
		if (i%16 == 0) {
			grid.graphics.ss(0.5).mt(x+i*unitW, y).lt(x+i*unitW, y+unitH*keyNum);
		} else if (i%4 == 0) {
			grid.graphics.ss(0.2).mt(x+i*unitW, y).lt(x+i*unitW, y+unitH*keyNum);
		} else {
			grid.graphics.ss(0.05).mt(x+i*unitW, y).lt(x+i*unitW, y+unitH*keyNum);
		}
	}
	for (var i = 0; i < keyNum; ++i) {
		grid.graphics.ss(0.05).mt(x, y+i*unitH).lt(x+unitW*length, y+i*unitH);
	}
	if (noteContainer.w < x + unitW*length)
		noteContainer.w += unitW*length;

	// resize srcollbar button
	var scrollbarHorizontal = staticContainer.getChildByName("scrollbarHorizontal");
	var rect = scrollbarHorizontal.getBounds();
	var button = scrollbarHorizontal.getChildByName("button");
	var length = getHDispP()*rect.width;
	button.maxX = rect.width - length;
	button.graphics.clear().f(SCROLLBAR_BTN_COLOR).r(0, 0, length, scrollbarH);
	button.x = -(noteContainer.x - noteContainer.originX) / noteContainer.w * rect.width;
}

/* mouse events */
/* bar container */
function barContainerMouseDownHandler(event) {
	// check whether mouse position is inside bound
	var mx = event.stageX - barContainer.originX;
	var my = event.stageY - barContainer.originY;
	var rect = barContainer.getBounds();
	var inside = mx > 0 && mx < rect.width && my > 0 && my < rect.height;

	if (inside) {
		moveBuoyTo(event.localX);
	}
}

function barContainerPressMoveHandler(event) {
	// check whether mouse position is inside bound
	var mx = event.stageX - barContainer.originX;
	var my = event.stageY - barContainer.originY;
	var rect = barContainer.getBounds();
	var inside = mx > 0 && mx < rect.width && my > 0 && my < rect.height;

	if (inside) {
		moveBuoyTo(event.localX);
	}
}

/* note container */
function noteContainerMouseDownHandler(event) {
	// check whether mouse position is inside bound
	var mx = event.stageX - noteContainer.originX;
	var my = event.stageY - noteContainer.originY;
	var rect = noteContainer.getBounds();
	var inside = mx > 0 && mx < rect.width && my > 0 && my < rect.height;

	if (event.target.name == "grid" && inside) {
		var head = Math.floor(event.localX / unitW);
		var key = Math.floor(event.localY / unitH);
		var note = addNoteOnContainer(key, head, 2);
		// extend grid when note is near the end of container
		if (noteContainer.w - note.x <= 16*unitW) {
			extendGrid(noteContainer.w, 0, cacheLength);
		}
		note.index = window.addNote(noteContainer.channel, note.key, note.head, note.head+note.units, note.iplayed);
		keyPressEffect(note.y/unitH);
	}

	var buoy = barContainer.getChildByName('buoyContainer');
	if (buoy.unitTime != null)
		playBuoy(buoy.unitTime);
}

function addNoteOnContainer(key, head, units) {
	var note = new createjs.Shape();
	note.name = "note";

	note.head = head;
	note.key = key;
	note.x = note.head*unitW;
	note.y = note.key*unitH;
	note.units = units;

	if (note.x >= barContainer.getChildByName('buoyContainer').x) note.iplayed = false;
	else note.iplayed = true;

	note.graphics.f(NOTE_COLOR).rr(0, 0, unitW*note.units-0.1, unitH-0.1, 4);

	note.on("mousedown", noteMouseDownHandler);
	note.on("pressup", notePressUpHandler);
	note.on("pressmove", notePressMoveHandler);
	note.on("rollover", noteRollOverHandler);
	note.on("dblclick", noteDblClickHandler);

	noteContainer.addChild(note);
	return note;
}

function noteContainerPressUpHandler(event) {
	keyUpEffect();
}

/* note */
function noteMouseDownHandler(event) {
	this.offsetX = event.localX;
	this.offsetY = event.localY;
	this.pressed = true;
	if (this.cursor == "move")
		keyPressEffect(Math.floor((event.stageY-noteContainer.y)/unitH));
}

function notePressUpHandler(event) {
	this.pressed = false;
	keyUpEffect();
}

function notePressMoveHandler(event) {
	var mx = event.stageX - noteContainer.x;
	var my = event.stageY - noteContainer.y;
	var px = mx - this.offsetX;
	var py = my - this.offsetY;
	if (this.cursor == "move") {
		var buoy = barContainer.getChildByName('buoyContainer');
		var x = Math.round(px / unitW)*unitW;
		var y = Math.round(py / unitH)*unitH;
		if (x < 0) { this.x = 0; }
		else { this.x = x; }
		if (y < 0) { y = 0; }
		if (this.y != y) {
			this.y = y;
			keyPressEffect(y/unitH);
		}
		this.head = this.x/unitW;
		this.key = this.y/unitH;
	}
	else if (this.cursor == "e-resize") {
		if (mx > this.x + unitW) {
			this.units = Math.round((mx - this.x) / unitW);
			var w = this.units*unitW;
			this.graphics.c().f(NOTE_COLOR).rr(0, 0, w-0.1, unitH-0.1, 4);
		}
	}
	var buoy = barContainer.getChildByName('buoyContainer');
	if (buoy.unitTime != null)
		playBuoy(buoy.unitTime);

	var played = true;
	if (this.x >= buoy.x) {
		played = false;
	}
	window.updateNote(noteContainer.channel, this.index, this.key, this.head, this.head+this.units, played);

	// if (noteContainer.getCacheDataURL() != null)
	// 	noteContainer.updateCache();
}

function noteRollOverHandler(event) {
	if (!this.pressed) {
		if (this.graphics.command.w - event.localX < 5) 
			this.cursor = "e-resize";
		else 
			this.cursor = "move";
	}
}

function noteDblClickHandler(event) {
	window.removeNote(noteContainer.channel, this.index);
	noteContainer.removeChild(this);
}

/* key */
function keyMouseDownHandler(event) {
	keyPressEffect(Number(this.name));
}

function keyPressUpHandler(event) {
	keyUpEffect();
}

/* scroll button */
function scrollVMouseDownHandler(event) {
	this.offsetX = event.localX;
	this.offsetY = event.localY;
}

function scrollVPressMoveHandler(event) {
	var my = event.stageY - scrollbarH;
	var py = my - this.offsetY;
	if (py <= 0)				// button reaches the top
		this.y = 0;
	else if (py >= this.maxY)	// button reaches the buttom
		this.y = this.maxY;
	else 						// button follows the mouse
		this.y = py;
	// scroll note container and key container
	scrollVContainer(noteContainer);
	scrollVContainer(keyContainer);
}

function scrollHMouseDownHandler(event) {
	this.offsetX = event.localX;
	this.offsetY = event.localY;
}

function scrollHPressMoveHandler(event) {
	var mx = event.stageX - keyW;
	var px = mx - this.offsetX;
	if (px <= 0)				// button reaches top
		this.x = 0;
	else if (px >= this.maxX)	// button reaches buttom
		this.x = this.maxX;
	else 						// button follows the mouse
		this.x = px;
	// scroll note container and bar container
	scrollHContainer(noteContainer);
	scrollHContainer(barContainer);
}

/* data */
function dataProcess(func) {
	for (var i = 0; i < window.channelList.length; ++i) {
		var noteList = window.channelList[i];
		if (noteList) {
			for (var j = 0; j < noteList.length; ++j) {
				if (noteList[j])
					func(noteList[j]);
			}
		}
	}
}

function tick(event) {
	fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";

	var buoy = barContainer.getChildByName('buoyContainer');
	if (buoy.unitTime != null) {
		dataProcess(function(note) {
			if (buoy.x >= note.head*unitW && note.played == false) {
				note.played = true;
				window.playNote(note);
			}
		})
	}

	stage.update(event);
}

/* utility function */
// return (float)(scroll height / total height)
function getVButtonP() {
	var scrollbarVertical = staticContainer.getChildByName("scrollbarVertical");
	var rect = scrollbarVertical.getBounds();
	var button = scrollbarVertical.getChildByName("button");
	var percent = button.y / rect.height;
	return percent;
}

// return (float)(scroll width / total width)
function getHButtonP() {
	var scrollbarHorizontal = staticContainer.getChildByName("scrollbarHorizontal");
	var rect = scrollbarHorizontal.getBounds();
	var button = scrollbarHorizontal.getChildByName("button");
	var percent = button.x / rect.width;
	return percent;
} 

// return (float)(display height / total height)
function getVDispP() {
	var rect = noteContainer.getBounds();
	var percent = rect.height / noteContainer.h;
	return percent;
}

// return (float)(display width / total width)
function getHDispP() {
	var rect = noteContainer.getBounds();
	var percent = rect.width / noteContainer.w;
	return percent;
}

// return the rect area which the container currently displays
function getDisplayCacheArea(container) {
	var rect = container.getBounds();
	var x = -container.x + container.originX;
	var y = -container.y + container.originY;
	var w = rect.width;
	var h = rect.height;
	return { x:x, y:y, w:w, h:h };
}

// scroll horizontal container display area and cache it
function scrollHContainer(container) {
	container.x = -getHButtonP()*container.w + container.originX;
}

// scroll vertical container display area and cache it
function scrollVContainer(container) {
	container.y = -getVButtonP()*container.h + container.originY;
}

// when key is pressed, the key should turn its color and show a mask
function keyPressEffect(id) {
	var mask = noteContainer.getChildByName("mask");
	// clean
	keyUpEffect();

	// draw key and mask
	var key = keyContainer.getChildByName(String(id));
	var w = key.w;
	var h = key.h;
	key.graphics.f(KEY_PRESS_COLOR).r(0, 0, w, h);
	var rect = getDisplayCacheArea(noteContainer);
	mask.x = rect.x;
	mask.y = id*unitH;
	mask.graphics.f(KEY_MASK_COLOR).r(0, 0, rect.w, unitH);

	// if (noteContainer.getCacheDataURL() != null) {
	// 	noteContainer.updateCache();
	// }
}

// when key press is released, the key should turn back to
// its original color and hide the mask
function keyUpEffect() {
	var mask = noteContainer.getChildByName("mask");
	// clean
	var previousId = mask.y / unitH;
	var key = keyContainer.getChildByName(String(previousId));
	var w = key.w;
	var h = key.h;
	key.graphics.f(key.kcolor).r(0, 0, w, h);
	mask.graphics.clear();

	// if (noteContainer.getCacheDataURL() != null) {
	// 	noteContainer.updateCache();
	// }
}

function moveBuoyTo(x) {
	var buoyContainer = barContainer.getChildByName("buoyContainer");
	buoyContainer.x = x;
	dataProcess(function(note) {
		if (note.head*unitW >= x) {
			note.played = false;
		} 
		else {
			note.played = true;
		}
	})
	if (buoyContainer.unitTime != null)
		playBuoy(buoyContainer.unitTime);
	else pauseBuoy();
}

// tween the buoy from start to end
animateBuoySE = function(start, end, unitTime) {
	if (end <= start) return;
	if (start < 0 || end > barContainer.w) return;

	var buoyContainer = barContainer.getChildByName("buoyContainer");
	if (buoyContainer.x < start || buoyContainer.x >= end) {
		moveBuoyTo(0);
	}
	buoyContainer.unitTime = unitTime;
	var light = buoyContainer.getChildByName("light");
	light.visible = true;
	
	var distance = end - buoyContainer.x;
	var time = distance / unitW * unitTime * 1000;

	createjs.Tween.get(buoyContainer, {override:true}).to({x:end}, time).call(function() {
		stopBuoy();
		dataProcess(function(note) {
			note.played = false;
		});
		playBuoy(unitTime);
	});
}

/* interface */
function initInterface() {
	// tween the buoy from beginning to nearest end
	window.playBuoy = function(unitTime) {
		var maxX = 16*unitW;
		dataProcess(function(note) {
			if (note.tail*unitW > maxX) {
				maxX = note.tail*unitW;
			}
		});
		var end = Math.ceil(maxX/(16*unitW))*16*unitW;
		animateBuoySE(0, end, unitTime);
	}

	// remove tween actions and hide buoy's light
	window.pauseBuoy = function() {
		var buoyContainer = barContainer.getChildByName("buoyContainer");
		buoyContainer.unitTime = null;
		var light = buoyContainer.getChildByName("light");
		light.visible = false;
		createjs.Tween.removeTweens(buoyContainer);
	}

	// pause buoy and move to the beginning
	window.stopBuoy = function() {
		pauseBuoy();
		moveBuoyTo(0);
	}

	// switch channel
	window.switchChannel = function(channel) {
		if (channel != noteContainer.channel) {
			// remove all notes
			var length = noteContainer.children.length;
			for (var i = 2; i < length; ++i) {
				noteContainer.removeChildAt(2);
			}
			noteContainer.channel = channel;

			var notes = window.channelList[channel-1];
			if (notes) {
				for (var i = 0; i < notes.length; ++i) {
					if (notes[i]) {
						var key = notes[i].key;
						var head = notes[i].head;
						var units = notes[i].tail - head;
						var note = addNoteOnContainer(key, head, units);
						note.index = i;
						if (noteContainer.w - note.x <= 16*unitW) {
							extendGrid(noteContainer.w, 0, cacheLength);
						}
					}
				}
			}

			scrollVContainer(noteContainer);
			scrollHContainer(noteContainer);
		}
	}
}