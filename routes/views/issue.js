var keystone = require('keystone');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'issue';
  locals.filters = {
    turnOffLocale : true,
    locale : req.session.locale || 'en',
    issue: req.params.issue,
  };
	locals.data = {
		issue: {},
    next: {},
    previous: {},
    related: [],
	}

  // load current item
	view.on('init', function (next) {
		var p = keystone.list('Issue').model.findOne({state: 'published', slug: locals.filters.issue}).populate('tags')

		p.exec(function (err, result) {
      if (!result) return res.redirect('/issues');
			locals.data.issue = result;
			next(err);
		});
	});

  // load previous items
  view.on('init', function(next) {
    var p = keystone.list('Issue').model.findOne({ 'publishedDate': {'$gt': locals.data.issue.publishedDate}}).and({state: 'published', locale: locals.filters.locale}).sort({'publishedDate': 1})

    p.exec(function(err, result) {
      locals.data.previous = result;
      next(err);
    });
  });

  // load next items
  view.on('init', function(next) {
    var p = keystone.list('Issue').model.findOne({ 'publishedDate': {'$lt': locals.data.issue.publishedDate}}).and({state: 'published', locale: locals.filters.locale}).sort({'publishedDate': -1})
    
    p.exec(function(err, result) {
      locals.data.next = result;
      next(err);
    })
  })

  // load related items
  view.on('init', function(next) {
    var p = keystone.list('Issue').model.find({state: 'published', locale: locals.filters.locale})
      .sort('-publishedDate')
      .where('slug').ne(locals.filters.issue)
      .limit(5)

      p.exec(function(err, results) {
        locals.data.related = results;
        next(err);
      })
  })

  view.render('issue');
};