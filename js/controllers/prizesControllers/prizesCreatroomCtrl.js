//球星对战投票
define(["app"],function(app){
	"use strict";
	function ctrl($scope,$rootScope,$timeout,$location,$stateParams,$ionicHistory,$ionicLoading,$ionicModal,Hall,Prizes) {
	//	跳转到竞猜房间的详情页  isMine是位置 flase是首页跳转true是赛况跳转
		$scope.go_detial = function(index,classicId,matchId,status){
			$ionicLoading.show();
			Prizes.roomDetial(index).then(function(data){
				sessionStorage.setItem('prizes_detial',JSON.stringify(data));
				$timeout(function(){
					var prizes_detial = JSON.parse(sessionStorage.getItem('prizes_detial'));
					if(prizes_detial && prizes_detial.code==0){
						var isMine = false;
						var url = "/tab/main/prizes/detial/"+ index + "/" + classicId +"/"+ matchId +"/"+ status +"/"+ isMine;
						$location.path(url);
						$ionicLoading.hide();
					}else{
						$ionicLoading.hide();
					}
				},500)
			},function(error){
				$ionicLoading.hide();
			})
		}
		var dealPrizeData = function(data){
//			data = matchDeadTime(data);//去掉倒计时
			angular.forEach(data,function(data_s,index_s){
				lineup_qudh(data_s.home.shirtNum, data_s.home)//球衣号码
				lineup_qudh(data_s.away.shirtNum, data_s.away)//球衣号码
				var left_Start = gettimeform(data_s.leftMatch.start_time,data_s.deadTime);
				var right_Start = gettimeform(data_s.rightMatch.start_time,data_s.deadTime);
				data_s.leftMatch.start_timeHour = (left_Start.isNextDay?left_Start.isNextDay:'')+left_Start.hours +":"+left_Start.minutes;
				data_s.rightMatch.start_timeHour = (right_Start.isNextDay?right_Start.isNextDay:'')+right_Start.hours +":"+right_Start.minutes;
			})
			return data;
		}		
		// 处理最近是否有比赛的3种方法
		var prizeDateHas = function(data){
			if(data && data.code == 0){
				$scope.countPrizes = data;
				page = data.pageNo;
				$scope.prizeall = dealPrizeData(data.data);
				if(data.pageNo>=data.totalPageCount){
					$scope.hasData = true;
				}
				$scope.dateMsg = false;
			}else if(data && data.code == 20001){
				$scope.prizeall = [];
			  	var stateTime = gettimeform(data.data.newMatchDate);
			  	$scope.dateMsg = {};
			  	$scope.dateMsg.newMatchDate = stateTime.month +"月"+ stateTime.dates +"日";
			  	$scope.dateMsg.leagueMatchDate = {};
			  	for(var x in data.data.leagueMatchDate){
			  		var everydata = data.data.leagueMatchDate[x];
			  		var everyTime = gettimeform(everydata);
			  		var y ='';
			  		if(x==0){
			  			 y = '英超'
			  		}else if(x==1){
			  			 y = '中超'
			  		}else if(x==2){
			  			 y = '欧冠'
			  		}else if(x==3){
			  			 y = '意甲'
			  		}else if(x==4){
			  			 y = '西甲'
			  		}
			  		$scope.dateMsg.leagueMatchDate[y] = everyTime.month +"月"+ everyTime.dates +"日";
			  	}
			
			}
		}
		
	//	获取缓存的竞猜房间list数据
		var prizes = JSON.parse(sessionStorage.getItem("prizes"));
	//	如果数据存在，且返回值为0时
		var page = 1;
		if(prizes){
			prizeDateHas(prizes);
		}else{
			Prizes.all(page).then(function(data){
				prizeDateHas(data);
			})
		}
		
//		var timerPrize = setInterval(function(){//倒计时//去掉倒计时
//			$scope.prizeall = matchDeadTime($scope.prizeall);
//			$scope.$apply();
//			$scope.$on("$destroy",function(){//移除modal
//				if(timerPrize) clearInterval(timerPrize);
//			})
//		},10000);
		
		function MorePrizesRooms(page){
			Prizes.all(page).then(function(data){
				if($scope.countPrizes && $scope.countPrizes.totalPageCount){
					var totalPage = $scope.countPrizes.totalPageCount;
				}else{
					var totalPage = 0;
				}
				if(data &&　data.code==0 && data.data && data.data.length>0 && page<=totalPage){
					data.data = dealPrizeData(data.data);
					var lists = $scope.prizeall;
					if($scope.prizeall.length>0){
						$scope.prizeall = new Array().concat(lists, data.data);
					}else{
						$scope.prizeall = data.data;		
					}
					$scope.hasData = false;
					$ionicLoading.hide();
					
				}else if(data.code==0 && data.data.length==0){
					page = page-1;
				}
				if(page>=$scope.countPrizes.totalPageCount || $scope.countPrizes.totalPageCount==undefined){
					$scope.hasData = true;
					$ionicLoading.hide();
				}
				$scope.$broadcast('scroll.infiniteScrollComplete'); 
	
			},function(error) {
				$timeout(function() {
					$ionicLoading.hide();
				}, 500)
			})
			
		}
		$scope.morePrizesRooms = function(){//分页加载
			if($scope.hasData != true){
				page = page + 1;
				MorePrizesRooms(page);
			}
		}
		$scope.doRefresh = function() {//下拉刷新
			if($scope.dateMsg) return;
			$scope.hasData = true;
			$scope.prizesDetial={};
			$(".prizes-room").children(".scroll").addClass('fanhui');
			$ionicLoading.show({
				template: '<div style="margin-top: 45vh;"><img id="load_bg" style="width:.32rem;height:.32rem" src="img2.0/main/refresh_1.png" /><span class="a-text-colorgreen" style="display:block;">房间刷新中，请稍候...</span></div>',
				delay: 500,
				duration: 1500
			});					
				$scope.$broadcast('scroll.refreshComplete');
				$timeout(function(){				
					Prizes.all(1).then(function(data){
						if(data.code==0){
							$scope.countPrizes = data;
							$scope.prizeall = dealPrizeData(data.data);
							if(data.pageNo<data.totalPageCount){
								$scope.hasData = false;
							}
							page = data.pageNo;
						}
					},function(error){
						$ionicLoading.hide();
					})
				},500)	
		};	
		
		$scope.vote = function(rule,data,room,$index){/*点击投票调用的方法*/	
			if(rule == true){
				if(room.homeCost){
					$scope.textmsg = "追加支持"
				}else{
					$scope.textmsg = "支持"
				}
			}else{
				if(room.awayCost){
					$scope.textmsg = "追加支持"
				}else{
					$scope.textmsg = "支持"
				}
			}
			TALKWATCH("球星对战-大厅"+$scope.textmsg)
			$scope.isHome = rule;//		判断是否是主场球员
			$scope.voteInfo = {
				"isHome":rule,
				"roomId":room.id,
				"isList":true,
				"index":$index,
				"dataName":"prizeall",
			}
			$scope.voter = data;//投票球员
			$scope.voter.expectPrize =getPreIncome(9,1,$scope.prizeall[$index].homeTotalCost,$scope.prizeall[$index].awayTotalCost,rule);
	
		/*剩余星钻*/
			var user = sessionStorage.getItem("user");
		 	if(user){
		 		$scope.userInfoDetial(JSON.parse(user));
		 		$scope.xz = $scope.userData.dmd;
		 		$scope.xz_f = JSON.parse(user).dmd + parseInt((JSON.parse(user).coin)/($scope.sysPar.starToJewel));
		 	}else{
		 		$scope.userInfoDetial();
		 		$timeout(function(){	 			
			 		var user = sessionStorage.getItem("user");
			 		if(user){
				 		$scope.userInfoDetial(JSON.parse(user));
				 		$scope.xz = $scope.userData.dmd;
				 		$scope.xz_f = JSON.parse(user).dmd + parseInt((JSON.parse(user).coin)/($scope.sysPar.starToJewel));
			 		}else{
			 			$scope.xz = 0;$scope.xz_f = 0;
			 		}
		 		},1000)
		 	}
	
		/*显示输入框*/
			$("#vote_num").val('1');
			var min = $("#vote_num").val();
			$('.prizes-room').find('.input_bg').css({display:"block"});
			$("#vote_num").bind('input oninput',function(event){
				getVal(event,min,99999,$scope.xz_f);
				$scope.voter.expectPrize =getPreIncome(9,Number(event.target.value),$scope.prizeall[$index].homeTotalCost,$scope.prizeall[$index].awayTotalCost,rule);
				$scope.$apply();
				
			})
			$scope.changeInput = function(changeId){
				var nowNum = setNum(min,99999,$scope.xz_f,changeId);//调用加减得函数
				$scope.voter.expectPrize =getPreIncome(9,Number(nowNum),$scope.prizeall[$index].homeTotalCost,$scope.prizeall[$index].awayTotalCost,rule);
			}
		}
		
		$scope.showRule = function(){//规则跳转
			$scope.showRules("prize");
		}
		
		$scope.guideFun = function(){
			// 引导
			$ionicModal.fromTemplateUrl('templates/main/modal/rewardModal.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal) {
				$scope.rewardModal = modal;
				$scope.rewardModal.show();
				$scope.sixPage = true;
				$scope.guiIndex = 0;
			})
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				$scope.rewardModal.remove();
			})
			
			$scope.nextPage = function(index){
				if(index == 6){
					$scope.rewardModal.remove();
				}
			}
		}
	
		// 首次进入引导 
	 	var locationGuide = JSON.parse(localStorage.getItem("guideNew"));
		if(locationGuide && locationGuide["prize"] === false){
			locationGuide["prize"] = true;
			 $scope.guideFun();
			localStorage.setItem("guideNew",JSON.stringify(locationGuide));
		}
		TALKWATCH("球星对战大厅");
		
	}
	ctrl.$inject = ["$scope","$rootScope","$timeout","$location","$stateParams","$ionicHistory","$ionicLoading","$ionicModal","Hall",'Prizes'];
	app.registerController("prizesCreatroomCtrl",ctrl);
//	return ctrl;
})