'use strict';

var app = angular.module('app', [
	'ui.router',
	'ngStorage',
	'app.auth',
	'app.admin'
]).config(['$urlRouterProvider', '$locationProvider',
	function ($urlRouterProvider, $locationProvider) {

		$urlRouterProvider.otherwise('/admin');
		$locationProvider.html5Mode(true);

	}
]);
app.constant('config', {
	apiUrl: '/api/',
	$storage: null
});
app.run(['$rootScope', '$state', '$stateParams', 'config', '$localStorage', '$location', 'ApiService',
	function ($rootScope, $state, $stateParams, $config, $localStorage, $location, $apiService) {

		log("©Bravento.com");

		$config.$storage = $localStorage;
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

		var loginData = $apiService.getLoginData();

		if (loginData.uid === null || loginData.uid === undefined || loginData.token === null || loginData.token === undefined) {
			if ($location.$$path != '/auth/login') $location.path('/auth/login');
		} else {
			if ($location.$$path == '/auth/login') $location.path('/');
		}
	}
]);