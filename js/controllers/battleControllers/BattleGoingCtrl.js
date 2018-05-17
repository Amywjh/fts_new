//对战js***********************************************
define(["app"],function(app){
	"use strict";
	function ctrl($scope, $stateParams, $rootScope, $location, $ionicHistory, $timeout, $ionicLoading, $templateCache, $interval,Battle,RTAll) {	
		$scope.playId=$stateParams.playId;//玩法，2三人战，3经典战
		$scope.bonusPlan = function(){
			var url = "tab/common/bonusPlan/" + $stateParams.roomId +"/false";
			Battle.bonusPlan($stateParams.roomId).then(function(data){
				if(data.code==0){
					$location.path(url);
				}
			},function(error){
				
			})
		}
		$scope.getLineup = function(userId){
			$ionicLoading.show();
			Battle.battleLineup($stateParams.roomId,userId).then(function(data){
				if(!data.code){
					sessionStorage.setItem('lineupShowItem',JSON.stringify(data));
					var url = "tab/battle/lineup/Linupshow/" + $stateParams.roomId +"/"+userId +"/1";
					$location.path(url);
					$ionicLoading.hide();				
				}else{
					$ionicLoading.hide();
				}
			})
		}
		//经典战************************************************************
		if ($stateParams.playId == 3){
			TALKWATCH("经典战进行中详情");
			Battle.lineupNostartEle($stateParams.roomId).then(function(data){
				if(data.code==0){
					data.data.countDown = getCountTime(data.data.prizeTimeStamp);
					$scope.roomDetial = data.data;
					var timerClassicsPrize = setInterval(function(){//预计开奖时间
						$scope.roomDetial.countDown = getCountTime(data.data.prizeTimeStamp);
						$scope.$on("$ionicView.leave",function(){
							clearInterval(timerClassicsPrize);
						})
					},60000)
					$scope.home_title = $scope.roomDetial.name;
					$scope.getLive();
				}
			},function(error){
	
			})
	
		}
		$scope.getLive = function(){
			var classLive = function(message){
				if(!message.prizing){
			    	if(message.matchList.length>0 && message.userList.length>0){
			    		var nowUserId = Number(sessionStorage.getItem("userId_short"));
						$scope.roomGoingData = message;
						angular.forEach($scope.roomGoingData.userList,function(dd,index){
							if(dd.userId == nowUserId){//
								dd.rank = index+1;
								$scope.roomGoingData.mine = dd;
							}
						})
						angular.forEach($scope.roomGoingData.matchList,function(con,index){
							con.startTimeFormat = 0;
							if(con.status<=2 && con.status!=1){
								con.statusMsg = "未开始";
							}else if(con.status>=5){
								con.statusMsg = "已结束";
							}else if(con.status==1){
								con.statusMsg = "比赛延期";
								if(con.startTime){
									con.statusMsg = con.statusMsg +"至";
									var startTimeFormat = gettimeform(con.startTime);
									con.startTimeFormat = startTimeFormat.month +"月" + startTimeFormat.dates +"日";
								}
							}
						})
					}
				}
			}
			//  11v11推送处理
			$scope.connectLive(0,$stateParams.roomId,false,classLive);
		}
		$scope.goEventPath = function(matchId){//11v11重要事件跳转
			$ionicLoading.show();
			RTAll.matchEvent(matchId).then(function(data){
				if(!data.code){
					sessionStorage.setItem("eventData",JSON.stringify(data.data));
					var _url = "tab/battle/battle-timeAxis/" + $stateParams.roomId +"/"+ matchId +"/" + 1 +"/";
					$timeout(function(){
						$location.path(_url);
						$ionicLoading.hide();
					},500)
				}else{
					sessionStorage.removeItem("eventData");
					$ionicLoading.hide();
				}
			})
		}
	   	$scope.$on("$ionicView.beforeLeave",function(){
		})
	}
	ctrl.$inject = ["$scope", "$stateParams", "$rootScope", "$location", "$ionicHistory", "$timeout", "$ionicLoading", "$templateCache", '$interval', "Battle","RTAll"];
		app.registerController("BattleGoingCtrl",ctrl);//return ctrl;
})
