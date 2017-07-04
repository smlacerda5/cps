var keystone = require('keystone');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'press';
  locals.filters = {
    turnOffLocale : true,
    locale : req.session.locale || 'en',
    press: req.params.press,
  };
  
	locals.data = {
		press: {},
    next: {},
    related: [],
	}

  // get current post
	view.on('init', function (next) {
		var p = keystone.list('Press').model.findOne({state: 'published', slug: locals.filters.press})
      .populate('tags')

		p.exec(function (err, result) {
      if (!result) return res.redirect('/press');
			locals.data.press = result;
			next(err);
		});
	});

  // get next post
  view.on('init', function(next) {
    var p = keystone.list('Press').model.findOne({ 'publishedDate': {'$lt': locals.data.press.publishedDate}}).and({state: 'published', locale: locals.filters.locale, sourceLink: ''}).sort({'publishedDate': -1})
    
    p.exec(function(err, result) {
      locals.data.next = result;
      next(err);
    })
  })
  
  // get related posts
  view.on('init', function(next) {
    var q = keystone.list('Press').model.find({state: 'published', locale: locals.filters.locale})
      .where('slug').ne(locals.filters.press)
      .sort('-publishedDate')
      .limit(5)

      q.exec(function(err, results) {
        locals.data.related = results;
        next(err);
      })
  })

  view.render('press-single');
};