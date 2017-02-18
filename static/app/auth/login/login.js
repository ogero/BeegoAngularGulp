'use strict';

angular.module('app.auth.login', [
	'ui.router',
	'ui.materialize'
]).config(['$stateProvider',
	function ($stateProvider) {
		$stateProvider.state('auth.login', {
			url: '/login',
			templateUrl: '/static/app/auth/login/login.html',
			controller: ['$scope', '$location', 'ApiService',
				function ($scope, $location, $apiService) {
					$scope.loginInputs = {};
					$scope.submitLogin = function () {
						$apiService.userLogin(
								$scope.loginInputs.username,
								$scope.loginInputs.password
						).then(function (response) {
							var user = response.data;
							Materialize.toast("Welcome " + user.Name + "!", 1000, '', function () {
								window.location = '/';
							});
						}, function (response) {
							Materialize.toast(response.data, 4000);
							$scope.loginInputs.password = '';
						});
					}
				}]
		});
	}
]);