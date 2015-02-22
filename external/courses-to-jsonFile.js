var fs = require("fs");
var getKeys = require("./course_search_keys");
var courseProcessor = require("./course-processor");

function generateRequestStr(keys) {
  refreshKey = keys.refreshKey;
  sessionId = keys.sessionId;
  var requestInfo = {hostname: "lionsden.molloy.edu", 
                     path:"/ICS/Course_Search/Course_Search.jnz?portlet=Course_Schedules&screen=Advanced+Course+Search&screenType=next", 
                     method: "POST", port:"80"};

  var body = '------FormBoundary\nContent-Disposition: form-data; name="__EVENTTARGET"\n\npg0$V$ltrNav\n------FormBoundary\nContent-Disposition: form-data; name="__EVENTARGUMENT"\n\n23\n------FormBoundary\nContent-Disposition: form-data; name="___BrowserRefresh"\n\n'+refreshKey+'\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTerm"\n\n2014;SP\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlDept"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCourseFrom"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCourseTo"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTitleRestrictor"\n\nBeginsWith\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtTitleRestrictor"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCourseRestrictor"\n\nBeginsWith\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtCourseRestrictor"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlDivision"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlMethod"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTimeFrom"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlTimeTo"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$days"\n\nrdAnyDay\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlFaculty"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlCampus"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlBuilding"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$ddlSecStatus"\n\nOpenFull\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtMin"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$txtMax"\n\n\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$hiddenCache"\n\nfalse\n------FormBoundary\nContent-Disposition: form-data; name="pg0$V$btnSearch"\n\nSearch\n------FormBoundary--';
  requestInfo.headers = {"content-type" : "multipart/form-data; boundary=----FormBoundary",
                         "Cookie":"ASP.NET_SessionId="+sessionId,
                         "Content-Length": body.length.toString()};
  requestInfo.body = body;

  return requestInfo;
}

function writeCourseData(courses) {
	var courseJSON = JSON.stringify(courses);
	fs.writeFile("course-data.json", courseJSON, function(err) {
  	if (err)
    	console.log("Failed to write file:", err);
  	else
    	console.log("Course data saved.");

	});
}

getKeys(function(keys) {
  var requestInfo = generateRequestStr(keys);
  courseProcessor(requestInfo, writeCourseData);
});