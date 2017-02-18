'use strict';

angular.module('app.auth', [
	'ui.router',
	'ui.materialize',
	'app.auth.login'
]).config(['$stateProvider',
	function ($stateProvider) {
		$stateProvider.state('auth', {
			abstract: true,
			url: '/auth',
			templateUrl: '/static/app/auth/layout.html'
		});
	}
]);