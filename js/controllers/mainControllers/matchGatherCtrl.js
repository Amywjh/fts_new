//球星对战投票
define(["app"],function(app){
	"use strict";
	function ctrl($scope,$rootScope,$timeout,$ionicModal,$ionicLoading,$location,$stateParams,$ionicHistory,Hall,Prizes,Main) {
		$scope.$on("$ionicView.beforeEnter",function(){
			$scope.matchGather = sessionStorage.getItem("matchGather");
			if($scope.matchGather){
				$scope.matchGather = JSON.parse($scope.matchGather);
				var nowPath = $ionicHistory.currentStateName();
				switch(nowPath){
					case "tab.main-joinSum":
						joinSum();
					break;
					case "tab.main-matchHint":
						MatchHint();
					break;
							
				}		
			}
		})
		$(".matchHintScroll").css({height:document.documentElement.clientHeight*(1-0.5/6.67)+"px"});
		function gatherDataAct(gatherName){
			$scope.matchGatherData = sessionStorage.getItem("matchGatherData")?JSON.parse(sessionStorage.getItem("matchGatherData")):false;
			if($scope.matchGatherData){//处理总结数据
				gatherData($scope.matchGatherData,gatherName);
			}else{
				Main.matchGather().then(function(data){
		    		if(!data.code){
		    			sessionStorage.setItem("matchGatherData",JSON.stringify(data.data));
						gatherData(data.data,gatherName);
		    		}
		    	})
			}
			function gatherData(data,gatherName){
				if(gatherName=="joinSum"){
					var matchDateList = data.matchSummary.matchDateList;
					var dateStr = "";
					for(var i=0;i<matchDateList.length;i++){
						var dateForm = gettimeform(matchDateList[i]);
						dateStr = dateStr + dateForm.month+"月"+dateForm.dates+"日" + "、";
					}
					data.matchSummary.matchDateStr = dateStr.slice(0,-1);
					switch(data.matchSummary.guade){
						case 1:
							var guadeDes = "运气是一个轮回，<br />下一次竞猜相信赢家必定是你";
						break;
						case 2:
							var guadeDes = "哟运气不错啊！<br />再接再厉你就是下个预言帝！";
						break;
						case 3:
							var guadeDes = "有时候赢不是仅仅用运气好<br />就可以解释的";
						break;
						case 4:
							var guadeDes = "就问一句，还有谁?!";
						break;
					}
					if(guadeDes)  $(".guadeDes").find("span").eq(0).html(guadeDes);
					$scope.joinSum = data.matchSummary;
					var usefullSum = ["matchDateList","gameStarCount","game11v11Count","loseEfficacyCount","customDmdCount","earnCoinCount","guade","bestLineUpCount","btn"];
					var timeSumCount = -1;
					for(var i=0;i<usefullSum.length;i++){
						angular.forEach(data.matchSummary,function(con,index){
							if(usefullSum[i]==index){
								timeSumCount++;
								if(index=="loseEfficacyCount" && con==0){
									timeSumCount--;
								}
								if(index=="bestLineUpCount" && con==0){
									timeSumCount--;
								}
							}
						})
						if(i==(usefullSum.length-1)) timeSumCount++;
						fadeItem(i,800*timeSumCount);
					}
					function fadeItem(num,time){
						num = num+1;
						switch(num){
							case 1:
								$(".joinMathDay").eq(0).addClass("joinMathDayFade");
							break;
							case 2:
								setTimeout(function(){
									$(".matchTypeItem").eq(0).addClass("matchTypeItemFade");
								},time)
							break;
							case 3:
								setTimeout(function(){
									$(".matchTypeItem").eq(1).addClass("matchTypeItemFade");
								},time)
							break;
							case 4:
								setTimeout(function(){
									$(".matchTypeItem").eq(2).addClass("matchTypeItemFade");
								},time)
							break;
							case 5:
								setTimeout(function(){
									$(".paySum").eq(0).addClass("paySumFad");
								},time)
							break;
							case 6:
								setTimeout(function(){
									$(".getSum").eq(0).addClass("getSumFad");
								},time)
							break;
							case 7:
								setTimeout(function(){
									$(".guadeDes").css({display:"block"});
									$(".getHonor").find(".img1").find(".imgBox").find("img").addClass("imgFade");
								},time)
							break;
							case 8:
								setTimeout(function(){
									if($scope.joinSum.bestLineUpCount){
										$(".getHonor").find(".img2").find(".imgBox").find("img").addClass("imgFade");
									}
								},time)
							break;
							case 9:
								setTimeout(function(){
									if($scope.joinSum.bestLineUpCount){
										$(".getHonor").find(".img2").find(".imgBox").find(".winNum").css({display:"block"});
									}
									$(".joinSumBtnBox").find(".joinSumBtn").css({display:"block"});
								},time)
							break;
						}
					}
					if(!$.isEmptyObject(data.matchSumExp)){//等级总结
						$scope.currentSon = true;//页面跳转还是切换的方式
						$scope.joimSumBtn="下一步";
						$scope.growExp = data.matchSumExp;
						$scope.growExp.growExpDetial = [];
						if(data.matchSumExp.joinRoomCount){//参与任意
							var growItem = {
								"id":0,
								"growFormItem":"参与任意竞猜",
								"growCount":data.matchSumExp.joinRoomCount,
								"growExp":data.matchSumExp.joinRoomExp
							}
							$scope.growExp.growExpDetial.push(growItem);
						}
						if(data.matchSumExp.winStarGusessCount){//猜对球星竞猜
							var growItem = {
								"id":1,
								"growFormItem":"猜对球星对战",
								"growCount":data.matchSumExp.winStarGusessCount,
								"growExp":data.matchSumExp.winStarGusessExp
							}
							$scope.growExp.growExpDetial.push(growItem);
						}
						if(data.matchSumExp.prizeTop50Count){
							var growItem = {
								"id":2,
								"growFormItem":"房间排名前50%",
								"growCount":data.matchSumExp.prizeTop50Count,
								"growExp":data.matchSumExp.prizeTop50Exp
							}
							$scope.growExp.growExpDetial.push(growItem);
						}
						if(data.matchSumExp.prizeTop25Count){
							var growItem = {
								"id":3,
								"growFormItem":"房间排名前25%",
								"growCount":data.matchSumExp.prizeTop25Count,
								"growExp":data.matchSumExp.prizeTop25Exp
							}
							$scope.growExp.growExpDetial.push(growItem);
						}
						if(data.matchSumExp.prizeTop10Count){
							var growItem = {
								"id":4,
								"growFormItem":"房间排名前10%",
								"growCount":data.matchSumExp.prizeTop10Count,
								"growExp":data.matchSumExp.prizeTop10Exp
							}
							$scope.growExp.growExpDetial.push(growItem);
						}
						if(!$scope.growExp.growExpDetial.length) delete $scope.growExp.growExpDetial;
						var expP = expSum($scope.growExp);
						$scope.growExp.expDataPrivate = expP?expP:false;
					}else{
						$scope.currentSon = false;//页面跳转还是切换的方式
						$scope.growExp = false;
						$scope.joimSumBtn="确定";
					}
				}
				if(gatherName=="matchHint"){
					if(!jQuery.isEmptyObject(data.matchCommend.game11v11)){//11v11比赛日期
						var dateFormEle = gettimeform(data.matchCommend.game11v11.matchDay);
						data.matchCommend.game11v11.matchDay = dateFormEle.month+"月"+dateFormEle.dates+"日";
						if(!jQuery.isEmptyObject(data.matchCommend.game11v11.gameMatchList)){
							
						}
					}else{
						data.matchCommend.game11v11 = false;
					}
					
					if(!jQuery.isEmptyObject(data.matchCommend.game1v1)){//1v1比赛日期
						var dateFormOne = gettimeform(data.matchCommend.game1v1.matchDay);
						data.matchCommend.game1v1.matchDay = dateFormOne.month+"月"+dateFormOne.dates+"日";
//						if(!jQuery.isEmptyObject(data.matchCommend.game1v1.gameMatchList)){
//							angular.forEach(data.matchCommend.game1v1.gameMatchList,function(con,index){
//								con = matchDeadTime(con);
//							})
//						}
					}else{
						data.matchCommend.game1v1 = false;
					}
					
					$scope.matchHint = data.matchCommend;
				}
			}
		}
		function expSum(expData){
			var expDataPrivate;
			if(expData.upgrade){//如果是升级先用旧的
				expDataPrivate = {
					"Level":expData.oldLevel,
					"oldExp":expData.oldExperience,
					"growExp":expData.oldIncrementExperience,
					"maxExp":expData.oldMaxExperience,
					"expPercent":expData.oldExpPercent,
					"growExpPercent":expData.oldIncrementExpPercent,
				};
			}else{//如果没有升级，之间用新的
				expDataPrivate = {
					"Level":expData.level,
					"oldExp":expData.currLevelExp,
					"growExp":expData.incrementExp,
					"maxExp":expData.levelMaxExp,
					"expPercent":expData.expPercent,
					"growExpPercent":expData.InExpPercent,
				};
			}
			return expDataPrivate;
		}
				
		function gradeUp(isUpData){
			if(isUpData.upgrade){//如果是升级
				var growExpPrivate = {
					"Level":isUpData.oldLevel,
					"oldExp":isUpData.currLevelExp,
					"growExp":isUpData.incrementExp,
					"maxExp":isUpData.levelMaxExp,
					"expPercent":isUpData.expPercent,
					"growExpPercent":isUpData.InExpPercent,
				};
				return growExpPrivate;
			}
			return false;
		}
		
		function MatchHint(){
			$scope.nowModalId = 3;
			gatherDataAct("matchHint");
		}
		function joinSum(){
			gatherDataAct("joinSum");
			$scope.nowModalId = 2;
		}
		$scope.goHall = function(_path){//前往各类竞猜
			if(_path){
				$ionicLoading.show();
				$rootScope.$emit("api:get",_path);//先广播给main控制器，执行数据请求
//				$location.path(_path);
				$scope.$on("$ionicView.beforeLeave",function(){//页面跳转时执行历史栈的变更
					history.replaceState({},"","#/tab/main");
					history.pushState({},"","#"+_path);
				})
				$rootScope.$on('$locationChangeSuccess', function() {
					$ionicLoading.hide();
				})
			}
		}
		$scope.goMain = function(){
			history.replaceState({},"","#/tab/main");
		}
		$scope.nextPage = function(nowModalId,currentSon){//前往下一个公告
			if(currentSon && $scope.growExp){
				$(".joinSumBtnBox").find(".joinSumBtn").css({display:"none"});
				$scope.joimSumBtn="确定";
//				$(".joinSumBtnBox").find(".joinSumBtn").text("确定");
				$scope.currentSon = false;
				$(".joinSumBg").css({display:'none'});
				$(".gradeBg").css({display:"block"});
				var _length = $scope.growExp.growExpDetial.length+1;
				function gradeRuleItemFade(i,max){
					var timeNum = i==0?0:1;
					setTimeout(function(){
						$(".gradeBg").find(".gradeRule").find(".gradeRuleItem").eq(i).addClass("gradeItemFad");
						i++;
						if(i<max){
							gradeRuleItemFade(i,max);
						}
						if(i==max){
							setTimeout(function(){
								var _widthGrow = $(".growExpAct").width();
								$(".growExpAct").width(0).css({opacity:1});
								$(".growExpAct").animate({"width":_widthGrow},1000,function(){
									var growDataTime = gradeUp($scope.growExp);
									if(growDataTime){//如果等级升级
										$scope.growExp.expDataPrivate = growDataTime;
										var leavelCha = Number($scope.growExp.level - growDataTime.Level);
										if(leavelCha>0){
											var timeCha = 1/leavelCha;
											var timeCount = 0;
											(function leavelFad(){
												$scope.growExp.expDataPrivate.Level++;//等级逐渐增加
												$scope.$apply();
												setTimeout(function(){
													if(timeCount<(leavelCha-1)){
														timeCount++;
														leavelFad();
													}
												},1000*timeCha)
											}());
										}
										$scope.$apply($scope.growExp);
										$(".growExpAct").width(0).css({opacity:"1"});
										$(".growExpAct").animate({"width":$scope.growExp.expDataPrivate.growExpPercent},1000);
									}
								});
							},500)
						}
					},timeNum*1000)
				}
				gradeRuleItemFade(0,_length);
				setTimeout(function(){
					$(".joinSumBtnBox").find(".joinSumBtn").css({display:"block"});
				},_length*1000);
				return;
			}
			nextMainModal(nowModalId,$scope.matchGather);
		}

		function nextMainModal(nowModalId,matchGather){
	    	for(var i=0;i<matchGather.length;i++){
	    		if(matchGather[i].id==nowModalId){//在弹窗数组中找到对应的位置
	    			var usedModalArr = matchGather.slice(i+1);//获取当前位置以后的弹窗数组
	    			if(!usedModalArr.length){//如果没有则返回上一级，原则上是首页
	    				history.back();return;
	    			}
	    			for(var ii=0;ii<usedModalArr.length;ii++){//遍历为显示的数组
	    				if(usedModalArr[ii].show && !usedModalArr[ii].haveShow){//如果为显示的数组仍有需要显示的
	    					var nowIndex = i+1;nowIndex = nowIndex +ii;
	    					matchGather[nowIndex].haveShow = true;//找到下一个要显示的数组
	    					sessionStorage.setItem("matchGather",JSON.stringify(matchGather));
	    					var _goUrl = usedModalArr[ii].path;
	    					if(_goUrl){
	    						$location.path(_goUrl);
	    						$scope.$on("$ionicView.beforeLeave",function(){//总结跳转时先添加历史栈
	    							history.replaceState({},"","#/tab/main");
	    							history.pushState({},"","#/"+_goUrl);
	    						})
	    					}
	    					return;//停止循环
	    				}	
	    			}
	    		}
	    	}
	    }
		

	}
	ctrl.$inject = ['$scope',"$rootScope",'$timeout','$ionicModal','$ionicLoading','$location',"$stateParams","$ionicHistory",'Hall','Prizes',"Main"];
	app.registerController("matchGatherCtrl",ctrl);
})