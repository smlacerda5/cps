module.exports = exports = function excerptPlugin(schema) {
	schema.virtual('excerpt').get(function() {
		if (this.brief) {
			var excerpt = this.brief.replace(/<.*?>/gi, function(result) {
				return '';
			})
			return excerpt.slice(0, 140) + '...';			
		} else if (this.extended) {
				var excerpt = this.extended.replace(/<.*?>/gi, function(result) {
				return '';
			})
			return excerpt.slice(0, 140) + '...';
		} else if (this.content && this.content.brief) {
			var excerpt = this.content.brief.replace(/<.*?>/gi, function(result) {
				return '';
			})
			return excerpt.slice(0, 140) + '...';
		} else if (this.content && this.content.extended) {
				var excerpt = this.content.extended.replace(/<.*?>/gi, function(result) {
				return '';
			})
			return excerpt.slice(0, 140) + '...';
		}
		return null;
	});
};