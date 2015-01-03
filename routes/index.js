var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/photos', function(req, res) {
  res.render('photos', { title: 'Photos' });
});

router.get('/videos', function(req, res) {
  res.render('videos', { title: 'Videos' });
});

router.get('/articles', function(req, res) {
  res.render('articles', { title: 'Articles' });
});

router.get('/clubs', function(req, res) {
  res.render('clubs', { title: 'Clubs' });
});

router.get('/events', function(req, res) {
  res.render('events', { title: 'Events' });
});

router.get('/socialmedia', function(req, res) {
  res.render('socialmedia', { title: 'Social Media' });
});

module.exports = router;
