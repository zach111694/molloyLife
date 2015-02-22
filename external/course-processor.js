var http = require("http");
var fs = require("fs");

var REPEAT_COUNTER = 62; // Replace with number of pages or find last page by scraping
var counter = 0;
var courses = [];
var sharedRequestInfo;

function getFileData(callback) {
	fs.readFile("molloy-data.txt", "utf8", function(error, text) {
  		if (error)
   		 throw error;
  		//console.log("The file contained:", text);
  		this.responseStr = text;
  		processResponseString.bind(this, callback)();
  		//callback();
	});
}

function getStrBetweenAndEndIndex(str, startIndex, startLookingText, startReadingText, endReadingText) {
	var startLookingIndex = str.indexOf(startLookingText, startIndex);
	var startReadingIndex = startReadingText.length + str.indexOf(startReadingText, startLookingIndex);
	var endReadingIndex = str.indexOf(endReadingText, startReadingIndex);

	if(endReadingIndex < startIndex) {
		endReadingIndex = str.length - 1 - endReadingText.length; // go to end
	}

	//console.log(str.substring(startReadingIndex, endReadingIndex) + "\n");

	return [str.substring(startReadingIndex, endReadingIndex).trim(), endReadingIndex + endReadingText.length];
}

function processResponseString(callback) {
	responseStr = this.responseStr;
	//var courses = [];
	var currentIndex = responseStr.indexOf("Credits"); // start processing here
	var endIndex = responseStr.indexOf("</tbody>");
	text = "";
	var propertyNames = ["code", "title", "professor", "seats", "open", "timeLoc", "credits", "startDate", "endDate"];
	var startLookingTexts = ["<a", "<td", "<li", "<td", "<td", "<li", "<td", "<td", "<td"];
	var startReadingTexts = [">", ">", ">", ">", ">", ">", ">", ">", ">"];
	var endReadingTexts = ["</a>", "</td>", "</li>", "</td>", "</td>", "</li>", "</td>", "</td>", "</td>"];
	//var courses = [];

	while(responseStr.indexOf("<a", currentIndex) < endIndex && responseStr.indexOf("<a", currentIndex) >= 0) {
		var course = {}; 
		for (var i = 0; i < propertyNames.length; i++) {
			pair = getStrBetweenAndEndIndex(responseStr, currentIndex, startLookingTexts[i], startReadingTexts[i], endReadingTexts[i]);
			text += pair[0] + "\n";
			currentIndex = pair[1];
			course[ propertyNames[i] ] = pair[0];
		}

		var courseCodeTriple = course.code.split(" ");

		if(courseCodeTriple[0])
			course.area = courseCodeTriple[0];

		if(courseCodeTriple[1])
			course.number = courseCodeTriple[1];

		if(courseCodeTriple[2])
			course.section = courseCodeTriple[2];

		course.isOpen = (course.open == "Open");

		if(course.timeLoc.split("&nbsp;")[0])
			course.days = course.timeLoc.split("&nbsp;")[0];

		if(course.timeLoc.split(";")[1]) {
			course.time = course.timeLoc.split(";")[1];
			course.startTime = course.time.split("-")[0];
			course.endTime = course.time.split("-")[1];
		} else {
			course.time = "TBA";
		}

		if(course.timeLoc.split(";")[2]) {
			course.location = course.timeLoc.split(";")[2].trim();
		} else {
			course.location = "TBA";
		}

		text += "\n";
		courses.push(course)
	}

	//var courseJSON = JSON.stringify(courses);

	if(REPEAT_COUNTER > counter) {
		counter++;
		var refreshKey = getStrBetweenAndEndIndex(responseStr, 0, '___BrowserRefresh', 'value="', '"')[0];
		console.log("Repeating with " + refreshKey + "...\n");
		sharedRequestInfo.body = '------FormBoundary\nContent-Disposition: form-data; name="__PORTLET"\n\npg0$V$ltrNav\n------FormBoundary\nContent-Disposition: form-data; name="_scriptManager_HiddenField"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="__EVENTTARGET"\n\npg0$V$ltrNav\n------FormBoundary\nContent-Disposition: form-data; name="__EVENTARGUMENT"\n\n'+counter+'\n------FormBoundary\nContent-Disposition: form-data; name="___BrowserRefresh"\n\n'+refreshKey+'\n------FormBoundary\nContent-Disposition: form-data; name="userName"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="password"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTerm"\n\n2014;SP\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlDivision"\n\n\n------FormBoundary--';
		sharedRequestInfo.headers["Content-Length"] = sharedRequestInfo.body.length;
		getData(sharedRequestInfo, callback);
	} else if(callback) {
		callback(courses);
	} else {
		return courses;
	}
}

function getResponseString(callback, response) {
  response.on("data", (function(chunk) {
    this.responseStr += chunk.toString();
  }).bind(this));
  response.on("end", processResponseString.bind(this, callback));
}

function getData(requestInfo, callback) {
	var myResponseStr = {responseStr:""};
	var request = http.request(requestInfo, getResponseString.bind(myResponseStr, callback));
	sharedRequestInfo = requestInfo;
	if(requestInfo.body)
		request.write(requestInfo.body);
	request.end("Complete");
	//console.log("Calling with " + requestInfo.headers["Cookie"] + "\n" + requestInfo.headers["Content-Length"] + "\n" + requestInfo.body + "\n");
}

function runData(requestInfo, callback) {
	var myResponseStr = {responseStr:""};
	var request = getFileData.bind(myResponseStr, callback)();
	//request.end("Complete");  
}

//runData("", console.log.bind(this, "Done"));
//runData("", console.log);

module.exports = getData;