//对战js***********************************************
define(["app"],function(app){
	"use strict";
	function ctrl($scope, $stateParams, $rootScope, $location,  $ionicLoading,Battle) {
		$scope.bonusIsNoStart = $stateParams.isNoStart=="true"?true:false;
		if(!$scope.bonusIsNoStart){
			$scope.prizeName;
			Battle.bonusPlan($stateParams.roomId).then(function(data){
				if(data.code==0){
					$scope.prizeName ={
						"activity":data.data.activity,
					};
					if(data.data.activity){//活动房
						$scope.prizeName.name = "奖品";
						var cha  = data.data.lastWinningIndex - data.data.firstWinningIndex;
						$scope.bonusArr = [];
						for(var i=0;i<=cha;i++){
							cha = 0;//目前仅显示第一名
							$scope.bonusArr.push(data.data.prize_thing_pic);
						}
					}else if(data.data.prizeType){//免费房
						$scope.prizeName.name = "星钻";
						$scope.bonusArr = data.data.prize;
						$scope.prizeType = data.data.prizeType;
					}else{//普通房
						$scope.prizeName.name = "星币";
						$scope.bonusArr = data.data.prize || data.data;
					}
				}
			})
		}else{
			Battle.bonusPlanNoStart($stateParams.roomId).then(function(data){
				if(!data.code){
					$scope.bonusArr = data.data;
				}
			})
		}
	}
	ctrl.$inject = ["$scope", "$stateParams", "$rootScope", "$location", "$ionicLoading","Battle"];
	app.registerController("BonusPlanCtrl",ctrl);//return ctrl;
})
