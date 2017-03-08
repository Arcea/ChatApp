var path = require('path');

module.exports = {
	imageShow: function(data) {
		var allowExt = ['.jpg', '.jpeg', '.png'];
		var items = path.parse(data);
		for (var key in allowExt) {
			if (allowExt[key] == items.ext) {
				data = '<img class="imageMessage" src="' + data + '"></img>';
			}
		}
		return data;
	}
}