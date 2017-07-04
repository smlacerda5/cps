var keystone = require('keystone');
var Types = keystone.Field.Types;

var Infographic = new keystone.List('Infographic', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt',
	defaultColumns: 'title, locale, state|15%, createdAt|15%',
	track: true,
});

Infographic.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	locale: { type: Types.Select, options: ['en', 'es'], default: 'en', required: true },
	publishedDate: { type: Types.Datetime, index: true, dependsOn: { state: 'published' }, default: Date.now },
	cloudImage: { label: "Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 1000px."},
	image : {
		label: 'Local Image',
		note: "Width should be at least 1000px.",
		type : Types.LocalFile,
		dest : 'public/images/infographics/',
		prefix : '/images/infographics/',
		filename : function (item, file) {
			return file.originalname;
		},
		format : function (item, file) {
			return '<img src="' + item.prefix + item.filename + '">';
		}
	},
});

// image urls
var imageUrls = require('./plugins/image-url');
Infographic.schema.plugin(imageUrls, {path: '/images/infographics/'});

Infographic.schema.virtual('url').get(function() {
    return '/infographics/' + this.slug;
});

Infographic.register();
