window.addEventListener("load", init, false);

function init() {
	initButtons();
	initFormConfirm();
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

	// 跳转提示
	$('#jump-modal').modal({blurring:true});
	if ($('#user').length > 0) {
		$('#user').click(function() {
			$('.msg').text('是否跳转至个人主页？');
			$('#jump-modal .ok').click(function() {
				var userid = $('#user').attr('userid');
				if (userid.length > 0) {
					window.location.href = '/individual?user_id=' + userid;
				}
			});
			$('#jump-modal').modal('show');
		});
	};
	if ($('#home').length > 0) {
		$('#home').click(function() {
			$('.msg').text('是否跳转至首页？');
			$('#jump-modal .ok').click(function() {
				window.location.href = '/';
			});
			$('#jump-modal').modal('show');
		});
	}

	// 登陆弹出框
	$('#signin-modal')
		.modal({blurring:true});

	// 登陆弹出按钮
	if ($('#signin').length > 0)
		$('#signin').click(function() { $('#signin-modal').modal('show'); })

	// 登陆提交按钮
	if ($('#signin-btn').length > 0)
		$('#signin-btn').click(signin);

	// 切换到注册的按钮
	$('.jumpup').click(function() {
		$('#signin-modal').modal('hide');
		$('#signup-modal').modal('show');
	}).css('cursor', 'pointer');

	// 注册弹出框
	$('#signup-modal')
		.modal({blurring:true});

	// 注册弹出按钮
	if ($('#signup').length > 0)
		$('#signup').click(function() { $('#signup-modal').modal('show'); })

	// 注册提交按钮
	if ($('#signup-btn').length > 0)
		$('#signup-btn').click(signup);

	// 切换到登录的按钮
	$('.jumpin').click(function() {
		$('#signup-modal').modal('hide');
		$('#signin-modal').modal('show');
	}).css('cursor', 'pointer');
}

function validSigninFormHandler() {
	var username = $('.login-form .username-input').val();
	var password = $('.login-form .password-input').val();
	$.ajax({
		url: 'editor/login',
		data: { 'username': username, 'password': password },
		type: "POST",
		success: function (data) {
			if (data.login_rst == 'success') {
				onSignInSuccess(data.user);
				$('#signin-modal').modal('hide');
			}
			else if (data.message) {
				$('#signin-modal .error.message').css('display', 'block');
				$('#signin-modal .error-message').text(data.message);
			}
		}
	});
}

function validSignupFormHandler() {
	var username = $('.signup-form .username-input').val();
	var password = $('.signup-form .password-input').val();
	var email = $('.signup-form .email-input').val();
	console.log(username); 
	console.log(email);
	$.ajax({
		url: 'editor/signup',
		data: { 'username': username, 'password': password, 'email': email },
		type: "POST",
		success: function (data) {
			if (data.signup_rst == 'success') {
				onSignInSuccess(data.user);
				$('#signup-modal').modal('hide');
			}
			else if (data.message) {
				$('#signup-modal .error.message').css('display', 'block');
				$('#signup-modal .error-message').text(data.message);
			}
		}
	});
}

function signin() {
	$('.login-form').form('validate form');
	var isValid = $('.login-form').form('is valid');
	if (isValid)
		validSigninFormHandler();
}

function signup() {
	var password = $('.signup-form .password-input').val();
	var confirm = $('.signup-form .confirm-input').val();
	$('.signup-form').form('validate form');
	var isValid = $('.signup-form').form('is valid');
	if (isValid)
		validSignupFormHandler();
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
				$('.msg').text('是否跳转至个人主页？');
				$('#jump-modal .ok').click(function() {
					var userid = $('#user').attr('userid');
					if (userid.length > 0) {
						window.location.href = '/individual?user_id=' + userid;
					}
				});
				$('#jump-modal').modal('show');
			});
		$('#home').before(userDom);
	}
}

function initFormConfirm() {
	$('.signup-form').form({
	    fields: {
	        username : 'empty',
	        email: 'email',
	        password2 : ['minLength[6]', 'empty'],
	        confirm_password: ['match[password2]', 'empty']
	    }
	});

	$('.login-form').form({
	    fields: {
	        username: 'empty',
	        password: 'empty'
	    }
	});
}