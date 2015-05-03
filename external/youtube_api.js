var request = require("request");
var config = require('config');
var NodeCache = require("node-cache");
var youtubeCache = new NodeCache({stdTTL: 300, checkperiod: 120});

//todo Keys should not be hardcoded
var apikey = config.get("Youtube.apiKey");
var channelid = "UCYq97D1iaRz5fL1c515MX-g";

var requestString = "https://www.googleapis.com/youtube/v3/search?key=" + apikey +
    "&channelId=" + channelid + "&part=snippet,id&order=date&maxResults=5";

self = module.exports = {
    getVideos: function (callback) {
        //var cacheKey = "molloy-youtube";
        //var cached = youtubeCache.get(cacheKey);
        //if(cacheKey in cached) {
        //    var result = cached[cacheKey];
        //   callback(null, result);
        //} else {
        console.log(requestString);
        request(requestString, function (error, response, body) {
            body = JSON.parse(body);
            if (!error) {
                //youtubeCache.set(cacheKey, body);
                callback(null, body);
            } else {
                callback(error);
            }

        });
        //}

    },
    getVideoPage: function (callback, pageToken) {
        //var cacheKey = "molloy-youtube";
        //var cached = youtubeCache.get(cacheKey);
        //if(cacheKey in cached) {
        //    var result = cached[cacheKey];
        //    callback(null, result);
        //} else {
        console.log(requestString + "&pageToken=" + pageToken);
        request(requestString + "&pageToken=" + pageToken, function (error, response, body) {
            body = JSON.parse(body);
            if (!error) {
                //youtubeCache.set(cacheKey, body);
                callback(null, body);
            } else {
                callback(error);
            }

        });
        //}

    }
};