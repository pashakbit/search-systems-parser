var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const request = require('request'),
      syncRequest = require('sync-request'),
      cheerio = require('cheerio'),
      iconv = require('iconv-lite'),
      fs = require('fs');

const parserOptions = {
	delay: 5
};

const proxyOptions = {
	url: 'http://api.foxtools.ru/v2/Proxy',
	method: 'POST',
	json: true,
	body: {
		type: 1,
		country: 'RU',
		limit: 10
	}
};

const defaultItemOptions = {
	path: 'http://www.yandex.ru/?q=',
	method: 'GET'
};

const searchRequests = ["Плитка", "Плитка для ванной"];

request(proxyOptions, function (proxyErr, proxyRes, proxyBody) {
	const proxyUrls = proxyBody.response.items.filter(proxy => proxy.uptime < parserOptions.delay).map(proxy => ['http://', proxy.ip, ':', proxy.port].join(''));

	const requestCount = searchRequests.length;
	let bodyItem = false;

	for (searchRequest of searchRequests) {
		for (proxyUrl of proxyUrls) {
			if (bodyItem === false) {
				let localItemOptions = _extends({}, defaultItemOptions);

				localItemOptions.path = localItemOptions.path + searchRequest;

				bodyItem = searchByRequest(localItemOptions, proxyUrl);
			}
		}

		console.log('===========================================');
		console.log(bodyItem);

		bodyItem = false;
	}
});

function searchByRequest(localItemOptions, proxyUrl = false) {
	let requestOptions = {};

	if (proxyUrl) {
		requestOptions.proxy = proxyUrl;
	}

	let res = syncRequest('GET', localItemOptions.path, requestOptions);

	return res.getBody().toString();
}