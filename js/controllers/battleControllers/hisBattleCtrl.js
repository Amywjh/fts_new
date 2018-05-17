//对战js***********************************************
define(["app"],function(app){
	"use strict";
	function ctrl($scope,$interval,$rootScope, $stateParams, $ionicScrollDelegate, $location, $ionicLoading, $timeout, Battle,Prizes,Thr) {
	//	房间类型
		$scope.playerType ={
			data:{
				"1":{name:'球星对战',activated:""},
				"2":{name:'三人战',activated:""},
				"3":{name:'经典11人',activated:""}
			}
		}
		$scope.battlestatusAct = 2;
		$scope.historyRecord = true;
	//	设置初始页page=1；
		$scope.page_prizes = 1;	//竞猜房间的页数
		$scope.page_def = 1;	//经典房间的页数
//		$scope.page_thr = 1; //3v3房间的页数
		var actPlay = $stateParams.classicId|3;
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
				data.room[ii].entry = toThousands(dd.entry);
				data.room[ii].bonus = toThousands(dd.bonus);
			})
			tabAct(2,true,$stateParams.classicId|3);//状态tab切换效果
			return data;
		}
		$scope.$on("$ionicView.beforeLeave",function(){
			$interval.cancel($scope.setint)
		})
		if($stateParams.classicId == 1){//球星对战
	//		获取缓存
			var battle_prizes = sessionStorage.getItem("battle_prizes_his");
			if (battle_prizes){
				$scope.battle_prizes = JSON.parse(battle_prizes);
				$scope.battle_prizesOnepage  = JSON.parse(battle_prizes);
				$scope.prizesTimeBox = [];
				var tabIndex = 2;
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
				tabAct(2,true,$stateParams.classicId|0);//状态tab切换效果
			}else{//玩法,联赛,状态,页码0,是否是状态切换
				getPrizesRooms($stateParams.classicId,'',2,$scope.page_prizes,true,true);
			}
			
		}else if($stateParams.classicId == 3){//经典战
			var battle_default = sessionStorage.getItem("battle_default_his");
			if(battle_default){
				operaData(JSON.parse(battle_default),2,true,true)
			}else{
				getDefaultRooms(2,'',$scope.page_def,true,true);
			}
			
		}else if($stateParams.classicId == 2){//3vs3

		}
	//	tab切换的函数
		function tabAct(tabIndex,isClassic,classicIndex){
			if(isClassic){
				angular.forEach($scope.playerType.data, function(data, index, array){
					if (index == classicIndex){
						$scope.playerType.data[index].activated = 'type_tab_activated';
					} else {
						$scope.playerType.data[index].activated = '';
					}
				});
			}
			$ionicLoading.hide();
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
				$scope.battledata = {};
				$scope.battledata.room = [];
				$timeout(function(){
					$scope.page_def = 1;//经典房间的页数
					getDefaultRooms(2,'',$scope.page_def,false,true);				
				},1300)
			}else if(type == 1){//竞猜房
				$scope.battle_prizes = [];
				$timeout(function(){
					$scope.page_prizes = 1;	//竞猜房间的页数
					getPrizesRooms(type,'',2,$scope.page_prizes,false,true);
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
			Battle.list(tabIndex,"",page,$stateParams.userId).then(function(dataAll){//房间状态，联赛类型，页数
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
					sessionStorage.setItem("battle_default_his",JSON.stringify(dataAll));
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
	//			console.log($scope.battledata);
				$timeout(function() {
					if (isClassic) {
						tabAct( 2, isClassic, $scope.playerTypeAct.id); //状态tab切换效果
					} else {
						$ionicLoading.hide();
					}
				}, 500)
			}
		}
	//	调用竞猜房接口的方法
		function getPrizesRooms(type,match,tabIndex,page,isTab,isClassic){
			$scope.hasData = true;
			Prizes.matchList(type,'',tabIndex,page,$stateParams.userId).then(function(dataAll){
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
						if( isClassic){
							$scope.totalCount = dataAll.data.length;
							tabAct(2,isClassic,$scope.playerTypeAct.id);//状态tab切换效果
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
					   TALKWATCH("历史记录-经典房详情跳转",roomId);
						Battle.battleRanking(roomId,$stateParams.userId).then(function(data){
							sessionStorage.setItem("battle_lineupEnd",JSON.stringify(data));
							$timeout(function() {
								var path = "/tab/battle/battle-room/" + status +"/"+ roomId +"/"+ playId +"/"+$stateParams.userId;
								$location.path(path);
								$ionicLoading.hide();
							}, 500)
						},function(error){
							$timeout(function(){
								$ionicLoading.hide();
							}, 500)
						})
					break;
					case 2:
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
//                  console.log($scope.battle_prizes)
					TALKWATCH("竞猜房历史记录跳转详情",roomId);
					var url = "/tab/battle/battle-prizes-end-detial/"+ roomId + "/" + classicId +"/"+ matchId +"/"+ status;
					$location.path(url);
					$ionicLoading.hide();
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
				getPrizesRooms($scope.playerTypeAct.id,'',2,$scope.page_prizes,false);
			}
		}
		$scope.moreDefRooms = function(){//经典战加载更多
			$scope.$broadcast('scroll.infiniteScrollComplete');
			if($scope.hasData != true){
				$scope.page_def = $scope.page_def+1;
				getDefaultRooms(2,'',$scope.page_def,false,false)
			}
		}
		$scope.playerDetial = function(){
			return;
		}
	}
	ctrl.$inject = ['$scope',"$interval","$rootScope", '$stateParams', '$ionicScrollDelegate', "$location", '$ionicLoading', '$timeout', 'Battle','Prizes','Thr'];
	app.registerController("hisBattleCtrl",ctrl);
})
