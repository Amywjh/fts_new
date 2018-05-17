define(["app"],function(app){
	"use strict";
	function ctrl ($scope,$rootScope,$ionicScrollDelegate,$ionicModal, $location,$timeout, $stateParams,$ionicLoading,Hall,LineUp) {
		$scope.leagueId=$stateParams.leagueId
		$scope.tabIndex=$stateParams.tabIndex
		$scope.state=$stateParams.state
		$scope.time=$stateParams.time
		$scope.lineupId = $stateParams.lineupId
		$scope.roomId = $stateParams.roomId
		// 3经典站  0三人站
	
		
		if($scope.state == 3 ){
			//返回
			$scope.success_goback=function(){
				$location.path("/tab/hall/0");
			}
			//跳转
			$scope.success_for=function(){
					$location.path("/tab/battle/"+$scope.state+"/" + $scope.leagueId + "/" + $scope.tabIndex);
			}
		}else if($scope.state == 0){
				//返回
			$scope.success_goback=function(){
				$location.path("/tab/main/thrvsthr");
			}
			//跳转
			$scope.success_for=function(){
				$scope.path="/tab/battle/"+$scope.tabIndex+"/"+ $scope.leagueId+"/"+0;
			    $location.path($scope.path)
			}
		}
		$scope.success_home=function(){
			 var state="";
			if($scope.state == 0){
				state="3人战"
			}else{
				state="经典战"
			}
			$scope.path='/tab/main'
			$location.path($scope.path)
		}
			
			///******************** new
			TALKWATCH("经典战-阵容创建成功")
			if($scope.tabIndex == 4){
				$scope.backaddress = '返回我的竞猜'
			}else{
				$scope.backaddress = '返回经典战大厅'
			}
			
			$scope.lineupLists = {1:"4-4-2",2:"4-5-1",3:"5-4-1",4:"5-3-2",5:"4-3-3",6:"3-5-2",7:"3-4-3"};
			$scope.lineupalls = JSON.parse(sessionStorage.getItem("lineupSuccess"));
			$scope.lineupcontent = {}
	//		console.log($scope.lineupalls);
			if($scope.lineupalls){
				angular.forEach($scope.lineupLists,function(list,id){
					if($scope.lineupalls.savedata.fmtType == id){
						 $scope.liupfamid = list;
						 $scope.liupimg = $scope.lineupalls.savedata.fmtType - 1 +"_1";
					}
				})
				$scope.lineupcontent = $scope.lineupalls.lineupcontent;
			}else{
				LineUp.battleUpdateLineup({roomId:$scope.roomId}).then(function(data){
					if(data.code == 0){
						$scope.liupfamid = data.data.lineupMsg.formation.fmt_name;
						$scope.liupimg = data.data.lineupMsg.formation.fmt_type - 1 +"_1";
						$scope.lineupcontent.one =  data.data.lineupMsg.foward ;
						$scope.lineupcontent.two =  data.data.lineupMsg.center;
						$scope.lineupcontent.thr =  data.data.lineupMsg.guard;
						$scope.lineupcontent.for =  data.data.lineupMsg.goalkeeper;
						angular.forEach($scope.lineupcontent,function(cont,ii){
							angular.forEach(cont,function(cont_i,ii_i){
								lineup_qudh(cont_i.shirt_num,cont_i)
							})
						})
					}
				})
			}
			
			// 返回经典站
			$scope.bntbalck = function(){
				if($scope.tabIndex == 4){
					$location.path("/tab/battle/3/" + $scope.leagueId + "/0");
					sessionStorage.removeItem("battle_default")
				}else{
					$location.path("/tab/hall/0")
				}
			}
			// 同步阵容
			$scope.bntlineupcopy = function(){
				TALKWATCH("经典站点击同步房间")
				$ionicModal.fromTemplateUrl('templates/lineup/lineup-roomlistmod.html', {
				scope: $scope,
				 animation: 'slide-in-up'
				}).then(function(modal) {
					$scope.roomlistmod = modal;
					$scope.roomlistmod.show();
				});
			}
			$scope.$on("$ionicView.beforeLeave",function(){
				if($scope.roomlistmod){
					$scope.roomlistmod.remove();
				}
				
			})
			
			// 点击同步阵容
			$scope.copylineupto = function(roomid,room){
				if(room.fee && room.fee>0){
					var entryFee = room.fee?room.fee:'';
					var msg = '确定使用<img class="a-img-size" src="../../img2.0/joinroom/zs_28.png"/> '+entryFee+' 加入房间？';
				}else{
					var msg = '确定加入房间？';
				}
				if(room.joined == 1){
					var msg = '确定替换以前阵容吗？';
				}
				var confirmPopup = $scope.url_ts(msg);
				confirmPopup.then(function(res){
					if (res) {
						lineupSync(roomid,room)
					}
				});
			}
		lineupRoomList(1);	
		// 查看比赛队伍
		$scope.teamhave = function(){
			//对战列表弹窗
			$ionicModal.fromTemplateUrl('templates/classics/teams-modal.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal) {
				$scope.teams = modal;
				$scope.teams.show();
			});
		}
		$scope.moreDataCanBeLoaded = true;
		$scope.currentPage = 2;
				//上拉加载
		$scope.loadMore = function(){
			$timeout(function(){
				if($scope.moreDataCanBeLoaded){
					$scope.$broadcast('scroll.infiniteScrollComplete');
					return;
				}
				lineupRoomList($scope.currentPage);
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.currentPage += 1;
				$ionicScrollDelegate.$getByHandle('mainScroll').resize();
			},1000)
		}
		
		
		var firstBlack = localStorage.getItem("firstBlack")
		// 确定第一次返回
		if(firstBlack === null){
			var str = [false]
			localStorage.setItem("firstBlack",JSON.stringify(str))
		}else if(JSON.parse(firstBlack)[0]  === false){
			var str = [true]
			localStorage.setItem("firstBlack",JSON.stringify(str))
		}
		
		//同步阵容显示房间列表
        function lineupRoomList(page){
        	page = page?page:1;
//      	console.log(page,$stateParams.roomId,$stateParams.lineupId)
			Hall.lineupRoomList(page,$stateParams.roomId,$stateParams.lineupId).then(function(list){
				if(list.code == 0){
					if(!$scope.hallroomall){
						$scope.roomList = [];
						$scope.hallroomall = list.data;
						$scope.teamsdate = $scope.hallroomall.deadTime;
					    $scope.teamsdegree = $scope.teamnum = $scope.hallroomall.matchList.length;
					}
					angular.forEach(list.data.roomList, function(data, index, array) {
						data.maxPrizePool = toThousands(data.maxPrizePool);
						data.feeNum = data.fee;
						data.fee = toThousands(data.fee);
						if(data.playType == 0){
							data.playTypeName = '第一名'
							data.playTypenum = '16'
						}else if(data.playType == 1){
							data.playTypeName = "前三名"
							data.playTypenum = '17'
						}else if(data.playType == 2){
							data.playTypeName = "前25%"
							data.playTypenum = '18'
						}else if(data.playType == 3){
							data.playTypeName = "前50%"
							data.playTypenum = '19'
						}else{
							data.playTypeName = "一对一"
							data.playTypenum = '20'
						}
					   data.mark = data.userCount/parseInt(data.maxUserCount)*100
					})
					if(list.totalPageCount==1){
							$scope.roomList= list.data.roomList;
							$scope.moreDataCanBeLoaded = true;
							$ionicLoading.hide();
							return false;
						}
					for (var i = 0; i < list.data.roomList.length; i++) {
						$scope.roomList.push(list.data.roomList[i]);
					}
                    if(page==list.pageNo){
                    	$scope.moreDataCanBeLoaded = true;
                    }
					if (list.pageNo < list.totalPageCount){
						$timeout(function(){
							$scope.moreDataCanBeLoaded = false
						},500)
					}else{
						$scope.moreDataCanBeLoaded = true
					}
					if(list.pageNo == list.totalPageCount){
						$scope.more_end = true;
					}
				}
			})
        }
        function lineupSync(roomId,room){
        	Hall.lineupSync(roomId,$scope.lineupId).then(function(data){
        		if(data.code == 0){
        			room.copy = true;
        			if(room.joined == 0){
        				room.userCount++;
        				room.mark = room.userCount/parseInt(room.maxUserCount)*100;
        			}
        			$scope.userInfoDetial();
        			$ionicLoading.hide();
        			TALKWATCH("经典站同步房间成功")
        			return false;
        		}
        		if(data.code == 1){
//      			$scope.toastDark(data.msg)
        			return false;
        		}
        		if(data.code == 2){
        			$scope.toastDark(data.msg)
        			return false;
        		}
        		if(data.code == 4){
        			$scope.toastDark(data.msg);
        			return false;
        		}
        		if(data.code == 1001){//余额不足
        			$scope.msg = '钻石余额不足,是否前往充值?';
					$scope.chargeAction($scope.msg,"取消","立即充值",true);
        			return false;
        		}
        		if(data.code == 1006){//星币余额不足，可以通过兑换满足的情况。
					$ionicLoading.hide();
					var msg = {"money":Number(data.data.diamond)};
					var callFun = function(){//兑换成功后回调
						$ionicLoading.show();
						lineupSync(roomId,room);
					}
					$scope.onceExchange("星钻余额不足",msg,"兑换并支付",callFun);//调用兑换功能
					return false;
				}
        		if(data.code == 6001){//房间已经截止，不能加入
        			$scope.toastDark(data.msg)
        			return false;
        		}
        		if(data.code == 6002){//房间人数已满，不能加入
        			$scope.toastDark(data.msg)
        			return false;
        		}
        	})
        }
        
          //  引导
          $scope.guideFun = function(){
          	$ionicModal.fromTemplateUrl('templates/main/modal/rewardModal.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal) {
				$scope.rewardModal = modal;
				$scope.rewardModal.show();
				$scope.forPage = true;
			})
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				$scope.rewardModal.remove();
			})
			
			$scope.nextPage = function(index){
				if(index == 4){
					$scope.rewardModal.remove();
				}
			}
          }
        
        
        // 首次进入引导 
	 	var locationGuide = JSON.parse(localStorage.getItem("guideNew"));
		if(locationGuide && locationGuide["submit"] === false){
			locationGuide["submit"] = true;
			 $scope.guideFun();
			localStorage.setItem("guideNew",JSON.stringify(locationGuide));
		}
	}
	ctrl.$inject = ["$scope","$rootScope","$ionicScrollDelegate","$ionicModal", "$location","$timeout", "$stateParams","$ionicLoading","Hall","LineUp"];
		app.registerController("lineupsuccessCtrl",ctrl);//return ctrl;
})