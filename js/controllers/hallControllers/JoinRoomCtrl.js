define(["app"],function(app){
	"use strict";
	function ctrl ($scope, $stateParams,$ionicHistory, $interval, $timeout, $location, $ionicLoading, $rootScope,$ionicPopup, Hall, Battle,LineUp) {
		$scope.home_title = "加入房间";
		$scope.back_title = "大厅";
		$scope.$on("$ionicView.beforeEnter",function(){
			if(!$ionicHistory.backView()){
				var address = location.hash;
				history.pushState({},"","#/tab/main");
		 		location.hash = address;
			}
			  // 首次进入引导 
		 	var locationGuide = JSON.parse(localStorage.getItem("guideNew"));
			if(locationGuide && locationGuide["join"] === false){
				locationGuide["join"] = true;
				$scope.firstEnter = true;
				localStorage.setItem("guideNew",JSON.stringify(locationGuide));
			}
		})
		$scope.showRule = function(){//规则
			$scope.showRules("classics");
		}
		if($stateParams.lineupId=="onlyShow"){
			$scope.home_title = "房间详情";
			$scope.hideBtn = true;
		}else{
			delete $scope.hideBtn;
		}
		
		//	加入房间处理数据的方法
		function joinroomact(data) {
			//加入房间的数据  (千分位)
			data.prices.predictFirst = toThousands(data.prices.predictFirst);
			data.prices.predictSecond = toThousands(data.prices.predictSecond);
			data.prices.predictThird = toThousands(data.prices.predictThird);
			data.prices.realFirst = toThousands(data.prices.realFirst);
			data.prices.realSecond = toThousands(data.prices.realSecond);
			data.prices.realThird = toThousands(data.prices.realThird);
			data.matchStartDate = data.matchStartTime.substr(0,6);
			data.countDown = getCountTime(data.matchStartTimeStamp);
			var _onlyShare = gettimeform(data.shareMatchTime); 
			data.shareDate = _onlyShare.month+"月"+_onlyShare.dates+"日";
			$scope.entryFee = data.fee;//入场费
			$scope.roomDetial = data;//数据
			$scope.roomDetial.roomId = $stateParams.roomId;//添加房间id
			$scope.userList = data.userList;
			if(!$scope._appId){
				$timeout(function(){
					if($ionicHistory.currentStateName() == "tab.hall-joinroom"){
						if($scope.roomDetial){
							var shareTitle = localStorage.getItem("nickName") +"邀请你参与" + $scope.roomDetial.shareDate+$scope.roomDetial.leagueName+"阵容竞猜";
							$scope.creatShare(false,shareTitle,null,"StarKings，专业足球阵容竞猜游戏，赢了就有钱",$stateParams.roomId);
						}
					}
				},2000)
			}else{
				if($ionicHistory.currentStateName() == "tab.hall-joinroom"){
					if($scope.roomDetial){
						var shareTitle = localStorage.getItem("nickName") +"邀请你参与" + $scope.roomDetial.shareDate+$scope.roomDetial.leagueName+"阵容竞猜";
						$scope.creatShare(false,shareTitle,null,"StarKings，专业足球阵容竞猜游戏，赢了就有钱",$stateParams.roomId);
					}
				}
			}
		}
		//	获取缓存的加入房间数据，如果存在，直接调用方法，不存在的调用服务
		var joinroomdata = sessionStorage.getItem("joinroomdata");
		if (joinroomdata){
			joinroomact(JSON.parse(joinroomdata));
		} else {
			Battle.lineupNostartEle($stateParams.roomId).then(function(data) {
				if(!data.code){
					sessionStorage.setItem("joinroomdata",JSON.stringify(data.data))
					joinroomact(data.data);
				}
			}, function(error) {

			})
		}
		//	点击加入的跳转页面
		$scope.isjoin = function(roomDetial){
			var id = roomDetial.roomId;
			sessionStorage.removeItem("one");
			sessionStorage.removeItem("two");
			sessionStorage.removeItem("thr");
			sessionStorage.removeItem("four");
			sessionStorage.removeItem("other");
			if(roomDetial.fee){
				var entryFee = roomDetial.fee?roomDetial.fee:'';
				var msg = '确定使用 <img class="a-img-size" src="../../img2.0/joinroom/zs_28.png"/> '+entryFee+' 加入房间？';
			}else{
				var msg = '确定加入房间？';
			}
			var confirmPopup = $scope.url_ts(msg);
			confirmPopup.then(function(res){
				if (res) {
					$ionicLoading.show();
					jionRoom(id);
				}	
			});
			$scope.$on("$destroy",function(){
				confirmPopup.close();				
			})
		}
		function jionRoom(id){
			var subData = {
					roomId: id,
				}
			var subJoinRoom = Hall.sub_joinRoom(subData);
			subJoinRoom.then(function(data) {
				var remind = "";
				var urlAdd = '';
				var classId = $scope.roomDetial.league;
				switch (data.code){
					case 0: //创建成功
					    TALKWATCH("经典房-加入房间成功");
						$scope.userInfoDetial();
						var LineUpState = {
							"roomId": subData.roomId,//房间id
						}
						LineUp.battleUpdateLineup(LineUpState).then(function(lineupData){
							if(lineupData.code==0){
								sessionStorage.setItem("battle_lineup_xg", JSON.stringify(lineupData.data));
								$timeout(function(){
									var $url = "#/tab/hall/0";
									history.replaceState({},"",$url);
									$scope.path = "#/tab/lineup/ksbz/" + 1 + "/" + subData.roomId + "/" + data.data.ids + "/" + 1 + "/" + classId;
									history.pushState({},"",$scope.path);
		//							$location.path($scope.path);
									$ionicLoading.hide();
								},500)
							}else{
								$ionicLoading.hide();
							}
						})
						break;
					case 1001: //钻石不够
						remind = "星钻余额不足，是否前往充值？";
						TALKWATCH("加入房间前往充值");
						urlAdd = "/tab/wode/sc";
						break;
					case 1006: //钻石不够,可用星币兑换
						remind = "兑换并支付";
						urlAdd = "/tab/wode/sc";
						break;
					case 6003: //重复加入
						remind = "您已加入过该房间,正在为您跳转到阵容页面";
						urlAdd = "/tab/battle/battle-lineup/" + id +"/"+3 +"/"+ classId +"/" +3 ;
						break;
					default:
						remind = data.msg;
						urlAdd = "";
					break;
					
				}
				if (remind != "") {
					$ionicLoading.hide();
					var subJoinResult = function(){
						if(data.code == 1001){
							$ionicLoading.hide();
							$scope.chargeAction(remind,"取消","立即充值",true);
						}else if(data.code == 1006){//星币余额不足，可以通过兑换满足的情况。
							$ionicLoading.hide();
							var msg = {"money":Number(data.data.diamond)};
							var callFun = function(){//兑换成功后回调
								$ionicLoading.show();
								jionRoom(id);
							}
							$scope.onceExchange("星钻余额不足",msg,"兑换并支付",callFun);//调用兑换功能
						}else{
							$scope.toast(remind);
								if(data.code == 6003){
									$timeout(function(){
										$ionicLoading.show();
									},2000)
									Battle.lineupNostartEle(id).then(function(data){
										if(data.code==0){
											sessionStorage.setItem("battle_lineup", JSON.stringify(data.data));
											$timeout(function(){
												$location.path(urlAdd);
											}, 2000)
										}else{
											$ionicLoading.hide();
										}
									},function(error){
										$ionicLoading.hide();
									})
								}else{
									if(urlAdd!=""){
										$timeout(function(){
											$ionicLoading.show();
										},2000)
										$timeout(function(){
											$location.path(urlAdd);
										}, 2000)
									}
								}
							
							$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
								$ionicLoading.hide();
							})
							$timeout(function(){
								$ionicLoading.hide();
							},5000)
						}
					}
					subJoinResult();
				}
			}, function(error) {
				return;
			})
			
		}
		$scope.rewardHelp = function(fee){
			if(!fee || fee==0) return;
			$scope.alertShut();
		}
		$scope.moreBonus = function(roomId,isNoStart){
			var url = "/tab/common/bonusPlan/"+ roomId +"/" +isNoStart;
			$location.path(url);
		}
		$scope.playerlist = function(roomId) {
				$ionicLoading.show();				
				Hall.playershow(roomId).then(function(data) {
					sessionStorage.setItem("playerList", JSON.stringify(data));
					var path = "/tab/hall/join_playerlist/" + roomId;
					$location.path(path);
					$ionicLoading.hide();
				}, function(error) {
					$ionicLoading.hide();
				});
			}
			//	返回页面
		$scope.return = function(){
			//		$(".hall-joinroom").parent('.tab-content').siblings('.tabs').css("z-index","5");
			var lineupId = $stateParams.lineupId == '' ? 0 : $stateParams.lineupId;
			$scope.path = "/tab/hall/" + lineupId;
			$location.path($scope.path);
		}
	}
	ctrl.$inject = ["$scope", "$stateParams","$ionicHistory", "$interval", "$timeout", "$location", "$ionicLoading", "$rootScope","$ionicPopup", "Hall", "Battle","LineUp"];
		app.registerController("JoinRoomCtrl",ctrl);//return ctrl;
})