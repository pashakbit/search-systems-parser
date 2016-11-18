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

const searchRequests = [
	"Плитка",
	"Плитка для ванной"
];

request(proxyOptions, function(proxyErr, proxyRes, proxyBody) {
	const proxyUrls = proxyBody.response.items
		.filter((proxy) => proxy.uptime < parserOptions.delay)
		.map((proxy) => ['http://', proxy.ip, ':', proxy.port].join(''));

	const requestCount = searchRequests.length;
	let bodyItem = false;

	for(searchRequest of searchRequests) {
		for(proxyUrl of proxyUrls) {
			if (bodyItem === false) {
				let localItemOptions = { ...defaultItemOptions };

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