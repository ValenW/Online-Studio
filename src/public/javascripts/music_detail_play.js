window.addEventListener("load", init, false);

//绘制音乐能量条需要用到的变量
var canvas;//绘制频谱的画布
var draw_width = 4;//柱状频谱的宽度
var gap = 1;//柱状频谱的间距
var draw_num;//绘制的柱状频谱数量
var step;//绘制频谱的采样步长
window.analyser;//绘制频谱需要经过的分析器
var array;//存放频谱的数组
var head_array;//柱状频谱帽头数组
var head_height = 2;//帽头高度
var head_style;//帽头样式
var ctx;//画布的2D绘图环境对象
var gradient;//定义一个渐变样式用于绘制频谱条
//var chunks=[];//存放每次绘制频谱的能量分布
var animation_id;

var context;
var bufferList;

var tempo = 110;
var unitTime  = 15 / tempo;

function init() {
    loadSource();
    initButtons();
    initNavigator();
    initAnimationFrame();
    initPrint();
    initProgress();
}

function test(){
    progress_increment();
    animation_id = window.requestAnimationFrame(test);
}

function progress_increment(){
    $('#myProgress').progress('increment');
}

function initProgress(){
    $('#myProgress').progress({total: 1000});
    $('#myProgress').progress({percent: 0});
}

function initPrint(){
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
    window.requestAnimationFrame(draw);
}

function initAnimationFrame(){
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame 
|| window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame 
|| window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
}

function initNavigator(){
    navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia ||
                          navigator.webkitGetUserMedia);
    if (navigator.getUserMedia) {
      console.log('getUserMedia supported.');
    }
}

function initButtons() {
    //播放按钮，按下之后不能再次按
    $("#play").click(function() {
        window.playMusic();
        window.listenIncrement();
        $("#play").addClass("active");
        $("#pause").removeClass("active");
        $("#stop").removeClass("active");
        $("#play").attr('disabled',true);
        $("#pause").removeAttr('disabled');
        //$("#stop").removeAttr('disabled');
        //$("#pause").disabled = 'disabled';
        //$("#stop").disabled = 'disabled';
    });
    //按下之后不能再按
    $("#pause").click(function() {
        test();
        $("#play").removeClass("active");
        $("#pause").addClass("active");
        $("#stop").removeClass("active");
        $("#pause").attr('disabled',true);
        $("#play").removeAttr('disabled');
        //$("#stop").removeAttr('disabled');
    });
    //重头播放，可以不停的按
    $("#stop").click(function() {
        window.stopMusic();
        $("#play").removeClass("active");
        $("#pause").removeClass("active");
        //$("#stop").addClass("active");
        //$("#stop").attr('disabled',true);
        $("#pause").removeAttr('disabled');
        $("#play").removeAttr('disabled');
    });
    $('#channel').dropdown({
        onChange: function(val) {
            $('.channel-indicate').text(val);
            window.switchChannel(val);
        }
    });
    $('#save').click(function() {
        window.save();
    });
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

function loadSource() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    $('#progress-modal')
        .modal({closable: false, blurring: true})
        .modal('show');

    urlList = new Array();
    for (var i = 108; i >= 21; --i) {
        // urlList.push("sounds/piano1/"+getKeyName(i)+".mp3");
        index = "";
        if (i < 100) {
            index = "0" + i.toString();
        } else {
            index = i.toString();
        }
        audioPath = "resources/sounds/piano2/GermanConcertD_"+index+"_083.wav";
        urlList.push(audioPath);
    }

    bufferLoader = new BufferLoader(context, urlList, finishedLoading);

    bufferLoader.load();
}

function finishedLoading(buffer) {
    bufferList = buffer;
    $('#progress-modal').modal('hide');
}

function playSound(buffer, head, tail) {
    var startTime = context.currentTime + head * unitTime;
    var endTime = context.currentTime + tail * unitTime;

    var source = context.createBufferSource();
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    source.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(context.destination)
    //analyser.fftSize = 2048;

    source.buffer = buffer;
    gainNode.gain.linearRampToValueAtTime(1, endTime - 1);
    gainNode.gain.linearRampToValueAtTime(0, endTime);

    if (!source.start)
        source.start = source.noteOn;
    source.start(startTime);
    source.stop(endTime);
}

window.playNote = function(note) {
    //console.log(bufferList);
    if (note)
        playSound(bufferList[note.key], 0, note.tail - note.head + 1);
}

window.playMusic = function(){
    //console.log(window.music);
    for (var x in window.music.spectrum.channels){
        //console.log(window.music.spectrum.channels[x]);
        for(var y in window.music.spectrum.channels[x]){
            //console.log(window.music.spectrum.channels[x][y]);
            window.playNote(window.music.spectrum.channels[x][y]);
        }
    }
    initProgress();
    // animation_id = window.requestAnimationFrame(draw);
    // console.log("play music");
    // console.log(animation_id);
}

window.stopMusic = function(){
    // console.log("stop music");
    // console.log(animation_id);
    // if(animation_id == null){
    //     return;
    // }else{
    //     window.cancelAnimationFrame(animation_id);
    //     animation_id = null;
    // }
    window.cancelAnimationFrame(animation_id);
}

window.setTempo = function(_tempo) {
    if (_tempo > 0) {
        tempo = _tempo;
        unitTime  = 15 / tempo;
        window.spectrum.tempo = _tempo;
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

//绘制函数
function draw(){
  analyser.getByteFrequencyData(array);
  //console.log(array);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(var i = 0; i < draw_num; i++){
    var value = array[i*step];
    //防止value(0-255)超过canvas.height
    value = value/255;
    value = value*120;
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