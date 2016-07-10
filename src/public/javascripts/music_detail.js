//记录是否听过
var isListened = false;
var isCollected = false;

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
                         window.updateCommentN(data.comment_list.length);
                         window.updateComment(data.comment_list,1);
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
                         window.updateCollectN(data.collectN);
                      },
             error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log("comment error");
                console.log(XMLHttpRequest.status);
                console.log(textStatus);
             }
         });
    });
});

//更新页面的收藏次数
window.updateCollectN = function(num){
    //isListened = true;
    $("#collectN").html(num);
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
    //页数
    var p = data.length/10 + 1;
    $("#comment_all").html("");
    for(var i = 0; i <= 9; i++){
        window.createComment(data[(page_num-1)*10+i],(page_num-1)*10+i+1);
        $("#comment_all").append(comment);
    }
    //for()
    
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
    img.src = data.comment_userId.profile;
    comment_head.appendChild(img);
    comment.appendChild(comment_head);
    var all_content = document.createElement('div');
    all_content.className = "all_content";
    var name = document.createElement('div');
    name.className = "name";
    var p_user = document.createElement('p');
    p_user.className = "description";
    p_user.innerHTML = data._id;
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
}

//创建一条分割线
var divideLine;
window.createDivideLine = function(){
    divideLine = document.createElement('div');
    divideLine.className = "ui dividing header divideline";
}

//更新下方页码
window.updatePage = function(page_num){

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

// $(function(){
//     $('#submit_button').click(function(){
//          console.log(123);
//          $.ajax({
//              type: "GET",
//              url: "test.json",
//              data: {username:$("#username").val(), content:$("#content").val()},
//              dataType: "json",
//              success: function(data){
//                          $('#resText').empty();   //清空resText里面的所有内容
//                          var html = ''; 
//                          $.each(data, function(commentIndex, comment){
//                                html += '<div class="comment"><h6>' + comment['username']
//                                          + ':</h6><p class="para"' + comment['content']
//                                          + '</p></div>';
//                          });
//                          $('#resText').html(html);
//                       }
//          });
//     });
// });
