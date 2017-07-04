var keystone = require('keystone');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'story';
  locals.filters = {
    // where do you set req.session.locale?
    locale : req.session.locale || 'en',
  };
	locals.data = {
		posts: [],
		header: {},
	}

	// load banner image
	view.on('init', function(next) {
		var q = keystone.list('JusticeChampionHeader').model.findOne({locale: locals.filters.locale, state: 'published'})

		q.exec(function(err, result) {
			locals.data.header = result;
			next(err);
		})
	})

  // Load the posts within the current year
	view.on('init', function (next) {
		var year = new Date().getFullYear() - 1;

		var q = keystone.list('JusticeChampion').model.find({locale: locals.filters.locale, state: 'published'})
			.where('forDate')
			.gt(new Date(year + ' 12 31'))
			.sort('forDate publishedDate');

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});
  
  view.render('justice-champions');
};
