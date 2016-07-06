window.addEventListener("load", init, false);

function init() {
	initButtons();
}

function initButtons() {
	$("#play").click(function() {
		window.playBuoy(unitTime);
		$("#play").addClass("active");
		$("#pause").removeClass("active");
		$("#stop").removeClass("active");
	});
	$("#pause").click(function() {
		window.pauseBuoy();
		$("#play").removeClass("active");
		$("#pause").addClass("active");
		$("#stop").removeClass("active");
	});
	$("#stop").click(function() {
		window.stopBuoy();
		$("#play").removeClass("active");
		$("#pause").removeClass("active");
		$("#stop").addClass("active");
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
	$('#signin-modal')
		.modal('attach events', '#signin', 'show')
		.modal({blurring:true});
	$('#signin-btn').click(signin);
	$('#signup-modal')
		.modal('attach events', '#signup', 'show')
		.modal({blurring:true});
	$('#signup-btn').click(signup);
}

function signin() {
	$('.signin.submit').click();

}

function signup() {
	$('.signup.submit').click();
}