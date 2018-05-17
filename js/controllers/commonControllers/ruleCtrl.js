define(["app"],function(app){
	"use strict";
	function ctrl($scope, $location, $ionicLoading, $timeout, $rootScope,$ionicModal,$ionicPopup) {
	    //位置切换
	    	$scope.dimension = [{
				"name": '进球（个）',
				"value": 6
			},
			{
				"name": '助攻（次）',
				"value": 4
			},
			{
				"name": '射门（次）',
				"value": 0.5
			},
			{
				"name": '射正（次）',
				"value": 1.5
			},
			{
				"name": '威胁球（个）',
				"value": 1.5
			},
			{
				"name": '传球成功（次）',
				"value": 0.05
			},
			{
				"name": '传中成功（次）',
				"value": 0.5
			},
			{
				"name": '过人（次）',
				"value": 0.5
			},
			{
				"name": '被犯规（次）',
				"value": 0.5
			},
			{
				"name": '抢断（次）',
				"value": 0.5
			},
			{
				"name": '传球拦截（次）',
				"value": 0.5
			},
			{
				"name": '封堵（次）',
				"value": 0.5
			},
			{
				"name": '解围（次）',
				"value": 0.5
			},
			{
				"name": '犯规（次）',
				"value": -0.25
			},
			{
				"name": '犯规造点（次）',
				"value": -1
			},
			{
				"name": '点球罚失（个）',
				"value": -3
			},
			{
				"name": '乌龙 （个）',
				"value": -3
			},
			{
				"name": '黄牌（个）',
				"value": -2
			},
			{
				"name": '红牌（个）',
				"value": -5
			}
		]
		$scope.guard = [{
				"name": '进球（个）',
				"value": 6
			},
			{
				"name": '助攻（次）',
				"value": 4
			},
			{
				"name": '射门（次）',
				"value": 0.5
			},
			{
				"name": '射正（次）',
				"value": 1.5
			},
			{
				"name": '威胁球（个）',
				"value": 1.5
			},
			{
				"name": '传球成功（次）',
				"value": 0.05
			},
			{
				"name": '传中成功（次）',
				"value": 0.5
			},
			{
				"name": '过人（次）',
				"value": 0.5
			},
			{
				"name": '被犯规（次）',
				"value": 0.5
			},
			{
				"name": '抢断（次）',
				"value": 0.5
			},
			{
				"name": '传球拦截（次）',
				"value": 0.5
			},
			{
				"name": '封堵（次）',
				"value": 0.5
			},
			{
				"name": '解围（次）',
				"value": 0.5
			},
			{
				"name": '不失球（上场满90分）',
				"value": 3
			},
			{
				"name": '犯规（次）',
				"value": -0.25
			},
			{
				"name": '犯规造点（次）',
				"value": -1
			},
			{
				"name": '点球罚失（个）',
				"value": -3
			},
			{
				"name": '乌龙 （个）',
				"value": -3
			},
			{
				"name": '黄牌（个）',
				"value": -2
			},
			{
				"name": '红牌（个）',
				"value": -5
			}
		]
		$scope.goalkeeper = [{
				"name": '进球（个）',
				"value": 6
			},
			{
				"name": '传球成功（次）',
				"value": 0.05
			},
			{
				"name": '扑救（次）',
				"value": 1.5
			},
			{
				"name": '成功出击（次）',
				"value": 1
			},
			{
				"name": '被犯规（次）',
				"value": 0.5
			},
			{
				"name": '解围（次）',
				"value": 0.5
			},
			{
				"name": '摘高空球（次）',
				"value": 0.5
			},
			{
				"name": '点球扑救（个）',
				"value": 3
			},
			{
				"name": '不失球（上场满90分）',
				"value": 6
			},
			{
				"name": '犯规造点（次）',
				"value": -1
			},
			{
				"name": '被失球（个）',
				"value": -1
			},
			{
				"name": '点球罚失（个）',
				"value": -3
			},
			{
				"name": '乌龙（个）',
				"value": -3
			},
			{
				"name": '黄牌（个）',
				"value": -2
			},
			{
				"name": '红牌（个）',
				"value": -5
			},
		]
		$(".positionAll .pos").eq(0).addClass("activated");
		$scope.dimensionActivated = $scope.dimension;
		$(".pos").on("click", function(e) {
			$(this).siblings().removeClass("activated");
			$(this).addClass("activated");
			if($(this).index() == 0) {
				$scope.dimensionActivated = $scope.dimension;
				$scope.$apply();
			} else if($(this).index() == 1) {
				$scope.dimensionActivated = $scope.guard;
				$scope.$apply();
			} else if($(this).index() == 2) {
				$scope.dimensionActivated = $scope.goalkeeper;
				$scope.$apply();
			}
			//		console.log($(this).index())
		}) 		
	}
	ctrl.$inject = ["$scope", "$location", "$ionicLoading", "$timeout", "$rootScope","$ionicModal","$ionicPopup"];
	app.registerController("ruleCtrl",ctrl);
//	return ctrl;
	
})