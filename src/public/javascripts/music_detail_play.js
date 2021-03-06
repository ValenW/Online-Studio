window.addEventListener("load", init, false);

//绘制音乐能量条需要用到的变量
var canvas;//绘制频谱的画布
var draw_width = 4;//柱状频谱的宽度
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
//var chunks=[];//存放每次绘制频谱的能量分布
var animation_id;
var max_tail = 0;
//歌曲时长int,ms
var time;
//进度条定时器
var timer;
//进度条值
var data_total;
//计时器运行次数
var timer_count = 0;
//var begin;

//audioContext
var context;
var bufferList;

var tempo = 110;
var unitTime  = 15 / tempo;

//判断是否停止播放
var isStop = false;
//存放sourceNode用于暂停播放
var source_array;
//var gNode;
//是否已经加载音源
var isLoad = false;
//var isMute = false;



/**
 * init the button of the music player
 */
function init() {
    initButtons();
}

/**
 * init the the external music resources
 * 
 */
function initMusicComponent(){
    loadSource();
    initNavigator();
    initAnimationFrame();
    initPrint();
    initMusicLength();
    initProgress();
}

/**
 * find out the max tail of the music node and compute the length of the music
 * use tail*unitTime * 1000 to compute the second of the music
 *
 */
function initMusicLength(){
    for (var x in window.music.spectrum.channels){
        for(var y in window.music.spectrum.channels[x]){
            if(window.music.spectrum.channels[x][y]!=null){
                if(max_tail < (window.music.spectrum.channels[x][y]).tail){
                    max_tail = (window.music.spectrum.channels[x][y]).tail;
                }
            }
        }
    }
    //console.log(max_tail);
    time = Math.ceil(max_tail * unitTime * 1000);
    //console.log(time);
    data_total = Math.ceil(time/100);
    var pro = createProgressElement(data_total-1);
    $('#middle').append(pro);
}

/**
 * the progress increment 1
 */
function progress_increment(){
    $('#myProgress').progress('increment');
}

/**
 * init the progress
 * reset the value and show the text
 *
 * @param <int> time record the length of the music（time/10）seconds
 */
function initProgress(time){
    timer_count = 0;
    $('#myProgress').progress('reset');
    $('#myProgress').progress({
    label: 'ratio',
    text: {
      ratio: '{value} : {total}'
    }
    });
}

/**
 * init the visualizition of the music
 * init the canvas, init the gradient color, init the target analyser which is used to
 *                  get the target data
 */
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

/**
 * get the correct animationframe component
 */
function initAnimationFrame(){
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame 
|| window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame 
|| window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
}

/**
 * get the navigator
 */
function initNavigator(){
    navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia ||
                          navigator.webkitGetUserMedia);
    if (navigator.getUserMedia) {
      console.log('getUserMedia supported.');
    }
}

/**
 * init the music player button
 * according to the logic of playing music, set the disabled attr to help user
 *              do the correct conduction
 */
function initButtons() {
    $("#pause").attr('disabled',true);
    $("#stop").attr('disabled',true);
    $("#volume_button").attr('disabled',true);
    $("#volume_bar").attr('disabled',true);
    //播放按钮，按下之后不能再次按
    $("#play").click(function() {
        if(!isLoad){
            initMusicComponent();
            isLoad = true;
            //$("#volume_button").removeAttr('disabled');
            return;
        }
        if(timer_count >= data_total){
            window.restartMusic();
        }else{
            window.playMusic();
        }
        window.listenIncrement();
        $("#play").attr('disabled',true);
        $("#pause").removeAttr('disabled');
        $("#stop").removeAttr('disabled');
        //$("#pause").disabled = 'disabled';
        //$("#stop").disabled = 'disabled';
    });
    //按下之后不能再按,初始不可用
    $("#pause").attr('disabled',true);
    $("#pause").click(function() {
        window.stopMusic();
        $("#pause").attr('disabled',true);
        $("#stop").attr('disabled',true);
        $("#play").removeAttr('disabled');
    });
    //重头播放，可以不停的按
    $("#stop").click(function() {
        //$('#myProgress').progress('reset');
        window.restartMusic();
        //console.log(context.state);
        //$("#stop").addClass("active");
        //$("#stop").attr('disabled',true);
        $("#pause").removeAttr('disabled');
        $("#play").attr('disabled',true);
        //$("#play").removeAttr('disabled');
    });
    //隐藏按钮
    $("#music-button-down").click(function(){
        setTimeout(function(){
            $('#music-button-down').css('display',"none");
            $('#music-button-up').css('display',"block");
        },600);
        $("#music-button-down").attr('disabled',true);
        $('#music-button-up').removeAttr('disabled');
        $('.music-player').css('bottom',"-150px");
        $('#music-button-down').css('bottom',"0px");
        $('#music-button-up').css('bottom',"0px");
    });
    //显示按钮
    $("#music-button-up").click(function(){
        setTimeout(function(){
            $('#music-button-up').css('display',"none");
            $('#music-button-down').css('display',"block");
        },600);
        $("#music-button-up").attr('disabled',true);
        $('#music-button-down').removeAttr('disabled');
        $('.music-player').css('bottom',"0px");
        $('#music-button-down').css('bottom',"150px");
        $('#music-button-up').css('bottom',"150px");
    });
    // $("#volume_button").click(function(){
    //     if(isMute){
    //         gNode[0].gain.value = 1;
    //         isMute = false;
    //     }else{
    //         gNode[0].gain.value = 0;
    //         isMute = true;
    //     }
    //     console.log(gNode[0]);
    // });
}

