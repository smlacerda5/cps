var keystone = require('keystone');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'story';
  locals.filters = {
    turnOffLocale : true,
    locale : req.session.locale || 'en',
    story: req.params.story,
  };
	locals.data = {
		story: {},
    related: [],
    next: {},
	}

  // get the post
	view.on('init', function (next) {
		var p = keystone.list('Story').model.findOne({state: 'published', slug: locals.filters.story})
      .populate('tags')
      .sort('-publishedDate')

		p.exec(function (err, result) {
			locals.data.story = result;
			next(err);
		});
	});

  // get next post
  view.on('init', function(next) {
    var p = keystone.list('Story').model
      .findOne({ 'publishedDate': {'$lt': locals.data.story.publishedDate}})
      .and({state: 'published', locale: locals.filters.locale})
      .sort('-publishedDate')
    
    p.exec(function(err, result) {
      locals.data.next = result;
      next(err);
    })
  })
  
  // get related posts
  view.on('init', function(next) {
    var q = keystone.list('Story').model.find({state: 'published', locale: locals.filters.locale})
      .where('slug').ne(locals.filters.story)
      .sort('-publishedDate')
      .limit(5)

      q.exec(function(err, results) {
        locals.data.related = results;
        next(err);
      })
  })

  view.render('story');
};