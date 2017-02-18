'use strict';

angular.module('app.admin', [
	'ui.router',
	'ui.materialize',
	'app.admin.dashboard',
	'app.admin.stuff'
]).config(['$stateProvider',
	function ($stateProvider) {
		$stateProvider.state('admin', {
			abstract: true,
			url: '/admin',
			templateUrl: '/static/app/admin/layout.html',
			controller: ['$state', '$scope', 'ApiService',
				function ($state, $scope, $apiService) {
					$scope.breadcrumbs = $state.current.data.breadcrumbs;
					$scope.pageTitle = $state.current.data.pageTitle;
					var loginData = $apiService.getLoginData();
					$scope.userName = loginData.name;
					$scope.userEmail = loginData.email;
					$scope.logout = function () {
						$apiService.userLogout().then(function (response) {
							Materialize.toast("Goodbye!", 1000, '', function () {
								window.location = '/';
							});
						}, function (response) {
							Materialize.toast(response.data, 4000);
						});
					};
				}],
			data: {
				breadcrumbs: null,
			}
		});
	}
]);