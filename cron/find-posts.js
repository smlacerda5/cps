var keystone 			= require('keystone');

exports = module.exports = function(posts, schema, cb) {
	keystone.list(schema).model.find({state: 'published'})
		.sort('-publishedDate')
		.exec(cb)
}