var express = require('express');
var router = express.Router();
var youtubeAPI = require("../external/youtube_api");

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Molloy Life'});
});

router.get('/photos', function (req, res) {
    res.render('photos', {title: 'Photos'});
});

router.get('/videos', function (req, res) {
    youtubeAPI.getVideos(function(err, data){
        if(!err) {

            var videos = [];
            if (data["items"])
                for (var v = 0; v < data["items"].length; v++) {
                    var currVid = data["items"][v];
                    if (currVid["id"]["kind"] === "youtube#video"){
                        var aVideo = {};

                        aVideo["id"] = currVid["id"]["videoId"];
                        aVideo["url"] = "https://www.youtube.com/watch?v=" + currVid["id"]["videoId"];
                        aVideo["title"] = currVid["snippet"]["title"];
                        aVideo["description"] = currVid["snippet"]["description"];
                        aVideo["thumbnail"] = currVid["snippet"]["thumbnails"]["high"]["url"];

                        videos.push(aVideo);
                    }
            }


            res.render('videos', {title: "Videos", videos:videos, nextPage: data["nextPageToken"]});

        } else {
            res.send("something went wrong");
        }

    });
});

router.get('/videoPage', function (req, res) {
    if (req.query["pageToken"]){
        youtubeAPI.getVideoPage(function(err, data){
            if(!err) {
                var videos = [];
                if (data["items"])
                    for (var v = 0; v < data["items"].length; v++) {
                        var currVid = data["items"][v];
                        if (currVid["id"]["kind"] === "youtube#video"){
                            var aVideo = {};

                            aVideo["id"] = currVid["id"]["videoId"];
                            aVideo["url"] = "https://www.youtube.com/watch?v=" + currVid["id"]["videoId"];
                            aVideo["title"] = currVid["snippet"]["title"];
                            aVideo["description"] = currVid["snippet"]["description"];
                            aVideo["thumbnail"] = currVid["snippet"]["thumbnails"]["high"]["url"];

                            videos.push(aVideo);
                        }
                    }
                res.render('videos/videoPage', {title: "Videos", videos:videos, nextPage: data["nextPageToken"]});
            } else {
                res.send("something went wrong");
            }
        },req.query["pageToken"]);
    }else {

        youtubeAPI.getVideos(function (err, data) {

            if (!err) {

                var videos = [];
                if (data["items"])
                    for (var v = 0; v < data["items"].length; v++) {
                        var currVid = data["items"][v];

                        if (currVid["id"]["kind"] === "youtube#video"){
                            var aVideo = {};

                            aVideo["id"] = currVid["id"]["videoId"];
                            aVideo["url"] = "https://www.youtube.com/watch?v=" + currVid["id"]["videoId"];
                            aVideo["title"] = currVid["snippet"]["title"];
                            aVideo["description"] = currVid["snippet"]["description"];
                            aVideo["thumbnail"] = currVid["snippet"]["thumbnails"]["high"]["url"];

                            videos.push(aVideo);
                        }

                    }

                res.render('videos/videoPage', {title: "Videos", videos: videos, nextPage: data["nextPageToken"]});
            } else {
                res.send("something went wrong");
            }

        });
    }
});


router.get('/articles', function (req, res) {
    res.render('articles', {title: 'Articles'});
});

router.get('/clubs', function (req, res) {
    res.render('clubs', {title: 'Clubs'});
});

router.get('/events', function (req, res) {
    res.render('events', {title: 'Events'});
});

router.get('/socialmedia', function (req, res) {
    res.render('socialmedia', {title: 'Social Media'});
});

router.get('/navigation', function (req, res) {
    res.render('navigation', {title: 'Navigation'})
})

module.exports = router;
