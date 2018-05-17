define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$rootScope,$ionicModal, $location,$ionicLoading,$state,$timeout, Corps) {
		$scope.$on('$ionicView.beforeEnter', function() {
			$scope.userInfoDetial();
			$scope.pageNum = 1;
			$scope.moreDataCanBeLoaded = true;
			$scope.roomList($scope.pageNum);
		});
		$scope.loadMore = function(isSearch){
			$timeout(function(){
				if ($scope.moreDataCanBeLoaded == false && $scope.pageNum < $scope.totalPageCount){
					if(!isSearch){
						$scope.pageNum += 1;
						$scope.roomList($scope.pageNum);
					}else{
						$scope.$broadcast('scroll.refreshComplete');
					}
				}else{
					$scope.moreDataCanBeLoaded = true;
					$scope.$broadcast('scroll.refreshComplete');
				}
			},800)
		}
		
		$scope.roomList = function(pageNum){
			Corps.hall({page:pageNum}).then(function(data){
				if(!data.code && data.data.length>0){
					$scope.totalPageCount = data.totalPageCount;
					if(data.pageNo == 1){
						$scope.teamRooms = data.data;
					}else{
						$scope.teamRooms = $scope.teamRooms.concat(data.data);
					}
					$scope.moreDataCanBeLoaded = false;
					if($scope.pageNum == $scope.totalPageCount){
						$scope.moreDataCanBeLoaded = true;
					}
				}else{
					$scope.teamRooms = '';
				}
			})
		}
		
		
		$scope.creamCorsp = function(){
//			$location.path('/tab/main/corps/cream/true');
            TALKWATCH("点击创建战队")
            if($scope.userData.currLevel >= 5){
            	sessionStorage.removeItem('corpsInfor');
            	$state.go('tab.corps-cream');  
            	return false;
            }
			$scope.toastDark('创建战队需用户等级达到5级！','',true);
		}
		// 申请加入战队
		$scope.joinCorps = function(room){
			 TALKWATCH("点击申请战队")
			if(!room.fristBtn){
				room.fristBtn = true;
			}
			if(room.userNum >= room.totalUserNum){
				$scope.toastDark('战队人数已达上限!','',true);
			    return false;
			}
			Corps.corpsJoin({fightTeamId:room.id}).then(function(data){
				$ionicLoading.show();
				if(!data.code){
					$scope.toastDark('申请成功请耐心等待!','',true);
					room.applyStatus = 0;
				}else if(data.code == 200111){
             		$location.path('/tab/main/corps/user/'+room.id);
             		$scope.userInfoDetial();
             		$scope.$on("$ionicView.beforeLeave",function(){
						history.replaceState({},"","#/tab/main");
						history.pushState({},"","#/tab/main/corps/user/"+room.id);
					})
				}else{
					$scope.toastDark(data.msg || '申请失败请检查网络!','',true);
				}
				$timeout(function(){
					room.fristBtn = false;
				},100)
				$ionicLoading.hide();
			})
		}
		$scope.$on("$ionicView.beforeLeave",function(){
//			history.replaceState({},"","#/tab/main");
//			history.pushState({},"","#/tab/main");
			$scope.userInfoDetial();
		})
		
	}
	ctrl.$inject = ['$scope',"$rootScope",'$ionicModal','$location','$ionicLoading','$state', '$timeout','Corps'];
	app.registerController("corpsCtrl",ctrl);//return ctrl;
})
