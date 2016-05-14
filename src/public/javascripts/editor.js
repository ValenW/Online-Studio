window.addEventListener("load", init, false);

var stage, w, h;
var keyContainer, noteContainer, barContainer, staticContainer;

var unitW = 20, unitH = 20;
var keyW = 80, keyH = 20;
var keyNum = 88, cacheLength = 160;

var GRID_COLOR = "#75726A";
var NOTE_COLOR = "#6FFF6E";
var KEY_PRESS_COLOR = "#FFA449";

function init() {
	initCanvas();
	initButtons();
}

function initCanvas() {
	stage = new createjs.Stage("canvas");

	// grab canvas width and height for later calculations:
	w = stage.canvas.width;
	h = stage.canvas.height;

	// noteContainer stays on the right displaying notes
	initNoteContainer();
	stage.addChild(noteContainer);

	// keyContainer stays on the left displaying keyboards
	initKeyContainer();
	stage.addChild(keyContainer);	

	// barContainer stays on the top displaying tools
	initBarContainer();
	stage.addChild(barContainer);

	// staticContainer never moves displaying static object
	initStaticContainer();
	stage.addChild(staticContainer);

	// add a text object to output the current FPS:
	fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#888");
	stage.addChild(fpsLabel);
	fpsLabel.x = 10;
	fpsLabel.y = 20;

	// enabled mouse over / out events
	stage.enableMouseOver();

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
}

function initStaticContainer() {
	staticContainer = new createjs.Container();
	staticContainer.x = staticContainer.offsetX = 0;
	staticContainer.y = staticContainer.offsetY = 0;

	var leftTop = new createjs.Shape();
	leftTop.graphics.f("#302F2C").r(0,0,keyW,40);

	staticContainer.addChild(leftTop);
}

function initBarContainer() {
	barContainer = new createjs.Container();
	barContainer.x = barContainer.offsetX = keyW;
	barContainer.y = barContainer.offsetY = 0;
	barContainer.w = 0;

	var labelbg = new createjs.Shape();
	barContainer.addChild(labelbg);

	extendGrid(0, 0, cacheLength);
}

function initKeyContainer() {
	keyContainer = new createjs.Container();
	keyContainer.x = keyContainer.offsetX = 0;
	keyContainer.y = keyContainer.offsetY = 40-keyH/2;

	var keyClassifier = [2,4,6,9,11,0,1,7,8,3,5,10];
	var blackKeys = new Array();
	var y = 0;

	for (var i = 0; i < keyNum; i++) {
		var key = new createjs.Shape();

		for (var j = 0; j < 12; ++j) {
			if (i%12 == keyClassifier[j]) {
				if (j < 5) {
					key.y = y-keyH/2;
					key.graphics.f("#000000").r(0, 0, keyW*2/3, keyH);
					blackKeys.push(key);
				}
				else if (j < 9) {
					key.y = y;
					key.graphics.s("#8DABA9").f("#FFFFFF").r(0, 0, keyW, keyH*3/2);
					y = y + keyH*3/2;
					keyContainer.addChild(key);				
				}
				else {
					key.y = y;
					key.graphics.s("#8DABA9").f("#FFFFFF").r(0, 0, keyW, keyH*2);
					y = y + keyH*2;
					keyContainer.addChild(key);
				}
			}
		}

		key.on("mousedown", keyMouseDownHandler);
		key.on("pressup", keyPressUpHandler);
	}

	for (var i = 0; i < blackKeys.length; i++) {
		keyContainer.addChild(blackKeys[i]);
	}

	keyContainer.cache(0, 0, keyW, keyH*keyNum);
}

function initNoteContainer() {
	noteContainer = new createjs.Container();
	noteContainer.x = noteContainer.offsetX = keyW;
	noteContainer.y = noteContainer.offsetY = 40;
	noteContainer.w = 0;

	var grid = new createjs.Shape();
	grid.name = "grid";
	noteContainer.addChild(grid);

	noteContainer.on("mousedown", noteContainerMouseDownHandler);
}

function extendGrid(x, y, length) {
	// extend bar
	var labelbg = barContainer.getChildAt(0);
	labelbg.graphics.f("#45433E").r(x, y, unitW*length, 40);
	var startNum = x / unitW / 16;
	var endNum = (x + unitW*length) / unitW / 16;

	for (var i = startNum; i < endNum; ++i) {
		var label = new createjs.Text(i+1, "bold 10px Arial", "#888");
		label.x = i*unitW*16;
		label.y = 20;
		barContainer.addChild(label);
	}
	barContainer.w += unitW*length;
	barContainer.cache(0, 0, barContainer.w, 40, 1);

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
	noteContainer.w += unitW*length;
}

