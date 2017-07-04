var keystone = require('keystone');
var Types = keystone.Field.Types;

var Upload = new keystone.List('Upload', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt',
	defaultColumns: 'title, createdAt|15%, cloudImage',
	track: true,
});

Upload.add({
	title: { type: String, required: true },
	publishedDate: { type: Types.Datetime, index: true, dependsOn: { state: 'published' }, default: Date.now },
	cloudImage: { label: "Cloud File", type: Types.CloudinaryImage },
	image : {
		type : Types.LocalFile,
		label : "Local File",
		dest : 'public/images/uploads/',
		prefix : '/images/uploads/',
		filename : function (item, file) {
			return file.originalname;
		},
		format : function (item, file) {
			return 'img src="' + item.prefix + item.filename + '"';
		}
	}
});

// image urls
var imageUrls = require('./plugins/image-url');
Upload.schema.plugin(imageUrls, {path: '/images/uploads/'});


Upload.schema.virtual('url').get(function() {
    return '/uploads/' + this.slug;
});

Upload.register();