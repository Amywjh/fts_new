define(["app"],function(app){
	"use strict";
	function ctrl($scope, $location, $stateParams, Hall) {
		$scope.playerlist = function() {
			history.go(-1)
			TALKWATCH("传统房玩家列表-返回");
		}
		$scope.headTitle = "经典战大厅";
		var playerlist = sessionStorage.getItem("playerList");
		if (playerlist) {
			$scope.roomDetial = JSON.parse(playerlist);
		} else {
			Hall.playershow($stateParams.roomId).then(function(data) {
				$scope.roomDetial = data;
			});
		}
	}
	ctrl.$inject = ["$scope", "$location", "$stateParams", "Hall"];
		app.registerController("JoinPlayerCtrl",ctrl);//return ctrl;
})