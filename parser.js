const request = require('request'),
	cheerio = require('cheerio'),
	iconv = require('iconv-lite'),
	fs = require('fs');

const proxyOptions = {
	url: 'http://api.foxtools.ru/v2/Proxy',
	method: 'POST',
	json: true,
	body: {
		type: 2,
		port: '80, 8080',
		country: 'RU',
		limit: 10
	}
}

const itemOptions = {
	headers: {},
	url: 'https://www.yandex.ru/?q=',
	method: 'GET'
}

request(proxyOptions, function(proxyErr, proxyRes, proxyBody) {
	console.log(proxyErr);
	console.log(proxyRes);
	console.log(proxyBody);

	// request(itemOptions, function(err, res, body) {

	// });
});
