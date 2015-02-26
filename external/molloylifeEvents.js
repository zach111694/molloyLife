var request = require('request');
var xml2js = require('xml2js');


var getData = function(callback){
  request('https://life.molloy.edu/EventRss/EventsRss', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      xml2js.parseString(body, function (err, result) {
        //console.log(JSON.stringify(result));
          if(!err){
              callback(null, result);
              return;
          }
          callback(err);
      });
    }
  });
};
module.exports = {
  getLatestEvents: function(callback){
    getData(function(err, data){
        if(!err) {
            callback(null, data["rss"]["channel"][0]["item"]);
            return;
        }
        callback(err);










    });
  }
};