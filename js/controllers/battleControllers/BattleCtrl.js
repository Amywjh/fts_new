//对战js***********************************************
define(["app"],function(app){
	"use strict";
	function ctrl($scope,$interval,$rootScope, $stateParams, $ionicScrollDelegate, $location, $ionicLoading, $timeout, Battle,Prizes,Thr) {
		$scope.$on("$ionicView.beforeEnter",function(){
		 	$(".tabs").css({opacity:1});
			var address = location.hash;
		 	history.pushState({},"","#/tab/main");
		 	if(address=="#/tab/battle/0/0/0"){
		 		$location.path("/tab/main")
		 	}else{
			 	location.hash = address;
		 	}
		})
		
//		$(".tabs").css({opacity:1});
		$scope.$on("$ionicView.afterEnter",function(){
			$scope.redDot(true);//红点显示
		})
	//	联赛类型
		$scope.matchType ={
			id:0,
			data:[{name:'英超'},{name:'中超'}]
		}
	//	房间类型
		$scope.playerType ={
			data:{
				"1":{name:'球星对战',activated:""},
				"2":{name:'三人战',activated:""},
				"3":{name:'经典11人',activated:""}
			}
		}
	//	状态类型
		$scope.battlestatus = [
			{'id': '0','title': '未开始','class': ''}, 
			{'id': '1','title': '进行中','class': ''},
			{'id': '2','title': '已结束','class': ''}
		];
	//	设置初始页page=1；
		$scope.page_prizes = 1;	//竞猜房间的页数
		$scope.page_def = 1;	//经典房间的页数
//		$scope.page_thr = 1; //3v3房间的页数
		var actPlay = $stateParams.classicId|1;
		//默认的房间类型
		$scope.playerTypeAct = {
			id:actPlay,
			name:$scope.playerType.data[actPlay].name
		}
		//房间类型对应的房间列表
		$scope.slide_page = Number(Number(actPlay)-1);
		// 转化为千分位
		function battleact(data){
			angular.forEach(data.room,function(dd,ii){
				data.room[ii].pond = toThousands(dd.pond);
				data.room[ii].entryNum = dd.entry;
				data.room[ii].entry = toThousands(dd.entry);
				data.room[ii].bonus = toThousands(dd.bonus);
			})
			tabAct(true,$stateParams.tabId|0,true,$stateParams.classicId|0);//状态tab切换效果
			return data;
		}
		$scope.$on("$ionicView.beforeLeave",function(){
			$interval.cancel($scope.setint)
		})
		if($stateParams.classicId == 1){//球星对战
	//		获取缓存
			var battle_prizes = sessionStorage.getItem("battle_prizes");
			if (battle_prizes){
				$scope.battle_prizes = JSON.parse(battle_prizes);
				$scope.battle_prizesOnepage  = JSON.parse(battle_prizes);
				$scope.prizesTimeBox = [];
				var tabIndex = $stateParams.tabId;
					if(tabIndex == 2){
						var map = {},dest = [];
						for(var i = 0; i < $scope.battle_prizes.length; i++){
						    var ai = $scope.battle_prizes[i];
						    if(!map[ai.timeList]){
						        dest.push({
						            timeList: ai.timeList,
						            status:tabIndex,
						            data: [ai]
						        });
						        map[ai.timeList] = ai;
						    }else{
						        for(var j = 0; j < dest.length; j++){
						            var dj = dest[j];
						            if(dj.timeList == ai.timeList){
						                dj.data.push(ai);
						                break;
						            }
						        }
						    }
						}
						$scope.prizesTimeBox = dest;
					}
				$scope.totalCount = $scope.battle_prizes.length;
				tabAct(true,$stateParams.tabId|0,true,$stateParams.classicId|0);//状态tab切换效果
			}else{//玩法,联赛,状态,页码0,是否是状态切换
				getPrizesRooms($stateParams.classicId,'',$stateParams.tabId,$scope.page_prizes,true,true);
			}
			
		}else if($stateParams.classicId == 3){//经典战
			var battle_default = sessionStorage.getItem("battle_default");
			if(battle_default){
				operaData(JSON.parse(battle_default),$stateParams.tabId,true,true)
			}else{
				getDefaultRooms($stateParams.tabId,'',$scope.page_def,true,true);
			}
			
		}else if($stateParams.classicId == 2){//3vs3

		}
	//	tab切换的函数
		function tabAct(isTab,tabIndex,isClassic,classicIndex){
			if(isTab){
				angular.forEach($scope.battlestatus, function(data, index, array){
					if (data.id == tabIndex){
						$scope.battlestatus[index].class = 'activated';
						$scope.battlestatusAct = tabIndex;
					} else {
						$scope.battlestatus[index].class = '';
					}
				});
			}
			if(isClassic){
				angular.forEach($scope.playerType.data, function(data, index, array){
					if (index == classicIndex){
						$scope.playerType.data[index].activated = 'type_tab_activated';
					} else {
						$scope.playerType.data[index].activated = '';
					}
				});
			}
			hideRed(tabIndex,classicIndex);
			$ionicLoading.hide();
		}
		function hideRed(tabIndex,classicIndex){
			tabIndex = Number(tabIndex);
			var statusSign;var playSign;
			switch(tabIndex){
				case 0:
					statusSign = "_noStart";
				break;
				case 1:
					statusSign = "_going";
				break;
				case 2:
					statusSign = "_end";
				break;
			}
			switch(classicIndex){
				case 3:
					playSign = "traditionSign";
				break;
				case 1:
					playSign = "starGuessSign";
				break;
				case 2:
					playSign = "thrTothrSign";
				break;
			}
			function redLocal(localData){
				if(statusSign && playSign){
					var statusPlaySing = playSign + statusSign;
					localStorage.setItem(statusPlaySing,localData.sign);
				}
			}
	//		tabIndex 0(未开始)1(进行中)2(已结束)  classicsIndex 1(球星对战)2(三人战)3(经典战)
			if(tabIndex==0){//未提交阵容
	//			if(!$scope.battleRedHot) return;
	//			switch(classicIndex){
	//				case 3:
	//					$scope.battleRedHot.noLineupTradition = false;
	//				break;
	//			}
	//			if(!$scope.battleRedHot.noLineupTradition) $scope.battleRedHot.noStartStatus = false;
			}else if(tabIndex==1){
				if(!$scope.battleRedHot) return;
				switch(classicIndex){
					case 1:
						$scope.battleRedHot.playing.StarGuess.showHas = false;
						redLocal($scope.battleRedHot.playing.StarGuess);
					break;
					case 3:
						$scope.battleRedHot.playing.Tradition.showHas = false;
						redLocal($scope.battleRedHot.playing.Tradition);
					break;
				}
				if(!$scope.battleRedHot.playing.Tradition.showHas && !$scope.battleRedHot.playing.StarGuess.showHas) $scope.battleRedHot.playing.statusShow = false;
			}else if(tabIndex==2){
				if(!$scope.battleRedHot) return;
				switch(classicIndex){
					case 1:
						$scope.battleRedHot.finished.StarGuess.showHas = false;
						redLocal($scope.battleRedHot.finished.StarGuess);
					break;
					case 3:
						$scope.battleRedHot.finished.Tradition.showHas = false;
						redLocal($scope.battleRedHot.finished.Tradition);
					break;
				}
				if(!$scope.battleRedHot.finished.Tradition.showHas && !$scope.battleRedHot.finished.StarGuess.showHas) $scope.battleRedHot.finished.statusShow = false;
			}
			if(!$scope.battleRedHot){
				$(".battleTab").removeClass("battleTabHot");
			}else if($scope.battleRedHot){
				if(!$scope.battleRedHot.unplay.statusShow && !$scope.battleRedHot.playing.statusShow && !$scope.battleRedHot.finished.statusShow){
					$(".battleTab").removeClass("battleTabHot");
				}
			}
		}
	//	点击按钮列表页
		$scope.roomFilter = function(type,$event){
			type = Number(type);
			$ionicLoading.show();
			$scope.page_prizes = 1;	//竞猜房间的页数
			$scope.page_def = 1;	//经典房间的页数
//			$scope.page_thr = 1;	//3v3房间的页数
			$scope.playerTypeAct = {
				id:type,
				name:$scope.playerType.data[type].name
			};
			$scope.slide_page=Number(Number(type)-1);//显示slide
			$scope.hasData = true;
			if(type==3){//传统房
				TALKWATCH ("赛况-筛选房间","传统房");
				$scope.battledata = {};
				$scope.battledata.room = [];
				$timeout(function(){
					$scope.page_def = 1;//经典房间的页数
					getDefaultRooms($scope.battlestatusAct,'',$scope.page_def,false,true);				
				},1300)
			}else if(type == 1){//竞猜房
				TALKWATCH ("赛况-筛选房间","竞猜房");
				$scope.battle_prizes = [];
				$timeout(function(){
					$scope.page_prizes = 1;	//竞猜房间的页数
					getPrizesRooms(type,'',$scope.battlestatusAct,$scope.page_prizes,false,true);
				},1300)
			}else if(type == 2){//3vs3
//				TALKWATCH ("赛况-筛选房间","3v3");
//				$scope.battledata = [];
//				$timeout(function(){
//					$scope.page_thr = 1;	//3v3房间的页数
//					getThrRooms($scope.battlestatusAct,'',$scope.page_thr,false,true);	
//				},1300)
			}		
//			$ionicScrollDelegate.$getByHandle("thrlist").scrollTop();
			$ionicScrollDelegate.$getByHandle("prizeslist").scrollTop();
			$ionicScrollDelegate.$getByHandle("deflist").scrollTop();
			
			$timeout(function(){
				$ionicLoading.hide();
			},5000);
		}
		
		// 	排序
		//向下滑动   显示搜索和返回顶部按钮消失
		$scope.searchshow = function(){
				var a = $(".battle").children(".scroll").css("transform").replace(/[^0-9\-,]/g, '').split(',');
				if (a[a.length - 1] > (-13 * document.documentElement.clientHeight / 19.2)) {
					$(".returntop").css({
						display: "none"
					});
				}
			}
		//向上滑动  返回顶部时某个位置时返回按钮消失
		$scope.showReturn = function(){
			var a = $(".battle").children(".scroll").css("transform").replace(/[^0-9\-,]/g, '').split(',');
			if (a[a.length - 1] >= (-3 * document.documentElement.clientHeight / 19.2)) {
				$(".returntop").css({
					display: "block"
				});
			}
		}
	//	调用传统房接口的方法
		function getDefaultRooms(tabIndex,matchId,page,isTab,isClassic){
			$scope.hasData = true;		
			Battle.list(tabIndex,"",page).then(function(dataAll){//房间状态，联赛类型，页数
				if(dataAll.code==0){
					operaData(dataAll,tabIndex,isTab,isClassic);
				}else{
					$ionicLoading.hide();
				}
			},function(error){
				$timeout(function() {
					$ionicLoading.hide();
				}, 500)
			})
		}
		function operaData(dataAll,tabIndex,isTab,isClassic){
			if (dataAll.pageNo == 1) {
					sessionStorage.setItem("battle_default",JSON.stringify(dataAll));
					$scope.nboxrooms = '';
					$scope.boxrooms = '';
			}
			if (dataAll.code == 0) {
				$scope.page_def = dataAll.pageNo; //page赋值
				if (dataAll.pageNo >= dataAll.totalPageCount) { //判断是否分页请求
					$scope.hasData = true;
				} else {
					$scope.hasData = false;
				}
				var roomlist=[];
				var boxrooms = {};
				if(tabIndex==1){
					angular.forEach(dataAll.data,function(datalist,index){
						$scope.roomhandle(datalist);
						roomlist = new Array().concat(roomlist,datalist);
					})
				}
				if(tabIndex == 0){
						angular.forEach(dataAll.data,function(datalist,index){
	  					    $scope.roomhandle(datalist);
							var times = gettimeform(index);
							var djsTimes = getTimeCount(index);
							var boxrooms ={};
							 boxrooms.today = times.month+"-"+times.dates;
							 boxrooms.todayhour = times.hours+":"+times.minutes;
							 boxrooms.timedateup = djsTimes;
							 boxrooms.roomlist = datalist;
							 boxrooms.dates = index;
						 	angular.forEach($scope.nboxrooms,function(date,key){
								if(date.dates == boxrooms.dates){
									date.roomlist = new Array().concat(date.roomlist,boxrooms.roomlist)
								    boxrooms =[];
								}
							})
						 	roomlist =new Array().concat(roomlist,boxrooms);
						})
					}
					if(tabIndex == 2){
							angular.forEach(dataAll.data,function(datalist,index){
								$scope.roomhandle(datalist);
								index = "- "+gettimeform(index).month+"月"+ gettimeform(index).dates+"日 -";
								if($scope.boxrooms){
										angular.forEach($scope.boxrooms,function(data,key){
										if(index == key){
											boxrooms[index] = new Array().concat($scope.boxrooms[key], datalist);
										}else{
											boxrooms[index] = datalist;
										}
									})
								}else{
									if(!boxrooms[index]){
										boxrooms[index] = [];
									}
									boxrooms[index] =  new Array().concat(boxrooms[index],datalist);
								}
							})
						}
				
				if (dataAll.pageNo == 1) { //变量赋值，如果是第一页则赋值，不是则重组
					$scope.battledata = dataAll.data;
					if(tabIndex==1){
						$scope.battledata.rooms = roomlist;
					}
					if(tabIndex==0){
						if(dataAll.totalCount == 0){
							$scope.battledata.rooms = [];
						}
						$scope.nboxrooms = roomlist;
					}
					if(tabIndex==2){
						if(JSON.stringify(boxrooms) == "{}"){
							$scope.battledata.rooms = [];
						}
						$scope.boxrooms = boxrooms;
					}
				} else {
					if(tabIndex==1){
						$scope.battledata.rooms = new Array().concat($scope.battledata.rooms, roomlist);
					}
					if(tabIndex == 0){
							$scope.nboxrooms = new Array().concat($scope.nboxrooms,roomlist);
					}
					if(tabIndex == 2){
						$scope.boxrooms = Object.assign($scope.boxrooms,boxrooms)
					}
				}
				$scope.battledata.status = tabIndex | 0;
				$timeout(function() {
					if (isTab || isClassic) {
						tabAct(isTab, tabIndex, isClassic, $scope.playerTypeAct.id); //状态tab切换效果
					} else {
						$ionicLoading.hide();
					}
				}, 500)
			}
		}
	//	调用3v3房接口的方法
//		function getThrRooms(tabIndex,matchId,page,isTab,isClassic){
//			$scope.hasData = true;
//			var data = {
//				usePage:page,
//				data:{
//					"status":tabIndex,
//					"filter":1,
//					"join":1,
//				}
//			}
//			Thr.list(data).then(function(dataAll){
//				if(dataAll.code==0){
//					var nowPage = data.usePage;
//					var totalPage = dataAll.totalPageCount?dataAll.totalPageCount:1;
//					if(dataAll &&　dataAll.code==0 && dataAll.data && nowPage<=totalPage){
//						var lists = $scope.battledata;
//						angular.forEach(dataAll.data, function(data, index) {
//							dataAll.data[index].firstPrize = toThousands(data.firstPrize);
//							dataAll.data[index].fee = toThousands(data.fee);
//							dataAll.data[index].myPrize = toThousands(data.myPrize);
//							if(dataAll.data[index].unused){
//								$scope.unused_style = {
//									"-webkit-filter":"grayscale(1)"
//								}
//							}else{
//								$scope.unused_style = {}
//							}
//						})	
//						if(nowPage>1){
//							$scope.battledata = new Array().concat(lists, dataAll.data);
//						}else{
//							sessionStorage.setItem("battle_thr",JSON.stringify(dataAll.data));
//							$scope.battledata = dataAll.data;		
//						}
//						$scope.hasData = false;
//					}
//					if(nowPage>=totalPage){
//						$scope.hasData = true;
//					}
//					
//					$timeout(function(){
//						if(isTab || isClassic){
//							$scope.totalCountThr = dataAll.totalCount;
//							tabAct(isTab,tabIndex,isClassic,$scope.playerTypeAct.id);//状态tab切换效果
//						}else{
//							$ionicLoading.hide();
//						}
//					}, 500)
//				}else{
//					$ionicLoading.hide();
//					$scope.hasData=true;
//				}
//			}, function(error){
//				$timeout(function(){
//					$ionicLoading.hide();
//				}, 500)
//			})
//		}
	//	调用竞猜房接口的方法
		function getPrizesRooms(type,match,tabIndex,page,isTab,isClassic){
			$scope.hasData = true;
			Prizes.matchList(type,'',tabIndex,page).then(function(dataAll){
				if(dataAll &&　dataAll.code==0){
					var nowPage = page;
					var totalPage = dataAll.totalPageCount?dataAll.totalPageCount:1;
					if(dataAll &&　dataAll.code==0 && dataAll.data && nowPage<=totalPage){
						angular.forEach(dataAll.data, function(data_s,index_s) {
								var left_Start = gettimeform(data_s.leftMatch.start_time,data_s.deadTime);
								var right_Start = gettimeform(data_s.rightMatch.start_time,data_s.deadTime);
								data_s.leftMatch.start_timeHour = (left_Start.isNextDay?left_Start.isNextDay:'')+left_Start.hours +":"+left_Start.minutes;//左边比赛的开始时间
								data_s.rightMatch.start_timeHour = (right_Start.isNextDay?right_Start.isNextDay:'')+right_Start.hours +":"+right_Start.minutes;//右边比赛的开始时间
								lineup_qudh(data_s.home.shirtNum, data_s.home)//球衣号码
								lineup_qudh(data_s.away.shirtNum, data_s.away)//球衣号码
								data_s.timeList = '- '+gettimeform(data_s.deadTime).month+"月"+gettimeform(data_s.deadTime).dates+"日 -";
						})
						var lists = $scope.battle_prizes;
//						dataAll.data = matchDeadTime(dataAll.data);//去掉倒计时
						if(nowPage>1){
							$scope.battle_prizes = new Array().concat(lists, dataAll.data);
						}else{
							$scope.battle_prizes = dataAll.data;
							$scope.battle_prizesOnepage = dataAll.data;
						}
						$scope.prizesTimeBox = [];
						if(tabIndex == '2'){
							var map = {},dest = [];
							for(var i = 0; i < $scope.battle_prizes.length; i++){
							    var ai = $scope.battle_prizes[i];
							    if(!map[ai.timeList]){
							        dest.push({
							            timeList: ai.timeList,
							            status:tabIndex,
							            data: [ai]
							        });
							        map[ai.timeList] = ai;
							    }else{
							        for(var j = 0; j < dest.length; j++){
							            var dj = dest[j];
							            if(dj.timeList == ai.timeList){
							                dj.data.push(ai);
							                break;
							            }
							        }
							    }
							}
							$scope.prizesTimeBox = dest;
						}
						$scope.hasData = false;
					}
					if(nowPage>=totalPage){
						$scope.hasData = true;
					}
					
					$timeout(function(){
						if(isTab || isClassic){
							$scope.totalCount = dataAll.data.length;
							tabAct(isTab,tabIndex,isClassic,$scope.playerTypeAct.id);//状态tab切换效果
						}else{
							$ionicLoading.hide();
						}
					},500)
				}else{
					$ionicLoading.hide();
					$scope.hasData=true;
				}
			}, function(error) {
				$timeout(function() {
					$ionicLoading.hide();
				}, 500)
			})
		}
		
	//  对战的经典房的tab切换
		$scope.choosestatus = function($index,type,match){//房间状态，房间类型，联赛类型
			TALKWATCH("赛况-顶部tab切换",$index);
	//		TALKWATCH("赛况-顶部tab切换",$index);
			$ionicLoading.show(); //加载页面
	//		添加battle的tab导航效果
	//		$scope.tabIndex = $index;
			$scope.page_prizes = 1;	//竞猜房间的页数
			$scope.page_def = 1;	//经典房间的页数
//			$scope.page_thr = 1;	//经典房间的页数
			$scope.moreDataCanBeLoaded = true;
			$scope.hasData = true;
			//恢复原形
			$ionicScrollDelegate.scrollTop();
			$(".returntop").css({
				display: "none"
			});
			if(type == 3){//如果是传统房间
				getDefaultRooms($index,'',$scope.page_def,true);
			}else if(type ==1){//如果是竞猜房间
				getPrizesRooms(type,'',$index,$scope.page_prizes,true);
			}
			else if(type ==2){//如果是3vs3
//				getThrRooms($index,'',$scope.page_thr,true);
			}
			
		}
		
	//	传统房和3v3的未开始跳转阵容
		$scope.showLineup = function(roomId,playId,matchId){
				$ionicLoading.show();
				if(playId ||playId==0){
					var playId = parseInt(playId);//防止获取到字符串的id不识别
					switch(playId){
						case 2:
						   	TALKWATCH ("赛况-3v3未开始跳转阵容",roomId);
							Thr.lineup(roomId).then(function(data){
								if(data.code==0){
									sessionStorage.setItem("lineup_thr",JSON.stringify(data));
									$timeout(function(){
										var $url = "#/tab/battle/" + playId + "/" + matchId + "/0";
										history.replaceState({},"",$url);
										var path = "#/tab/battle/lineup-thr/" + roomId +"/"+ playId +"/" + matchId +"/"+ 0;
										history.pushState({},"",path);
										$ionicLoading.hide();									
									},500);
								}else{
									$ionicLoading.hide();
								}
							},function(error){
								$timeout(function() {
									$ionicLoading.hide();
								}, 500)
							})
						break;
						case 3:
						$scope.hasData = true;
							TALKWATCH ("赛况-经典房未开始跳转阵容",roomId);
							Battle.lineupNostartEle(roomId).then(function(data){
								if(data.code==0){
									sessionStorage.setItem("battle_lineup", JSON.stringify(data.data));
									$timeout(function() {
										if(matchId == 1){
											$scope.matchId = false;
										}else{
										    $scope.matchId = true;	
										}
										var $url = "#/tab/battle/" + playId + "/" + $scope.matchId + "/0";
										history.replaceState({},"",$url);
										var path = "#/tab/battle/battle-lineup/" + roomId +"/"+ playId +"/" + matchId +"/"+ 0;
										history.pushState("","",path)
		//								$location.path(path);
										$ionicLoading.hide();
									}, 500)
								}else{
									$ionicLoading.hide();
								}
							},function(error){
								$ionicLoading.hide();
							})
	//						$timeout(function(){
	//							$ionicLoading.hide();
	//						},5000)
						break;
					}
					
				}
			}
		$scope.going = function(roomId,playId,matchId){
	       $ionicLoading.show();
				if(playId ||playId==0){
					var playId = parseInt(playId);
					switch(playId){
						case 2:
						   	TALKWATCH ("赛况-3v3进行中",roomId);
							Thr.lineup(roomId).then(function(data){
								if(data.code==0){
									sessionStorage.setItem("lineup_thr",JSON.stringify(data));
									$timeout(function(){
										var $url = "#/tab/battle/" + playId + "/" + matchId + "/1";
										var path = "#/tab/battle/roomGoing/" + roomId +"/"+ playId +"/" + 0;
										history.replaceState({},"",$url);
										history.pushState({},"",path);
										$ionicLoading.hide();									
									},500);
								}else{
									$ionicLoading.hide();
								}
							},function(error){
								$timeout(function() {
									$ionicLoading.hide();
								}, 500)
							})
						break;
						case 3:
						$scope.hasData = true;
							TALKWATCH ("赛况-经典房进行中",roomId);
							Battle.lineupNostartEle(roomId).then(function(data){
								if(data.code==0){
									sessionStorage.setItem("battle_lineup", JSON.stringify(data.data));
									$timeout(function() {
										var $url = "#/tab/battle/" + playId + "/" + matchId + "/1";
										history.replaceState({},"",$url);
										var path = "#/tab/battle/roomGoing/" + roomId +"/"+ playId +"/" + 0;
										history.pushState("","",path)
		//								$location.path(path);
										$ionicLoading.hide();
									}, 500)
								}else{
									$ionicLoading.hide();
								}
							},function(error){
								$ionicLoading.hide();
							})
						break;
					}
					
				}
		}
		//	传统房和3v3的已结束跳转
		$scope.lineup_end = function(status,roomId,userId,playId,unused){		
			if(playId || playId==0){
				$ionicLoading.show();
				playId = parseInt(playId);
				switch(playId){
					case 3:
						if(unused){
							$ionicLoading.hide();
							var msg = "因无其他玩家参与，此房间已失效。您花费的星钻已退至您的账户内，有问题请及时与我们联系"
							$scope.alertDark(msg);return;
						}
					   TALKWATCH ("赛况-经典房的已结束跳转",roomId);
						Battle.battleRanking(roomId).then(function(data){
							sessionStorage.setItem("battle_lineupEnd",JSON.stringify(data));
							$timeout(function() {
								var $url = "#/tab/battle/" + playId + "/" + '' + "/" + status;
								history.replaceState({},"",$url);
								var path = "#/tab/battle/battle-room/" + status +"/"+ roomId +"/"+ playId +"/"+userId;
								history.pushState("","",path);
	//							$location.path(path);
								$ionicLoading.hide();
							}, 500)
						},function(error){
							$timeout(function(){
								$ionicLoading.hide();
							}, 500)
						})
					break;
					case 2:
						TALKWATCH ("赛况-3v3的已结束跳转",roomId);
						if(unused){
							$ionicLoading.hide();
							var msg = "因无其他玩家参与，此房间已失效。您花费的星钻已退至您的账户内，有问题请及时与我们联系";
							$scope.alert(msg);return;
						}
						Thr.userList(roomId,1).then(function(data){//参数1 为按排名排序
							sessionStorage.removeItem("battle_lineupEnd");
							sessionStorage.setItem("battle_lineupEnd",JSON.stringify(data));
							$timeout(function(){
								var $url = "#/tab/battle/" + playId + "/" + '' + "/" + status;
								var path = "#/tab/battle/battle-room-thr/" + status +"/"+ roomId +"/"+ playId +"/"+userId;
								history.replaceState({},"",$url);
								history.pushState("","",path);
	//							$location.path(path);
								$ionicLoading.hide();
							}, 500)
						},function(error){
							$timeout(function() {
								$ionicLoading.hide();
							}, 500)
						})
					break;
					default:
						Battle.battleRanking(roomId).then(function(data){
							sessionStorage.setItem("battle_lineupEnd",JSON.stringify(data));
							$timeout(function() {
								var path = "/tab/battle/battle-room/" + status +"/"+ roomId +"/"+ playId +"/"+userId;
								$location.path(path);
								$ionicLoading.hide();
							}, 500)
						},function(error){
							$timeout(function() {
								$ionicLoading.hide();
							}, 500)
						})
					break;
				}
			}
				$timeout(function(){
					$ionicLoading.hide();
				},5000)
	
		}
		
	//	竞猜房间的跳转  数字是位置 1是首页跳转2是赛况跳转
		$scope.go_detial = function(roomId,classicId,matchId,status,result){
			if(result==3){
				$scope.toastDark("房间已失效");return;
			}
			$ionicLoading.show();//$scope.hasData = true;
			Prizes.roomDetial(roomId).then(function(data){
				if(data.code==0){				
					status = data.data.status;
					$scope.battle_prizes_detial = data.data;
					sessionStorage.setItem('prizes_detial',JSON.stringify(data));
					sessionStorage.setItem("battle_prizes", JSON.stringify($scope.battle_prizesOnepage));
//					sessionStorage.setItem("battle_prizes", JSON.stringify($scope.battle_prizes));
					var $url = "#/tab/battle/1/" + matchId +"/"+ status;
					history.replaceState({},"",$url);
					if(status==0){
						TALKWATCH("赛况-竞猜房的未开始跳转",roomId);
						var isMine = true;
						var url = "/tab/main/prizes/detial/"+ roomId + "/" + classicId +"/"+ matchId +"/"+ status +"/"+ isMine;
						$location.path(url);
						$ionicLoading.hide();
					}else if(status == 1){
						var url = "/tab/battle/battle-prizes-going-detial/"+ roomId + "/" + classicId +"/"+ matchId +"/"+ status;
						$location.path(url);
						$ionicLoading.hide();
					}else if(status == 2){
						TALKWATCH("赛况-竞猜房的已结束跳转",roomId);
						var url = "/tab/battle/battle-prizes-end-detial/"+ roomId + "/" + classicId +"/"+ matchId +"/"+ status;
						$location.path(url);
						$ionicLoading.hide();
					}
				}else{
					$ionicLoading.hide();
				}
	
			},function(error){
				$ionicLoading.hide();
			})
			
			$timeout(function(){
				$ionicLoading.hide();
			},5000)
		}
	
		$scope.morePrizesRooms = function(){//球星对战加载更多
			$scope.$broadcast('scroll.infiniteScrollComplete');
			if($scope.hasData != true){
				$scope.page_prizes = $scope.page_prizes+1;
				getPrizesRooms($scope.playerTypeAct.id,'',$scope.battlestatusAct,$scope.page_prizes,false);
			}
		}
//		$scope.moreThrRooms = function(){
//			$scope.$broadcast('scroll.infiniteScrollComplete');
//			if($scope.hasData != true){
//				$scope.page_thr = $scope.page_thr+1;
//				getThrRooms($scope.battlestatusAct,'',$scope.page_thr,false);
//			}
//		}
		$scope.moreDefRooms = function(){//经典战加载更多
			$scope.$broadcast('scroll.infiniteScrollComplete');
			if($scope.hasData != true){
				$scope.page_def = $scope.page_def+1;
				getDefaultRooms($scope.battlestatusAct,'',$scope.page_def,false,false)
			}
		}
		$scope.playerDetial = function(){
			return;
		}
		$scope.vote = function(rule,data,prizeItem,$index){/*点击投票调用的方法*/	
			if(rule == true){
				if(prizeItem.homeCost){
					$scope.textmsg = "追加支持"
				}else{
					$scope.textmsg = "支持"
				}
			}else{
				if(prizeItem.awayCost){
					$scope.textmsg = "追加支持"
				}else{
					$scope.textmsg = "支持"
				}
			}
			var str = {"球员":data.playerName}
			TALKWATCH("球星对战-赛况未开始",$scope.textmsg,str)
			$scope.isHome = rule;//		判断是否是主场球员
			$scope.voteInfo = {
				"isHome":rule,
				"roomId":prizeItem.id,
				"isList":true,
				"index":$index,
				"dataName":"battle_prizes",
			}
			$scope.voter = data;//投票球员
			$scope.voter.expectPrize =rule?prizeItem.homeExpectPrize:prizeItem.awayExpectPrize;
			/*剩余星钻*/
			var user = sessionStorage.getItem("user");
		 	if(user){
		 		$scope.userInfoDetial(JSON.parse(user));
		 		$scope.xz = $scope.userData.dmd;
		 		$scope.xz_f = JSON.parse(user).dmd;
		 	}else{
		 		$scope.userInfoDetial();
		 		$timeout(function(){	 			
			 		var user = sessionStorage.getItem("user");
			 		if(user){
				 		$scope.userInfoDetial(JSON.parse(user));
				 		$scope.xz = $scope.userData.dmd;
				 		$scope.xz_f = JSON.parse(user).dmd;
			 		}else{
			 			$scope.xz = 0;$scope.xz_f = 0;
			 		}
		 		},1000)
		 	}
	
			/*显示输入框*/
			$("#vote_num").val('1');
			var min = $("#vote_num").val();
			$('.tab-battle').find('.input_bg').css({display:"block"});
			$("#vote_num").bind('input oninput',function(event){
				getVal(event,min,99999,$scope.xz_f);
			})
			$timeout(function(){
				setNum(min,99999,$scope.xz_f);//调用加减得函数
			},1200)
		}
	}
	ctrl.$inject = ['$scope',"$interval","$rootScope", '$stateParams', '$ionicScrollDelegate', "$location", '$ionicLoading', '$timeout', 'Battle','Prizes','Thr'];
	app.registerController("BattleCtrl",ctrl);//return ctrl;
})
