$(function(){
    $('#submit_button').click(function(){
         // console.log(music._id)
         // var t = $("#content").val();
         // console.log(t);
         $.ajax({
             type: "post",
             url: "/music/insertComment",
             data: {music_id:music._id, comment_string:$("#content").val()},
             dataType: "json",
             success: function(data){
                         $('#content').empty();
                      },
             error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log("comment error");
             }
         });
    });
});


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
