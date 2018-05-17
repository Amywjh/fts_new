define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$rootScope,$ionicModal, $location,$ionicLoading,$timeout,$stateParams,$state,$cacheFactory, Corps) {
		$scope.$on("$ionicView.beforeEnter",function(){
//			$scope.logo = $stateParams.isLogo;
//			$scope.name = $stateParams.isName;
//			$scope.text = $stateParams.isText;
//			$scope.join = $stateParams.isJoin?$stateParams.isJoin:1;
			var corpsInfor = JSON.parse(sessionStorage.getItem('corpsInfor'));
			if(corpsInfor){
				$scope.logo = corpsInfor.isLogo;
				$scope.name = corpsInfor.isName;
				$scope.text = corpsInfor.isText;
				$scope.join = corpsInfor.isJoin;
			}
			if($scope.logo){
				$("#corpsLogo").attr("src",$scope.logo);
			}
			if($scope.name){
				$("#corpsName").val($scope.name);
			}
			if($scope.text){
				$("#corpsText").val($scope.text);
			}
			$scope.joinType = [
			   {'text':'不审核直接加入','type':1},
			   {'text':'队长审核加入','type':0},
			]
			$scope.isJoin = {
				type:$scope.join?$scope.join:1,
			}
		})
		// 创建战队
		$scope.creamNew = function(){
//		   var 	$corpsLogo = !$stateParams.isUplogo?$("#corpsLogo").attr("src"):'../../img2.0/corps/zd_cjzd_tx_default.png',
		  if($scope.creamBtn) return;
		  $scope.creamBtn = true;
		  var 	$corpsLogo = $("#corpsLogo").attr("src"),
			$corpsName = $("#corpsName").val(),
			$corpsText = $("#corpsText").val();
            if(!$corpsName){
            	$scope.toastDark('战队名字不能为空！','',true);
            	$scope.creamBtn = false;
            	return false;
            }
            if($corpsName.length<3){
            	$scope.toastDark('战队名字不能少于3个字！','',true);
            	$scope.creamBtn = false;
            	return false;
            }
             if(!$corpsText){
            	$scope.toastDark('战队口号不能为空！','',true);
             	$scope.creamBtn = false;
            	return false;
            }
             var dataList = {
             	logo:$corpsLogo,
             	name:$corpsName,
             	slogan:$corpsText,
             	fightTeamJoinType:$scope.isJoin.type
             }
             Corps.create(dataList).then(function(data){
             	$ionicLoading.show();
             	$scope.creamBtn = false;
             	if(!data.code ){
         			sessionStorage.removeItem('corpsInfor');
             		$location.path('/tab/main/corps/user/'+data.data.id);
             		$scope.userInfoDetial();
             		$scope.$on("$ionicView.beforeLeave",function(){
						history.replaceState({},"","#/tab/main");
						history.pushState({},"","#/tab/main/corps/user/"+data.data.id);
					})
	             	$ionicLoading.hide();
             		 return false;
             	}else if(data.code == 200101){
             		$scope.toastDark(data.msg,'',true)
             		$ionicLoading.hide();
             	    return false;
             	}else if(data.code == 200115 || data.code == 200116 || data.code == 200117){
             		$scope.toastDark('不能含有敏感词"'+data.data+'"','',true)
             		$ionicLoading.hide();
             	    return false;
             	}else{
             		$ionicLoading.hide();
             		$scope.toastDark( data.msg || '网络异常请稍后重试','',true);
             		 return false;
             	}
             	$ionicLoading.hide();
             	$scope.toastDark( data.msg || '网络异常请稍后重试','',true);
             })
		}
		// 选择logo
		$scope.corpsLogoChoose = function(){
			var $corpsName = $("#corpsName").val(),
			$corpsText = $("#corpsText").val();
			$ionicLoading.show();
			Corps.corpsLogo().then(function(data){
				if(!data.code){
					sessionStorage.setItem('corps-teamLogo',JSON.stringify(data))
					$timeout(function(){
//						$state.go('tab.corps-logo',{isName:$corpsName,isText:$corpsText,isJoin:$scope.isJoin.type}); 
                       var obj = {isName:$corpsName,isText:$corpsText,isJoin:$scope.isJoin.type,isLogo:$scope.logo};
                       sessionStorage.setItem('corpsInfor',JSON.stringify(obj));
						$location.path('/tab/main/corps/logo')
						$ionicLoading.hide();
					},500)
					return false;
				}
				$ionicLoading.hide();
			},function(){
				$ionicLoading.hide();
			})
		}
		// 记录状态
		$scope.joinRecord = function(data){
		}
	}
	ctrl.$inject = ['$scope',"$rootScope",'$ionicModal','$location','$ionicLoading', '$timeout','$stateParams','$state',"$cacheFactory",'Corps'];
	app.registerController("corpsCreamCtrl",ctrl);//return ctrl;
})
