'use strict';

app.factory('ApiService', [
	'$http',
	'$q',
	'config',
	function ($http, $q, $config) {

		var getLoginData = function () {
			return {
				token: $config.$storage.token,
				uid: $config.$storage.uid,
				name: $config.$storage.name,
				email: $config.$storage.email
			};
		};

		var setLoginData = function (uid, token, name, email) {
			$config.$storage.uid = uid;
			$config.$storage.token = token;
			$config.$storage.name = name;
			$config.$storage.email = email;
			log("User " + uid + " logged in");
		};

		var clearLoginData = function () {
			$config.$storage.uid = null;
			$config.$storage.token = null;
			$config.$storage.name = null;
			$config.$storage.email = null;
		};

		var _failure = function (response) {
			// This is the only HTTP code that WILL ALWAYS log user out
			if (response.status === 401) {
				clearLoginData();
				window.location = '/auth/login';
			}
		};

		var _call = function (method, url, config) {
			var loginData = getLoginData();
			if (loginData.token != null) $http.defaults.headers.common['Token'] = loginData.token;
			var deferred = $q.defer();
			$http(angular.extend({
				method: method,
				url: $config.apiUrl + url
			}, config)).then(function (response) {
				deferred.resolve(response);
			}, function (response) {
				_failure(response);
				deferred.reject(response);
			});
			return deferred.promise;
		};

		var _get = function (endpoint, config) {
			return _call('get', endpoint, config);
		};

		var _post = function (endpoint, config) {
			return _call('post', endpoint, config);
		};

		var userLogin = function (username, password) {
			var deferred = $q.defer();
			_get('user/login', {
				params: {
					username: username,
					password: password
				}
			}).then(function (response) {
				if (response.status === 200) {
					setLoginData(response.data.Id, response.data.Token, response.data.Name, response.data.Email);
				}
				deferred.resolve(response);
			}, deferred.reject);
			return deferred.promise;
		};

		var userLogout = function () {
			var deferred = $q.defer();
			_get('user/logout', {}).then(function (response) {
				if (response.status === 200) {
					clearLoginData();
				}
				deferred.resolve(response);
			}, deferred.reject);
			return deferred.promise;
		};

		var userTestBadToken = function () {
			return _get('user/testBadToken', {});
		};

		return ({
			getLoginData: getLoginData,
			userLogin: userLogin,
			userLogout: userLogout,
			userTestBadToken: userTestBadToken
		});
	}
]);