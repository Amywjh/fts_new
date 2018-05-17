//球星对战投票
define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$timeout,$location,$ionicHistory,$ionicLoading,$stateParams,$ionicModal,Prizes,Thr) {
		$scope.back_title = "返回";
		$scope.home_title="赛况";
		$scope.showRule = function(){
			$scope.showRules("prize");
		}
		$scope.$on('$destroy', function() {
	    	if($scope.awardAlertModal) $scope.awardAlertModal.remove();
		});
		//房间比赛数据
		var prizes_detial = JSON.parse(sessionStorage.getItem('prizes_detial'));
		if(prizes_detial && prizes_detial.code==0){
			$scope.prize = prizes_detial.data;
			lineup_qudh($scope.prize.home.shirtNum, $scope.prize.home)//球衣号码
			lineup_qudh($scope.prize.away.shirtNum, $scope.prize.away)//球衣号码
			$scope.prize = isShowWin($scope.prize);
		}else{
			Prizes.roomDetial($stateParams.prizesRoomId).then(function(data){
				if(data.code==0){
					$scope.prize = data.data;
					lineup_qudh($scope.prize.home.shirtNum, $scope.prize.home)//球衣号码
					lineup_qudh($scope.prize.away.shirtNum, $scope.prize.away)//球衣号码
					$scope.prize = isShowWin($scope.prize);
				}else{
					
				}
			},function(error){
				$ionicLoading.hide();
			})
		}
		if($stateParams.tabId==1){//进行中
			if($ionicHistory.currentStateName()=="tab.battle-prizes-going-detial") $scope.hidePrizesPre = true;//指令中支持率条的隐藏
			TALKWATCH("球星对战进行中详情")
			Prizes.playerData($stateParams.prizesRoomId).then(function(data){//球员维度数据
				if(data.code==0){
					$scope.playerData = data.data;
					$scope.getLive();
				}
			})	
		}else if($stateParams.tabId==2){//已结束
			$scope.detialEnd = true;
			TALKWATCH("球星对战已结束详情");
			Prizes.matchResult($stateParams.prizesRoomId).then(function(data){//球员维度数据
				if(data.code==0){
					$scope.prizeInfo = getScorePercent(data.data);
				}
			})
		}
		function isShowWin(data){//已结束赢奖弹窗提示
			if(data.resultType==1){//赢奖状态下
				var showWin;var prizesWin;
				data.totalCost = Number(data.homeCost+data.awayCost);//全部投注金额
				prizesWin = JSON.parse(localStorage.getItem("prizeResultWin"));
				if(prizesWin){//有提示历史记录
					if(loseTime(data.deadTime)){//7天前的比赛不再提示，并删除记录
						for(var i=0;i<prizesWin.length;i++){
							if(prizesWin[i]==data.id){
								prizesWin.splice(i,1);
							}
						}
						showWin = false;
					}else{//7天内的比赛，判断是否曾经有过提示
						showWin = true;
						for(var i=0;i<prizesWin.length;i++){
							if(prizesWin[i]==data.id){//有过提示则不再显示
								showWin = false;
							}
						}
						if(showWin) prizesWin.push(data.id);
					}
				}else{//没有提示历史记录
					if(!loseTime(data.deadTime)){//7天内的比赛处理提示
						var prizesWin = [data.id];
						showWin = true;
					}else{//7天前的比赛不提示
						showWin = false;
					}
				}
				localStorage.setItem("prizeResultWin",JSON.stringify(prizesWin));
			}
			if($stateParams.tabId==2){//球星对战已结束赢奖提示modal
				$ionicModal.fromTemplateUrl('templates/common/awardAlert.html', {
					scope: $scope
				}).then(function(modal){
					$scope.awardAlertModal = modal;
					if(showWin){
						$scope.awardAlertModal.show();
					}
					$scope.commit = function(){
						$scope.awardAlertModal.hide();
					}
				});
			}
			return data;
		}
		$scope.getLive = function(){
			$scope.connectLive(1,$stateParams.prizesRoomId,null,$scope.getEventMsg);
		}
		$scope.getEventMsg = function(data){
			if(!data.prizing){//待测试
				if(data.leftMatch.length>0 || data.rightMatch.length>0){
					$scope.prizesGoingData = data;
					if(data.leftMatch){
						data.leftMatch.homeTeamName = data.leftMatch.homeName;
						data.leftMatch.awayTeamName = data.leftMatch.awayName;
						data.leftMatch.statusDisplay = data.leftMatch.status;
						data.leftMatch.matchLengthWithMinute = data.leftMatch.length;
					}
					if(data.rightMatch){
						data.rightMatch.homeTeamName = data.rightMatch.homeName;
						data.rightMatch.awayTeamName = data.rightMatch.awayName;
						data.rightMatch.statusDisplay = data.rightMatch.status;
						data.rightMatch.matchLengthWithMinute = data.rightMatch.length;
					}
					if($scope.prize){
						$scope.prize.leftMatch = data.leftMatch;
						$scope.prize.rightMatch = data.rightMatch;
					}
					if(data.roomStatus==3) $scope.playing_noSendPirze = true;
				}
			}
		}
		
		function getScorePercent(data){//获得百分比
			data.homeResultPercent = {};
			data.awayResultPercent = {};
			angular.forEach(data.dimensions,function(item,index){
				if(data.home[index] || data.away[index]){
					data.home[index] = data.home[index]||0;
					data.away[index] = data.away[index]||0;
					var sum = Number(data.home[index]||0) + Number(data.away[index]||0);
					data.homeResultPercent[index] = (Number(data.home[index]||0)/sum)*100 +"%";
					data.awayResultPercent[index] = (1-Number(data.home[index]||0)/sum)*100 +"%";
				}
			})
			return data;
		}
		$scope.$on('$ionicView.beforeLeave', function(e){
			if($scope.conn && $scope.conn.isOpened()){
				$scope.conn.close();
			}
		});
	}
	ctrl.$inject = ["$scope","$timeout","$location","$ionicHistory","$ionicLoading","$stateParams",'$ionicModal','Prizes','Thr'];
		app.registerController("battlePrizesDetialCtrl",ctrl);//return ctrl;
})