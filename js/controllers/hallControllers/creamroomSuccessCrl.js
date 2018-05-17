define(["app"],function(app){
	"use strict";
	function ctrl ($scope,$interval,$rootScope, $ionicActionSheet, $http, $timeout, $ionicModal, $ionicLoading, $ionicScrollDelegate, $location, $stateParams,$ionicHistory, Hall,Battle,Thr) {
		$scope.headTitle = "房间创建成功";
	    $scope.privacy = $stateParams.privacy;
	    $scope.roomPWD  = $stateParams.roomPWD;
	    var hash = location.hash
	    $scope.$on("$ionicView.beforeLeave", function(e){
	    	if($ionicHistory.currentStateName() == "tab.thrvsthr-creatroom"){
	    		location.hash = hash;
	    	}
	    	if($ionicHistory.currentStateName() != "tab.creamroom-success"){
				$scope.creatShare(true);
			}
	    })
    	Battle.lineupNostartEle($stateParams.roomId).then(function(data) {
			if(!data.code){
				var _roomInfo = data.data;
				var _onlyShare = gettimeform(_roomInfo.shareMatchTime);
				_roomInfo.shareDate = _onlyShare.month+"月"+_onlyShare.dates+"日";
				if($ionicHistory.currentStateName() == "tab.creamroom-success"){
					var shareTitle = localStorage.getItem("nickName") +"邀请你参与" + _roomInfo.shareDate+_roomInfo.leagueName+"阵容竞猜";
					$scope.creatShare(false,shareTitle,null,"StarKings，专业足球阵容竞猜游戏，赢了就有钱",$stateParams.roomId);
				}
			}
		}, function(error) {

		})
	    
	    
	    
	    $scope.goingLineup = function(){
	    	var $url = "#/tab/hall/0";
			history.replaceState({},"",$url);
	    	$scope.path = "#/tab/lineup/ksbz/" + 1 + "/" + $stateParams.roomId + "/" + '' + "/" + 1　 + "/" + $stateParams.league;
	    	history.pushState({},"",$scope.path);
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				$ionicLoading.hide();
			})
	    }
	    
	    
	}
	ctrl.$inject = ['$scope','$interval',"$rootScope", '$ionicActionSheet', '$http', '$timeout', '$ionicModal', '$ionicLoading', "$ionicScrollDelegate", '$location', "$stateParams","$ionicHistory", 'Hall', "Battle","Thr"];
		app.registerController("creamroomSuccessCrl",ctrl);//return ctrl;
})