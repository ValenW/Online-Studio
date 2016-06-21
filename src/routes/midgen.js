var fs = require('fs');

function insertZeros(num) {
	var rt = "";
	while (num-- > 0) rt+=String.fromCharCode(0);
	return rt;
}

function insertInt(num, room) {
	var rt = "";
	while (num > 0) {
		rt = String.fromCharCode(num%256)+rt;
		num = Math.floor(num/256);
	}
	rt = insertZeros(room-rt.length)+rt;
	return rt;
}


function init_header(Config) {
	var rt = "MThd";
	rt += insertInt(Config.road_length, 4);
	rt += insertInt(1, 2);
	rt += insertInt(Config.road_num, 2);
	rt += insertInt(Config.ticknum, 2);
	return rt;
}


function init_road(Config) {
	var rt = "";
	rt += "MTrk";
	rt += insertInt(Config.road_length+15, 4);
	rt += create_event(0, set_beat(0x4, 0x4));
	rt += create_event(0, set_speed(0x07A120));
	return rt;
}


function end_road(time) {
	var rt = "";
	rt += create_event(time, insertInt(0xff2f, 2));
	rt += insertZeros(1);
	return rt;
}

function create_event(time, eve) {
	var rt = "";
	rt += insertInt(time, 1);
	rt += eve;
	return rt;
}

function create_music(arr, road_num, len, Config) {
	var rt = "";
	var time = 0;
	for (var c = 0; c < len; c++) {
		time += Math.floor(Config.ticknum/4);
		for (key in arr) {
			if (typeof(arr[key][c]) == 'undefined') continue;
			if (arr[key][c] == 0) rt += create_event(time, close_note(road_num, key));
			else rt+=create_event(time, create_note(road_num, key, arr[key][c]));
			time = 0;
		}
	}
	return rt;
}


/*###########EVENT###################*/

function change_instru(road, instru) {
	var rt = String.fromCharCode(0xC0+road);
	rt += String.fromCharCode(instru);
	return rt;
}

function create_note(road, note, strength) {
	var rt = "";
	rt += String.fromCharCode(0x90+road);
	rt += String.fromCharCode(note);
	rt += String.fromCharCode(strength);
	return rt;
}

function close_note(road, note) {
	var rt = "";
	rt += String.fromCharCode(0x80+road);
	rt += String.fromCharCode(note);
	rt += String.fromCharCode(0);
	return rt;
}

function set_beat(fenzi, fenmu) {
	var rt = "";
	rt += insertInt(0xff5804, 3);
	rt += String.fromCharCode(fenzi);
	rt += String.fromCharCode(Math.floor(Math.log(fenmu)/Math.log(2)));
	rt += insertZeros(2);
	return rt;
}

function set_speed(speed) {
	var rt = "";
	var spd = insertInt(speed, 1);
	rt += insertInt(0xff51)+String.fromCharCode(spd.length);
	rt += spd;
	return rt;
}

/*##############################*/
function printBytes(str) {
	var bytes = [];

	for (var i = 0; i < str.length; ++i) {
	    bytes.push(str.charCodeAt(i).toString(16));
	}

	alert(bytes);
}


function writeMidIE(str)
{
   var fso, tf;
   fso = new ActiveXObject("Scripting.FileSystemObject");//获取对象
   tf = fso.CreateTextFile("./test.mid", true);//创建一个文件
   var bytes = [];
	for (var i = 0; i < str.length; ++i) {
	    bytes.push(str.charCodeAt(i).toString(16));
	}
   tf.Write (bytes);
   tf.Close();//关闭
}

 function clickDownload(str)  
{  
	var link = document.createElement('a');
	link.download = "test.mid";
	str =  encodeURIComponent(str);  
	link.href = "data:text/csv;charset=utf-8,"+str;  
	link.click(); 
}


var stopped=false;

exports.exec = function () {
	var head_config = {
    	road_length : 6, road_num : 1, ticknum : 50
	};

	var midi = init_header(head_config);

	var p = 0x55;
	var road = 0;
	var len = 7;
	var arr = {
		60:[],
		62:[ , , , ,p,p,0],
		64:[ ,p,p,0, , , ],
		65:[ , , ,p,0, , ],
		67:[p,0, , , , , ]
	};

    var tmp = create_music(arr, road, len, head_config);
    tmp += end_road(5);
    var road_config_1 = {
  		road_length : tmp.length
    };
	midi+=init_road(road_config_1);
	midi+=tmp;
	
    fs.writeFile('test.mid', midi, {flag :'w+', encoding:'binary'}, function(err) {
		if (err) throw err;
		console.log('Saved!');
	});

	return midi;
};

/*document.getElementById("midistart").addEventListener("click", function() {
    var midistartB=document.getElementById("midistartB");
    switch(midistartB.className) {
      case "glyphicon glyphicon-play":
        smfPlayer.setStartTime();
        if(stopped==true) {
            smfPlayer.changeFinished(false);
        }
        stopped=false;
        midistartB.className="glyphicon glyphicon-pause";
        var Idx=document.getElementById("midiFileList").value;
        smfPlayer.init(parsedMidi[Idx].data, latency, parsedMidi[Idx].eventNo);
        smfPlayer.startPlay();
        break;
      case "glyphicon glyphicon-pause":
        var Idx=document.getElementById("midiFileList").value;
        parsedMidi[Idx].eventNo=smfPlayer.eventNo;
        midistartB.className="glyphicon glyphicon-play";
        smfPlayer.stopPlay();
        stopped=true;
        break;
    }
});*/