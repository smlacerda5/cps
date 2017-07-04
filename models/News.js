var keystone = require('keystone');
var Types = keystone.Field.Types;

var News = new keystone.List('News', {
    map : { name : 'title' },
    autokey : { path : 'slug', from : 'title', unique : true },
    defaultSort: '-createdAt',
    defaultColumns: 'title, locale, state|15%, author|15%, createdAt|15%',
    track: true,
});


News.add({
    title : {type : String, required : true },
    state : {type : Types.Select, options : 'draft, published, archived', default : 'draft', index : true},
    publishedDate : {type : Types.Datetime, index : true, dependsOn : {state : 'published'}, default: Date.now },
    locale: {type: Types.Select, options: ['en', 'es'], default: 'en'},
    author : {type : Types.Relationship, ref : 'User', index : true},
    source: {type: String},
    sourceLink: {type: Types.Url, label: 'Link to Source', dependsOn: {source: true}, note: "Format should be http://linkHere.com" }, 
    tags: { type: Types.Relationship, ref: 'Tag', many: true },
    cloudImage: { label: "Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 1800px."},
    image : {
      type : Types.LocalFile,
          note : "Width should be at least 1800px.",
      dest : 'public/images/news/',
      prefix : '/images/news/',
      filename : function (item, file) {
        return file.originalname;
      },
      format : function (item, file) {
        return 'img src="' + item.prefix + item.filename + '"';
      }
    },
	content: {
		brief: 	    { type: Types.Textarea, height: 100 },
		extended:   { type: Types.Html, wysiwyg: true, height: 300 },
	},
});

// image urls
var imageUrls = require('./plugins/image-url');
News.schema.plugin(imageUrls, {path: '/images/news/'});

News.schema.pre('save', function(next) {
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

News.schema.virtual('content.full').get(function () {
    return this.content.extended || this.content.brief;
});

News.schema.virtual('type').get(function() {
	return 'news';
});

News.schema.virtual('url').get(function() {
    return '/media/news/post/' + this.slug;
});

News.register();