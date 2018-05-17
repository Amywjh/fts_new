define(["app"],function(app){
	"use strict";
	function ctrl($scope,$rootScope,$state,$ionicPopup,$ionicActionSheet,$http,$timeout,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicSlideBoxDelegate,$location,$stateParams,$ionicHistory) {
		$ionicModal.fromTemplateUrl('templates/guide/guideMod.html', {
			scope: $scope,
			animation: 'silde-in-up'
		}).then(function(modal) {
				$scope.guideMode = modal;
				$scope.guideMode.show();
			   var count = $("#guideUl li").length;
			   $("#guideUl li:not(:first-child)").hide();
			   $timeout(function(){
			   		$("#guideUl li").eq(1).fadeIn(1000);
			   },1000)
		       $scope.guidenext = function(index){
		       	    if(index !=20 && index != 39){
		       	    	guideIndex(index);
		       	    }else if(index==20){
		       	    	guideout(index);
		       	    }else if(index == 39){
		       	    	history.back();
		       	    	$scope.guideMode.remove();
		       	    }
		       }
	    });
		function guideIndex(index){
			for(var i=0;i<index;i++){
				$("#guideUl li").eq(i).hide();
			}
			 $("#guideUl li").eq(index).show();
			$timeout(function(){
				$("#guideUl li").eq(index+1).fadeIn(500);
			},500)
		}
		function guideout(index){
			for(var i=0;i<index;i++){
				$("#guideUl li").eq(i).hide();
			}
			var num = 1;
			$("#guideUl li").eq(index).show();
			var guidTime = setInterval(function(){
				$("#guideUl li").eq(index+num).fadeIn(500);
				num++;
				if(num == 5){
					setTimeout(function(){
						clearInterval(guidTime);
					},500)
				}
			},1500)
		}
		
		$scope.$on("$ionicView.leave",function(){
			if($scope.guideMode){
				$scope.guideMode.remove();
			}
	    })
	}
	ctrl.$inject = ['$scope','$rootScope',"$state","$ionicPopup",'$ionicActionSheet','$http','$timeout','$ionicModal','$ionicLoading',"$ionicScrollDelegate","$ionicSlideBoxDelegate",'$location',"$stateParams","$ionicHistory"];
	app.registerController("courseCtrl",ctrl);//return ctrl;
})