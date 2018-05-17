
define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$location) {
		$scope.helpCon = function(helpIndex){
			$location.path("/tab/wode/help/second/"+helpIndex);
		}
		
	}
	ctrl.$inject = ["$scope","$location"];
	app.registerController("wdhelpCtrl",ctrl);//return ctrl;
})