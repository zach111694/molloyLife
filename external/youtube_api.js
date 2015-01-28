var request = require("request");


var apikey = "";
var channelid = "UCYq97D1iaRz5fL1c515MX-g";

var requestString = "https://www.googleapis.com/youtube/v3/search?key=" + apikey +
    "&channelId=" + channelid + "&part=snippet,id&order=date&maxResults=20";

self = module.exports = {
    getVideos: function(callback){
        request(requestString,function(error,response,body){
            callback(body);
        })
    }
};