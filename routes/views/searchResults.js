var keystone = require('keystone');
var jade = require('jade');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = '';
	locals.filters = {
		locale: req.session.locale || 'en',
		turnOffLocale: true,
	};

	locals.data = {
		posts: [],
	};

	var tags = req.body.tags || [];
	var keywords = req.body.keywords;

	// get all posts related to this tag
	view.on('init', function(next) {
		// if the tags are not chosen by the user, return all data with 
		// matching keywords, else only those with the specific tag and keyword
		// matches
		if (!(tags.length > 0) && keywords.length > 0) {
			keystone.list('SearchResults').model.find(
				{
					$or: [ 
						{$text: {$search: keywords}}, 
						{title: {$regex: new RegExp(keywords, 'i')}},
						{brief: {$regex: new RegExp(keywords, 'i')}},
					]
				},
					{score: {$meta: 'textScore'}}
			)
			.where('locale', locals.filters.locale)
			.sort({score: {$meta: 'textScore'}})
			.exec(function(err, results) {
				locals.data.posts = results;
				next(err);
			})
		} else if (tags.length > 0 && !(keywords.length > 0)) {
			keystone.list('SearchResults').model.find({locale: locals.filters.locale})
			.sort('-publishedDate')
			.in('tags', tags)
			.exec(function(err, results) {
				locals.data.posts = results;
				next(err);
			})
		} else {
			keystone.list('SearchResults').model.find(
				{
					$or: [ 
						{$text: {$search: keywords}}, 
						{title: {$regex: new RegExp(keywords, 'i')}},
						{brief: {$regex: new RegExp(keywords, 'i')}},
					]
				},
					{score: {$meta: 'textScore'}}
			)
			.where('locale', locals.filters.locale)
			.sort({score: {$meta: 'textScore'}})
			.in('tags', tags)
			.exec(function(err, results) {
				locals.data.posts = results;
				next(err);
			})
		}
	})

	// Render the view, but use json if the user clicks on the pagination controls
	// else use template
		view.render(function(err) {
			if (err) return res.apiError('error', err);

			res.apiResponse({
				view: jade.renderFile('templates/includes/filter-search-results.jade', {
					data: locals.data,
					filters: locals.filters
				})
			});
		});
};
