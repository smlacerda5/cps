var keystone = require('keystone');
var Types = keystone.Field.Types;

var Press = new keystone.List('Press', {
    map : { name : 'title' },
    autokey : { path : 'slug', from : 'title', unique : true },
    defaultSort: '-createdAt',
    defaultColumns: 'title, locale, state|15%, categories|15%, author|15%, source|15%, createdAt|15%',
    track: true,
    label: "Press Releases"
});

Press.add({
    title : {type : String, required : true },
    state : {type : Types.Select, options : 'draft, published, archived', default : 'draft', index : true},
    publishedDate : {type : Types.Datetime, index : true, dependsOn : {state : 'published'}, default: Date.now },
    locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true},
    location: { type: Types.Relationship, ref: 'Location', many: true },
    author: {type : Types.Relationship, ref : 'User', index : true},
    categories : {type : Types.Relationship, ref : 'PressCategory', many : true },
    tags: { type: Types.Relationship, ref: 'Tag', many: true },
    source: {type: String},
    sourceLink: {type: Types.Url, label: 'Link to Source', dependsOn: {source: true}, note: "Format should be http://linkHere.com" }, 
    cloudImage: { label: "Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 1800px."},
    image : {
		type : Types.LocalFile,
        note : "Width should be at least 1800px.",
		dest : 'public/images/press-releases/',
		prefix : '/images/press-releases/',
		filename : function (item, file) {
			return file.originalname;
		},
		format : function (item, file) {
			return 'img src="' + item.prefix + item.filename + '"';
		}
	},
  content : {
    brief: { type: Types.Textarea, height: 100},
    extended: { type: Types.Html, wysiwyg: true, height: 300}
  },
});

// image urls
var imageUrls = require('./plugins/image-url');
Press.schema.plugin(imageUrls, {path: '/images/press-releases/'});

Press.schema.pre('save', function(next) {
	// surround wsysiwyg content with a div class for styling purposes
	if (this.content.extended && this.content.extended.length > 0) {
        var front = this.content.extended.slice(0, 50);
    
        if (front.indexOf('extended') === -1) {
            this.content.extended = '<div class="extended-content">' + this.content.extended + '</div>';
        }
	}

    if (this.content.brief && this.content.brief.length > 0) {
        var ptag = this.content.brief.slice(0, 50)
        if (ptag.indexOf('<p>') === -1) {
            this.content.brief = '<p>' + this.content.brief + '</p>';
        }      
    }
  next();
});

Press.schema.virtual('content.full').get(function () {
    return this.content.extended || this.content.brief;
});

Press.schema.virtual('type').get(function() {
	return 'press';
});

// handles what the slug looks like. This is called from my .jade templates.
Press.schema.virtual('url').get(function() {
    return '/media/press-release/' + this.slug;
});

Press.register();
