var crypto = require('crypto');
module.exports = function(data) {
	var i = 0,
		e = ('e').charCodeAt(0),
		root = [],
		info_from,
		info_to;

	function parse(char, parent) {
		var rtn;
		switch (char) {
			case 105: //'i':
				var val = '';
				while (i < data.length) {
					if (data[i] >= 48 && data[i] <= 57) {
						val += String.fromCharCode(data[i]);
					} else if (data[i] == e) {
						break;
					}
					i++;
				}
				rtn = val;
				break;
			case 100: //'d':
				var dict = {},
					key,
					temp;
				while ((data[++i] != e) && (temp = parse(data[i], dict))) {
					if (key) {
						if (key === 'info') {
							info_to = i;
							dict.info_hash = crypto.createHash('sha1').update(data.slice(info_from + 1, info_to + 1), 'binary').digest('hex').toUpperCase();
						}
						if (key !== 'pieces') {
							dict[key] = temp;
							key = null;
						}
					} else {
						key = temp;
						if (key === 'info') {
							info_from = i;
						}
					}
				}
				rtn = dict;
				parent === root && parent.push(dict);
				break;
			case 108: //'l':
				var list = [],
					temp;
				while ((data[++i] != e) && (temp = parse(data[i], list))) {
					list.push(temp);
				}
				rtn = list;
				break;
			default:
				var len = String.fromCharCode(char);
				while (++i < data.length) {
					if (data[i] < 48 || data[i] > 57) {
						break;
					}
					len += String.fromCharCode(data[i]);
				}
				len <<= 0;
				rtn = data.slice(i + 1, i + 1 + len).toString();
				i += len;
				break;
		}
		return rtn;
	}
	parse(data[i], root);
	return root[0] || {};
};