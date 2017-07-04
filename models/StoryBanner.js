var keystone = require('keystone');
var Types = keystone.Field.Types;

var StoryBanner = new keystone.List('StoryBanner', {
    map : { name : 'title' },
    autokey : { path : 'slug', from : 'title', unique : true },
    defaultSort: '-createdAt',
    defaultColumns: 'title, locale, author|15%, createdAt|15%',
    track: true,
});

StoryBanner.add({
    title : {type : String, required : true },
    publishedDate : {type : Types.Datetime, index : true, dependsOn : {state : 'published'}, default: Date.now },
    locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true },
    author : {type : Types.Relationship, ref : 'User', index : true},
    cloudImage: { label: "Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 800px."},
    image : {
        type : Types.LocalFile,
        note: "Width should be at least 800px.",
        dest : 'public/images/stories/',
        prefix : '/images/stories/',
        filename : function (item, file) {
            return file.originalname;
        },
        format : function (item, file) {
            return '<img src="' + item.prefix + item.filename + '" />';
        }
    },
});

var imageUrls = require('./plugins/image-url');
StoryBanner.schema.plugin(imageUrls, {path: '/images/stories/'});

StoryBanner.register();