/**
 * audiocontext bufferLoader
 */
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

/**
 * load the music source
 */
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
        audioPath = "resources/sounds/piano2/GermanConcertD_"+index+"_083.mp3";
        urlList.push(audioPath);
    }

    bufferLoader = new BufferLoader(context, urlList, finishedLoading);

    bufferLoader.load();
}

/**
 * the callback function of loadsource
 */
function finishedLoading(buffer) {
    bufferList = buffer;
    $('#progress-modal').modal('hide');
}

/**
 * playSound
 * use the web audio to create the list
 *
 * @param <List> buffer music source
 * @param <int> head the node head
 * @param <int> tail the node tail
 */
function playSound(buffer, head, tail) {
    var startTime = context.currentTime + head * unitTime;
    var endTime = context.currentTime + tail * unitTime;
    //context = 
    //console.log(context.state);
    //analyser = context.createAnalyser();
    var source = context.createBufferSource();
    var gainNode = context.createGain ? context.createGain() : context.createGainNode();
    source.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(context.destination)
    analyser.fftSize = 2048;
    source_array.push(source);
    source.buffer = buffer;
    gainNode.gain.linearRampToValueAtTime(1, endTime - 1);
    gainNode.gain.linearRampToValueAtTime(0, endTime);
    gNode.push(gainNode);

    if (!source.start)
        source.start = source.noteOn;
    source.start(startTime);
    source.stop(endTime);
}

/**
 * playNote
 * use the playSound interface
 *
 * @param <Element> note the music struct
 */
window.playNote = function(note) {
    //console.log(bufferList);
    if (note)
        playSound(bufferList[note.key], note.head, note.tail + 2);
}

/**
 * playMusic
 * play every node
 */
window.playMusic = function(){
    if(isStop){
        context.resume();
        isStop = false;
        return;
    }
    //console.log(window.music);
    source_array = [];
    gNode = [];
    for (var x in window.music.spectrum.channels){
        //console.log(window.music.spectrum.channels[x]);
        for(var y in window.music.spectrum.channels[x]){
            if(window.music.spectrum.channels[x][y]!=null){
                //console.log(window.music.spectrum.channels[x][y]);
                window.playNote(window.music.spectrum.channels[x][y]);
                if(max_tail < (window.music.spectrum.channels[x][y]).tail){
                    max_tail = (window.music.spectrum.channels[x][y]).tail;
                }
            }
        }
    }
    //console.log(max_tail);
    time = Math.ceil(max_tail * unitTime * 1000);
    //console.log(time);
    data_total = Math.ceil(time/100);
    initProgress(data_total);
    progress_run();
}

/**
 * stopMusic
 */
window.stopMusic = function(){
    if(!isStop){
        context.suspend();
        isStop = true;
        return;
    }
}

/**
 * restartMusic
 */
window.restartMusic = function(){
    clearTimeout(timer);
    for (var i = 0; i < source_array.length; i++){
        source_array[i].stop();
    }
    if(isStop){
        context.resume();
        isStop = false;
    }
    //isStop = false;
    timer_count = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //clearArray();
    window.playMusic();
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


function clearArray(){
    for(var i = 0; i < draw_num; i++){
        array[i*step] = 255;
    }
}

/**
 * visualization
 * draw the music power bar into the canvas
 *
 */
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

/**
 * setTimeout to run the progress
 * every second use 10 times,1000ms/10=100ms
 */
function progress_run(){
    //console.log(isStop);
    if(isStop){
        timer = setTimeout('progress_run()',100);
        return;
    }
    timer_count++;
    //console.log(timer_count);
    if(timer_count >= data_total){
        //timer_count = 0;
        //var now = (new Date()).getTime();
        //clearArray();
        //console.log("clear");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //console.log(((now - begin)/1000).toFixed(3));
        $("#pause").attr('disabled',true);
        $("#play").removeAttr('disabled');
        return;
    }
    progress_increment();
    timer = setTimeout('progress_run()',100);
}

/**
 * create the progress dom
 * create the progress bar with specify time
 *
 * @param <int> time the length of the music(time/10 second)
 */
function createProgressElement(time){
    var progress = document.createElement('div');
    progress.className = "ui indicating small progress myProgress";
    progress.id = "myProgress";
    progress.setAttribute("data-value", 0);
    progress.setAttribute("data-total",time);
    var div = document.createElement('div');
    div.className  = "bar";
    var div2 = document.createElement('div');
    div2.className = "progress";
    progress.appendChild(div);
    div.appendChild(div2);
    return progress;
}