var keystone = require('keystone');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'take-action';
  locals.filters = {
    turnOffLocale : true,
    locale : req.session.locale || 'en',
    event: req.params.event,
  };
	locals.data = {
		post: {},
    related: [],
    next: {},
	}

  // get the post
	view.on('init', function (next) {
		var p = keystone.list('PartnerEvent').model.findOne({state: 'published', slug: locals.filters.event})
      .populate('tags')

		p.exec(function (err, result) {
			locals.data.post = result;
			next(err);
		});
	});

  // get next post
  view.on('init', function(next) {
    var p = keystone.list('PartnerEvent').model
      .findOne({ 'eventDate': {'$lt': locals.data.post.eventDate}})
      .and({state: 'published', locale: locals.filters.locale})
      .sort('eventDate publishedDate')
    
    p.exec(function(err, result) {
      locals.data.next = result;
      next(err);
    })
  })
  
  // get related posts
  view.on('init', function(next) {
    var q = keystone.list('PartnerEvent').model.find({state: 'published', locale: locals.filters.locale})
      .where('slug').ne(locals.filters.event)
      .sort('eventDate publishedDate')
      .limit(5)

      q.exec(function(err, results) {
        locals.data.related = results;
        next(err);
      })
  })

  view.render('partner-events-single');
};