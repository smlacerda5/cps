var keystone = require('keystone');
var Types = keystone.Field.Types;

var Ally = new keystone.List('Ally', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt',
	defaultColumns: 'title, state|15%, author|15%, createdAt|15%',
	track: true,
});

Ally.add({
	title: { type: String, required: true },
	sourceLink: { type: String, note: "Format source.com", required: true, initial: true},
	colorCloudImage: { label: "Color Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 150px and the same dimensions as the black and white image."},
	colorImage : {
		label: 'Color Local Image',
		note: "Width should be at least 150px and the same dimensions as the black and white image.",
		type : Types.LocalFile,
		dest : 'public/images/ally/',
		prefix : '/images/ally/',
		filename : function (item, file) {
			return file.originalname;
		},
		format : function (item, file) {
			return 'img src="' + item.prefix + item.filename + '"';
		}
	},
});

Ally.schema.virtual('color_url').get(function() {
  if(this.colorCloudImage.url) {
    return this._.colorCloudImage.src({width: 200});
  } else if (this.colorImage) {
    return '/images/ally/' + this.colorImage.filename;
  } else {
		return null;
	}
});

Ally.register();