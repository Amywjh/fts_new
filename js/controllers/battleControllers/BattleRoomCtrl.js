//对战js***********************************************
define(["app"],function(app){
	"use strict";
	function ctrl($scope,$http,$ionicHistory, $stateParams, $ionicSlideBoxDelegate, $location, $rootScope, $ionicLoading, $timeout,$ionicModal,Battle,Thr,RTAll) {
	   	$scope.lineupShare = function(userId){//分享
			$ionicLoading.show();
			Battle.lineupShare($stateParams.roomId,userId).then(function(other){
				if(!other.code){
					var _url = "tab/battle/lineup/lineupShare/"+$stateParams.roomId+"/"+other.data.userInfo.id;
					var _date = gettimeform(other.data.matchDay);
					other.data.lineupTitle = _date.month +"月" + _date.dates +"日" + other.data.leagueName +"阵容竞猜";
					if(!other.data.lineupMsg){
						other.data.lineupMsg = {
							"LineUpExp":null,
							"lineUpFightValue":null,
							"lineUpSubmitTime":null,
							"salaryHot":null,
							"surPlusSalary":null,
							"surplusPerAvg":null,
							"formation":null
						}
					}
					var _userInfo = other.data;
					var _lineupInfo = getLineup(other);
					var _shareInfo = {
						"_userInfo":_userInfo,
						"_lineupInfo":_lineupInfo
					}
					sessionStorage.setItem("shareInfo",JSON.stringify(_shareInfo));
					$location.path(_url);$ionicLoading.hide();
				}else{
					$ionicLoading.hide();
				}
			},function(error){
				$ionicLoading.hide();
			})
		}
	   	TALKWATCH("经典战已结束-阵容");
		$scope.goodId = $stateParams.roomId;
		if ($stateParams.statusId == 2){
			//切换tab
			if ($stateParams.playId != 3){
				$scope.battletotal = [
					{'id': 0,'title': '排名','class': 'checked'},
					{'id': 1,'title': '我的阵容','class': ''},
					{'id': 2,'title': '球员数据','class': ''}, 
				]
			}else{
				$scope.battletotal = [
					{'id': 0,'title': '排名','class': 'checked'},
					{'id': 1,'title': '战报','class': ''}, 
				]
			}
			$scope.playId=parseInt($stateParams.playId);
			var playId = parseInt($stateParams.playId);
						//3v3默认的排行
			var getBattleRankThr = function (data){
				if(data.code!=0) return;
				$scope.battleRankData = data.data;
				$scope.battleRankData_result_one = data.data.matches[0];
				$scope.battleRankData_result_other = data.data.matches;
				$scope.games_num=$scope.battleRankData_result_other.length;
			//	玩家排名数据
				if(data.data.userList){	
					if(data.data.userList.length>3){
						$scope.topthree = data.data.userList.slice(0,3);
					}else{
						$scope.topthree = data.data.userList.slice(0,data.data.userList.length);
					}
				}
				$scope.ranks = data.data.userList;
				$scope.myselfData = data.data.my;
	//			console.log($scope.myselfData,$scope.battleRankData,$scope.topthree,$scope.ranks);
			}
			//经典房默认的排行
			var getBattleAct = function (data){
				if(data.code) return;
				$scope.battleRankData = data.data;
				$scope.battleRankData_result_one = $scope.battleRankData.teamInfo[0];
				$scope.battleRankData_result_other = $scope.battleRankData.teamInfo;
				$scope.games_num=$scope.battleRankData_result_other.length;
				$scope.teamsdate = $scope.battleRankData.matchDay;
				sessionStorage.setItem("battleRankData_result_one", JSON.stringify($scope.battleRankData_result_one));
				sessionStorage.setItem("battleRankData_result_other", JSON.stringify($scope.battleRankData_result_other));
				sessionStorage.setItem("battleRankData_name", JSON.stringify($scope.battleRankData.roomName));
				//	玩家排名数据
				if(data.data.userInfo){		
					if(data.data.userInfo.length>3){
						$scope.topthree = data.data.userInfo.slice(0,3);
					}else{
						$scope.topthree = data.data.userInfo.slice(0,data.data.userInfo.length);
					}
				}
				$scope.ranks = data.data.userInfo;
				var timeStamp = new Date().getTime();
				angular.forEach($scope.ranks,function(array,index){
					array.headImageUrl = array.headImageUrl+"?"+timeStamp;
				})
				$scope.myselfData = data.data.mine;
				$scope.myselfData.headImageUrl = $scope.myselfData.headImageUrl +"?"+timeStamp;
				$scope.matchRecord = data.data.matchRecord;
			}
			switch(playId){
				case 3:
					var battle_lineupEnd = sessionStorage.getItem('battle_lineupEnd');
					if(battle_lineupEnd){
						getBattleAct(JSON.parse(battle_lineupEnd));
					}else{
						Battle.battleRanking($stateParams.roomId).then(function(data){
							getBattleAct(data);
						})
					}
				break;
				case 2:
					var battle_lineupEnd = sessionStorage.getItem('battle_lineupEnd');
					if(battle_lineupEnd){
						getBattleRankThr(JSON.parse(battle_lineupEnd));
					}else{
						Thr.userList($stateParams.roomId,1).then(function(data){
							getBattleRankThr(data);
						})
					}
				break;
				default:
					var battle_lineupEnd = sessionStorage.getItem('battle_lineupEnd');
					if(battle_lineupEnd){
						getBattleAct(JSON.parse(battle_lineupEnd));
					}else{
						Battle.battleRanking($stateParams.roomId).then(function(data){
							getBattleAct(data);
						})
					}
				break;
			}
	
		}
		$scope.tablist = 0;
		//tab 切换
		$scope.cktab = function(data){
			var checkTab = function(){
				angular.forEach($scope.battletotal,function(datalist,index){
					if(datalist.id == data.id){
						datalist.class = "checked";
						return false;
					}
						datalist.class = "";
				})
			}
			if(data.id == 0){
				TALKWATCH("经典战已结束-阵容");
			}
			if(data.id == 1 && !$scope.battlerecord){
				TALKWATCH("经典战已结束-战报");
				$ionicLoading.show();
				 // 测试record
                   Battle.battlerecord($stateParams.roomId).then(function(alllist){
                       if(alllist && alllist.code == 0){
                       	   $scope.battlerecord =  {};
			                 $scope.battlerecord.mvpPlayer = alllist.data.mvpPlayer;
			                 $scope.battlerecord.worstPlayer = alllist.data.worstPlayer;
			                 $scope.battlerecord.costPlayer = alllist.data.costPlayer;
			                 $scope.battlerecord.mostPopularPlayer = alllist.data.mostPopularPlayer;
			                angular.forEach($scope.battlerecord,function(datalist,index){
			                	angular.forEach(datalist,function(list_data,list_index){
			                		list_data.show = false;
			                		if(!list_data.hot){
			                			list_data.hot = "0%";
			                		}
			                		if(list_data.matchResult){
				                		list_data.matchResult.startMonth = getData(list_data.matchResult.startTime).month
				                		list_data.matchResult.startDay = getData(list_data.matchResult.startTime).day
				                	}
			                	})
			                })
			                
					    $scope.lineupcontent = lineupGet(alllist.data.bestLineUpOfPlayer).lineupcontent;
						$scope.lineup_data =  lineupGet(alllist.data.bestLineUpOfPlayer).lineup_data;
						var timeStamp = new Date().getTime();
						$scope.lineup_data.userLogoUrl = $scope.lineup_data.userLogoUrl +"?"+timeStamp;
						$scope.lineupcontentBest = lineupGet(alllist.data.best11LineUp).lineupcontent;
						$scope.lineup_dataBest =  lineupGet(alllist.data.best11LineUp).lineup_data;
						$scope.tablist = data.id;
						checkTab();
						$ionicLoading.hide();
			     }else{
			     	$ionicLoading.hide();
			     }
            })
              // 阵容处理     
              var lineupGet = function(alllistDataBestLine){
              	    var  lineupcontent = {};
						lineupcontent.one =  alllistDataBestLine.foward;
						lineupcontent.two =  alllistDataBestLine.center;
						lineupcontent.thr =  alllistDataBestLine.guard;
						lineupcontent.goalkeeper =  alllistDataBestLine.goalkeeper;
						angular.forEach(lineupcontent,function(datalist,index){
							angular.forEach(datalist,function(list,ii){
								lineup_qudh(list.shirt_num, list) //球衣号码
							})
						})
					var lineup_data =  alllistDataBestLine;
					return  {"lineupcontent":lineupcontent,"lineup_data":lineup_data}
              }
                 return false;  
           } 
           if($scope.battlerecord || data.id == 0){
           	$scope.tablist = data.id;
           }
		  checkTab();
		}
		var getData = function(data){
			var pos = data.indexOf("-");
			var month = data.substring(0,pos);
			var day = data.substring(pos+1);
			return {"month":month,"day":day}
		}
		
		$scope.toggle = function(Group) {
			  Group.show = !Group.show;
           }
		$scope.isGroupShown = function(Group){
			return Group.show;
		}
		
		
		//构建球队弹窗列表
		$ionicModal.fromTemplateUrl('templates/battle/teams-list.html', {
			scope: $scope,
			animation: 'silde-in-up'
		}).then(function(modal) {
			$scope.teamList = modal;
		});
		//弹窗出
		$scope.events=function(){
			$scope.teamList.show();
		}
		$scope.goEventPath = function(matchId){//重要事件跳转
			$ionicLoading.show();
			RTAll.matchEvent(matchId).then(function(data){
				if(!data.code){
					sessionStorage.setItem("eventData",JSON.stringify(data.data));
					var _url = "tab/battle/battle-timeAxis/" + $stateParams.roomId +"/"+ matchId +"/" + 2 +"/";
					$timeout(function(){
						$location.path(_url);
						$ionicLoading.hide();
					},500)
				}else{
					sessionStorage.removeItem("eventData");
					$ionicLoading.hide();
				}
			})
		}
		$scope.showdetial = function($index){//	点击tab切换
			$stateParams.playId = parseInt($stateParams.playId);
			$ionicLoading.show();
			if($stateParams.playId == 3){
				default_tab($index);
			}else if($stateParams.playId == 2){
				three_tab($index);
			}
		}
		//tab切换效果函数
		var setChecked = function($index){
			angular.forEach($scope.battletotal, function(data, index, array){
				if ($index == index) {
					$scope.battletotal[index].class = 'checked';
				} else {
					$scope.battletotal[index].class = '';
				}
			})
		}
	//	经典房tab切换的方法
	//	3vs3的tab切换
		
	//	if ($location.url().match("battle-bestlineup")){
	//		$scope.goodId = $stateParams.goodId;
	//		showBestLineup($scope.goodId);
	//		$scope.battleRankData_result_other = JSON.parse(sessionStorage.getItem("battleRankData_result_other"));
	//		$scope.battleRankData_result_one = JSON.parse(sessionStorage.getItem("battleRankData_result_one"));
	//		$scope.battleRankData_name = JSON.parse(sessionStorage.getItem("battleRankData_name"));
	//	}
		
		//构建球队弹窗列表
		$ionicModal.fromTemplateUrl('templates/battle/battle-lineupshow.html', {
			scope: $scope,
			animation: 'silde-in-up'
		}).then(function(modal) {
			$scope.lineupshow = modal;
		});
		//阵容弹窗关
		$scope.lineup_bnt=function(){
			$scope.lineupshow.hide();
			$timeout(function(){
				$scope.lineupcontent = {};
			},500)
		}
		
		//3人战弹窗列表
		$ionicModal.fromTemplateUrl('templates/battle/thr-lineupshow.html', {
			scope: $scope,
			animation: 'silde-in-up'
		}).then(function(modal) {
			$scope.thrlineupshow = modal;
		});
		//阵容弹窗关
		$scope.lineup_bnt=function(){
			$scope.thrlineupshow.hide();
			$scope.lineupshow.hide();
			$timeout(function(){
				$scope.lineupcontent = {};
			},500)
		}
	
		//经典房点击排名玩家 跳转阵容弹窗
		$scope.ownLineup = function(id){
			TALKWATCH("经典房已结束查看阵容");
			$scope.findBest = false;
			$ionicLoading.show();
			Battle.battleLineup($stateParams.roomId,id).then(function(other){
				if(other.code==0){
					sessionStorage.setItem('lineupShowItem',JSON.stringify(other))
					$timeout(function(){
						$location.path('/tab/battle/lineup/Linupshow/'+$stateParams.roomId+"/"+id+"/2")
					    $ionicLoading.hide();
					},500)
				}else{
					$ionicLoading.hide();
				}
			},function(error){
				$ionicLoading.hide();
			})
		}
		
		$scope.showLineup = function(data){//3v3的已结束显示玩家阵容
			var id=data.id
			TALKWATCH("3v3已结束查看阵容");
			$ionicLoading.show();
			Thr.lineup($stateParams.roomId,id).then(function(data){
				if(data.code==0){
					$scope.lineup = lineup_act(data,playId);
					$scope.thr_datalist=data.data.userInfo;
					$scope.thrlineupshow.show();
					$ionicLoading.hide();
				}else{
					$ionicLoading.hide()
				}
			},function(error){
				$timeout(function() {
					$ionicLoading.hide();
				}, 500)
			})
	
		}
	     $scope.$on('$ionicView.beforeLeave', function(e){
		    $scope.teamList.hide();
		    $scope.lineupshow.hide();
		    $scope.thrlineupshow.hide();
		 });
		 $scope.$on('$destroy', function(e){
		    $scope.teamList.remove();
		    $scope.lineupshow.remove();
		    $scope.thrlineupshow.remove();
		 });
		 $scope.$on("$ionicView.beforeLeave",function(){
		})
	}
	ctrl.$inject = ['$scope',"$http","$ionicHistory", '$stateParams', '$ionicSlideBoxDelegate', '$location', "$rootScope", "$ionicLoading","$timeout","$ionicModal", 'Battle',"Thr","RTAll"];
	app.registerController("BattleRoomCtrl",ctrl);//return ctrl;
})
