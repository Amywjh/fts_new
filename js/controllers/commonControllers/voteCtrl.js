//球星对战投票
define(["app"],function(app){
	"use strict";
	function ctrl($scope,$rootScope,$timeout,$location,$stateParams,$ionicHistory,$ionicLoading,Wode,Hall,Prizes) {
		//取消投票
		$scope.novote =function(){
			TALKWATCH ("竞猜投票-取消投票");
			$('.input_bg').css({display:"none"});
		}
		//确定投票
		$scope.commitvote = function(voteInfo){
			TALKWATCH ("竞猜投票-投票",voteInfo.isHome);
			$ionicLoading.show();			
			var money = $("#vote_num").val();//获取投票的值
			var reg = new RegExp("^[1-9]{1}[0-9]{0,4}$");
			var res = reg.test(money);//正则匹配的结果
			if (!res) {//判断如果不为整数的时候
				$scope.toastDark("请输入1-99999的整数");//调用输入错误的提示框
				$ionicLoading.hide();
				return;
			}
//			如果输入没有错误，调用接口prizes服务的vote方法，提交投票数据到服务器
			Prizes.vote(voteInfo.roomId,voteInfo.isHome,money).then(function(data){
				if(data.code ==0){
					TALKWATCH ("竞猜投票-成功",money);
					$scope.userInfoDetial();
					if(voteInfo.isList){//如果是list的投票
						if(voteInfo.dataName=="prizeall"){
							$scope.prizeall[voteInfo.index].joined = 1;
							$scope.prizeall[voteInfo.index].home.percent = data.data.homePercent;//主队支持率
							$scope.prizeall[voteInfo.index].away.percent = data.data.awayPercent;
							$scope.prizeall[voteInfo.index].homeExpectPrize = data.data.homeExpect;//主队1单位预期
							$scope.prizeall[voteInfo.index].awayExpectPrize = data.data.awayExpect;
							$scope.prizeall[voteInfo.index].homeTotalCost = data.data.homeTotalCost;//主队总投入
							$scope.prizeall[voteInfo.index].awayTotalCost = data.data.awayTotalCost;
							$scope.prizeall[voteInfo.index].prizePool = data.data.prizePool;//奖池
							if(voteInfo.isHome==true){
								TALKWATCH ("竞猜投票-成功",money,voteInfo.isHome);
								$scope.prizeall[voteInfo.index].homeCost = parseInt($scope.prizeall[voteInfo.index].homeCost) + parseInt(money);
							}else{
								TALKWATCH ("竞猜投票-成功",money,voteInfo.isHome);
								$scope.prizeall[voteInfo.index].awayCost = parseInt($scope.prizeall[voteInfo.index].awayCost) + parseInt(money);
							}
							var sessionPrizeall = {//原来的缓存prizes是带code值的
								code:0,
								data:$scope.prizeall
							}
							sessionStorage.setItem("prizes",JSON.stringify(sessionPrizeall));//缓存新list
						}else if(voteInfo.dataName=="battle_prizes"){
							$scope.battle_prizes[voteInfo.index].joined = 1;
							$scope.$apply();
							$scope.battle_prizes[voteInfo.index].home.percent = data.data.homePercent;//主队支持率
							$scope.battle_prizes[voteInfo.index].away.percent = data.data.awayPercent;
							$scope.battle_prizes[voteInfo.index].homeExpectPrize = data.data.homeExpect;//主队1单位预期
							$scope.battle_prizes[voteInfo.index].awayExpectPrize = data.data.awayExpect;
							$scope.battle_prizes[voteInfo.index].homeTotalCost = data.data.homeTotalCost;//主队总投入
							$scope.battle_prizes[voteInfo.index].awayTotalCost = data.data.awayTotalCost;
							$scope.battle_prizes[voteInfo.index].prizePool = data.data.prizePool;//奖池
							if(voteInfo.isHome==true){
								TALKWATCH ("竞猜投票-成功",money,voteInfo.isHome);
								$scope.battle_prizes[voteInfo.index].homeCost = parseInt($scope.battle_prizes[voteInfo.index].homeCost) + parseInt(money);
							}else{
								TALKWATCH ("竞猜投票-成功",money,voteInfo.isHome);
								$scope.battle_prizes[voteInfo.index].awayCost = parseInt($scope.battle_prizes[voteInfo.index].awayCost) + parseInt(money);
							}
							sessionStorage.setItem("battle_prizes",JSON.stringify($scope.battle_prizes));//缓存新list
						}
					}else{//如果是detial的投票
						$scope.prizesDetial.home.percent = data.data.homePercent;//主队支持率
						$scope.prizesDetial.away.percent = data.data.awayPercent;
						$scope.prizesDetial.homeExpectPrize = data.data.homeExpect;//主队1单位预期
						$scope.prizesDetial.awayExpectPrize = data.data.awayExpect;
						$scope.prizesDetial.homeTotalCost = data.data.homeTotalCost;//主队总投入
						$scope.prizesDetial.awayTotalCost = data.data.awayTotalCost;
						$scope.playerData.home.costRank = data.data.homeCostRank;//玩家投入排名前三
						$scope.playerData.away.costRank = data.data.awayCostRank;
						$scope.prizesDetial.prizePool = data.data.prizePool;//奖池
						if(voteInfo.isHome==true){
							TALKWATCH ("竞猜投票-成功",money,voteInfo.isHome);
							$scope.prizesDetial.homeCost = parseInt($scope.prizesDetial.homeCost) + parseInt(money);
						}else{
							TALKWATCH ("竞猜投票-成功",money,voteInfo.isHome);
							$scope.prizesDetial.awayCost = parseInt($scope.prizesDetial.awayCost) + parseInt(money);
						}
						sessionStorage.setItem("prizes_detial",JSON.stringify($scope.prizesDetial));//缓存新list
						if($stateParams.isMine=="false"){
							Prizes.all(1).then(function(prizesData){
								if(data.code==0){
									sessionStorage.setItem("prizes",JSON.stringify(prizesData));
								}else{
									sessionStorage.removeItem("prizes");
								}
							})		
						}else if($stateParams.isMine=="true"){
							$scope.playerId = 1; //玩法id
	//						$scope.matchId = $stateParams.matchId; //联赛id，要求默认为英超
							$scope.tabIndex = 0; //房间状态
							$scope.page = 1; //页码
							Prizes.matchList($scope.playerId,'', $scope.tabIndex, $scope.page).then(function(data){
								if(data.code==0){
									sessionStorage.setItem("battle_prizes", JSON.stringify(data.data));
								}else{
									sessionStorage.removeItem("battle_prizes");
								}
							}, function(error){
			
							})
						}
					}
					$ionicLoading.hide();
					$('.input_bg').css({display:"none"});
					$scope.toastDark("支持成功,祝你好运!","感觉胜券在握可以追加支持哦");
				}else{
					$ionicLoading.hide();
					TALKWATCH("竞猜投票-失败",data.data);
					if(data.code==1001){
						TALKWATCH("竞猜投票-钻石不足");
						$scope.chargeAction("钻石余额不足","取消","立即充值",true);
						return false;
					}else if(data.code==1006){
						TALKWATCH("竞猜投票-钻石不足");
						var msg = {"money":Number(data.data.diamond)};
						var callFun = function(){//兑换成功后回调
							$scope.commitvote(voteInfo);
						}
						$scope.onceExchange("星钻余额不足",msg,"兑换并支付",callFun);//调用兑换功能
						return false;
					}else{
						$scope.toastDark(data.data);
					}
				}
//				提交成功后隐藏输入框
			},function(error){
				$ionicLoading.hide();
				$scope.toastDark("提交失败，请重试")
			})
			$timeout(function(){
				$ionicLoading.hide();
			},5000);
		}
	}
	ctrl.$inject = ["$scope","$rootScope","$timeout","$location","$stateParams","$ionicHistory","$ionicLoading",'Wode',"Hall",'Prizes'];
	app.registerController("voteCtrl",ctrl);
//	return ctrl;

})