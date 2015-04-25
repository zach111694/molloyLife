// Route to correct processor to handle processing of data (e.g., xmlprocessor, htmlprocessor)
// All processors should implement getData(requestInfo, callback)
var fs = require("fs");
var processor;
var allEventItems = [];
var NUM_OF_EVENT_PAGES = 7;
var processedEventPages = 0;
//var entryId = 1;

function readData() {
	if(true) { // replace in future with criteria
		getData = require("./processors/htmlprocessor");
	} else {

	}

	for(var i = 1; i <= NUM_OF_EVENT_PAGES; i++) {
		getData({hostname: "www.molloy.edu", path:"/molloy-life/molloy-life-news?page=" + i, method: "GET"}, recordEvents);
	}
}

function recordEvents(eventItems) {
	var numOfEvents = eventItems.length;
	for(var i = 0; i < numOfEvents; i++)
		allEventItems.push(eventItems[i]);
	processedEventPages++;

	if(processedEventPages == NUM_OF_EVENT_PAGES) {
		writeJSON();
	}
}

function dateCompare(event1, event2) {
	var date1 = new Date(event1.date);
	var date2 = new Date(event2.date);

	if(date1 > date2) {
		return -1;
	}

	else if(date1 < date2) {
		return 1;
	}

	return 0;
}

function writeJSON() {
/*
	for(var k = 0; k < allEventItems.length; k++) {
		console.log(allEventItems[k].date);
	}
*/
	//console.log("Done");
	allEventItems.sort(dateCompare);
/*
	for(var k = 0; k < allEventItems.length; k++) {
		console.log(allEventItems[k].date);
	}
*/
	var eventData = JSON.stringify(allEventItems);
	//process.stdout.write(eventData);
	fs.writeFile("../public/data/articles.json", eventData, function(err) {
		if (err)
    		console.log("Failed to write file:", err);
  		else
    		console.log("Article data saved.");
	});
}

readData();

/*
function printData(eventItems) {
	numOfEvents = eventItems.length;
	process.stdout.write("Here are the event dates: \n");
	for(var i = 0; i < numOfEvents; i++) {
		process.stdout.write(eventItems[i].date + "\n-------\n");
	}
}
*/

//module.exports.getData = getData;
//module.exports.writeJSON = writeJSON;
module.exports = readData;