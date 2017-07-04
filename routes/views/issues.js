var keystone = require('keystone');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'issue';
  locals.filters = {
    // where do you set req.session.locale?
    locale : req.session.locale || 'en',
  };
	locals.data = {
		issues: [],
		header: {},
	}

	// get header information
	view.on('init', function(next) {
		var p = keystone.list('IssueHeader').model.findOne({state: 'published', locale: locals.filters.locale})

		p.exec(function (err, result) {
			locals.data.header = result || {};
			next(err);
		});
	});

  // Load the issues
	view.on('init', function (next) {
		var q = keystone.list('Issue').model.find({locale: locals.filters.locale, state: 'published'}).sort('-publishedDate').limit(6);

		q.exec(function (err, results) {
			locals.data.issues = results;
			next(err);
		});
	});
  
  view.render('issues');
};
