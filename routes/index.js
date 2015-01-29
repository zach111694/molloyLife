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
            res.send(data);
        } else {
            res.send("something went wrong");
        }

    });
    //res.render('videos', {title: 'Videos'});
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
