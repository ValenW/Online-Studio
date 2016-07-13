window.addEventListener("load", init, false);

var totalPage = window.tot_page > 0 ? window.tot_page : 1;
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
		if (currentPage != Number(page)) {
			currentPage = Number(page);
			switchHandler();
		}
	}
}

function switchInputHandler() {
	var page = Number($(this).val());
	if (page != NaN && page > 0 && page <= totalPage) {
		if (currentPage != page) {
			currentPage = page;
			switchHandler();
		}
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
	requestData();
}

function requestData() {
	$.ajax({  
		url: 'category/?tag_id='+tag_id+'\&sorted='+sorted+'\&page='+currentPage.toString(),
		type: "GET",
		success: function (data) {
			if (data) refreshData(data.music_list);
		}
	});
}

function refreshData(data) {
	var lis = $('ul').children('li');
	for (var i = 0; i < lis.length; ++i) {
		if (i < data.length) {
			$(lis[i]).children('img').attr('src', data[i].cover);
			$(lis[i]).children('.title').attr('href', '/music?music_id='+data[i]._id).text(data[i].name);
			$(lis[i]).children('.v-desc').text(data[i].name);
			$(lis[i]).children('.bf span').text(data[i].listenN);
			$(lis[i]).children('.pl span').text(data[i].commentN);
			$(lis[i]).children('.author').attr('href', '/user?user_id='+data[i].author._id).text(data[i].author.username);
			$(lis[i]).show();
		} else {
			$(lis[i]).hide();
		}
	}
	scrollTo(0);
}

function scrollTo(position) {
	$('html body').animate({
		scrollTop: position
	}, 500);
}