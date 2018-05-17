//我的商城控制器
define(["app"], function(app) {
	"use strict";
	function ctrl($scope, $ionicPopup, $location, $ionicLoading, $timeout, $rootScope,$ionicModal, Wode, Hall) {
		$scope.hideRight = true;
		//说明弹窗
		$(".wode-sc .jq_sm").height($(window).height() - $(".header_wode").height())
		$(".wode-sc .right").on("click", function(e) {
			$(".wode-sc .jq_sm").slideToggle();
			$(document).one("click", function() {
				$(".wode-sc .jq_sm").slideUp();
			});
			e.stopPropagation();
		});
		$(".wode-sc .jq_sm").on("click", function(e) {
			$(".wode-sc .jq_sm").slideUp();
			e.stopPropagation();
		});
		TALKWATCH("充值中心")
		//选择切换
		$scope.recharge = function(index) {
			$scope.slide_page = index;
			$(".header_bg div:nth-child(3) div").siblings("div").removeClass("act").eq(index).addClass("act");
			if(index==1){
				$scope.userInfoDetial();
				var userNow = sessionStorage.getItem("user");
				if(!userNow) return false;
				var getExchange = $scope.getViableExchange(JSON.parse(userNow).coin,$scope.coin);
		 		$scope.dmdInt = getExchange.dmdInt;
		 		$scope.coin = getExchange.defaultValue;
			}
		}
		$scope.$on("$ionicView.beforeEnter",function(){
	    	var address = location.hash;
			history.replaceState({},"","#/tab/wode");
			location.hash = address;
		})
		
		$scope.jewel = {//星钻数据
			"rowOne":[{"id": 0,"jewel": 10,"money": 10},
			{"id": 1,"jewel": 30,"money": 30},
			{"id": 2,"jewel": 50,"money": 50}],
			"rowTwo":[{"id": 3,"jewel": 100,"money": 100},
			{"id": 4,"jewel": 500,"money": 500},
			{"id": 5,"jewel": 1000,"money": 1000}],
//			"rowThr":[{"id": 6,"jewel": 3000,"money": 3000},
//			{"id": 7,"jewel": 5000,"money": 5000},
//			{"id": 8,"jewel": 10000,"money": 10000}]	
		}
		$scope.coin = {//星币数据
			"rowOne":[{"id": 0,"jewel": 1,"coin": 10},
					{"id": 1,"jewel": 5,"coin": 50},
					{"id": 2,"jewel": 10,"coin": 100}],
			"rowTwo":[{"id": 3,"jewel": 50,"coin": 500},
					{"id": 4,"jewel": 100,"coin": 1000},
					{"id": 5,"jewel": 500,"coin": 5000}]		
		}
	 	
	
		//充值弹窗
		$scope.Diamond = function(data) {
			TALKWATCH("点击充值星钻",data.money);
			function onBridgeReady() {
				$.ajax({
					url: "/api/v2/charge/wechat/charge",
					headers: {
						'uk': $hp.defaults.headers.common['uk']
					},
					type: "get",
					data: {
						count: data.money,
					},
					success: function(data) {
						data = data.data;
						WeixinJSBridge.invoke(
							'getBrandWCPayRequest', {
								"appId": data['appId'], //公众号名称，由商户传入     
								"timeStamp": data['timeStamp'], //时间戳，自1970年以来的秒数     
								"nonceStr": data['nonceStr'], //随机串     
								"package": data['pkg'],
								"signType": data['signType'], //微信签名方式：     
								"paySign": data['paySign'] //微信签名 
							},
							function(res) {
								if(res.err_msg == "get_brand_wcpay_request:ok") {
									$.ajax({
										url: "/api/v2/charge/wechat/query?order=" + data['orderNumber'],
										type: "GET",
										success: function(data) {
											if(data.code==0){
												if(data.data==5 || data.data==2){
													$scope.firstCharge = false;
													$scope.userInfoDetial();
													listenUserInfo();
													TALKWATCH("充值星钻成功")
													suceessAlert('successACharge');
												}else{
													$scope.toast("充值失败");
													TALKWATCH("充值星钻失败")
												}
											}else{
												$scope.toast("充值失败");
												TALKWATCH("充值星钻失败")
											}
										}
									});
								}else{
									$scope.toast("充值失败 ");
									TALKWATCH("充值星钻失败")
								}
							}
						);
					}
				});
			}
			if(typeof WeixinJSBridge == "undefined") {
				if(document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
				} else if(document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
					document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
				}
			} else {
				onBridgeReady();
			}
		}
	    
	    $scope.$on('$ionicView.beforeLeave', function(e){
	    	if($scope.alertPopup) $scope.alertPopup.close();
		    if($scope.errorPopup) $scope.errorPopup.close();
		    if($scope.confirmPopup) $scope.confirmPopup.close();
		    if($scope.exmAlert) $scope.exmAlert.remove();
		    $scope.hideRight = false;
		 });
		
		//兑换记录跳转
		$scope.dhjl = function(){
			$location.path("/tab/wode/dhjl")
		}
	    
	    $scope.Gold = function (data,isAll) {//兑换弹窗 
	    	TALKWATCH("点击兑换星钻");
	    	if(data.noExchange) return $scope.toast("星币不足");
	        $ionicModal.fromTemplateUrl('templates/shop2.0/exchangeModal.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal,$event){
				$scope.exmAlert = modal;
				$scope.exmAlert.show();			
				$scope.data = data;
				$scope.conver = function(data){//确定兑换
					$ionicLoading.show();
					var Coin = data.coin;
					if(isAll) Coin = commafyback(data.jewel.toString())*10;
					Wode.wode_xingbi(Coin).then(function(converResult) {
						if(converResult.code == 0) {
							TALKWATCH("兑换星钻成功",data.coin);
							$scope.userInfoDetial();
							var getExchange = $scope.getViableExchange(JSON.parse($scope.user).coin,$scope.coin);
					 		$scope.dmdInt = getExchange.dmdInt;
					 		$scope.coin = getExchange.defaultValue;
					 		console.log($scope.dmdIn,$scope.coin)
							listenUserInfo();
							$scope.exmAlert.remove();
							suceessAlert('successAConvert');
						}else{
							errorAlert("兑换失败","请检查网络后重试");
							TALKWATCH("兑换星钻失败")
						}
						$ionicLoading.hide();
					},function(error){
						errorAlert("兑换失败","请检查网络后重试");
						TALKWATCH("兑换星钻失败");
						$ionicLoading.hide();
					})
				}
				$scope.cancel = function(){//取消兑换
					$scope.exmAlert.remove();
				}
			});
	    };
	    $scope.user = sessionStorage.getItem("user");
		function listenUserInfo(){//监听用户信息变化
			var timerUser = setInterval(function(){
		    	$scope.$apply($scope.user = sessionStorage.getItem("user"));
		    },1000);
			var userWatch = $scope.$watch("user",function(newData,oldData){
				if(newData==oldData) return;
				if(newData!=oldData && newData){
					$scope.user = newData;
			 		var getExchange = $scope.getViableExchange(JSON.parse(newData).coin,$scope.coin);
			 		$scope.dmdInt = getExchange.dmdInt;
			 		$scope.coin = getExchange.defaultValue;
			 		clearInterval(timerUser);
			 		userWatch();
				}
		    },true)
		}
		$scope.myPopup = {
			'isPopup' :false,
		}
		    //成功提示
	    var suceessAlert =function(addClass,text2){
	    	$scope.myPopup.isPopup = true;
	    	$scope.alertPopup = $ionicPopup.alert({  
	            cssClass: ['successA',addClass],
	            template: '',  
	            okText: '<div></div>',   
	      	}); 
	      	$timeout(function(){$scope.alertPopup.close()},3000)
	    }
		//失败提示
		var errorAlert = function(text1, text2) {
			var html = '<p>' + text1 + '</p><p>' + text2 + '</p>'
			if(text2 == "" || !text2) {
				html = '<p class="tt">' + text1 + '</p>'
			}
			$scope.errorPopup = $ionicPopup.alert({
				cssClass: 'errorA',
				template: html,
				okText: '<div></div>',
			});
			$timeout(function(){$scope.errorPopup.close()},3000)
		}
		// 星币
		$scope.user = sessionStorage.getItem("user");
	 	if($scope.user){
	 		$scope.userInfoDetial(JSON.parse($scope.user));
	 		var getExchange = $scope.getViableExchange(JSON.parse($scope.user).coin,$scope.coin);
	 		$scope.dmdInt = getExchange.dmdInt;
	 		$scope.coin = getExchange.defaultValue;
	 	}else{
	 		$scope.userInfoDetial();
	   		listenUserInfo();
	 	}
	 	
	}
	ctrl.$inject = ["$scope", "$ionicPopup", "$location", "$ionicLoading", "$timeout", "$rootScope","$ionicModal", "Wode", "Hall"];
	app.registerController("exchangeCtrl",ctrl);//return ctrl;
})