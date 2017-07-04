var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'social-feed';
	locals.filters = {
		post: req.params.post,
	};
	locals.data = {
		posts: [],
	};

	view.on('init', function (next) {
		var q = keystone.list('Social').model.find();

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});

	});

	// Render the view
	view.render('/');
};