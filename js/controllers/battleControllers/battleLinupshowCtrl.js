//对战js***********************************************
define(["app"],function(app){
	"use strict";
	function ctrl($scope,$ionicHistory, $stateParams, $ionicSlideBoxDelegate, $location, $rootScope, $ionicLoading, $timeout,$ionicModal,Battle,LineUp,Thr) {
        $scope.getLive = function(){
        	$scope.connectLive(0,$stateParams.roomId,$stateParams.userId);//实时结果 拉取   	
        }
        var lineupShowItem = JSON.parse(sessionStorage.getItem('lineupShowItem'))
        if(lineupShowItem){
        	analysis(lineupShowItem);
        }else{
        	Battle.battleLineup($stateParams.roomId,$stateParams.userId).then(function(other){
				if(!other.code){
					analysis(other);
				}else{
					$ionicLoading.hide();
				}
			},function(error){
				$ionicLoading.hide();
			})
        }
        function analysis(other){
        	var getLineupData = getLineup(other);//调用11v11阵容处理函数
			$scope.ids = getLineupData.ids;
			$scope.lineup_data = getLineupData.lineup_data;
			$scope.lineup_data.lineupImgId = $scope.lineup_data.lineup_nameId-1;
			if(!$scope.lineup_data.surPlusSalary){
				$scope.lineup_data.surPlusSalary = 0;
			}
			$scope.lineupcontent = getLineupData.lineupcontent;
			if($stateParams.statusId==1){
				$scope.roomStatus = $stateParams.statusId;
				$scope.getLive();
			}else{
				$scope.roomStatus = 2;
				if($scope.lineup_data.id ==localStorage.getItem("userId")){
					$scope.showShareLineup = true;
				}
				
			}
       	}
        
		$scope.lineupShare = function(userId){//炫耀一下
			$ionicLoading.show();
			if($scope.lineup_data.id != localStorage.getItem("userId")) return;
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
	        
	    $scope.goPlayerDetial = function(playerId,roomStatus){
	    	if(roomStatus!=1){
	    		$scope.playerDetial(playerId);
	    	}else{
	    		event.preventDefault();
	    	}
	    }
	     $scope.$on('$ionicView.beforeLeave', function(e){
	     	sessionStorage.removeItem("lineupShowItem");
		 });
		 $scope.$on('$destroy', function(e){
		 });
	
	}
	ctrl.$inject = ['$scope',"$ionicHistory", '$stateParams', '$ionicSlideBoxDelegate', '$location', "$rootScope", "$ionicLoading","$timeout","$ionicModal", 'Battle',"LineUp","Thr"];
		app.registerController("battleLinupshowCtrl",ctrl);//return ctrl;
})
