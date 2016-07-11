//记录是否听过
var isListened = false;
var isCollected = false;
var comment_data;


//处理未登录
window.isLogin = function(){
    //未登陆
    if(user == undefined || user == null){
        return;
    }
}

window.onload = function(){
    //console.log("start");
    comment_data = music.comments;
    var p = Math.ceil(comment_data.length/10);
    //console.log(p);
    window.updatePage(p);
}

//submit按钮事件
$(function(){
    $('#submit_button').click(function(){
         console.log(window.music.comments);
         console.log(music._id)
         var t = $("#content").val();
         console.log(t);
         $.ajax({
             type: "post",
             url: "/music/insertComment",
             data: {music_id:music._id, comment_string:$("#content").val()},
             dataType: "json",
             success: function(data){
                         $('#content').val("");
                         console.log(data.comment_list);
                         comment_data = data.comment_list;
                         window.updateCommentN(data.comment_list.length);
                         window.updateComment(data.comment_list,1);
                         var p = Math.ceil(comment_data.length/10);
                         window.updatePage(p);
                      },
             error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log("comment error");
                console.log(XMLHttpRequest.status);
                console.log(textStatus);
             }
         });
    });
});



//收藏按钮事件
$(function(){
    $('#collect').click(function(){
         console.log(music._id)
         //var t = $("#content").val();
         //console.log(t);
         $.ajax({
             type: "get",
             url: "/music/saveMusicToRepo?music_id="+window.music._id,
             data: {},
             dataType: "json",
             success: function(data){
                         //$('#content').html("");
                         console.log(data);
                         window.updateCollectN(data);
                      },
             error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log("comment error");
                console.log(XMLHttpRequest.status);
                console.log(textStatus);
             }
         });
    });
});

//更新页面的收藏
window.updateCollectN = function(data){
    //isListened = true;
    var str;
    if(data.is_collect){
        str = "已收藏";
    }else{
        str = "收藏";
    }
    $('#collect_message').html(str);
    $("#collectN").html(data.collectN);
}


//更新页面的试听次数
window.updateListenN = function(num){
    isListened = true;
    $("#listenN").html(num);
}

//更新评论数字
window.updateCommentN = function(num){
    $("#commentN").html(num);
    $("#commentN2").html(num+"评论");
}

//更新下方评论
window.updateComment = function(data,page_num){
    now_page = page_num;
    //页数
    //var p = data.length/10 + 1;
    $("#comment_all").html("");
    for(var i = 0; i <= 9; i++){
        if(data.length-((page_num-1)*10+i)-1 < 0){return;}
        //console.log(data);
        //console.log(data.length-((page_num-1)*10+i)-1);
        //console.log(data[data.length-((page_num-1)*10+i)-1]);
        window.createComment(data[data.length-((page_num-1)*10+i)-1],data.length-((page_num-1)*10+i));
        $("#comment_all").append(comment);
        $("#comment_all").append(divideLine);
    }
    
}

//创建一条评论
var comment;
window.createComment = function(data,num){
    comment = document.createElement('div');
    comment.className = "comment";
    var comment_head = document.createElement('div');
    comment_head.className = "comment_head";
    var img = document.createElement('img');
    img.className = "ui circular image pos";
    img.src = "/uploads/heads/"+data.comment_userId.profile;
    comment_head.appendChild(img);
    comment.appendChild(comment_head);
    var all_content = document.createElement('div');
    all_content.className = "all_content";
    var name = document.createElement('div');
    name.className = "name";
    var p_user = document.createElement('p');
    p_user.className = "description";
    p_user.innerHTML = data.comment_userId.username;
    name.appendChild(p_user);
    all_content.appendChild(name);
    var content = document.createElement('div');
    content.className = "content";
    var p_content = document.createElement('p');
    p_content.className = "description";
    p_content.innerHTML = data.comment_content;
    content.appendChild(p_content);
    all_content.appendChild(content);
    var message = document.createElement('div');
    message.className = "message";
    var span_high = document.createElement('span');
    span_high.className = "qua";
    span_high.innerHTML = "#"+num;
    var span_date = document.createElement('span');
    span_date.className = "qua";
    span_date.innerHTML = data.comment_date;
    message.appendChild(span_high);
    message.appendChild(span_date);
    all_content.appendChild(message);
    comment.appendChild(all_content);
    all = document.createElement('div');
    all.className = "all";
    comment.appendChild(all);
    window.createDivideLine();
}

//创建一条分割线
var divideLine;
window.createDivideLine = function(){
    divideLine = document.createElement('div');
    divideLine.className = "ui dividing header divideline";
}

//创建页码
var pagenum;
window.createPageNum = function(page_num){
    pagenum = document.createElement('a');
    pagenum.innerHTML = page_num;
    pagenum.href = "javascript:;";
    pagenum.onclick = function(){
        return window.updateComment(comment_data,page_num);
    };
}

//更新下方页码
var now_page = 1;
window.updatePage = function(page_num){
    now_page = 1;
    $("#next_page").html("");
    //总共多少页
    var span1 = document.createElement('span');
    span1.innerHTML = "共"+ page_num +"页";
    $("#next_page").append(span1);
    //上一页
    //var span2 = document.createElement('span');
    //span2.innerHTML = "共"+ page_num +"页";
    //$("#next_page").append(span2);
    //中间按钮
    for(var i = 1;i <= page_num; i++){
        createPageNum(i);
        $("#next_page").append(pagenum);
    }
    //下一页
    //var span3 = document.createElement('span');
    //span3.innerHTML = "共"+ page_num +"页";
    //$("#next_page").append(span3);
}



//听音乐增加音乐的试听次数
//在页面刷新前，点击无数次播放，也只会增加一次试听
window.listenIncrement = function(){
    if(isListened) return;
    //console.log("/music/listen?music_id="+music._id);
    $.ajax({
        url: "/music/listen?music_id="+window.music._id,
        type: "GET",
        data: {},
        dataType: "json",
        success:function(data){
            //console.log(data);
            window.updateListenN(data.listenN);
        },
        error:function(XMLHttpRequest,textStatus,errorThrown){
            console.log(textStatus);
        }
    });
}

