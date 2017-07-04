var keystone = require('keystone');
var Types = keystone.Field.Types;

var Story = new keystone.List('Story', {
    map : { name : 'title' },
    autokey : { path : 'slug', from : 'title', unique : true },
    defaultSort: '-createdAt',
    defaultColumns: 'title, locale, featuredStory, state|15%, categories|15%, author|15%, createdAt|15%',
    track: true,
});

Story.add({
    featuredStory: { type: Types.Boolean },
    title : {type : String, required : true },
    state : {type : Types.Select, options : 'draft, published, archived', default : 'draft', index : true},
    publishedDate : {type : Types.Datetime, index : true, dependsOn : {state : 'published'}, default: Date.now },
    location: { type: Types.Relationship, ref: 'Location', many: false },
    locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true },
    author : {type : Types.Relationship, ref : 'User', index : true},
    categories : {type : Types.Relationship, ref : 'StoryCategory', many : true},
    tags: { type: Types.Relationship, ref: 'Tag', many: true },
    cloudImage: { label: "Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 1800px."},
    image : {
        type : Types.LocalFile,
        note: "Width should be at least 1800px.",
        dest : 'public/images/stories/',
        prefix : '/images/stories/',
        filename : function (item, file) {
            return file.originalname;
        },
        format : function (item, file) {
            return '<img src="' + item.prefix + item.filename + '" />';
        }
    },
    content : {
        brief: { type: Types.Textarea, height: 100,},
        extended: { type: Types.Html, wysiwyg: true, height: 300}
    },
});

// image urls
var imageUrls = require('./plugins/image-url');
Story.schema.plugin(imageUrls, {path: '/images/stories/'});

Story.schema.pre('save', function(next) {
    // surround wsysiwyg content with a div class for styling purposes
    if (this.content.extended && this.content.extended.length > 0) {
        var front = this.content.extended.slice(0, 50);
			
        if (front.indexOf('extended') === -1) {
                this.content.extended = '<div class="extended-content">' + this.content.extended + '</div>';
        }
    }
    next();
});

Story.schema.virtual('content.full').get(function () {
    return this.content.extended || this.content.brief;
});

Story.schema.virtual('type').get(function() {
	return 'story';
});

Story.schema.virtual('url').get(function() {
    return '/voices-of-reform/' + this.slug;
});

Story.register();