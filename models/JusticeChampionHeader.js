var keystone = require('keystone');
var Types = keystone.Field.Types;

var JusticeChampionHeader = new keystone.List('JusticeChampionHeader', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt',
	defaultColumns: 'title, locale, state|15%, author|15%, createdAt|15%',
	track: true,
	label: "Justice Champions"
});

JusticeChampionHeader.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'published', index: true },
	locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true},
	publishedDate: { type: Types.Datetime, index: true, dependsOn: { state: 'published' }, default: Date.now },
	cloudImage: { label: "Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 1800px."},
	image : {
		label: 'Local Image',
		note: "Width should be at least 1800px.",
		type : Types.LocalFile,
		dest : 'public/images/justice-champions/',
		prefix : '/images/justice-champions/',
		filename : function (item, file) {
			return file.originalname;
		},
		format : function (item, file) {
			return 'img fill="' + item.prefix + item.filename + '"';
		}
	},
	text: {type: Types.Html, wysiwyg: true},
});

// image urls
var imageUrls = require('./plugins/image-url');
JusticeChampionHeader.schema.plugin(imageUrls, {path: '/images/justice-champions/'});

JusticeChampionHeader.register();
