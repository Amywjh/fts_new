//球星对战投票
define(["app"],function(app){
	"use strict";
	function ctrl($scope,$rootScope,$ionicActionSheet,$http,$timeout,$ionicModal,$ionicLoading,$location,$stateParams) {
	 	var user = sessionStorage.getItem("user");
	 	if(user){
	 		$scope.userInfoDetial(JSON.parse(user));
	 	}else{
	 		$scope.userInfoDetial();
	 	}
	//主页说明弹窗
		$(".prizes-roombuttons").unbind("click");
		$(".prizes-roombuttons").on("click", function(e){
			e.stopPropagation();
			e.preventDefault();
			$(this).closest(".pane").find(".rule").find(".jq_sm").slideToggle();
		});
		$(".jq_sm").on("click", function(e){ 
			e.stopPropagation();
			$(this).slideUp();
		});
		
		$scope.back = function(){
			history.go(-1);
		}
		$scope.hallsc=function(){
			TALKWATCH("头部-点击商城");
	//		$scope.toastDark("暂未开放，敬请期待");
			$location.path("/tab/wode/sc");
		}
	
	}
	ctrl.$inject = ['$scope',"$rootScope",'$ionicActionSheet','$http','$timeout','$ionicModal','$ionicLoading','$location',"$stateParams"];
	app.registerController("headerCtrl",ctrl);
//	return ctrl;
})