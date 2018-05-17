//排行
define(["app"], function(app) {
	"use strict";
	function ctrl($scope, $timeout, $http, $ionicLoading, $ionicScrollDelegate, Rank) {
		$scope.$on("$ionicView.beforeEnter",function(){
			var address = location.hash;
		 	history.pushState({},"","#/tab/main");
		 	location.hash = address;
	//	 	$(".tabs").css("boxShadow","none")
		})
	//	$scope.$on("$ionicView.beforeLeave",function(){
	//		$(".tabs").css("boxShadow","0 -10px 15px 0 rgba(0, 0, 0, 0.35)")
	//	})
	//	$scope.$on("$ionicView.afterLeave",function(){
	//		$(".tabs").css("boxShadow","0 -10px 15px 0 rgba(0, 0, 0, 0.35)")
	//	})
		$scope.rankTitleArray = [
			{id:0,name:"财富榜",harvest:"星币"},
			{id:1,name:"等级榜",harvest:"等级"},
			{id:2,name:"胜率榜",harvest:"胜率"},
		];
		$scope.ranktitle = $scope.rankTitleArray[0];//默认title
		$scope.activated_slide = 0;
		$('.onlyRankTitle').find(".rankTitleItem").eq($scope.activated_slide).addClass("activated");
		$scope.num = 3;	//默认为总排行
		var rank_default = sessionStorage.getItem("rank_default");
		if (rank_default) {
			var data =  JSON.parse(rank_default);
			operaData(data);
		} else {
			$scope.currPage = 1;
			rankCon($scope.num,$scope.currPage);
		}
		
		$scope.getMore = function(rankId){
			$scope.currPage += 1;
			getRankData(rankId);
		}
	//	$scope.rank = function($event,id){
	//		$($event.target).find("span").css({display:"block"});$($event.target).siblings().find("span").css({display:"none"})
	//		$scope.getMoreData = true;$scope.currPage = 1;
	//		getRankData(id);
	//	}
		function getRankData(id){
			if($scope.ranktitle != $scope.rankTitleArray[id]) $scope.ranktitle = $scope.rankTitleArray[id];
			switch(id){
				case 0://财富榜
					rankCon($scope.num,$scope.currPage);
				break;
				case 1://等级榜
					rankGrade(false,$scope.currPage);
				break;
				case 2://胜率榜
				    rankWin(false,$scope.currPage);
				break;
				default://星币
					rankCon($scope.num,$scope.currPage);
				break;
			}
			
		}
		
		function rankCon(id,page){//星币请求数据
			$scope.getMoreData = true;
			Rank.rankCon(id,page).then(function(data){
				operaData(data);
			},function(error){
				$ionicLoading.hide();
			})
		}
		function rankGrade(id,page){//场次请求数据
			$scope.getMoreData = true;
			Rank.rankGrade(page).then(function(data) {
				operaData(data);
				$timeout(function(){
					$ionicLoading.hide();
				},500)					
			},function(err){
				$timeout(function(){
				   $ionicLoading.hide();
			    },500)
			})
		}
		function rankWin(id,page){//胜率请求数据
			$scope.getMoreData = true;
			var winning = Rank.Rank_winning(page);
			winning.then(function(data) {
				operaData(data);
				$timeout(function(){
					$ionicLoading.hide();
				},500)
			},function(err){
					$timeout(function(){
					   $ionicLoading.hide();
				    },500)
				})
		}
		function operaData(data){//处理数据
			if(data.code==0){
				var timeStamp = new Date().getTime();
				angular.forEach(data.data.coinList,function(array,index){
					array.userHeadImg = array.userHeadImg+"?"+timeStamp;
				})
				if(data.pageNo==1){
					$scope.itemzh = data.data.coinList;
					$scope.itemMine = data.data.mine;
					$scope.itemMine.userHeadImg = $scope.itemMine.userHeadImg+"?"+timeStamp;
				}else if(data.pageNo>1){
					$scope.itemzh = new Array().concat($scope.itemzh,data.data.coinList)
				}
				$scope.currPage = data.pageNo;
				if(data.pageNo>=data.totalPageCount){
					 $scope.getMoreData = true;
				}else{
					$scope.getMoreData = false;
				}
				$timeout(function(){
					$ionicLoading.hide();
				},500)
			}else{
				$ionicLoading.hide();
			}
		}
		
		$('.onlyRankTitle').delegate('.rankTitleItem', 'click', function(event) {//点击排行title事件
			var index = $(this).index();//当前标签位于父标签的位置，不能有变化
			if(index==$scope.activated_slide) return;
			$ionicLoading.show();
			$ionicScrollDelegate.$getByHandle('rankScroll').scrollTop(true);
			$(this).siblings(".rankTitleItem").removeClass("activated");
			$(this).addClass("activated");
			$scope.activated_slide = index;//slide的page
			$scope.$apply();
//			TALKWATCH("排行-排序",index);
//			$(this).parents('.zpx').find('span').text($(this).text())
//			$(this).parent('.zpx_ul').slideUp(100)
//			$scope.num = index + 1;	
			$scope.currPage = 1;
			event.stopPropagation();//阻止事件冒泡
			getRankData(index);//关联$scope.rankTitleArray,位置不能随意变化
		})
		// 	排序-----勿删
	//	$(".zpx").on("click", function(e) {
	//		$(".zpx_ul").slideToggle(200);
	//		$(document).one("click", function() {
	//			$(".zpx_ul").slideUp();
	//		});
	//		e.stopPropagation();
	//	});
	//
		TALKWATCH("排行");
	
	}
	ctrl.$inject = ['$scope', '$timeout', '$http', "$ionicLoading", "$ionicScrollDelegate", 'Rank'];
		app.registerController("rankCtrl",ctrl);//return ctrl;
})