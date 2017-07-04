module.exports = exports = function imageUrlsPlugin (schema, options) {
	schema.virtual('x_large_url').get(function() {
		if(this.cloudImage.url) {
			return this._.cloudImage.fit(2500, 1000);
		} else if (this.image && this.image.filename) {
			return options.path + this.image.filename;
		} else {
			return null;
		}
	});

	schema.virtual('large_url').get(function() {
		if(this.cloudImage.url) {
			return this._.cloudImage.fit(1750, 900);
		} else if (this.image && this.image.filename) {
			return options.path + this.image.filename;
		} else {
			return null;
		}
	});

	schema.virtual('medium_url').get(function() {
		if(this.cloudImage.url) {
			return this._.cloudImage.fit(1200, 800);
		} else if (this.image && this.image.filename) {
			return options.path + this.image.filename;
		} else {
			return null;
		}
	})

	schema.virtual('small_url').get(function() {
		if(this.cloudImage.url) {
			return this._.cloudImage.fit(800, 600);
		} else if (this.image && this.image.filename) {
			return options.path + this.image.filename;
		} else {
			return null;
		}
	})

	schema.virtual('thumbnail_url').get(function() {
		if(this.cloudImage.url) {
			return this._.cloudImage.fit(500, 450);
		} else if (this.image && this.image.filename) {
			return options.path + this.image.filename;
		} else {
			return null;
		}
	});
}
