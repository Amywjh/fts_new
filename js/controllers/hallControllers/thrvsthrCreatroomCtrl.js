//3v3创建房间控制器
define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$rootScope,$stateParams,$ionicModal,$location,$timeout,$ionicLoading,$ionicScrollDelegate,Hall,Thr,LineUp) {
		$scope.nickname = localStorage.getItem("nickName")?localStorage.getItem("nickName")+"的房间":'';
		if($stateParams.playId==2){
			$scope.headTitle =$stateParams.privacy|0?"创建私密房":"创建公开房";
		}else if($stateParams.playId==3){
			$scope.headTitle =$stateParams.privacy|0?"创建私密房":"创建公开房";
			if($stateParams.privacy == 0){
				    	TALKWATCH("经典战-创建公开放");
			    }else if($stateParams.privacy == 1){
			    	TALKWATCH("经典战-创建私密房");
			    }
		}
		$scope.showRule = function(){
			if($stateParams.playId==2){
			}else if($stateParams.playId==3){
				$scope.showRules("classics");
			}
		}
		$scope.$on("$destroy",function(){//移除modal
			if($scope.iscreatroom) $scope.iscreatroom.remove();
			if($scope.inputModal) $scope.inputModal.remove();
			$scope.rewardWatch();//取消监听
		})
		//	入场人数
		$scope.creatroom_num = {
			'title': "入场人数",
			'value': [{'detial': 2}, {'detial': 10}, {'detial': 20}, {'detial': 50}, {'detial': "自定义"}]
		};
		//	入场费
		$scope.creatroom_fee = {
			'title': "入场费",
			'value': [{'detial': 0.1}, {'detial': 0.5}, {'detial': 1}, {'detial': 5}, {'detial': "自定义"}]
		};
		var creatroom_fun = function(list) {
			if(JSON.parse(sessionStorage.getItem("onlyDate"))){
				$scope.onlyDate = JSON.parse(sessionStorage.getItem("onlyDate"));
			}
			$scope.creat_choosed={};
			//创建接口返回的数据
			if(list.code==0 && list.data.length!=0){
				$scope.creatroomdata = list.data;
				var  getDefaultLeague = function(onlyDate){//默认选择给定的联赛
					if(onlyDate){
						for(var i=0;i<$scope.creatroomdata.length;i++){
							if(onlyDate.league == $scope.creatroomdata[i].league){
								return $scope.creatroomdata[i];
							}
						}
						return $scope.creatroomdata[0];//如果给定日期与实际日期不符，默认选择第一个
					}else{
						return $scope.creatroomdata[0];
					}
				}
				$scope.matchList = getDefaultLeague($scope.onlyDate);//联赛list
				if($scope.matchList.matchMap){
					$scope.choose_game=true;
				}
			}
			//获取玩法
			Thr.thrvsthrtype().then(function(data){
				if(data.code==0){
					$scope.contestType=data.data;
					$scope.contestType.splice(0,1);
					for(var i=0;i<$scope.contestType.length;i++){//玩法排序问题
						$scope.contestType[i].rankCode = Number($scope.contestType[i].code)+2;
						if($scope.contestType[i].code==3){
							$scope.contestType[i].rankCode = 0;
						}
					}
					$scope.creat_choosed = {//默认的选中效果
						league:$scope.onlyDate?$scope.onlyDate.league:$scope.creatroomdata[0].league,//联赛
						num: $scope.creatroom_num.value[0].detial,//入场人数
						fee: $scope.creatroom_fee.value[0].detial,//入场费
						rewardPlanId: $scope.contestType[3].code,//玩法选择
						rewardPlanName:$scope.contestType[3].name + "均分"//默认奖励规则
					};
					var matchday = "";
					if($scope.onlyDate && $scope.onlyDate.matchDay){
						var month = $scope.onlyDate.matchDay.substring(0,2);
						var days = $scope.onlyDate.matchDay.substring(3,5);
						matchday = month+"月"+days+"日";
					}
					$scope.creat_choosed.jc = $scope.creat_choosed.num * $scope.creat_choosed.fee;//预计奖池
					var getMatchDay = function(matchday){//默认选择给定日期的比赛
						var matchMapKyes = Object.keys($scope.matchList.matchMap);
						if(matchday){
							for(var i=0;i<matchMapKyes.length;i++){
								if(matchday == matchMapKyes[i]){
									return matchday;
								}
							}
							return matchMapKyes[0];//如果给定日期与实际日期不符，默认选择第一个
						}else{
							return matchMapKyes[0];
						}
					}
					$scope.creat_choosed.matchId = getMatchDay(matchday);//	默认选中第一轮联赛
					$scope.matchChoosedList = $scope.matchList.matchMap[$scope.creat_choosed.matchId];
				}
			})
		}
		var creatroom = sessionStorage.getItem("thrvsthrfilter");
		if (creatroom) {
			creatroom_fun(JSON.parse(creatroom));
		} else {
			Thr.thrvsthrfilter().then(function(data){
				console.log(data);
				creatroom_fun(data);
			})
		}
		$scope.chooseMacth = function(k){
			$scope.matchChoosedList = $scope.matchList.matchMap[k];
		}
		//点击联赛出现对应比赛球队的方法
		$scope.creatroomgame = function(id){
//			if(id == 2 || id==3 || id ==4){
//				$scope.choose_game =false;
//				$scope.choose_wit = true;
//				delete $scope.matchList;
//				delete $scope.creat_choosed.matchId;
//				return false;
//			}
			$scope.choose_wit = false;
			for(var i=0;i<$scope.creatroomdata.length;i++){
				if($scope.creatroomdata[i].league==id){
					$scope.matchList = $scope.creatroomdata[i];//联赛list
				}
			}
			if($scope.matchList.matchMap){
				$timeout(function(){
					$scope.creat_choosed.matchId = Object.keys($scope.matchList.matchMap)[0];//	默认选中第一轮联赛;
				},200)
				$scope.matchChoosedList = $scope.matchList.matchMap[Object.keys($scope.matchList.matchMap)[0]];
				$scope.choose_game=true;
			}else{
				$scope.choose_game =false;
			}
			$ionicScrollDelegate.$getByHandle('creatScroll').resize();
		}
		$scope.rewardWatch = $scope.$watch('creat_choosed',function(newData,oldData){//奖金分配计算
			if(newData!=oldData  && !$.isEmptyObject(newData)){
				$scope.rewardArr = getReward($scope.creat_choosed.rewardPlanId,$scope.creat_choosed.num,$scope.creat_choosed.fee);
			}
		},true);
			
		function creatRoomModal(){//是否创建房间模态框
			if($scope.iscreatroom){
				$scope.iscreatroom.show();
				if($scope.iscreatroom._isShown) $ionicScrollDelegate.$getByHandle('matchScroll').scrollTop();
			}else{
				$ionicModal.fromTemplateUrl('templates/classics/modal/thr-creatroom.html', {
					scope: $scope
				}).then(function(modal){
					$scope.iscreatroom = modal;
					$scope.iscreatroom.show();
					if($scope.iscreatroom._isShown) $ionicScrollDelegate.$getByHandle('matchScroll').scrollTop();
				});
			}
		}
		//		是否创建房间
		$scope.is_creat = function(data){
			$scope.showMsg = {};
			$scope.showMsg.roomname = $("input[name=roomname]").val() ? $("input[name=roomname]").val():'';	//房间名
			$scope.showMsg.nickName = localStorage.getItem("nickName")?localStorage.getItem("nickName"):"";//昵称
			$scope.showMsg.fee = data.fee;//入场费
			$scope.showMsg.num = data.num;//入场人数
//				$scope.showMsg.fee = $(".cost li").eq(0).find("span").text();//入场费
//				$scope.showMsg.num = $(".match_num li").eq(0).find("span").text();//入场人数
			var wfId = data.rewardPlanId;  //玩法
			var num = $scope.showMsg.num; //入场人数
			var remind = '';
			//玩法0第一名 1前三名 2前25 3前50 4 1v1
			if (!(data.league+1)){
				remind = '请选择联赛';
			} else if (!data.matchId) {
				remind = '近一周内没有本赛事比赛，请选择其他赛事';
				if($scope.choose_wit) remind = '我们还在准备此联赛，请选择其他赛事';
			} else if (!(data.rewardPlanId+1)) {
				remind = '请选择玩法';
			} else if (!$scope.showMsg.num) {
				remind = '请选择入场人数';
			} else if (wfId == 1 && num < 3) {
				remind = "入场人数不少于3人";
			} else if (wfId == 2 && num < 4) {
				remind = "入场人数不少于4人";
			} else if (wfId == 4 && num != 2) {
				remind = "入场人数固定为2人";
			} else if (!$scope.showMsg.fee) {
				remind = '请选择入场费'
			} else if ($("input[name=roomname]").val().length > 20) {
				console.log($scope.showMsg.roomname.length);
				remind = '房间名称不能超过20个字符'
			} else if (!data.jc){
				remind = '请确定信息'
			};
			switch (true) {//如果错误信息存在时
				case remind != "":
					if(!data.matchId){
						$scope.alertDark(remind)
					}else{
						$scope.toastDark(remind);
					}
					break;
				case !remind: //如果错误信息不存在时
					$scope.showMsg.leagueName = $scope.matchList.name;
					$scope.showMsg.round = $scope.matchList.round;//轮次，11v11无意义
					if($scope.matchList.matchMap){
						$scope.showMsg.matchTime = $scope.matchList.matchMap[data.matchId][0].startTime;
					}
					$scope.showMsg.matchListChoosed = $scope.matchList.matchMap[data.matchId];
					$scope.showMsg.rewardPlanId = data.rewardPlanId;
					//	玩法
					angular.forEach($scope.contestType, function(ctData, ctIndex) {
						if (ctData.code == data.rewardPlanId){
							$scope.showMsg.rewardPlanName = $scope.contestType[ctIndex].name;
							if($scope.showMsg.rewardPlanName == "前25%"){
								$scope.showMsg.rewardPlanName = "前25%梯度"
							}else if($scope.showMsg.rewardPlanName == "前50%"){
								$scope.showMsg.rewardPlanName = "前50%均分"
							}
						}
					})
					creatRoomModal();
					break;
			}

			$(".iscreatroom-all").parents(".modal-backdrop").css({//不知有何用
				bottom: "0px"
			});
		}
		
		$scope.commit_creat = function(showMsg,choosed,event){//确认创建
			$(event.target).attr("disabled","disabled");
			$(event.target).siblings().attr("disabled","disabled");
			$ionicLoading.show();
			var ids = '';
			angular.forEach(showMsg.matchListChoosed,function(dd,ii){
				ids += dd.id +","
			})
			ids = ids.slice(0,-1);
			if($stateParams.playId==2){//3v3
			}else if($stateParams.playId==3){
				subCreatEle(showMsg,choosed,event,ids)
			}
		};
		var subCreatEle = function(showMsg,choosed,event,ids){//11v11提交创建
			//提交创建房间时的参数
			sessionStorage.removeItem("one");
			sessionStorage.removeItem("two");
			sessionStorage.removeItem("thr");
			sessionStorage.removeItem("four");
			sessionStorage.removeItem("other");
			var num = $(".match_num").find("li").eq(0).find("span").text();
			var fee = $(".cost").find("li").eq(0).find("span").text();
			var sub_data_ele = {
				"ids": ids,
				"roomType":1,
				"fee":showMsg.fee|0,//入场费
				"maxUserCount": showMsg.num|0,//入场人数
				"name":showMsg.roomname,//房间名
				"playType":choosed.rewardPlanId+1,
				"league":choosed.league,
				"privacy":$stateParams.privacy//0 公开 1 私密
			};
			//			调用提交创建房间的服务
			var subCreatRoom = Hall.sub_creatroom(sub_data_ele);
			subCreatRoom.then(function(data){
					var remind = '';
					switch (data.code){
						case 0: //创建成功
						    TALKWATCH("经典房-创建成功");
							$ionicLoading.show();
							$scope.userInfoDetial();
							var LineUpState = {
								"roomId": data.data.roomId,//房间id
							}
							LineUp.battleUpdateLineup(LineUpState).then(function(lineupData){
								if(lineupData.code==0){
									sessionStorage.setItem("battle_lineup_xg", JSON.stringify(lineupData.data));
									$timeout(function(){//延迟跳转
										$scope.path = "#/tab/hall/creamroomSuccess/" + data.data.roomId + "/" + $scope.creat_choosed.league + "/" + data.data.roomPWD + "/" +$stateParams.privacy;
//										history.replaceState({},"",$scope.path);
//										history.pushState({},"",$scope.path);
										$location.path("/tab/hall/creamroomSuccess/" + data.data.roomId + "/" + $scope.creat_choosed.league + "/" + data.data.roomPWD + "/" +$stateParams.privacy)
//										$timeout(function(){
//											history.pushState({},"",$scope.path);
//											console.log(1111)
//											$ionicLoading.hide();
//										},500)
//										$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
//											$ionicLoading.hide();
//										})
									},500);
								}else{
									$ionicLoading.hide();
								}
							})
							break;
						case 1001: //钻石不够
							remind = "";
//							if(commafyback($scope.userData.coin)>=((sub_data_ele.fee)*$scope.sysPar.starToJewel)){
//								var msg = {"money":Number(sub_data_ele.fee)};
//								var callFun = function(){//兑换成功后回调
//									$ionicLoading.show();
//									subCreatEle(showMsg,choosed,event,ids);
//								}
//								$scope.onceExchange("星钻余额不足",msg,"兑换并支付",callFun);//调用兑换功能
//							}else{
//							}
							$scope.msg = '钻石余额不足,是否前往充值?';
							$scope.chargeAction($scope.msg,"取消","立即充值",true);
							break;
						case 1006: //钻石不够,但可以用星币兑换满足
							remind = "";
							var msg = {"money":Number(data.data.diamond)};
							var callFun = function(){//兑换成功后回调
								$ionicLoading.show();
								subCreatEle(showMsg,choosed,event,ids);
							}
							$scope.onceExchange("星钻余额不足",msg,"兑换并支付",callFun);//调用兑换功能
							break;
						case 6004: //敏感词
						   remind = "";
						   $scope.msg = '您的房间名包括敏感词“'+data.data+'”，请修改后重试';
						   $scope.alertDark($scope.msg);
						   break;
						default:
							remind = data.data ||data.msg;
							break;
					}
					if (remind != "") {
						$scope.toastDark(remind);
						$timeout(function() {
							$scope.iscreatroom.hide();
							$(event.target).removeAttr("disabled");
							$(event.target).siblings().removeAttr("disabled");
						}, 2000)
					} else {
						$scope.iscreatroom.hide();
						$ionicLoading.hide();
						$(event.target).removeAttr("disabled");
						$(event.target).siblings().removeAttr("disabled");
					}
				}, function(error) {
					$ionicLoading.hide();
					$scope.toastDark("创建失败，请重试");
					$(event.target).removeAttr("disabled");
					$(event.target).siblings().removeAttr("disabled");
				})
		}

		//		取消创建
		$scope.exit_creat = function() {
			$scope.iscreatroom.hide();
		};
		
		$scope.creat_other = {//其他金额或人数的添加
			fee: '',
			num: ''
		};
		$scope.inputAction = function(titleName,titleId,defaultNum,min,max){//	input输入
			$ionicModal.fromTemplateUrl('templates/directives/common/inputNum.html', {
				scope: $scope
			}).then(function(modal){
				$scope.titleName = titleName;
				$scope.titleId = titleId;
				$scope.inputModal = modal;
				$scope.inputModal.show();
				$("#vote_num").val(defaultNum);
				$scope.changeInput = function(changeId){
					setNum(min,max,undefined,changeId);
				}
				$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
					$scope.inputModal.remove();
				})
			});
			
		}
		$scope.enter_c = function(value){//调用input输入
			$scope.titleName = value?"入场费":"入场人数";
			$scope.titleId = value;
			var max = value?99999:100;
			var min = value?0.1:2;
			if(value){//入场费
				var defaultNum = $scope.creat_choosed.fee;
			}else{//入场人数
				var defaultNum = $scope.creat_choosed.num;
			}
			$scope.inputAction($scope.titleName,$scope.titleId,defaultNum,Number(min),max);
		}
		
		$scope.exit_enter_c = function(){//取消输入
			$scope.inputModal.remove();
		}
		$scope.commit_enter_c = function(id){//确定输入
			if(!id){//0 为入场人数
				var v_num = $("#vote_num").val();
				var reg = new RegExp("^[1-9]{1}[0-9]{0,3}$");
				var res = reg.test(v_num);
				var wfId = $scope.creat_choosed.rewardPlanId;
				if (wfId == 1 && v_num < 3) {
					$scope.toastDark("请输入3-100的整数");
					return;
				} else if (wfId == 2 && v_num < 4) {
					$scope.toastDark("请输入4-100的整数");
					return;
				} else if (wfId == 4 && v_num != 2) {
					$scope.toastDark("入场人数固定为2人");
					return;
				} else if (!res || v_num < 2 || v_num > 100) {
					if(v_num>100){
						$scope.alertDark("很抱歉,最多只能创建100人的房间");
					}else{
						$scope.toastDark("请输入2-100的整数");
					}
					return;
				}
				$scope.creat_choosed.num = Number(v_num);
				$scope.inputModal.remove();

			}else{//1 为入场费
				var v_fee = $("#vote_num").val();
				var reg = new RegExp("^[1-9]{1}[0-9]{0,4}$");
				var res = reg.test(v_fee);
				if (!res) {
					$scope.toastDark("请输入1-99999的整数");
					return;
				}
				$scope.creat_choosed.fee = Number(v_fee);
				$scope.inputModal.remove();

			}
		}
		$scope.ackpot_plan = function(data,index){
			switch(index){
				case 1:
				$scope.creat_choosed.num = $scope.creat_choosed.num<5?3:$scope.creat_choosed.num;
				$scope.creatroom_num.value[0].detial = 3;
					break;
				case 2:
				$scope.creat_choosed.num = $scope.creat_choosed.num<4?4:$scope.creat_choosed.num;
				$scope.creatroom_num.value[0].detial = 4;
					break;
				default:
				$scope.creat_choosed.num = $scope.creat_choosed.num<5?2:$scope.creat_choosed.num;
				$scope.creatroom_num.value[0].detial = 2;
					break;
			}
			
			$scope.creat_choosed.rewardPlanName=data;
			 if($scope.creat_choosed.rewardPlanName=="前25%"){
				$scope.creat_choosed.rewardPlanName="前25%梯度"
			}else if($scope.creat_choosed.rewardPlanName=="前50%"){
				$scope.creat_choosed.rewardPlanName="前50%均分"
			}
		}
	}
	ctrl.$inject = ["$scope", "$rootScope", "$stateParams", "$ionicModal", "$location", "$timeout", "$ionicLoading","$ionicScrollDelegate", "Hall","Thr","LineUp"];
	app.registerController("thrvsthrCreatroomCtrl",ctrl);//return ctrl;
})