var request = require('request');
var xml2js = require('xml2js');


var getData = function(callback){
  request('https://life.molloy.edu/EventRss/EventsRss', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      xml2js.parseString(body, function (err, result) {
        console.log(JSON.stringify(result));
        callback(result);
      });
    }
  });
};
module.exports = {
  getLatestEvents: function(){
    getData(function(data){
      var events = data;
      var prettyEvents = {};









    });
  }
};