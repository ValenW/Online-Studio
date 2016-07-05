window.addEventListener("load", init, false);

var totalPage = window.tot_count ? window.tot_count : 1;
var displPage = 10;
var currentPage = 1;

function init() {
	$('.card .image').dimmer({
		on: 'hover'
	});

	$('.page-jump input').change(switchInputHandler);
	if (displPage > totalPage)
		setPageSelector(totalPage, 1, 1);
	else
		setPageSelector(displPage, 1, 1);
}

function insertBtn(str) {
	var dom = $('<div></div>').addClass('ui compact button').text(str);
	dom.click(switchBtnHandler);
	$('.button-groups').append(dom);
}

function setPageSelector(dispnum, start, index) {
	$('.page-jump .total').text('/'+totalPage.toString());

	insertBtn("上一页");
	for (var i = 0; i < dispnum; ++i) insertBtn((i+start).toString());
	insertBtn("下一页");

	$($('.button-groups').children()[index]).addClass('active');
}

function switchBtnHandler() {
	var page = $(this).text();
	if (page == "上一页") {
		if (currentPage > 1) {
			currentPage -= 1;
			switchHandler();
		}
	}
	else if (page == "下一页") {
		if (currentPage < totalPage) {
			currentPage += 1;
			switchHandler();
		}
	}
	else {
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
	for (var i = 0; i < btns.length; ++i)
		$(btns[i]).remove();
	var start = Math.floor((currentPage-1)/displPage)*displPage+1;
	var index = currentPage%displPage;
	if (index == 0) index = displPage;
	if (displPage > totalPage - start + 1)
		setPageSelector(totalPage - start + 1, start, index);
	else
		setPageSelector(displPage, start, index);
}