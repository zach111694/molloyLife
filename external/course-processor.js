var https = require("https");
var fs = require("fs");

//var REPEAT_COUNTER = 56; // Replace with number of pages or find last page by scraping
var REPEAT_COUNTER = 62; // Replace with number of pages or find last page by scraping
var counter = 0;
var courses = [];
var sharedRequestInfo;

function getFileData(callback) {
	fs.readFile("../public/data/molloy-data.txt", "utf8", function(error, text) {
  		if (error)
   		 throw error;
  		//console.log("The file contained:", text);
  		this.responseStr = text;
  		processResponseString.bind(this, callback)();
  		//callback();
	});
}

function getListItemsFrom(str, startDelimiter, startReadingText, endDelimiter) {
	startDelimiter = startDelimiter || "<li";
	startReadingText = startReadingText || ">";
	endDelimiter = endDelimiter || "</li>";
	var listItems = [];
	var currentIndex = 0;

	//console.log(startDelimiter + " " + endDelimiter + " " + str);

	while(str.indexOf(startDelimiter, currentIndex) != -1) {
		var pair = getStrBetweenAndEndIndex(str, currentIndex, startDelimiter, startReadingText, endDelimiter);
		listItems.push(pair[0]);
		currentIndex = pair[1];
	}

	return listItems;
}

function getStrBetweenAndEndIndex(str, startIndex, startLookingText, startReadingText, endReadingText) {
	var startLookingIndex = str.indexOf(startLookingText, startIndex);
	var startReadingIndex = startReadingText.length + str.indexOf(startReadingText, startLookingIndex);
	var endReadingIndex = str.indexOf(endReadingText, startReadingIndex);

	// HACK FOR FACT THAT THERE MAY BE NO CLOSING TAG FOR <ul> when no schedule is entered
	if(str.substring(startReadingIndex).indexOf("No schedule") == 0) {
		endReadingIndex = startReadingIndex+1;
	}

	else if(endReadingIndex < startIndex) {
		endReadingIndex = str.length - 1 - endReadingText.length; // go to end
	}

	//console.log(str.substring(startReadingIndex, endReadingIndex) + "\n");

	return [str.substring(startReadingIndex, endReadingIndex).trim(), endReadingIndex + endReadingText.length];
}

function processResponseString(callback) {
	//console.log(this.responseStr);
	responseStr = this.responseStr;
	//var courses = [];
	var currentIndex = responseStr.indexOf("Credits"); // start processing here
	var endIndex = responseStr.indexOf("</tbody>");
	text = "";
	var propertyNames = ["code", "title", "professor", "seats", "open", "timeLoc", "credits", "startDate", "endDate"];
	var startLookingTexts = ["<a", "<td", "<ul", "<td", "<td", "<ul", "<td", "<td", "<td"];
	var startReadingTexts = [">", ">", ">", ">", ">", ">", ">", ">", ">"];
	var endReadingTexts = ["</a>", "</td>", "</ul>", "</td>", "</td>", "</ul>", "</td>", "</td>", "</td>"];
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

		course.timeLocs = [];
		course.timeLocs = getListItemsFrom(course.timeLoc);
		delete course.timeLoc;

		course.days = [];
		course.times = [];
		course.startTimes = [];
		course.endTimes = [];
		course.locations = [];

		course.timeLocs.forEach(function(timeLoc) {

			if(timeLoc) {
				if(timeLoc.split("&nbsp;")[0]) {
					course.days.push(timeLoc.split("&nbsp;")[0]);
				}

				if(timeLoc.split(";")[1]) {
					var meetTime = timeLoc.split(";")[1];
					course.times.push(meetTime);
					course.startTimes.push(meetTime.split("-")[0]);
					course.endTimes.push(meetTime.split("-")[1]);
				} else {
					course.times.push("TBA");
				}

				if(timeLoc.split(";")[2]) {
					course.locations.push(timeLoc.split(";")[2].trim());
				} else {
					course.locations.push("TBA");
				}
			}
		});

		course.professors = [];
		course.professors = getListItemsFrom(course.professor);
		delete course.professor;

		text += "\n";
		courses.push(course);
	}

	//var courseJSON = JSON.stringify(courses);

	if(REPEAT_COUNTER > counter) {
		counter++;
		var refreshKey = getStrBetweenAndEndIndex(responseStr, 0, '___BrowserRefresh', 'value="', '"')[0];
		console.log("Repeating with " + refreshKey + "...");
		console.log("Processing page " + counter);
		sharedRequestInfo.body = '------FormBoundary\nContent-Disposition: form-data; name="__PORTLET"\n\npg0$V$ltrNav\n------FormBoundary\nContent-Disposition: form-data; name="_scriptManager_HiddenField"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="__EVENTTARGET"\n\npg0$V$ltrNav\n------FormBoundary\nContent-Disposition: form-data; name="__EVENTARGUMENT"\n\n'+counter+'\n------FormBoundary\nContent-Disposition: form-data; name="___BrowserRefresh"\n\n'+refreshKey+'\n------FormBoundary\nContent-Disposition: form-data; name="userName"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="password"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTerm"\n\n2015;SP\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlDivision"\n\n\n------FormBoundary--';
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
	var request = https.request(requestInfo, getResponseString.bind(myResponseStr, callback));
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