function noteContainerMouseDownHandler(event) {
	if (event.target.name == "grid") {
		var note = new createjs.Shape();
		note.name = "note";

		note.x = Math.floor(event.localX / unitW)*unitW;
		note.y = Math.floor(event.localY / unitH)*unitH;

		note.graphics.f(NOTE_COLOR).rr(0, 0, unitW*2-0.1, unitH-0.1, 4);

		note.on("mousedown", noteMouseDownHandler);
		note.on("pressup", notePressUpHandler);
		note.on("pressmove", notePressMoveHandler);
		note.on("rollover", noteRollOverHandler);

		noteContainer.addChild(note);
	}
}

function noteMouseDownHandler(event) {
	this.offsetX = event.localX;
	this.offsetY = event.localY;
	this.pressed = true;
}

function notePressUpHandler(event) {
	this.pressed = false;
}

function notePressMoveHandler(event) {
	var mx = event.stageX - noteContainer.x;
	var my = event.stageY - noteContainer.y;
	var px = mx - this.offsetX;
	var py = my - this.offsetY;
	if (this.cursor == "move") {
		this.x = Math.round(px / unitW)*unitW;
		this.y = Math.round(py / unitH)*unitH;
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
	} else if (this.cursor == "e-resize") {
		if (mx > this.x + unitW) {
			var w = Math.round((mx - this.x) / unitW)*unitW;
			this.graphics.c().f(NOTE_COLOR).rr(0, 0, w-0.1, unitH-0.1, 4);
		}
	}
}

function noteRollOverHandler(event) {
	if (!this.pressed) {
		if (this.graphics.command.w - event.localX < 5) 
			this.cursor = "e-resize";
		else 
			this.cursor = "move";
	}
}

function keyMouseDownHandler(event) {
	var w = this.graphics.command.w;
	var h = this.graphics.command.h;

	this.graphics.f(KEY_PRESS_COLOR).r(0,0,w,h);
	keyContainer.updateCache();
}

function keyPressUpHandler(event) {
	var w = this.graphics.command.w;
	var h = this.graphics.command.h;

	if (h == keyH)
		this.graphics.f("black").r(0,0,w,h);
	else
		this.graphics.f("white").r(0,0,w,h);

	keyContainer.updateCache();
}

function tick(event) {
	fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
	stage.update(event);
}

/* button */
function initButtons() {
	$(".left").click(function() {
		if (noteContainer.x - noteContainer.offsetX - keyW + 500 <= 0) {
			createjs.Tween.get(noteContainer).to({x:noteContainer.x+500}, 500);
			createjs.Tween.get(barContainer).to({x:barContainer.x+500}, 500);
		}
		else {
			createjs.Tween.get(noteContainer).to({x:noteContainer.offsetX}, 500);
			createjs.Tween.get(barContainer).to({x:barContainer.offsetX}, 500);
		}
	});
	$(".right").click(function() {
		if (noteContainer.x - 500 - w <= -noteContainer.w) {
			extendGrid(noteContainer.w, 0, cacheLength);
		}
		createjs.Tween.get(noteContainer).to({x:noteContainer.x-500}, 500);
		createjs.Tween.get(barContainer).to({x:barContainer.x-500}, 500);
	});
	$(".up").click(function() {
		if (noteContainer.y - noteContainer.offsetY + 300 <= 0) {
			createjs.Tween.get(noteContainer).to({y:noteContainer.y+300}, 500);
			createjs.Tween.get(keyContainer).to({y:keyContainer.y+300}, 500);
		}
		else {
			createjs.Tween.get(noteContainer).to({y:noteContainer.offsetY}, 500);
			createjs.Tween.get(keyContainer).to({y:keyContainer.offsetY}, 500);
		}
	})
	$(".down").click(function() {
		if (noteContainer.y - noteContainer.offsetY - 300 - h + unitH*keyNum >= 0) {
			createjs.Tween.get(noteContainer).to({y:noteContainer.y-300}, 500);
			createjs.Tween.get(keyContainer).to({y:keyContainer.y-300}, 500);
		}
		else {
			createjs.Tween.get(noteContainer).to({y:h-unitH*keyNum+noteContainer.offsetY}, 500);
			createjs.Tween.get(keyContainer).to({y:h-unitH*keyNum+keyContainer.offsetY}, 500);
		}
	})
}
