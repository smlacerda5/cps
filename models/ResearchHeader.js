var keystone = require('keystone');
var Types = keystone.Field.Types;

var ResearchHeader = new keystone.List('ResearchHeader', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt',
	defaultColumns: 'title, locale, state|15%, author|15%, createdAt|15%',
	track: true,
	label: "Research"
});

ResearchHeader.add({
	title: { type: String, required: true },
	subTitle: { type: String, required: false, },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'published', index: true },
	locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true},
	publishedDate: { type: Types.Datetime, index: true, dependsOn: { state: 'published' }, default: Date.now },
	author: { type: Types.Relationship, ref: 'User' },
	cloudImage: { label: "Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 1800px."},
	image : {
		label: 'Local Image',
		note: "Width should be at least 1800px.",
		type : Types.LocalFile,
		dest : 'public/images/research/',
		prefix : '/images/research/',
		filename : function (item, file) {
			return file.originalname;
		},
		format : function (item, file) {
			return 'img fill="' + item.prefix + item.filename + '"';
		}
	},
});

// image urls
var imageUrls = require('./plugins/image-url');
ResearchHeader.schema.plugin(imageUrls, {path: '/images/research/'});

ResearchHeader.register();
