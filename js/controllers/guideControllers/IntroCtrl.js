define(["app"], function(app) {
	"use strict";

	function ctrl($scope, $rootScope, $state, $timeout, $location, $stateParams) {
		$timeout(function() {
			$location.path("/tab/main").replace();
		}, 1000)
	}
	ctrl.$inject = ['$scope', '$rootScope', "$state", '$timeout','$location', "$stateParams"];
	app.registerController("IntroCtrl", ctrl);
})