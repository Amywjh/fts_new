
define(["app"], function(app) {
	"use strict";
	function ctrl($scope, $stateParams) {
		if($stateParams.helpIndex) $scope.whichRule = $stateParams.helpIndex;
//		$scope.wode_help = function() {
//			history.back();
//		}
	}
	ctrl.$inject = ['$scope', "$stateParams"];
	app.registerController("wdgzCtrl",ctrl);//return ctrl;
})