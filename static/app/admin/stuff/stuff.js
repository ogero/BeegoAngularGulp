'use strict';

angular.module('app.admin.stuff', [
	'ui.router',
	'ui.materialize'
]).config(['$stateProvider',
	function ($stateProvider) {
		$stateProvider.state('admin.stuff', {
			url: '/stuff',
			templateUrl: '/static/app/admin/stuff/stuff.html',
			controller: ['$scope', 'ApiService',
				function ($scope, $apiService) {
				}],
			data: {
				breadcrumbs: [{title: "Stuff", sref: ""}]
			}
		}).state('admin.stuff-detail', {
			url: '/stuff/:stuffId',
			templateUrl: '/static/app/admin/stuff/stuff.detail.html',
			controller: ['$scope', 'ApiService', '$stateParams',
				function ($scope, $apiService, $stateParams) {
					$scope.stuffId = $stateParams.stuffId;
				}],
			data: {
				breadcrumbs: [{title: "Stuff", sref: "admin.stuff()"}, {title: "Detail", sref: ""}]
			}
		});
	}
]);