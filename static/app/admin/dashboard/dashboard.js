'use strict';

angular.module('app.admin.dashboard', [
	'ui.router',
	'ui.materialize'
]).config(['$stateProvider',
	function ($stateProvider) {
		$stateProvider.state('admin.dashboard', {
			url: '',
			templateUrl: '/static/app/admin/dashboard/dashboard.html',
			controller: ['$scope', 'ApiService',
				function ($scope, $apiService) {
					$scope.userTestBadToken = function () {
						$apiService.userTestBadToken().then(function (response) {
							Materialize.toast(response.data, 4000);
						}, function (response) {
							Materialize.toast(response.data, 4000);
						});
					};
				}],
			data: {
				breadcrumbs: [{title: "Dashboard", sref: ""}],
			}
		});
	}
]);