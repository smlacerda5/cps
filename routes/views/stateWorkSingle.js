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
		var p = keystone.list('StateWork').model.findOne({state: 'published', slug: locals.filters.title}).populate('location tags')

		p.exec(function (err, result) {
      if (!result) return res.redirect('/state-work');

			locals.data.post = result;
			next(err);
		});
	});

  // get all posts, sort, then get previous and next
  view.on('init', function(next) {
    var p = keystone.list('StateWork').model.find({locale: locals.filters.locale}).populate('location').select('-content -image -cloudImage')

    p.exec(function(err, results) {
      if (locals.data.post) {
        results.sort(function(a, b) {
          return a.location.key.toLowerCase() > b.location.key.toLowerCase();
        })

        var idx = results.findIndex(function(a) {
          return a.location.key === locals.data.post.location.key;
        })
        
        locals.data.previous = idx > 0 ? results[idx - 1] : null
        locals.data.next = idx < results.length - 1 ? results[idx + 1] : null;
      }
      next(err);
    })

  });

  // load related posts
  view.on('init', function(next) {
    var p = keystone.list('StateWork').model.find({state: 'published', locale: locals.filters.locale})
      .sort('-publishedDate')
      .where('slug').ne(locals.filters.title)
      .limit(5)

      p.exec(function(err, results) {
        locals.data.related = results;
        next(err);
      })
  })

  view.render('state-work-single');
};