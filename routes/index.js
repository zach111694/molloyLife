var express = require('express');
var fs = require('fs');
var router = express.Router();

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

router.get('/courses', function (req, res) {
	fs.readFile("public/data/course-data.json", "utf8", function(error, text) {
  		if (error)
    		throw error;
    	var coursesData = JSON.parse(text);
    	res.render('courses', {title: 'Courses', coursesData: coursesData});
	});
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
