window.addEventListener("load", init, false);

function init() {
	initButtons();
}

function initButtons() {
	// 开始
	$("#play").click(function() {
		window.playBuoy(unitTime);
		$("#play").addClass("active");
		$("#pause").removeClass("active");
		$("#stop").removeClass("active");
	});
	// 暂停
	$("#pause").click(function() {
		window.pauseBuoy();
		$("#play").removeClass("active");
		$("#pause").addClass("active");
		$("#stop").removeClass("active");
	});
	// 停止
	$("#stop").click(function() {
		window.stopBuoy();
		$("#play").removeClass("active");
		$("#pause").removeClass("active");
		$("#stop").addClass("active");
	});

	// 声道下拉栏
	$('#channel').dropdown({
		onChange: function(val) {
			$('.channel-indicate').text(val);
			window.switchChannel(val);
		}
	});

	// 保存
	$('#save').click(function() {
		window.save();
	});

	// 个人主页跳转提示
	$('#individual-modal').modal({blurring:true});
	if ($('#user').length > 0)
		$('#individual-modal').modal('attach events', '#user', 'show')
		

	// 跳转确认按钮
	$('#individual-modal .ok').click(function() {
		var userid = $('#user').attr('userid');
		if (userid.length > 0) {
			window.location.href = '/individual?user_id=' + userid;
		}
	})

	// 登陆弹出框
	$('#signin-modal')
		.modal('attach events', '#signin', 'show')
		.modal({blurring:true});

	// 登陆按钮
	$('#signin-btn').click(signin);

	// 切换到注册的按钮
	$('.jumpup').click(function() {
		$('#signin-modal').modal('hide');
		$('#signup-modal').modal('show');
	}).css('cursor', 'pointer');

	// 注册弹出框
	$('#signup-modal')
		.modal('attach events', '#signup', 'show')
		.modal({blurring:true});

	// 注册按钮
	$('#signup-btn').click(signup);

	// 切换到登录的按钮
	$('.jumpin').click(function() {
		$('#signup-modal').modal('hide');
		$('#signin-modal').modal('show');
	}).css('cursor', 'pointer');
}

function signin() {
	$('.signin.submit').click();
	// var user = {'_id':'123123123','username':'simba'};
	// onSignInSuccess(user);
}

function signup() {
	$('.signup.submit').click();
}

function onSignInSuccess(user) {
	var userDom = $('#user');
	if (userDom.length > 0) {
		userDom.text(user.username);
	} else {
		$('#signin').remove();
		$('#signup').remove();
		var userDom = $('<div></div>');
		userDom
			.addClass('ui inverted orange button')
			.attr('style','margin-left:15px')
			.attr('userid', user._id)
			.attr('id', 'user')
			.text(user.username)
			.click(function() {
				$('#individual-modal').modal('show');
			})
		$('#save').before(userDom);
	}
}