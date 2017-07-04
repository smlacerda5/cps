var keystone = require('keystone');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'blog';
  locals.filters = {
    turnOffLocale : true,
    locale : req.session.locale || 'en',
    post: req.params.post,
  };
	locals.data = {
		post: {},
    next: {},
    related: [],
	}

  // get single post based on filter
	view.on('init', function (next) {
		var p = keystone.list('Blog').model.findOne({state: 'published', slug: locals.filters.post})
      .populate('tags')
      .sort('-publishedDate')

		p.exec(function (err, result) {
      if (!result) return res.redirect('/blog');
			locals.data.post = result;
			next(err);
		});
	});

  // load next
  view.on('init', function(next) {
    var p = keystone.list('Blog').model
      .findOne({ 'publishedDate': {'$lt': locals.data.post.publishedDate}})
      .and({state: 'published', locale: locals.filters.locale})
      .sort('-publishedDate')

    p.exec(function(err, result) {
      locals.data.next = result;
      next(err);
    })
  })
  
  // load related content
  view.on('init', function(next) {
    var q = keystone.list('Blog').model.find({state: 'published', locale: locals.filters.locale})
      .sort('-publishedDate')
      .where('slug').ne(locals.filters.post)
      .limit(5)

      q.exec(function(err, results) {
        locals.data.related = results;
        next(err);
      })
  })

  view.render('blog-single');
};