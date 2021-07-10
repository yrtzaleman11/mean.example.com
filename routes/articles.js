var express = require('express');
var router = express.Router();
var Articles = require('../models/articles');

router.get('/', function (req, res, next) {
  Articles.find({}, function (err, articles) {
    if (err) {
      return handleError(err);
    }
    res.render('articles/index', { title: "Articles", articles: articles });
  });
});

router.get('/view', function (req, res, next) {
  var articleSlug = req.params.slug;
  Articles.findOne({ 'slug': articleSlug }, function (err, article) {
    if (err) {
      return handleError(err);
    } else {
      res.render('articles/view', { title: 'xxx', article: article });
    }
  });
});

router.get('/app', function (req, res, next) {
    res.render('articles/app', { title: 'Article Management' });
});

module.exports = router;