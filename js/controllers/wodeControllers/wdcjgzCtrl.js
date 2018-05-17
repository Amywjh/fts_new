
define(["app"], function(app) {
	"use strict";
	function ctrl($scope, $stateParams, $location, Wode) {
		$scope.back_title = "返回";
		$scope.home_title = "等级";
		$scope.showRule = function() {
			$location.path("/tab/achieve/rule/")
		}
		$scope.return = function() {
			history.back();
		}
			// 经验说明
		$scope.cjgzdata = [
			{'name': '参与竞技（10+以上用户参与）','number': '10'},
			{'name': '获得前3名','number': '40'},
			{'name': '获得前25%排名','number': '15'}, 
			{'name': '获得前50%','number': '5'}, 
			{'name': '单人场(少于10人用户参与) ','number': '1'}, 
			{'name': '参与竞技（竞猜房）','number': '5'}, 
			{'name': '获胜（竞猜房）','number': '10'},
		]
		// 经验说明
		$scope.cjgzdata = [{
				'name': '参与竞技（10+以上用户参与）',
				'number': '10'
			},
			{
				'name': '获得前3名',
				'number': '40'
			},
			{
				'name': '获得前25%排名',
				'number': '15'
			},
			{
				'name': '获得前50%',
				'number': '5'
			},
			{
				'name': '单人场(少于10人用户参与) ',
				'number': '1'
			},
			{
				'name': '参与竞技（竞猜房）',
				'number': '5'
			},
			{
				'name': '获胜（竞猜房）',
				'number': '10'
			},
		];
		 Wode.wode_cj().then(function(data) {
			if(data.code == 0) {
				//  背景颜色条
				$scope.cjdatazhu = data.data.achievement;
				// 个人头像  经验
				$scope.userdata = data.data;
				$scope.bl = parseInt(data.data.currExp) / parseInt(data.data.maxExp) * 100;
			}
		})
	}
	ctrl.$inject = ["$scope", "$stateParams", "$location", "Wode"];
	app.registerController("wdcjgzCtrl",ctrl);//return ctrl;
})