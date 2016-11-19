'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _syncRequest = require('sync-request');

var _syncRequest2 = _interopRequireDefault(_syncRequest);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var parserOptions = {
	proxyDelay: 5
};

var proxyOptions = {
	url: 'http://api.foxtools.ru/v2/Proxy',
	method: 'POST',
	json: true,
	body: {
		type: 1,
		country: 'RU',
		limit: 100,
		anonymity: 8,
		uptime: parserOptions.proxyDelay
	}
};

var defaultItemOptions = {
	path: 'https://www.yandex.ru/search/?lr=213',
	method: 'GET'
};

var searchRequests = ['Плитка', 'Плитка для ванной'];

var userAgents = ['Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36', 'Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36', 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.10586', 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 6P Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36', 'Mozilla/5.0 (Linux; Android 6.0.1; E6653 Build/32.2.A.0.253) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36', 'Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36', 'Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36', 'Mozilla/5.0 (Linux; Android 6.0.1; SGP771 Build/32.2.A.0.253; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36', 'Mozilla/5.0 (Linux; Android 5.0.2; SAMSUNG SM-T550 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.3 Chrome/38.0.2125.102 Safari/537.36', 'Mozilla/5.0 (Linux; Android 4.4.3; KFTHWI Build/KTU84M) AppleWebKit/537.36 (KHTML, like Gecko) Silk/47.1.79 like Chrome/47.0.2526.80 Safari/537.36', 'Mozilla/5.0 (Linux; Android 5.0.2; LG-V410/V41020c Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/34.0.1847.118 Safari/537.36', 'Mozilla/5.0 (CrKey armv7l 1.5.16041) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.0 Safari/537.36', 'Mozilla/5.0 (Linux; U; Android 4.2.2; he-il; NEO-X5-116A Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30', 'Mozilla/5.0 (Linux; Android 4.2.2; AFTB Build/JDQ39) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.173 Mobile Safari/537.22', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246', 'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1'];

var mainProxyUrls = [],
    randProxyUrls = [],
    globalResult = [];

(0, _request2.default)(proxyOptions, function (proxyErr, proxyRes, proxyBody) {
	mainProxyUrls = proxyBody.response.items.map(function (proxy) {
		return ['http://', proxy.ip, ':', proxy.port].join('');
	});

	var proxyUrls = mainProxyUrls.slice();

	var bodyItem = false,
	    $ = null;

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = searchRequests[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var searchRequest = _step.value;

			while (!bodyItem) {
				var proxyUrl = getRandProxyUrl(),
				    userAgent = randElement(userAgents);

				console.log(proxyUrl + ' / ' + userAgent);

				bodyItem = searchByRequest(_extends({}, defaultItemOptions, {
					path: defaultItemOptions.path + getMsid() + '&text=' + escape(searchRequest)
				}), userAgent, proxyUrl);

				if (bodyItem) {
					$ = _cheerio2.default.load(bodyItem);

					if (successRequest($)) {
						globalResult.push(_defineProperty({}, searchRequest, $('.related__item .link').map(function (i, link) {
							return $(link).text();
						}).get()));

						console.log(globalResult);
					} else {
						console.log('Yandex прочухал бота!');
						bodyItem = false;
					}
				}

				customSleep(getDelay());
			}

			bodyItem = false;
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}
});

function searchByRequest(localItemOptions) {
	var userAgent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	var proxyUrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	var requestOptions = {
		'headers': {
			'Host': 'yandex.ru',
			'Accept-Encoding': 'gzip, deflate, br',
			'Referer': 'https://yandex.ru/',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			'Accept-Language': 'ru-RU,ru;q=0.8,en-us;q=0.5,en;q=0.3',
			'Connection': 'keep-alive',
			'Upgrade-Insecure-Requests': '1',
			'Cookie': 'z=s:l:7bdf6fbbb8:1479468914182; b=sruc%23eLM!Mr%3C7qkk%7DH%3DQco%7Bc%2B2%40%25l%3Ajp!0%2BIgs%3DbktW-v)Ls-8%3F%26%3DUud*KH%2BJ7o%3FI%7Bey%40yw%2Bno0%5E-C; yandexuid=1967064511438825261; yp=1506311339.dswa.0#1506311339.dsws.1#1506311339.dwbs.1#1786447097.multib.1#1495260492.szm.1_00:1366x768:1366x382#1794832121.udn.cDprb2tvdmlucGF2ZWw%3D#1482060905.ygu.1#1482066030.los.1#1482066030.losc.0; L=W05mcX56R35AAAJQeUN3fn9DVnRiZ3FNWjcPJEcLLSYvExZf.1479472121.12777.339227.5fef3631e8ead76dfb2f8f9b9443e929; yabs-frequency=/4/0G0007FdBbW00000/vqAmS4GdHm00/; fuid01=55cdae8e48b47604.kVzye6Z3aX5pbPlTUi86z0oqTEhNBSvuY8GpbWExIPjORYuwZ38ib9-72vf6nh4l7S9Sux4B8Tm-TIlxY2R022KBiD7fX3Pltg-82MLPhVWorV0zl3-vYAznQdZuSViJ; _ym_uid=1471087418270186435; i=wtVy0WCXMXa7CqQqGJ/5YvGV46yPSDTsZN6K2W8iqcrC6JoOihdo3AqVANRiQFfHoC/JyKGVwMhmHK7Y5OfCBJ3/O60=; _ym_isad=2; ys=udn.cDprb2tvdmlucGF2ZWw%3D#ymrefl.475B84EE4E65511F#wprid.1479474023775569-17633534388591544268109690-sas1-5631; yandex_gid=213; zm=m-white_bender.flex.css-https%3Awww_c6ukOczMvq6ZvHdLfOagrhVupHs%3Al'
		}
	};

	if (proxyUrl) {
		requestOptions.proxy = proxyUrl;
	}
	if (userAgent) {
		requestOptions.headers['user-agent'] = userAgent;
	}

	return (0, _syncRequest2.default)(localItemOptions.method, localItemOptions.path, requestOptions).getBody().toString();
}

function getMsid() {
	return '&msid=' + Math.floor(Math.random() * 2000000000) + '.' + Math.floor(Math.random() * 70000) + '.' + Math.floor(Math.random() * 70000) + '.' + Math.floor(Math.random() * 70000);
}

function getRandProxyUrl() {
	if (!randProxyUrls.length) {
		randProxyUrls = mainProxyUrls.slice();
	}

	return randProxyUrls.splice(Math.floor(Math.random() * randProxyUrls.length), 1);
}

function randElement(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getDelay() {
	return Math.floor(3000 + (Math.random() * 2000 - 1000));
}

function customSleep(delay) {
	var waitTill = new Date(new Date().getTime() + delay);

	while (waitTill > new Date()) {}
}

function successRequest($) {
	return $('title').text() !== 'Ой!' && $('h1.title').text() !== 'ой...';
}