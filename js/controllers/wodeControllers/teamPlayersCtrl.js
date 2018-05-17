define(["app"], function(app) {
	"use strict";
	function ctrl($scope, $ionicPopup, $stateParams,$location, $ionicLoading, $timeout, $rootScope,$ionicModal,Wode, Hall) {
		
		var teamPlayersinfor = JSON.parse(sessionStorage.getItem("teamPlayersinfor"));
		
		if(teamPlayersinfor){
			getPalyersinfor(teamPlayersinfor)
		}else{
			var listdata = {
				teamId:$stateParams.playerId,
		      	league:$stateParams.leagueId,
			}
			Wode.sch_teamAllPlayer(listdata).then(function(data){
				getPalyersinfor(data)
			})
		}
		
		function getPalyersinfor(getdata){
			if(getdata.code == 0){
				$scope.teamPlayers = getdata.data.playerInfo;
				$scope.teamInfo = getdata.data.teamInfo;
			}
		}
		
		
	}
	ctrl.$inject = ["$scope", "$ionicPopup","$stateParams", "$location", "$ionicLoading", "$timeout", "$rootScope","$ionicModal","Wode", "Hall"];
		app.registerController("teamPlayersCtrl",ctrl);//return ctrl;
})