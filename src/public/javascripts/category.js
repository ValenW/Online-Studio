window.addEventListener("load", init, false);

var totalPage = 88;
var displPage = 10;

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
}

function switchBtnHandler() {
	var page = $(this).text();
	switchHandler(page);
}

function switchInputHandler() {
	var page = $(this).val();
	switchHandler(page);
}

function switchHandler(page) {
	if (page == "上一页") {

	}
	else if (page == "下一页") {

	}
	else {
		var index = Number(page)
		$('.page-jump input').val(index);
	}
}