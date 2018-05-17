define(["app"],function(app){
	"use strict";
	function ctrl ($scope,$interval,$rootScope, $ionicActionSheet, $http, $timeout, $ionicModal, $ionicLoading, $ionicScrollDelegate, $location, $stateParams,$ionicHistory, Hall,Battle,Thr) {
		$scope.$on("$ionicView.beforeEnter",function(){
			var address = location.hash;
		 	history.pushState({},"","#/tab/main");
		 	location.hash = address;
		 	var historyView = $ionicHistory.forwardView();
//		 	console.log(historyView);
		 	if(historyView && historyView.stateName != "tab.hall-joinroom" && historyView.stateName != "tab.thrvsthr-creatroom" && historyView.stateName != "tab.battle-lineup"){
				$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
				hallShow();
				first_choose = true;
		 	}else if(!historyView){
				$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
		 		hallShow();
				first_choose = true;
		 	}
		 	
		 	// 首次进入引导 
		 	var locationGuide = JSON.parse(localStorage.getItem("guideNew"));
			if(locationGuide && locationGuide["hall"] === false){
				$scope.guideFun(true)
				locationGuide["hall"] = true;
				localStorage.setItem("guideNew",JSON.stringify(locationGuide));
			}
			 TALKWATCH("经典战大厅") 
		})
	    $scope.searchclear = '';
	    $scope.playType = '16';
		var hallShow = function(){//大厅默认显示的方法
			$scope.currentPage = 1;//定义初始页为1
			$scope.halldata = {};
			$scope.moreDataCanBeLoaded = true;
			if(JSON.parse(localStorage.getItem("hallvsthrfilter"))) {//获取玩法缓存
				$scope.boxDate = JSON.parse(localStorage.getItem("hallvsthrfilter"));
				convet($scope.boxDate);
				$scope.onlyDate = $scope.boxDate[0];
				$scope.searchdata = serchdata($scope.onlyDate);
	//			var obj = $scope.boxDate.data;
	//		    boxDatefun(obj);
				//默认进入页  通过筛选获取房间
				if(sessionStorage.getItem("hall")){//获取房间list的缓存
					var hallData = JSON.parse(sessionStorage.getItem("hall"));
					if(hallData.code==0){
						getRoomItems(hallData);
					}
				}else{//如果房间list不存在，调用filter方法获取房间list
					$ionicLoading.show();
					$scope.filter($scope.currentPage);
				}
				//	默认为空的赛选
				$scope.choosedRoom = {};
			}else{//如果玩法缓存不存在的情况下
				if($scope.boxDate){
	//				var obj = $scope.boxDate.data;
	//		       boxDatefun(obj);
	                convet($scope.boxDate)
					angular.forEach($scope.boxDate,function(date,index){
						if(date.choose_css == true){
							$scope.onlyDate = $scope.boxDate[index];
						}
					})
					$scope.filter()
				}else{
					Hall.evematchList().then(function(data){
					if(data.code==0 &&  data.data.gameMatchList &&  data.data.gameMatchList.length>0){
	//					var obj = data.data;
	//		             boxDatefun(obj);
	                    var gameDateList = data.data.gameMatchList;
						$scope.onlyDate = gameDateList[0];
						var str = JSON.stringify(data);
					    sessionStorage.setItem("hallvsthrfilter",str); //将玩法存入到缓存中
						$scope.filter()
					  }else if(data.code==0){
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
					  	console.log($scope.dateMsg);
					  }else{
					  	$scope.noDateMsg = true;
					  }
					})
				}
			}
		}
	
	    //显示返回顶部方法
	    $scope.config ={
	    	showTop:false,
	    }
	    　$scope.toTopScroll = function(){
	        $scope.config.showTop = $ionicScrollDelegate.getScrollPosition().top>250?true:false;
	    };
		//返回顶部
		$scope.hallshow = function() {
			$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
		}
		//下拉刷新
		$scope.doRefresh = function(){
			//刷新时禁止出现加载  防止bug
			$scope.halldata.room =[];
			$scope.currentPage = 1;
			$scope.moreDataCanBeLoaded = true;
			$scope.more_end = false;
			$scope.noMorePage = true;
			$(".hall").children(".scroll").addClass('fanhui');
			$ionicLoading.show({
				template: '<div style="margin-top: 45vh;"><img id="load_bg" style="width:.32rem;height:.32rem" src="img2.0/main/refresh_1.png" /><span class="a-text-colorgreen" style="display:block;">房间刷新中，请稍候...</span></div>',
				delay: 500,
	//			duration: 1500
			});
				$scope.$broadcast('scroll.refreshComplete');
				$timeout(function(){
					$scope.moreDataCanBeLoaded = false
					$scope.filter();
				},1600)
		};
	
		//恢复默认
		$scope.exitchoose = function(){
			$scope.choosedRoom = angular.copy($scope.choosedRoom = angular.copy(defaultChoosed));//解除双向绑定
			$scope.peopleType = "所有";
			$scope.feeType = "所有";
			$scope.screen = false;
			delete $scope.matchList;
			$scope.choose.hide();
		};
	
			// 点击头像跳转到我的页面
		$scope.hallHead = function() {
			}
			//点击入场人数
		$scope.limitNum = function(name) {
			}
			//点击入场费
		$scope.entry = function(fee) {
			}
			//点击是否官方
		$scope.roomType = function(id) {
			}
			//点击是否参加比赛
		$scope.isJoin = function(id) {
		}
		
		//新
		//筛选弹窗
		$ionicModal.fromTemplateUrl('templates/classics/hall-choose.html', {
			scope: $scope,
			animation: 'slide-in-down'
		}).then(function(modal) {
			$scope.choose = modal;
		});
	  	//排序弹窗
	  	$ionicModal.fromTemplateUrl('templates/classics/hall-sortmodal.html', {
			scope: $scope,
			animation: 'slide-in-down'
		}).then(function(modal) {
			$scope.sortmodal = modal;
		});
		//房间已满弹窗
		$ionicModal.fromTemplateUrl('templates/classics/croommodal.html', {
			scope: $scope,
			 animation: 'fade-in'
		}).then(function(modal) {
			$scope.croom = modal;
		});
	  	$scope.$on('$destroy', function() {
	  		sessionStorage.removeItem("hall");
		    $scope.choose.remove();
		    $scope.sortmodal.remove();
		    $scope.croom.remove();
		    if($scope.creamfixedModal){
		    	 $scope.creamfixedModal.remove()
		    }
		    if($scope.quickSearchRoom){
		    	$scope.quickSearchRoom.remove()
		    }
		    if($scope.teams){
		    	$scope.teams.remove();
		    }
	//	    instance.destroy();
	  	});
	  			// 当隐藏的模型时执行动作
	  $scope.$on("modal.hidden", function(e) {
	   // 执行动作
		   if($scope.sortmodal){
			   	if($scope.sortId==0||!$scope.sortId){
					$timeout(function(){$scope.sortcss =''},500)
				}else{
					$timeout(function(){$scope.sortcss = 'upsortcss'},500)
				}
		   }
	      if($scope.choose && $scope.choosedRoom && defaultChoosed){
			   	if($scope.choosedRoom.entryId != defaultChoosed.entryId || $scope.choosedRoom.limitNumId!= defaultChoosed.limitNumId || $scope.choosedRoom.roomType != defaultChoosed.roomType || $scope.choosedRoom.isJoin!= defaultChoosed.isJoin){
					$timeout(function(){$scope.filtcss = 'upfiltcss';},500)
				}else{
					$timeout(function(){$scope.filtcss = '';},500)
				}
		   }
	  });
	  	//上拉加载
		$scope.loadMore = function(isSearch){
				$timeout(function(){
					if ($scope.moreDataCanBeLoaded == false){
						$scope.moreDataCanBeLoaded = true;
						if(!isSearch){
							$scope.currentPage += 1;
							$scope.filter($scope.currentPage);
						}else{
							$scope.currentPage += 1;
							dosearch($scope.searchVal);
							$scope.$broadcast('scroll.refreshComplete');
						}
					}
				},800)
				$ionicScrollDelegate.$getByHandle('mainScroll').resize();
	//			$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		
		
		
	  	//	创建房间模块
		$scope.creatroom = function() {
			$ionicModal.fromTemplateUrl('templates/classics/modal/creamcheckmodal.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal) {
				$scope.creamfixedModal = modal;
				$scope.creamfixedModal.show();
			})
			
		}
		

		$scope.checkCss0 = true;
	  	$scope.checkCss1 = false;
	  	$scope.typechecked = function(index){
	  		if($scope.checkCss0 == false && index == 0){
	  			$scope.checkCss0 = !$scope.checkCss0;
	  		    $scope.checkCss1 = !$scope.checkCss1;
	  		}
	  		if($scope.checkCss1 == false && index == 1){
	  			$scope.checkCss0 = !$scope.checkCss0;
	  		    $scope.checkCss1 = !$scope.checkCss1;
	  		}
	  		$scope.privacy = index;
	  	}		
	
	  	$scope.creamfixed = function(){
	  		creatroom();
	  	}
	  	function creatroom(){
	  		sessionStorage.removeItem('hallvsthrfilter')
			sessionStorage.removeItem('hall');
			$scope.creamfixedModal.hide();
		    TALKWATCH("经典战-点击创建房间");
			$ionicLoading.show();
			event.stopPropagation();
			Thr.thrvsthrfilter().then(function(data){
				if(data.code==0){
					if(data.data.length!=0){
						sessionStorage.setItem("thrvsthrfilter", JSON.stringify(data));
						if($scope.onlyDate) sessionStorage.setItem("onlyDate",JSON.stringify($scope.onlyDate));
						$scope.creamfixedModal.remove();
						$scope.privacy = $scope.privacy?$scope.privacy:0;
						$location.path("/tab/thrvsthr/creatroom/3/"+$scope.privacy);
						$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
								$ionicLoading.hide();
						})
					}else{
						$ionicLoading.hide();
						$scope.alertDark("近期暂无可竞猜比赛，无法创建房间。有新比赛我们会通过微信公众号第一时间通知您");
						return;
					}
				}else{
				   $ionicLoading.hide();
					return;
				}
			})
	  	}
	  	/**
	  	 *  快速进入房间
	  	 */
	  	$scope.quickRoom = function(){
	  	  	$ionicModal.fromTemplateUrl('templates/classics/modal/quickSearchRoom.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal) {
				$scope.quickSearchRoom = modal;
				$scope.quickSearchRoom.show();
				
			   var container = document.getElementById("inputBoxContainer");
			   new KeyBoard(container);
		      /**
			    * 快速搜索房间
				*/
				$scope.quickRoomShow = function(){
					var realInput = document.getElementById("realInput").value;
					console.log(realInput);
					Hall.joinRoomByRN(realInput).then(function(data){
						if(data.code == 0){
							var _data = {
	                         	full:0,
	                         	join:data.data.isJoinRoom,
	                         	id:data.data.roomId,
	                         	max_level:data.data.maxLevel,
	                         	min_level:data.data.minLevel,
	                         	levelLimit:data.data.level_limit,
	                         }
	                         $scope.joinroom(_data);
	                         $scope.quickSearchRoom.remove();
						}else{
							$scope.alertDark("很抱歉！大厅内查找不到此房间<br/>请检查后重试")
						}
					})
                 
				}
				   
			});
	  	}
	  	
	  	//大厅日期选择
	  	// 大厅tabs
		var hallvsthrfilter = sessionStorage.getItem("hallvsthrfilter");
		if(hallvsthrfilter){
			var obj = JSON.parse(hallvsthrfilter).data;
			boxDatefun(obj.gameMatchList);
		}else{
			Hall.evematchList().then(function(data){
				if(data.code == 0 && data.data.gameMatchList && data.data.gameMatchList.length !=0){
					var str = JSON.stringify(data)
				    sessionStorage.setItem("hallvsthrfilter",str)
				    boxDatefun(data.data.gameMatchList);
			  	}
		  })
		}
	
		$scope.choose_wf = function($index){
			$ionicLoading.show();
			$timeout(function(){$scope.sortcss =''},500);
			$timeout(function(){$scope.filtcss = '';},500);
			$scope.currentPage = 1;
			$scope.searchclear='';
			$scope.noMorePage = false;
			first_choose = true;
			$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
			storeChoosed = angular.copy($scope.choosedRoom = angular.copy(defaultChoosed));//解除筛选条件绑定
			$scope.feeType = "所有";
			$scope.peopleType = "所有";
			$scope.sortId = 0;
		    $ionicLoading.show()
			$scope.halldata.room = [];//房间列表
			$scope.halldata.num = 0;
	     angular.forEach($scope.boxDate,function(data,index){
	     	if($index == index){
	     		data.choose_css = true;
	     		$scope.onlyDate = $scope.boxDate[index];
	     		angular.forEach($scope.sortList,function(data,ii){
					if(data.id == 0){
						data.checko = true;
						return false;
					}
					data.checko = false;
				})
	     		$scope.today = data.matchDay;
	     		$scope.todayhour = data.matchList[0].startTimePoint;
	     		$scope.todaycount = data.matchList[0].remainTime;
	     		$scope.filter(1);
	     		return false;
	     	}
	     	data.choose_css = false;
	     })
		}
	  	
	  	$scope.btnteamshow = function(team){
	  		$scope.teamsdate = $scope.boxDate[team].matchDay;
	  		$scope.teamsdegree = $scope.boxDate[team].matchCount;
	  		$scope.temalist = $scope.boxDate[team].matchList;
//	  		$ionicScrollDelegate.$getByHandle('teamsScroll').scrollTop(false);
	  		//对战列表弹窗
			$ionicModal.fromTemplateUrl('templates/classics/teams-modal.html', {
				scope: $scope,
				 animation: 'fade-in'
			}).then(function(modal) {
				$scope.teams = modal;
				$scope.teams.show();
			});
	  	}
		
		//筛选模块
		var first_choose = true;
		var defaultChoosed;var storeChoosed;
		$scope.choosedata={
			limitNum:[{id:0,name:"所有"},{id:1,name:"2-10"},{id:2,name:"11-30"},{id:3,name:"31-100"},{id:4,name:"101+"}],
			entry:[{id:0,name:"所有"},{id:1,name:"免费"},{id:2,name:"1-5"},{id:3,name:"6-20"},{id:4,name:"21-50"}],
		    list:[{id:5,name:"51+"}]
		}
		
		
		//点击筛选
		$scope.clickchoose = function(){
			$timeout(function(){$scope.filtcss = 'filtcss';},500)
			$scope.choose.show();
			//	筛选的数据
			if (first_choose){
				first_choose = false;
				//	默认的选中条件
				defaultChoosed = {
					entryId: 0,//entryId入场费id
					limitNumId: 0,//limitNumId入场人数id
					roomType: true,//roomType官方
					isJoin: false,//isJoin加入
				}
				$scope.choosedRoom = angular.copy($scope.choosedRoom = angular.copy(defaultChoosed));
				storeChoosed = angular.copy(storeChoosed = angular.copy(defaultChoosed));
			}
		}
		//确认筛选
		$scope.commitchoose = function(data) {
			if($scope.onlyDate){
				$ionicLoading.show();
				$scope.halldata.room = [];
				$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
				$scope.filter(1);
			}
			$scope.choose.hide();
			$timeout(function(){
			},600)
		};
		$scope.peopleType = $scope.feeType = '所有';
		$scope.peoplechosetype = function(name){
			$scope.peopleType = name;
		}
		$scope.feechosetype = function(name){
			$scope.feeType = name;
		}
		
		//排序模块//点击排序
		$scope.clicksort = function(){
			$timeout(function(){$scope.sortcss ='sortcss'},500);
			$scope.sortmodal.show();
		}
		$scope.sortList =[
			{id:0,typename:"默认排序",checko:true},
			{id:-1,typename:"参与人数（从高到低）"},
			{id:-3,typename:"最高奖池（从高到低）"},
			{id:-2,typename:"入场费（从高到低）"},
			{id:2,typename:"入场费（从低到高）"},
		]
		$scope.sortcheck = function(index){
			angular.forEach($scope.sortList,function(data,ii){
				if(data.id == index){
					data.checko = true;
					return false;
				}
				data.checko = false;
			})
			$scope.sortId = index;
			if($scope.onlyDate){
				$scope.halldata.room = [];
				$scope.filter(1,$scope.sortId)
			}
			$scope.sortmodal.hide();
		}
		// 搜索模块
			//模糊查询,实现查找功能
		var dosearch = function(val) {
			$scope.moreDataCanBeLoaded = true;
			var searchlist = {
					"name": val,
					"page": $scope.currentPage,
	                "ids":$scope.searchdata.ids,
					"matchDate":$scope.searchdata.matchDate,
					"league":$scope.searchdata.league,
					"status":0,
					"filter":1,
				}
			var search = Hall.hallSearch(searchlist);
			search.then(function(data) {
				$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
				if(data.code==0){
					$scope.roomhandle(data.data.rooms)
					$scope.halldata.num = data.totalCount;
					$scope.currentPage = data.pageNo;
					if(data.pageNo==1){
						$scope.halldata.room = data.data.rooms;
					}else{
						$scope.halldata.room = new Array().concat($scope.halldata.room,data.data.rooms);
					}
					if(data.totalPageCount > data.pageNo){
						$scope.moreDataCanBeLoaded = false;
						$scope.searchGoing = true;
					}
				}
			})
		};
		//搜索框点击键盘的搜索键
		//绑定确定按钮
		$scope.searchclear='';
		$scope.sclear = function(){
			$scope.searchclear='';
			if($scope.onlyDate){
				$ionicLoading.show();
				$scope.halldata.room = [];
				$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
				$scope.filter(1);
			}
		}
		$scope.myKeyup = function(e) {
				var keycode = window.event ? e.keyCode : e.which;
	//			$scope.dosearch($('.search[type=search]').val())
				if (keycode == 84 || keycode == 13) { //keycode==0表示点击手机输入键盘的go按钮，keycode==13表示点击键盘的enter
					$scope.currentPage = 1;
					if (ionic.Platform.isIOS()) {
						$scope.searchVal = $('.search[type=search]').val();
						if($scope.onlyDate){
							dosearch($('.search[type=search]').val())
						}
					} else {
						$scope.searchVal = $('.search[type=search]').val();
						if($scope.onlyDate){
							dosearch($('.search[type=search]').val())
						}
							//搜索后键盘出现
						$timeout(function() {
	//						$('.search[type=search]').val("")
							$('.search[type=search]').blur()
							$('.roomcount').css({
								'position': 'absolute'
							});
						}, 600)
					}
				}
			}
			//搜索时设置底部tab隐藏
		$('.search[type=search]').bind('focus', function() {
			$('.roomcount').css('position', 'static');
		}).bind('blur', function() {
			if (ionic.Platform.isIOS()) {
				$scope.searchVal = $('.search[type=search]').val();
				if($scope.onlyDate){
					dosearch($('.search[type=search]').val())	
				}
					//搜索后键盘出现
				$timeout(function() {
	//				$('.search[type=search]').val("")
					$('.roomcount').css({
						'position': 'absolute'
					});
				}, 600)
			} else {
				//  清空文本内容
	//			$('.search[type=search]').val("")
				$timeout(function() {
					$('.roomcount').css({
						'position': 'absolute'
					});
				}, 600)
			}
		});
		
		//  加入房间模块
		$scope.joinroom = function(data) {
			    sessionStorage.removeItem('hallvsthrfilter')
			    sessionStorage.removeItem('hall')
//			    console.log(data);return;
				if (data.full == 0 && !data.join){
					if(data.level_limit ==1 && ($scope.userData.currLevel<data.min_level || $scope.userData.currLevel>data.max_level)){
						$scope.msgHtml = '很抱歉！本房间只有等级<span class="a-text-color-whit">Lv.'+data.min_level+'-Lv.'+data.max_level+'</span>的人才可进入'
					    $scope.alertDark($scope.msgHtml);
					    return false;
					}
					TALKWATCH("经典房-点击加入房间");
					$(".team").click(function() {
						var team_this = $(this);
						$(this).addClass("team_actived");
						$timeout(function() {
							team_this.removeClass("team_actived");
						}, 1000)
					})
					$("#allteam").find(".activated").addClass('pulse');
					$ionicLoading.show();
					var roomId = data.id;
					Battle.lineupNostartEle(roomId).then(function(data) {
						if(data.code==0){
							sessionStorage.setItem("joinroomdata", JSON.stringify(data.data));
							$location.path('/tab/hall/joinroom/' + roomId + "/" + '');
							$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
								$ionicLoading.hide();
							})
						}else{
							$ionicLoading.hide();
							$scope.alertDark(data.data || "本房间数据异常,请尝试加入其它房间 ");
						}
					}, function(error) {
						$ionicLoading.hide();
					})
				}else if(data.join){
					TALKWATCH("经典房-点击我的房间");
					var classId = "";
					var urlAdd = "/tab/battle/battle-lineup/" + data.id +"/"+3 +"/"+classId+ "/" +3 ;
					$ionicLoading.show();
					Battle.lineupNostartEle(data.id).then(function(dd) {
						if(dd.code==0){
							sessionStorage.setItem("battle_lineup", JSON.stringify(dd.data));
							$timeout(function() {
								$ionicLoading.hide();
								$location.path(urlAdd);
							})
						}else{
							$ionicLoading.hide();
						}
					}, function(error) {
						$ionicLoading.hide();
					})
				}else if(data.full == 1){
					$scope.croom.show();
				}
			}
		
		/**
		 *  2.2活动房标签
		 */ 
		 $scope.imgBiao = function(){
		 	var str ={
		 		"width":".38rem",
		 		"height":".16rem",
		 		"position":"absolute",
		 		"bottom":0,
		 		"right":0,
		 	}
		 	return str;
		 }
		
		// 联赛
		function boxDatefun(list){
	    	$scope.boxDate = list;
	    	convet($scope.boxDate)
	    	$scope.today = list[0].matchDay;
	     	$scope.todayhour = list[0].matchList[0].startTimePoint;
	     	$scope.todaycount = list[0].matchList[0].remainTime;
			angular.forEach($scope.boxDate,function(data,index){
	          if(index == 0){
		     		data.choose_css = true;
		     		return false;
		     	}
		     	data.choose_css = false;
		   })
	    }
		
		function getRoomItems(hallData){//有缓存的情况下处理数据的方法
			$scope.halldata.num = hallData.totalCount;//房间数
			$scope.halldata.room = hallData.data.rooms;//房间列表
			ShowCountDown(hallData.data.matchTime);
			$scope.roomhandle($scope.halldata.room);
			//	默认为空的赛选
			$scope.choosedRoom = {};
			if (hallData.pageNo < hallData.totalPageCount){
				$scope.moreDataCanBeLoaded = false;
				$scope.currentPage = 1;
			}
		}
		
		//房间列表及筛选排序等功能的方法
		$scope.filter = function(page,sort){
			// 首次返回
			var firstBlack = localStorage.getItem("firstBlack");
			if(firstBlack && JSON.parse(firstBlack)[0] === false){
               var firstBlack = [true];
               $scope.guideFun('',true);
               localStorage.setItem("firstBlack",JSON.stringify(firstBlack))
			}
			$scope.searchGoing = false;
			$scope.more_end=false;
			//当发起请求时 停止数据加载
			$scope.moreDataCanBeLoaded = true;
			//清空输入框内容
			$('.search[type=search]').val("")
			if (!$scope.halldata.room){
				$scope.choosedRoom = {};
				$scope.halldata.room = [];
			}
			$scope.searchdata = serchdata($scope.onlyDate);
			$scope.filterData = {
					page:page?page:1,
					status:0,
					filter:1,
					sort:parseInt($scope.sortId)?parseInt($scope.sortId):0,
					league:$scope.onlyDate.league,
	                ids:$scope.searchdata.ids,
					matchDate:$scope.searchdata.matchDate,
				}
			if($scope.choosedRoom && JSON.stringify($scope.choosedRoom) !== "{}"){
				$scope.filterData.entry = $scope.choosedRoom.entryId?$scope.choosedRoom.entryId:0;//入场费
				$scope.filterData.limitNum = $scope.choosedRoom.limitNumId?$scope.choosedRoom.limitNumId:0;//用户上限
				$scope.filterData.isShowFull = $scope.choosedRoom.roomType?0:1;//是否显示已满房间
				$scope.filterData.isJoin = $scope.choosedRoom.isJoin?1:0;//  是否加入
			}
			//	调用筛选的服务
			Hall.list($scope.filterData).then(function(data){
				if(data.code==0){
//					console.log(data)
						$scope.halldata.num = data.totalCount;
						$scope.ShowCountDown(data.data.matchTime);
						if (data.data.rooms){
							$scope.roomhandle(data.data.rooms)
							if(data.totalPageCount==1){
								$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
								$scope.halldata.room = data.data.rooms;
								$ionicLoading.hide();
								return false;
							}
							for (var i = 0; i < data.data.rooms.length; i++) {
								$scope.halldata.room.push(data.data.rooms[i]);
							}
							if (data.pageNo < data.totalPageCount){
								$scope.moreDataCanBeLoaded = false
							}else{
								$scope.moreDataCanBeLoaded = true;
								if($scope.halldata.num>4){
									$scope.more_end=true;
								}else{
									$scope.more_end=false;
								}
							}
						}
						$scope.currentPage = data.pageNo;
						$ionicLoading.hide();
				}else{
					$scope.halldata.num = 0;
					$scope.halldata.room = [];
					$ionicLoading.hide();
				}
			},function(error) {
				$scope.halldata.num = 0;
				$scope.halldata.room = [];
				$ionicLoading.hide();
			})
		}
		
		function serchdata(datalist){
			var ids='',page='';
			angular.forEach(datalist.matchList,function(list,index){
							ids += list.id + ',';
						})
			page ={
				page:1,
				status:0,
				filter:1,
				league:datalist.league,
	            ids:ids.substring(0,ids.length-1),
				matchDate:datalist.matchDate
			}
			return page;
		}
		function convet(datalist){
			angular.forEach(datalist,function(data,index){
				data.matchDay = gettimeform(data.matchDate).month+"-"+gettimeform(data.matchDate).dates;
			})
		}
		$scope.ShowCountDown = function(date){
			$interval.cancel($scope.setint);
			function going(){
				if(getTimeCount(date)){
					$scope.timedateup =getTimeCount(date);
				}
			}
		   going()
		   $scope.setint = $interval(function(){
		  	    going()
			},10000);
		}
		$scope.$on("$ionicView.beforeLeave",function(){
			$interval.cancel($scope.setint)
		})
		
		//  引导
		$scope.guideFun = function(twoPage,fivePage){
			$scope.twoPage = twoPage?twoPage:false;
			$scope.fivePage = fivePage?fivePage:false;
			$ionicModal.fromTemplateUrl('templates/main/modal/rewardModal.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal) {
				$scope.rewardModal = modal;
				$scope.rewardModal.show();
				$scope.guiIndex = 0;
			})
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				$scope.rewardModal.remove();
			})
		}
		$scope.nextPage = function(index){
			$scope.guiIndex ++ ;
			if(index == 2){
				$scope.nextImg = true;
				if($scope.guiIndex >1){
					$scope.twoPage = false;
					$scope.rewardModal.remove();
				}
			}
			if(index == 5){
				$scope.rewardModal.remove();
			}
		}
		
	}
	ctrl.$inject = ['$scope','$interval',"$rootScope", '$ionicActionSheet', '$http', '$timeout', '$ionicModal', '$ionicLoading', "$ionicScrollDelegate", '$location', "$stateParams","$ionicHistory", 'Hall', "Battle","Thr"];
		app.registerController("HallCtrl",ctrl);//return ctrl;
})