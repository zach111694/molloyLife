var http = require("http");
var responseStr = "";

function getResponseString(callback, response) {
  response.on("data", function(chunk) {
    responseStr += chunk.toString();
  });
  response.on("end", processResponseString.bind(undefined, callback));
}

function processResponseString(callback) {
	var eventItems = [];
	var currentIndex = 0;

	var DATE_TAG_OPEN = '<div class="date">';
	var DATE_TAG_CLOSE = "</div>";
	var DATE_TAG_OPEN_LEN = DATE_TAG_OPEN.length;
	var DATE_TAG_CLOSE_LEN = DATE_TAG_CLOSE.length;

	var IMAGE_TAG_OPEN = '<img';
	var IMAGE_SRC_OPEN = 'src="';
	var IMAGE_SRC_CLOSE = '"';
	var IMAGE_TAG_CLOSE = '/>';
	var IMAGE_SRC_OPEN_LEN = IMAGE_SRC_OPEN.length;
	var IMAGE_TAG_OPEN_LEN = IMAGE_TAG_OPEN.length;
	var IMAGE_SRC_CLOSE_LEN = IMAGE_SRC_CLOSE.length;
	var IMAGE_TAG_CLOSE_LEN = IMAGE_TAG_CLOSE.length;

	var TITLE_TAG_OPEN = '<h2 class="title">';
	var TITLE_LINK_OPEN = 'href="';
	var TITLE_LINK_CLOSE = '"';
	var TITLE_TAG_CLOSE = '</a>';
	var TITLE_LINK_OPEN_LEN = TITLE_LINK_OPEN.length;
	var TITLE_LINK_CLOSE_LEN = TITLE_LINK_CLOSE.length;
	var TITLE_TAG_OPEN_LEN = TITLE_TAG_OPEN.length;
	var TITLE_TAG_CLOSE_LEN = TITLE_TAG_CLOSE.length;

	var PREVIEW_TEXT_TAG_OPEN = '<p>';
	var PREVIEW_TEXT_TAG_CLOSE = '<a'; //get rid of Read more link
	var PREVIEW_TEXT_TAG_OPEN_LEN = PREVIEW_TEXT_TAG_OPEN.length;
	var PREVIEW_TEXT_TAG_CLOSE_LEN = PREVIEW_TEXT_TAG_CLOSE.length;

	var MAX_EVENTS = 20;
	var numOfEvents = 0;

	do
	{
		var startIndex = responseStr.indexOf(DATE_TAG_OPEN,currentIndex) + DATE_TAG_OPEN_LEN;
		var stopIndex = responseStr.indexOf(DATE_TAG_CLOSE,startIndex);
		var eventInfo = {};
		currentIndex = stopIndex + DATE_TAG_CLOSE_LEN;
		numOfEvents++;
		if(startIndex < DATE_TAG_OPEN_LEN || numOfEvents > MAX_EVENTS)
			break;
		eventInfo.date = responseStr.substring(startIndex, stopIndex).trim();

		startIndex = responseStr.indexOf(IMAGE_TAG_OPEN,currentIndex) + IMAGE_TAG_OPEN_LEN;
		startIndex = responseStr.indexOf(IMAGE_SRC_OPEN,startIndex) + IMAGE_SRC_OPEN_LEN;
		stopIndex = responseStr.indexOf(IMAGE_SRC_CLOSE,startIndex);
		eventInfo.imageSrc = responseStr.substring(startIndex, stopIndex).trim();
		currentIndex = responseStr.indexOf(IMAGE_TAG_CLOSE,stopIndex) + IMAGE_TAG_CLOSE_LEN;

		startIndex = responseStr.indexOf(TITLE_TAG_OPEN,currentIndex) + TITLE_TAG_OPEN_LEN;
		startIndex = responseStr.indexOf(TITLE_LINK_OPEN,startIndex) + TITLE_LINK_OPEN_LEN;
		stopIndex = responseStr.indexOf(TITLE_LINK_CLOSE,startIndex);
		eventInfo.storyLink = responseStr.substring(startIndex, stopIndex).trim();
		currentIndex = stopIndex + TITLE_LINK_CLOSE_LEN;

		startIndex = currentIndex+1;
		stopIndex = responseStr.indexOf(TITLE_TAG_CLOSE,startIndex);
		eventInfo.headline = responseStr.substring(startIndex, stopIndex).trim();
		currentIndex = stopIndex + TITLE_TAG_CLOSE_LEN;

		startIndex = responseStr.indexOf(PREVIEW_TEXT_TAG_OPEN,currentIndex) + PREVIEW_TEXT_TAG_OPEN_LEN;
		stopIndex = responseStr.indexOf(PREVIEW_TEXT_TAG_CLOSE,startIndex);
		eventInfo.previewText = responseStr.substring(startIndex, stopIndex).trim();
		currentIndex = stopIndex + PREVIEW_TEXT_TAG_CLOSE_LEN;

		eventItems.push(eventInfo);

	} while(true);
	
	responseStr = "";

	if(callback)
		callback(eventItems);

	else
		return eventItems;
}

function getData(requestInfo, callback) {
	var request = http.request(requestInfo, getResponseString.bind(undefined, callback));
	request.end("Complete"); 
}

module.exports = getData;
