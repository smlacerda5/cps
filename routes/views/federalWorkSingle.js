var keystone = require('keystone');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'state-work';
  locals.filters = {
    turnOffLocale : true,
    locale : req.session.locale || 'en',
    title: req.params.title,
  };
	locals.data = {
		post: {},
    next: {},
    previous: {},
    related: [],
	}

  // get current post
	view.on('init', function (next) {
		var p = keystone.list('FederalWork').model.findOne({state: 'published', slug: locals.filters.title}).populate('location tags')

		p.exec(function (err, result) {
      if (!result) return res.redirect('/state-work');
			locals.data.post = result;
			next(err);
		});
	});

  // get previous post
  view.on('init', function(next) {
    var p = keystone.list('FederalWork').model
      .findOne({ 'publishedDate': {'$gt': locals.data.post.publishedDate}})
      .and({state: 'published', locale: locals.filters.locale})
      .select('-content -image -cloudImage')
      .sort({'publishedDate': 1})

    p.exec(function(err, result) {
      locals.data.previous = result;
      next(err);
    });
  });

  // get next post
  view.on('init', function(next) {
    var p = keystone.list('FederalWork').model
      .findOne({ 'publishedDate': {'$lt': locals.data.post.publishedDate}})
      .and({state: 'published', locale: locals.filters.locale})
      .select('-content -image -cloudImage')
      .sort({'publishedDate': -1})
    
    p.exec(function(err, result) {
      locals.data.next = result;
      next(err);
    })
  })

  // load related posts
  view.on('init', function(next) {
    var p = keystone.list('FederalWork').model.find({state: 'published', locale: locals.filters.locale})
      .sort('-publishedDate')
      .where('slug').ne(locals.filters.title)
      .limit(5)

      p.exec(function(err, results) {
        locals.data.related = results;
        next(err);
      })
  })

  view.render('federal-work-single');
};