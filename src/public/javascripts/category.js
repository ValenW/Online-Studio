window.addEventListener("load", init, false);

// total pages
var totalPage = window.tot_page > 0 ? window.tot_page : 1;
// size of page selector
var displPage = 10;
// index of current page
var currentPage = 1;

function init() {
	// init dimmer effect
	$('.card .image').dimmer({
		on: 'hover'
	});
	// init input change event of page selector
	$('.page-jump input').change(switchInputHandler);
	// display page selector buttons
	if (displPage > totalPage)
		setPageSelector(totalPage, 1, 1);
	else
		setPageSelector(displPage, 1, 1);
}

/**
 * insertBtn() dynamically insert buttons to page selector
 * 
 * @param <string> str [button index]
 */
function insertBtn(str) {
	var dom = $('<div></div>').addClass('ui compact button').text(str);
	dom.click(switchBtnHandler);
	$('.button-groups').append(dom);
}

/**
 * setPageSelector() dynamically refresh page selector buttons
 *
 * @param <int> dispnum [number of total index buttons to insert]
 * @param <int> start [start index of buttons]
 * @param <int> index [index of active button]
 */
function setPageSelector(dispnum, start, index) {
	$('.page-jump .total').text('/'+totalPage.toString());

	insertBtn("上一页");
	for (var i = 0; i < dispnum; ++i) insertBtn((i+start).toString());
	insertBtn("下一页");

	$($('.button-groups').children()[index]).addClass('active');
}

/**
 * switchBtnHandler() receive page index and calls switchHandler()
 */
function switchBtnHandler() {
	var page = $(this).text();
	if (page == "上一页") {
		if (currentPage > 1) {	// page index should be larger than 0
			currentPage -= 1;
			switchHandler();
		}
	}
	else if (page == "下一页") {
		if (currentPage < totalPage) {	// page index should be less than totalPage
			currentPage += 1;
			switchHandler();
		}
	}
	else {
		if (currentPage != Number(page)) {
			currentPage = Number(page);
			switchHandler();
		}
		// nothing to do if page stays the same
	}
}

/**
 * switchInputHandler() receive page index and calls switchHandler()
 */
function switchInputHandler() {
	var page = Number($(this).val());
	// check index validation
	if (page != NaN && page > 0 && page <= totalPage) {
		if (currentPage != page) {
			currentPage = page;
			switchHandler();
		}
	} else {
		$('.page-jump input').val(currentPage);
	}
}

/**
 * switchHandler() dynamically refresh page content
 * ajax request music list and reset page selector
 */
function switchHandler() {
	// reset the placeholder of selector input
	$('.page-jump input').val(currentPage);

	// remove selector buttons
	var btns = $('.button-groups').children();
	for (var i = 0; i < btns.length; ++i)
		$(btns[i]).remove();

	// calculate start index and active index
	var start = Math.floor((currentPage-1)/displPage)*displPage+1;
	var index = currentPage%displPage;
	if (index == 0) index = displPage;

	// insert selector buttons
	if (displPage > totalPage - start + 1)
		setPageSelector(totalPage - start + 1, start, index);
	else
		setPageSelector(displPage, start, index);

	// ajax request
	requestData();
}

/**
 * requestData() ajax request for music list data
 */
function requestData() {
	$.ajax({  
		url: 'category/?tag_id='+tag_id+'\&sorted='+sorted+'\&page='+currentPage.toString(),
		type: "GET",
		success: function (data) {
			if (data) refreshData(data.music_list);
		}
	});
}

/**
 * refreshData() change html attributes
 *
 * @param <List<object>> data
 */
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

/**
 * scrollTo() scrolls the whole page to a position
 * 
 * @param <int> position [y-axis]
 */
function scrollTo(position) {
	$('html body').animate({
		scrollTop: position
	}, 500);
}