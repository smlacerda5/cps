var keystone 			= require('keystone');

exports = module.exports = function(posts, cb) {
	var SearchResult = keystone.list('SearchResults').model;

	if (posts && posts.length > 0) {
		posts.sort(function(a, b) {
			return b.publishedDate - a.publishedDate;
		})

		posts.map(function(post) {
			var thisPost = {
				refId: post._id, 
				state: post.state,
				url: post.url,
				sourceLink: post.sourceLink || null,
				title: post.title,
				locale: post.locale,
				publishedDate: post.publishedDate,
				tags: post.tags,
				brief: post.content.brief,
				extended: post.content.extended,
			};

			var newSearchResult = new SearchResult(thisPost);
			newSearchResult.save(cb)
		})
	}

}