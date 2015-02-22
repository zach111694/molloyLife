var http = require("http");

var COOKIE_NAME = "ASP.NET_SessionId";

function generateRequestHeader() {
  var requestInfo = {hostname: "lionsden.molloy.edu",
                     path:"/ICS/Course_Search/Course_Search.jnz?portlet=Course_Schedules&screen=Advanced+Course+Search&screenType=next", 
                     method: "GET", port:80};
      requestInfo.headers = {};

  return requestInfo;

}

function getStrBetweenAndEndIndex(str, startIndex, startLookingText, startReadingText, endReadingText) {
	var startLookingIndex = str.indexOf(startLookingText, startIndex);
	var startReadingIndex = startReadingText.length + str.indexOf(startReadingText, startLookingIndex);
	var endReadingIndex = str.indexOf(endReadingText, startReadingIndex);
	return [str.substring(startReadingIndex, endReadingIndex).trim(), endReadingIndex + endReadingText.length];
}

function getResponseString(callback, response) {
  response.on("data", (function(chunk) {
  	this.responseStr += chunk.toString();

  	if(!this.sessionId) {
  		var cookie = response.headers['set-cookie'].toString();
  		var startIndex = cookie.indexOf(COOKIE_NAME) + COOKIE_NAME.length + 1; // + 1 for =
  		var endIndex = cookie.indexOf(";", startIndex);
  		this.sessionId = cookie.substring(startIndex, endIndex);
  	}
  }).bind(this));
  response.on("end", extractKeys.bind(this, callback));
  response.on("error", console.log.bind("Error"));  
}

function extractKeys(callback) {
	callback({"sessionId": this.sessionId, "refreshKey": getStrBetweenAndEndIndex(this.responseStr, 0, '___BrowserRefresh', 'value="', '"')[0]});
}

function getKeys(callback) {
	var header = generateRequestHeader();
	var myKeys = {responseStr: "", sessionId: undefined, refreshKey: undefined};
	var request = http.request(generateRequestHeader(), getResponseString.bind(myKeys, callback));
	request.end("Complete");
}

getKeys(console.log);

module.exports = getKeys;