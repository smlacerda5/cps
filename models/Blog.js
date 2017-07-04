var keystone = require('keystone');
var Types = keystone.Field.Types;

var Blog = new keystone.List('Blog', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt',
	defaultColumns: 'title, locale, state|15%, categories|15%, author|15%, createdAt|15%',
	track: true,
});

Blog.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true},
	location: { type: Types.Relationship, ref: 'Location', many: false },
	publishedDate: { type: Types.Datetime, index: true, dependsOn: { state: 'published' }, default: Date.now },
	author: { type: Types.Relationship, ref: 'User' },
	categories: { type: Types.Relationship, ref: 'BlogCategory', many: true, },
	tags: { type: Types.Relationship, ref: 'Tag', many: true },
	cloudImage: { label: "Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 1800px."},
	image : {
		label: 'Local Image',
		note: "Width should be at least 1800px.",
		type : Types.LocalFile,
		dest : 'public/images/blogs/',
		prefix : '/images/blogs/',
		filename : function (item, file) {
			return file.originalname;
		},
		format : function (item, file) {
			return 'img fill="' + item.prefix + item.filename + '"';
		}
	},
	content: {
		brief: { type: Types.Textarea, height: 100,},
		extended: { type: Types.Html, wysiwyg: true, height: 300}
	},
});

// image urls
var imageUrls = require('./plugins/image-url');
Blog.schema.plugin(imageUrls, {path: '/images/blogs/'});

Blog.schema.pre('save', function(next) {
	// surround wsysiwyg content with a div class for styling purposes
	if (this.content.extended && this.content.extended.length > 0) {
		var front = this.content.extended.slice(0, 50);
			
		if (front.indexOf('extended') === -1) {
			this.content.extended = '<div class="extended-content">' + this.content.extended + '</div>';
		}
	}
  next();
});

Blog.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

// plugin that returns a no html excerpt
var excerptPlugin = require('./plugins/excerpt');
Blog.schema.plugin(excerptPlugin);

Blog.schema.virtual('type').get(function() {
	return 'blog';
});

Blog.schema.virtual('url').get(function() {
    return '/blog/' + this.slug;
});

Blog.register();
