var keystone = require('keystone');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'story';
  locals.filters = {
		turnOffLocale: true,
    locale : req.session.locale || 'en',
		champion: req.params.champion,
  };
	locals.data = {
		post: {},
		posts: [],
		press: [],
		news: [],
	}

  // Load the posts
	view.on('init', function (next) {
		var q = keystone.list('JusticeChampion').model.findOne({
			state: 'published', 
			slug: locals.filters.champion
		})
			.populate('champion')

		q.exec(function (err, result) {
			locals.data.post = result;
			next(err);
		});
	});

  // Load posts within the current year
	view.on('init', function (next) {
		var year = new Date().getFullYear() - 1;

		var q = keystone.list('JusticeChampion').model.find({
			locale: locals.filters.locale, 
			state: 'published'
		})
			.where('forDate')
			.gt(new Date(year + ' 12 31'))
			.sort('forDate publishedDate');

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// load news for this champion
	view.on('init', function (next) {
		var q = keystone.list('JusticeChampionNews').model.find({
			locale: locals.filters.locale, 
			state: 'published'
		})
			.populate('champion')
			.where('champion').in([locals.data.post._id])
			.sort('-publishedDate');

		q.exec(function (err, results) {
			locals.data.news = results;
			next(err);
		});
	});	

  view.render('justice-champions-single');
};
