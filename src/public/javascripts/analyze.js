//使用web audio api
window.onload = init;
var context;
var bufferLoader;
var canvas;//绘制频谱的画布
var draw_width = 10;//柱状频谱的宽度
var gap = 2;//柱状频谱的间距
var draw_num;//绘制的柱状频谱数量
var step;//绘制频谱的采样步长
window.analyser;//绘制频谱需要经过的分析器
var array;//存放频谱的数组
var head_array;//柱状频谱帽头数组
var head_height = 2;//帽头高度
var head_style;//帽头样式
var ctx;//画布的2D绘图环境对象
var gradient;//定义一个渐变样式用于绘制频谱条


navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia ||
                          navigator.webkitGetUserMedia);

if (navigator.getUserMedia) {
  console.log('getUserMedia supported.');
}

//程序主体
//音频在连接destination以前经过analyser
//就可以获取音乐的频谱
//通过requestAnimationFrame来不断更新画布，实现音乐频谱
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame 
|| window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function init() {
	// Fix up prefixing
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();

	//初始化canvas
	canvas = document.getElementById('canvas');
	draw_num = canvas.width/(draw_width+gap);
	head_array = new Array();
	ctx = canvas.getContext('2d');//获取画布的2D绘图环境对象
	gradient = ctx.createLinearGradient(0,0,0,canvas.height);
	//gradient.addColorStop(1,'#a75c06');
	//gradient.addColorStop(0.75,'#5ba706');
	gradient.addColorStop(0,'#ff0033');
	gradient.addColorStop(0.33,'#fc0073');
	gradient.addColorStop(0.66,'#fc079b');
	gradient.addColorStop(1,'#9107fc');
	head_style = gradient;
	analyser = context.createAnalyser();
	array = new Uint8Array(analyser.frequencyBinCount);
	step = Math.round(array.length/draw_num);


	//读入音频数据
	bufferLoader = new BufferLoader(
	context,
	[
	  'resources/audio/01-A.mp3',
	  'resources/audio/Aimer - Broken Night.mp3',
	],
	finishedLoading
	);

	bufferLoader.load();
}

//绘制函数
function draw(){
  analyser.getByteFrequencyData(array);
  //console.log(array);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(var i = 0; i < draw_num; i++){
  	var value = array[i*step];
  	//第一次初始化柱状频谱帽头
  	if(head_array.length < Math.round(draw_num)){
  		head_array.push(value);
  	}
  	//绘制帽头
  	ctx.fillStyle = head_style;
  	if(value < head_array[i]){
  		//如果小于之前的值则使用前一次保存的值来绘制帽头
  		//head_array[i]会逐渐减少
  		ctx.fillRect(i*(draw_width+gap),canvas.height-(--head_array[i]),draw_width,head_height);
  	}else{
  		//否则更换值
  		head_array[i] = value;
  		ctx.fillRect(i*(draw_width+gap),canvas.height-head_array[i],draw_width,head_height);

  	}
  	//绘制频谱条
  	ctx.fillStyle = gradient;
  	ctx.fillRect(i*(draw_width+gap),canvas.height-value,draw_width,canvas.height);
  }
  window.requestAnimationFrame(draw);
}




var chunks=[];

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
  var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];
  var analyser1 = context.createAnalyser();
  var analyser2 = context.createAnalyser();
  source1.connect(analyser1);
  source2.connect(analyser2);
  //analyser1.connect(source2);
  analyser2.fftSize = 2048;
  var mediaStream = context.createMediaStreamDestination();
  analyser2.connect(mediaStream);
  analyser2.connect(context.destination);

  source2.onended = function(e){
    console.log("onended");
    mediaRecorder.stop();
    mediaRecorder.requestData();
  }

  var mediaRecorder = new MediaRecorder(mediaStream.stream);
    mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);

        //var blob = new Blob(chunks, { 'type' : 'audio/mp3; codecs=opus' });
         //window.location.href = URL.createObjectURL(blob);
        //console.log(chunks);
        console.log("ondataavailable");
  }

  mediaRecorder.onstop = function(evt) {
         // Make blob out of our blobs, and open it.
         var blob = new Blob(chunks, { 'type' : 'audio/mp3; codecs=opus' });
         //window.location.href = URL.createObjectURL(blob);
         var aud = document.getElementById('audio');
         var audioURL = window.URL.createObjectURL(blob);
         aud.src = audioURL;
         var down = document.getElementById('download');
         down.href = audioURL;
         console.log(blob);
  };

  mediaRecorder.start();
  source2.start(0);
  source2.stop(40);
  // chunks.push(source2.buffer);
  // var blob = new Blob(chunks, { 'type' : 'audio/mp3; codecs=opus' });
  // //window.location.href = URL.createObjectURL(blob);
  // var aud = document.getElementById('audio');
  // var audioURL = window.URL.createObjectURL(blob);
  // aud.src = audioURL;
  analyser = analyser2;


  //console.log(mediaStream.stream);
  //mediaRecorder.stop();
  //var blob = new Blob(mediaStream.stream, { 'type' : 'audio/ogg; codecs=opus' });
  window.requestAnimationFrame(draw);
}


function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

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


