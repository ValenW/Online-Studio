$(document).ready(function(){
    $(".edit-icon").click(function(event) {
        var target = $(event.target);
        while(!target.hasClass("static-content")) {
            target = target.parent();
        }
        target.next().show();
        target.hide();
    });
    $(".cancel-btn").click(function(event) {
        var target = $(event.target);
        while(!target.hasClass("edit-content")) {
            target = target.parent();
        }
        target.prev().show();
        target.hide();
    });
    $("#username-save-btn").click(function() {
        var username = $("input[name=username]").val();
        var user_id = window.location.pathname.split('/')[3];
        
        $.ajax({
            url: "/user/update/name/"+user_id,
            method: "POST",
            data: {
                id : user_id,
                username: username
            },
            dataType: "json",
            success: function(data) {
                console.log(data);
                $("#username-edit-content").hide();
                $("#username-item-content").text(username);
                $("#username-static-content").show();
            },
            fail: function() {
                console.log("fail");
            }
        });
    });
    $("#introduction-save-btn").click(function() {
        var introduction = $("input[name=introduction]").val();
        var user_id = window.location.pathname.split('/')[3];
        
        $.ajax({
            url: ""
        })
    });
});