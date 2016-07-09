//记录是否听过
var isListened = false;
var isCollected = false;

//submit按钮事件
$(function(){
    $('#submit_button').click(function(){
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
                         console.log();
                         console.log(data.comment_list);
                         updateCommentN(data.comment_list.length);
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
window.updateComment = function(){
    //for()
    $("#comment_all").html();
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
