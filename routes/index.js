var express = require('express');
var router = express.Router();
var molloylifeEvents = require('../external/molloylifeEvents');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Molloy Life'});
});

router.get('/photos', function (req, res) {
    res.render('photos', {title: 'Photos'});
});

router.get('/videos', function (req, res) {
    res.render('videos', {title: 'Videos'});
});

router.get('/articles', function (req, res) {
    res.render('articles', {title: 'Articles'});
});

router.get('/clubs', function (req, res) {
    res.render('clubs', {title: 'Clubs'});
});

router.get('/events', function (req, res) {
    molloylifeEvents.getLatestEvents(function(err, data) {
        if(!err) {
            res.render("events", {title:"Events", events: data});
            return;
        }
        res.render("events", {title:"Events", error: true});


    });

});

router.get('/socialmedia', function (req, res) {
    res.render('socialmedia', {title: 'Social Media'});
});

router.get('/navigation', function (req, res) {
    res.render('navigation', {title: 'Navigation'})
})

module.exports = router;
