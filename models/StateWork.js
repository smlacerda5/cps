var keystone = require('keystone');
var Types = keystone.Field.Types;

var StateWork = new keystone.List('StateWork', {
    map : { name : 'title' },
    autokey : { path : 'slug', from : 'title', unique : true },
    defaultSort: '-createdAt',
    defaultColumns: 'title, locale, onMap, location, state|15%, author|15%, createdAt|15%',
    track: true,
});


StateWork.add({
    title : {type : String, required : true },
    onMap: {type: Types.Boolean, required: false, initial: true, label: "Display on map?" }, 
    state : {type : Types.Select, options : 'draft, published, archived', default : 'draft', index : true},
    publishedDate : {type : Types.Datetime, index : true, dependsOn : {state : 'published'}, default: Date.now },
    locale: {type: Types.Select, options: ['en', 'es'], default: 'en'},
    author : {type : Types.Relationship, ref : 'User', index : true},
    location: {type: Types.Relationship, ref: 'Location', initial: true, required: true},
    tags: { type: Types.Relationship, ref: 'Tag', many: true },
    cloudImage: { label: "Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 1800px."},
    image : {
      type : Types.LocalFile,
          note : "Width should be at least 1800px.",
      dest : 'public/images/state-work/',
      prefix : '/images/state-work/',
      filename : function (item, file) {
        return file.originalname;
      },
      format : function (item, file) {
        return 'img src="' + item.prefix + item.filename + '"';
      }
    },
    bullet1:    { label: 'Map Bullet Point 1', type: String },
    bullet2:    { label: 'Map Bullet Point 2', type: String, dependsOn: {bullet1: true} },
    bullet3:    { label: 'Map Bullet Point 3', type: String, dependsOn: {bullet2: true} },
    stat1:		{ label: 'Stat 1', type: String },
    stat1Label: { label: 'Stat 1 Label', type: String, dependsOn: { stat1: true}},
    stat2:		{ label: 'Stat 2', type: String, dependsOn: { stat1: true}},
    stat2Label: { label: 'Stat 2 Label', type: String, dependsOn: { stat2: true}},
    stat3:		{ label: 'Stat 3', type: String, dependsOn: { stat2: true}},
    stat3Label: { label: 'Stat 3 Label', type: String, dependsOn: { stat3: true}},
    overview: 	{ label: 'Stat Overview', type: Types.Html, wysiwyg: true, height: 200 },
	content: {
		brief: 	    { type: Types.Textarea, height: 100 },
		extended:   { type: Types.Html, wysiwyg: true, height: 300 },
	},
});

// image urls
var imageUrls = require('./plugins/image-url');
StateWork.schema.plugin(imageUrls, {path: '/images/state-work/'});

StateWork.schema.pre('save', function(next) {
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

StateWork.schema.virtual('content.full').get(function () {
    return this.content.extended || this.content.brief;
});

StateWork.schema.virtual('type').get(function() {
	return 'state-work';
});

StateWork.schema.virtual('url').get(function() {
    return '/reform-in-action/state-work/post/' + this.slug;
});

StateWork.register();