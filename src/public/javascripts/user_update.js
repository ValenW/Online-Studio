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
            url: "/user/update/introduction/"+user_id,
            method: "POST",
            data: {
                id: user_id,
                introduction: introduction
            },
            dataType: "json",
            success: function(data) {
                console.log(data);
                $("#introduction-edit-content").hide();
                $("#introduction-item-content").text(introduction);
                $("#introduction-static-content").show();
            },
            fail: function() {
                console.log("fail");
            }
        })
    });
    $("#password-save-btn").click(function() {
        var password = $("input[name=password]").val();
        var newPassword = $("input[name=new-password]").val();
        var comfirmPassword = $("input[name=comfirm-password]").val();
        if (password.length === 0) {
            return alert("请输入原密码");
        }
        if (newPassword.length === 0) {
            return alert("请输入新密码");
        }
        if (comfirmPassword.length === 0) {
            return alert("请确认新密码");
        }
        if (newPassword !== comfirmPassword) {
            return alert("两次输入的新密码不一致");
        }
        var user_id = window.location.pathname.split('/')[3];
        $.ajax({
            url: "/user/update/password/"+user_id,
            method: "POST",
            data: {
                id: user_id,
                password: password,
                newPassword: newPassword
            },
            dataType: "json",
            success: function(data) {
                if (data.message === "password error") {
                    alert("输入的原密码错误");
                } else if (data.message === "success") {
                    $("input[name=password]").val('');
                    $("input[name=new-password]").val('');
                    $("input[name=comfirm-password]").val('');
                    $("#password-static-content").show();
                    $("#password-edit-content").hide();
                }
            },
            fail: function() {
                console.log("fail");
            }
        })
    });
});