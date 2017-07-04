var keystone = require('keystone');
var jade = require('jade');
var ObjectId = require('mongodb').ObjectID;

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = '';
	locals.filters = {
		post: req.params.post,
		locale: req.session.locale || 'en',
		next: req.query.next,
		id: req.query.id,
		turnOffLocale: true,
	};

	locals.data = {
		posts: [],
		tag: '',
	};

	var paginationQuery = {
		page: req.query.page || 1,
		perPage: 12,
		maxPages: 10,
		filters: {
			state: 'published',
			locale: locals.filters.locale,
		}
	}

	// get header information
	view.on('init', function(next) {
		var p = keystone.list('TagHeader').model.findOne({state: 'published', locale: locals.filters.locale})

		p.exec(function (err, result) {
			locals.data.header = result || {};
			next(err);
		});
	});

	// get all posts related to this tag
	view.on('init', function(next) {
		var test = null;
		var p = keystone.list('SearchResults').paginate(paginationQuery)
			.in('tags', [ObjectId(locals.filters.id)])
			.populate('tags')
			.sort('-publishedDate')

		p.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		})
	});


	// Render the view, but use json if the user clicks on the pagination controls
	// else use template
	if (locals.filters.next) {
		view.render(function(err) {
			if (err) return res.apiError('error', err);

			res.apiResponse({
				view: jade.renderFile('templates/includes/filter-tags.jade', {
					data: locals.data,
					filters: locals.filters
				})
			});
		});
	} else {
		view.render('tags');
	}
};
