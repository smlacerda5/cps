var keystone = require('keystone');
var Types = keystone.Field.Types;

var Partner = new keystone.List('Partner', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt',
	defaultColumns: 'title, state|15%, author|15%, createdAt|15%',
	track: true,
});

Partner.add({
	title: { type: String, required: true },
	sourceLink: { type: String, note: "Format source.com", required: true, initial: true},
	colorCloudImage: { label: "Color Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 150px and the same dimensions as the black and white image."},
	colorImage : {
		label: 'Color Local Image',
		note: "Width should be at least 150px and the same dimensions as the black and white image.",
		type : Types.LocalFile,
		dest : 'public/images/partner/',
		prefix : '/images/partner/',
		filename : function (item, file) {
			return file.originalname;
		},
		format : function (item, file) {
			return 'img src="' + item.prefix + item.filename + '"';
		},
	},
	content: { type: Types.Html, wysiwyg: true, height: 300},
	citationBy: { label: "Name", note: "Name of the person cited above", type: String },
	professionalTitle: { label: "Professional Title", note: "Professional title of the person cited above", type: String },
	companyName: { type: String }
});

Partner.schema.virtual('color_url').get(function() {
  if(this.colorCloudImage.url) {
    return this._.colorCloudImage.src({width: 200});
  } else if (this.colorImage) {
    return '/images/partner/' + this.colorImage.filename;
  } else {
		return null;
	}
});

Partner.register();
