var keystone = require('keystone');
var Types = keystone.Field.Types;

var Video = new keystone.List('Video', {
    map : { name : 'title' },
    autokey : { path : 'slug', from : 'title', unique : true },
    defaultSort: '-createdAt',
    defaultColumns: 'title, locale, author|15%, createdAt|15%',
    track: true,
});

Video.add({
    title : {type : String, required : true },
    publishedDate : {type : Types.Datetime, index : true, dependsOn : {state : 'published'}, default: Date.now },
    locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true },
    location: {type: Types.Select, options: ['home-location-1']},
    author : {type : Types.Relationship, ref : 'User', index : true},
    link: {label: 'Link to video', note: "Format is http://player.vimeo.com/LINK_TO_VIDEO or /path/to/local/file", type: Types.Url },
});

Video.register();