window.addEventListener("load", init, false);

var totalPage = 88;
var displPage = 10;
var currentPage = 1;

function init() {
	$('.card .image').dimmer({
		on: 'hover'
	});
	setPageSelector();
}

function insertBtn(str) {
	var dom = $('<div></div>').addClass('ui compact button').text(str);
	dom.click(switchBtnHandler);
	$('.button-groups').append(dom);
}

function setPageSelector() {
	$('.page-jump .total').text('/'+totalPage.toString());
	$('.page-jump input').change(switchInputHandler);

	insertBtn("上一页");
	if (displPage > totalPage) {
		for (var i = 1; i <= totalPage; ++i) insertBtn(i.toString());
	} else {
		for (var i = 1; i <= displPage; ++i) insertBtn(i.toString());
	}
	insertBtn("下一页");

	$($('.button-groups').children()[1]).addClass('active');
}

function switchBtnHandler() {
	var page = $(this).text();
	if (page == "上一页" && currentPage > 1) {
		currentPage -= 1;
		switchHandler();
	}
	else if (page == "下一页" && currentPage < totalPage) {
		currentPage += 1;
		switchHandler();
	} else {
		currentPage = Number(page);
		switchHandler();
	}
}

function switchInputHandler() {
	var page = Number($(this).val());
	if (page != NaN && page > 0 && page <= totalPage) {
		currentPage = page;
		switchHandler();
	} else {
		$('.page-jump input').val(currentPage);
	}
}

function switchHandler() {
	$('.page-jump input').val(currentPage);
	var btns = $('.button-groups').children();
	for (var i = 1; i <= 10; ++i) {
		$(btns[i]).removeClass('active');
		$(btns[i]).text(i+(Math.floor(currentPage/10)*10));
	}
	$(btns[currentPage%10]).addClass('active');
}