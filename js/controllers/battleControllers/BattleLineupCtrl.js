//对战js***********************************************
define(["app"],function(app){
	"use strict";
	function ctrl($scope, $stateParams, $rootScope, $location, $ionicHistory, $timeout, $ionicLoading, $templateCache, $interval, LineUp, Thr, Hall,Battle) {
		$scope.back_title = "赛况";
		$scope.playId = $stateParams.playId;
		if($stateParams.matchId){
			$scope.back_title = "赛况";
			$scope.return = function() {//返回
				//		$stateParams.playId 0传统房，1球星对战  2  三人战
				//		matchId  0英超  1中超
				//		tabId    0未开始  1进行中    2已结束
				TALKWATCH("3人战修改阵容-返回键");
				$ionicLoading.show();
				$scope.path = "/tab/battle/" + $stateParams.playId + "/" + $stateParams.matchId + "/0"; //
				$location.path($scope.path);
				$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
					sessionStorage.removeItem("thrjoinroomdata")
					$ionicLoading.hide();
				})
			}
		}else{
			$scope.back_title = "大厅";
			$scope.return = function() {
				history.go(-1)
			}
		}
		
	
		$scope.showRule = function() { //规则详情
			if ($stateParams.playId == 2) { //三人战
//				$location.path("/tab/thrvsthr/rule/");
			} else if ($stateParams.playId == 3) { //经典战
			}
	
		}
		$scope.rewardHelp = function(fee){
			if(!fee || fee==0) return;
			$scope.alertShut();
		}
		$scope.moreBonus = function(roomId,isNoStart){
			var url = "/tab/common/bonusPlan/"+ $stateParams.roomId +"/" +isNoStart;
			$location.path(url);
		}
		$scope.activated_slide = 0;
		$(".myroom_detial_tabs").find(".myroom_detial_tabItem").eq($scope.activated_slide).addClass("activat");
		$(".myroom_detial_tabItem").on("click", function(e){
			$(this).siblings().removeClass("activat");
			$(this).addClass("activat")
			$scope.activated_slide = $(this).index();
			$scope.$apply();
		})
	
		//	三人战****************************************************************
		if ($stateParams.playId == 2){
			var roomDetial = sessionStorage.getItem("roomDetial");
			if(roomDetial){
				var data = JSON.parse(roomDetial);
				data.data.prices.first = toThousands(data.data.prices.first);
				data.data.prices.second = toThousands(data.data.prices.second);
				data.data.prices.third = toThousands(data.data.prices.third);
				$scope.roomDetial = data;
				console.log($scope.roomDetial);
			}else{
				Battle.lineupNostart($stateParams.roomId).then(function(data){
					if(data.code==0){
						data.data.prices.first = toThousands(data.data.prices.first);
						data.data.prices.second = toThousands(data.data.prices.second);
						data.data.prices.third = toThousands(data.data.prices.third);
						$scope.roomDetial = data.data;
						$scope.home_title = $scope.roomDetial.name;
					}
				},function(error){
					
				})
			}
			//	获得当前的玩法，调用不能的接口
			var playId = parseInt($stateParams.playId);
			switch (playId) {//0经典房，1 球星对战  2三人战
				case 2:
					var lineup_thr = sessionStorage.getItem("lineup_thr");
					if (lineup_thr) {
						$scope.lineup = lineup_act(JSON.parse(lineup_thr), playId);
					} else {
						Thr.lineup($stateParams.roomId).then(function(data) {
							if (data.code == 0) {
								sessionStorage.setItem("lineup_thr", JSON.stringify(data));
								$scope.lineup = lineup_act(data, playId);
							} else {
								$ionicLoading.hide();
							}
						}, function(error) {
							$timeout(function() {
								$ionicLoading.hide();
							}, 500)
						})
					}
					break;
				default:
					break;
			}
			
				// 修改阵容
			$scope.zrxz_tj = function() {
				if($scope.lineup.data[2]){
					TALKWATCH("3人战完善阵容");
				}else{
					TALKWATCH("3人战修改阵容");
				}
				
				$ionicLoading.show();
				Thr.getPlayers($stateParams.roomId).then(function(data) {
					if (data.code == 0) {
						sessionStorage.setItem("thr_players", JSON.stringify(data));
						sessionStorage.setItem("lineup_thr_work", '');
						var roomId = $stateParams.roomId; //房间号
						var playId = $stateParams.playId; //玩法
						$timeout(function(){
							var path = "#/tab/main/thrvsthr/lineupshow/" + roomId + "/" + playId + "/" + $stateParams.matchId + "/" + false;
							history.replaceState({},"",path);
							$ionicLoading.hide();
						},500)
	//					history.pushState({},"",path);
					} else {
						$ionicLoading.hide();
					}
		
				}, function(error) {
					$ionicLoading.hide();
				})
			}
		}
	
	
		//经典战************************************************************		
			var lineup_classics = function (data){
				var _onlyShare = gettimeform(data.shareMatchTime); 
				data.shareDate = _onlyShare.month+"月"+_onlyShare.dates+"日";
				// 提示房主信息页面返回
				if($ionicHistory.currentStateName() == "tab.battle-lineup"){
					var shareTitle = localStorage.getItem("nickName") +"邀请你参与" + data.shareDate + data.leagueName+"阵容竞猜";
					$scope.creatShare(false,shareTitle,null,"StarKings，专业足球阵容竞猜游戏，赢了就有钱",$stateParams.roomId);
				}
				data.roomId = $stateParams.roomId;
				data.prices.predictFirst = toThousands(data.prices.predictFirst);
				data.prices.predictSecond = toThousands(data.prices.predictSecond);
				data.prices.predictThird = toThousands(data.prices.predictThird);
				data.prices.realFirst = toThousands(data.prices.realFirst);
				data.prices.realSecond = toThousands(data.prices.realSecond);
				data.prices.realThird = toThousands(data.prices.realThird);
				data.countDown = getCountTime(data.matchStartTimeStamp);
				$scope.notFull = false;
				$scope.lineupcontent = {};
				$scope.lineupcontent.one = [];
				$scope.lineupcontent.two = [];
				$scope.lineupcontent.thr = [];
				$scope.lineupcontent.for = [];
				$scope.ids = data.matchIds.join(",");
				var model_data = {
					"numone": "",
					"numtwo": "",
					"headIcon": "",
					"id": "",
					"name": "",
				};
				if(data.lineUp == null && data.formation == null){
					$scope.liupfamid = "4-4-2";
					$scope.liupimg = "0_1";
					$scope.notFull = true;
					for (var i = 0; i < 2; i++) {
						$scope.lineupcontent.one.push(model_data)
					}
					for (var i = 0; i < 4; i++) {
						$scope.lineupcontent.two.push(model_data)
					}
					for (var i = 0; i < 4; i++) {
						$scope.lineupcontent.thr.push(model_data)
					}
					for (var i = 0; i < 1; i++) {
						$scope.lineupcontent.for.push(model_data)
					}
				}else{
					$scope.liupfamid = data.formation.fmt_name;
					$scope.liupimg = data.formation.fmt_type -1 +"_1";
					if(data.lineUp.lineUp == 0 || data.lineUp.lineUp ==null){
						$scope.notFull = true;
					}
					if (data.lineUp.lineUp != 0){
						$scope.notFull = false;
						angular.forEach(data.lineUp, function(data_s, index_s) {
							lineup_qudh(data_s.shirt_num, data_s) //球衣号码
							switch(data_s.positionDisplay){
								case 1:
									$scope.lineupcontent.one.push(data_s);
								break;
								case 2:
									$scope.lineupcontent.two.push(data_s);
								break;
								case 3:
									$scope.lineupcontent.thr.push(data_s);
								break;
								case 4:
									$scope.lineupcontent.for.push(data_s);
								break;
							}
						})
					}
					switch (data.formation.fmt_type) {
						case 1:
							var len_one = $scope.lineupcontent.one.length;
							for (var i = 0; i < 2-len_one; i++) {
								$scope.lineupcontent.one.push(model_data)
							}
							var len_two = $scope.lineupcontent.two.length;
							for (var i = 0; i < 4-len_two; i++) {
								$scope.lineupcontent.two.push(model_data);
							}
							var len_thr = $scope.lineupcontent.thr.length;
							for (var i = 0; i < 4-len_thr; i++) {
								$scope.lineupcontent.thr.push(model_data);
							}
							var len_for = $scope.lineupcontent.for.length;
							for (var i = 0; i < 1-len_for; i++) {
								$scope.lineupcontent.for.push(model_data);
							}
							break;
						case 2:
							var len_one = $scope.lineupcontent.one.length;
							for (var i = 0; i < 1-len_one; i++) {
								$scope.lineupcontent.one.push(model_data)
							}
							var len_two = $scope.lineupcontent.two.length;
							for (var i = 0; i < 5-len_two; i++) {
								$scope.lineupcontent.two.push(model_data);
							}
							var len_thr = $scope.lineupcontent.thr.length;
							for (var i = 0; i < 4-len_for; i++) {
								$scope.lineupcontent.thr.push(model_data);
							}
							var len_for = $scope.lineupcontent.for.length;
							for (var i = 0; i < 1-len_for; i++) {
								$scope.lineupcontent.for.push(model_data);
							}
							break;
						case 3:
							var len_one = $scope.lineupcontent.one.length;
							for (var i = 0; i < 1-len_one; i++) {
								$scope.lineupcontent.one.push(model_data)
							}
							var len_two = $scope.lineupcontent.two.length;
							for (var i = 0; i < 4-len_two; i++) {
								$scope.lineupcontent.two.push(model_data);
							}
							var len_thr = $scope.lineupcontent.thr.length;
							for (var i = 0; i < 5-len_for; i++) {
								$scope.lineupcontent.thr.push(model_data);
							}
							var len_for = $scope.lineupcontent.for.length;
							for (var i = 0; i < 1-len_for; i++) {
								$scope.lineupcontent.for.push(model_data);
							}
							break;
						case 4:
							var len_one = $scope.lineupcontent.one.length;
							for (var i = 0; i < 2-len_one; i++) {
								$scope.lineupcontent.one.push(model_data)
							}
							var len_two = $scope.lineupcontent.two.length;
							for (var i = 0; i < 3-len_two; i++) {
								$scope.lineupcontent.two.push(model_data);
							}
							var len_thr = $scope.lineupcontent.thr.length;
							for (var i = 0; i < 5-len_for; i++) {
								$scope.lineupcontent.thr.push(model_data);
							}
							var len_for = $scope.lineupcontent.for.length;
							for (var i = 0; i < 1-len_for; i++) {
								$scope.lineupcontent.for.push(model_data);
							}
							break;
						case 5:
							var len_one = $scope.lineupcontent.one.length;
							for (var i = 0; i < 3-len_one; i++) {
								$scope.lineupcontent.one.push(model_data)
							}
							var len_two = $scope.lineupcontent.two.length;
							for (var i = 0; i < 3-len_two; i++) {
								$scope.lineupcontent.two.push(model_data);
							}
							var len_thr = $scope.lineupcontent.thr.length;
							for (var i = 0; i < 4-len_for; i++) {
								$scope.lineupcontent.thr.push(model_data);
							}
							var len_for = $scope.lineupcontent.for.length;
							for (var i = 0; i < 1-len_for; i++) {
								$scope.lineupcontent.for.push(model_data);
							}
							break;
						case 6:
							var len_one = $scope.lineupcontent.one.length;
							for (var i = 0; i < 2-len_one; i++) {
								$scope.lineupcontent.one.push(model_data)
							}
							var len_two = $scope.lineupcontent.two.length;
							for (var i = 0; i < 5-len_two; i++) {
								$scope.lineupcontent.two.push(model_data);
							}
							var len_thr = $scope.lineupcontent.thr.length;
							for (var i = 0; i < 3-len_for; i++) {
								$scope.lineupcontent.thr.push(model_data);
							}
							var len_for = $scope.lineupcontent.for.length;
							for (var i = 0; i < 1-len_for; i++) {
								$scope.lineupcontent.for.push(model_data);
							}
							break;
						case 7:
							var len_one = $scope.lineupcontent.one.length;
							for (var i = 0; i < 3-len_one; i++) {
								$scope.lineupcontent.one.push(model_data)
							}
							var len_two = $scope.lineupcontent.two.length;
							for (var i = 0; i < 4-len_two; i++) {
								$scope.lineupcontent.two.push(model_data);
							}
							var len_thr = $scope.lineupcontent.thr.length;
							for (var i = 0; i < 3-len_for; i++) {
								$scope.lineupcontent.thr.push(model_data);
							}
							var len_for = $scope.lineupcontent.for.length;
							for (var i = 0; i < 1-len_for; i++) {
								$scope.lineupcontent.for.push(model_data);
							}
							break;
					}
				}
			}
		
		if ($stateParams.playId == 3) {
			var sessionLineup = sessionStorage.getItem("battle_lineup");
			if(sessionLineup){
				var data = JSON.parse(sessionLineup);
				data.matchStartDate = data.matchStartTime.substr(0,6);
				$scope.roomDetial = data;
				var timeStamp = new Date().getTime();
				angular.forEach($scope.roomDetial.userList,function(array,index){
					array.photo = array.photo+"?"+timeStamp;
				})
				$scope.home_title = $scope.roomDetial.name;
				lineup_classics(data);
			}else{
				Battle.lineupNostartEle($stateParams.roomId).then(function(data){
					if(data.code==0){
						data.data.matchStartDate = data.data.matchStartTime.substr(0,6);
						$scope.roomDetial = data.data;
						var timeStamp = new Date().getTime();
						angular.forEach($scope.roomDetial.userList,function(array,index){
							array.photo = array.photo+"?"+timeStamp;
						})
						$scope.home_title = $scope.roomDetial.name;
						lineup_classics(data.data);
					}
				},function(error){
					
				})
			}
			//对战未开始修改阵容后跳转
			$scope.battle_lineup = function(roomUserId){
				$ionicLoading.show();
				var LineUpState = {
					"roomId": $stateParams.roomId,//房间id
				}
				LineUp.battleUpdateLineup(LineUpState).then(function(data){
					if(data.code==0){
						sessionStorage.setItem("battle_lineup_xg", JSON.stringify(data.data));
						var playId = $stateParams.playId; //玩法
						var lineId = data.data.lineupMsg?(data.data.lineupMsg.formation?data.data.lineupMsg.formation.fmt_type:1):1;
						$timeout(function(){
							var matchId='',path ='';
							TALKWATCH("经典战修改阵容或完善阵容");
							if($stateParams.fromId == 0){
								path = "#/tab/lineup/ksbz/" + 4 + "/" + $stateParams.roomId + "/" + null + "/"　 + lineId　 + 　"/" + matchId;
							}else{
								path = "#/tab/lineup/ksbz/" + 2 + "/" + $stateParams.roomId + "/" + null + "/"　 + lineId　 + 　"/" + matchId;
							}
		//					$location.path(path);
							history.replaceState({},"",path);
						},500)
						$rootScope.$on('$routeChangeSuccess', function() { //返回前页时，刷新前页
							$ionicLoading.hide();
						});
					}else{
						$scope.toast("系统繁忙，请稍后重试");
					}
				}, function(error) {
					$timeout(function() {
						$ionicLoading.hide();
					}, 500)
				})
			}
		}
	}
	ctrl.$inject = ["$scope", "$stateParams", "$rootScope", "$location", "$ionicHistory", "$timeout", "$ionicLoading", "$templateCache", '$interval', "LineUp", "Thr", "Hall","Battle"];
	app.registerController("BattleLineupCtrl",ctrl);
		//return ctrl;
})
function lineup_act(data, kind) {//三人战和匹配战和擂台战的方法
	if (data.data) {
		if (kind == 2) {
			var len = 3;
		}
		var lineup = [];
		var nowNum = 0;
		angular.forEach(data.data.players, function(eachData, index) {
			if (eachData) {
				nowNum++;
				eachData.torch = []; //热度
				var num = eachData.hot;
				for (var i = 0; i < num; i++) {
					eachData.torch.push(i)
				}
				lineup_qudh(eachData.shirtNum, eachData);
				lineup.push(eachData);
			}
		})
		if (lineup.length < len) { //如果阵容不完善
			var cha = len - lineup.length;
			for (var i = 0; i < cha; i++) {
				lineup.push('');
			}
		}
		if (data.data.room.league == 0) {
			var leagueName = "英超"
		} else if (data.data.room.league == 1) {
			var leagueName = "中超"
		}
		return {
			"num": nowNum,
			"maxNum": len,
			"title": data.data.room.deadTimeDisplay,
			"league": leagueName,
			"round": data.data.room.round,
			"data": lineup
		};
	}
}