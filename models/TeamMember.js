var keystone = require('keystone');
var Types = keystone.Field.Types;

var TeamMember = new keystone.List('TeamMember', {
    autokey : { path : 'slug', from : 'name', unique : true },
    defaultSort: '-createdAt',
    defaultColumns: 'name, locale, state|15%, createdAt|15%',
    track: true,
});

TeamMember.add({
    name: {type: String, required: true},
    lastName: {type : String, required : true, default: "", initial: true},
    firstName: {type: String, required: true, default: "", initial: true},
    middleInitial: {type: String,},
    state : {type : Types.Select, options : 'draft, published, archived', default : 'draft', index : true},
    jobTitle: { type: String},
    email: {type: Types.Email},
    locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true},
    cloudImage: { label: "Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 500px."},
    image : {
      type : Types.LocalFile,
      note: "With should be at least 500px.",
      dest : 'public/images/team-members/',
      prefix : '/images/team-members/',
      filename : function (item, file) {
        return file.originalname;
      },
      format : function (item, file) {
        return 'img src="' + item.prefix + item.filename + '"';
      }
    },
    content: { type: Types.Html, wysiwyg: true, height: 300},
});

TeamMember.schema.virtual('thumbnail_url').get(function() {
  if(this.cloudImage.url) {
    return this._.cloudImage.src({width: 300, height: 450});
  } else if (this.image) {
    return '/images/team-members/' + this.image.filename;
  } else {
    return null;
  }
});

TeamMember.schema.virtual('fullName').get(function () {
    return this.firstName + " " + this.lastName;
});

TeamMember.schema.virtual('url').get(function() {
    return '/about/' + this.slug;
});

TeamMember.register();
