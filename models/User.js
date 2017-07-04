var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User', {
	track: true,
	defaultColumns: 'name, email, isAdmin',
});

User.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, initial: true, required: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone' },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Relationships
 */
User.relationship({ ref: 'Story', path: 'stories', refPath: 'author' });


/**
 * Registration
 */
User.register();
