var cron 					= require('node-cron');
var async					= require('async');
var keystone 			= require('keystone');
var savePosts 		= require('./save-posts');
var findPosts 		= require('./find-posts');

var posts;

function searchResults() {
	posts = [];

	// get posts from several of the models and save to SearchResults model
	async.waterfall([
		function(callback) {
			keystone.list('SearchResults').model.remove({}, function(err) {
				if (err) callback(err);
				callback(null);
			})
		},
		function(callback) {
			findPosts(posts, 'Blog', function(err, results) {
				if (err) callback(err);
				posts = posts.concat(results);
				callback(null, posts);
			})
		},
		function(posts, callback) {
			findPosts(posts, 'Event', function(err, results) {
				if (err) callback(err);
				posts = posts.concat(results);
				callback(null, posts);
			})
		},
		function(posts, callback) {
			findPosts(posts, 'FederalWork', function(err, results) {
				if (err) callback(err);
				posts = posts.concat(results);
				callback(null, posts);
			})
		},
		function(posts, callback) {
			findPosts(posts, 'Issue', function(err, results) {
				if (err) callback(err);
				posts = posts.concat(results);
				callback(null, posts);
			})
		},
		function(posts, callback) {
			findPosts(posts, 'News', function(err, results) {
				if (err) callback(err);
				posts = posts.concat(results);
				callback(null, posts);
			})
		},
		function(posts, callback) {
			findPosts(posts, 'PartnerEvent', function(err, results) {
				if (err) callback(err);
				posts = posts.concat(results);
				callback(null, posts);
			})
		},
		function(posts, callback) {
			findPosts(posts, 'Press', function(err, results) {
				if (err) callback(err);
				posts = posts.concat(results);
				callback(null, posts);
			})
		},
		function(posts, callback) {
			findPosts(posts, 'Research', function(err, results) {
				if (err) callback(err);
				posts = posts.concat(results);
				callback(null, posts);
			})
		},
		function(posts, callback) {
			findPosts(posts, 'StateWork', function(err, results) {
				if (err) callback(err);
				posts = posts.concat(results);
				callback(null, posts);
			})
		},
		function(posts, callback) {
			findPosts(posts, 'Story', function(err, results) {
				if (err) callback(err);
				posts = posts.concat(results);
				callback(null, posts);
			})
		},
	],
		function(err, posts) {
			if (err) {
				console.log(err);
			} else {
				savePosts(posts, function(err, results) {
					if (err) console.log(err);
				})
			}
		}
	)
}

// var task = cron.schedule('0 1 0,12 * * *', profiler, false);
var task = cron.schedule('0 1 0,3,6,8,10,12,14,16,18,22 * * *', searchResults, false);

exports = module.exports = task;
