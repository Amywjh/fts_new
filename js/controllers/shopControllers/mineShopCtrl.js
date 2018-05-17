define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$ionicPopup,$http,$ionicLoading,$ionicModal,$location,$ionicHistory,$rootScope,$timeout,ShopUrl,Wode) {
		$scope.$on("$ionicView.beforeEnter",function(){
	    	var address = location.hash;
			history.replaceState({},"","#/tab/wode");
			location.hash = address;
		})
	//选择切换
	$scope.recharge=function(index){
		 $scope.slide_page=index;
         $(".header_bg div div").siblings("div").removeClass("act").eq(index).addClass("act");
         if(index == 1){
         	TALKWATCH("点击星币")
         }
	}
	TALKWATCH("兑换商城")
	//星币兑换
	$scope.coin={
		"rowOne":[{"id": 0,"jewel": 1,"coin": 10},
				{"id": 1,"jewel": 5,"coin": 50},
				{"id": 2,"jewel": 10,"coin": 100}],
		"rowTwo":[{"id": 3,"jewel": 50,"coin": 500},
				{"id": 4,"jewel": 100,"coin": 1000},
				{"id": 5,"jewel": 500,"coin": 5000}]
	}
	
	// 兑换金钱
	$scope.shopExchange = function(){
		$scope.Goldf();
	}
	 $scope.ggg = function(){
	 	var num = $('.by .list input[type=number]').val();
	 	if(num > 0 && num<50000){
	 		$scope.exHavehl = parseInt(num*10*1.05);
	 	}else if(num>=50000){
	 		num = 50000;
	 		$('.by .list input[type=number]').val(num);
	 		$scope.exHavehl = parseInt(num*10*1.05);
	 	}else{
	 		$scope.exHavehl = '';
	 	}
	 }
	$scope.nowexchange = function(){
		var num = $('.by .list input[type=number]').val();
		if(num >50000){
			$scope.toast('每人每日最多兑换¥50000现金券')
			return false;
		}
		if(num < 20){
			$scope.toast('很抱歉！最低兑换金额为¥20')
			return false;
		}
		if(parseInt(num*10*1.05) > $scope.coinall){
			$scope.toast('很抱歉,星币不足!参加游戏赚取更多星币再来兑换吧')
			return false;
		}
		$scope.shopModal.remove()
		$ionicLoading.show();
		$timeout(function(){
			ShopUrl.getBankInfo().then(function(data){
		       if(data.code == 0){
		       	var str = JSON.stringify(data.data)
		       	sessionStorage.setItem("userBankInfoId",str);
                $location.path("/tab/wode/userconfirm/1/"+num);
		       	$ionicLoading.hide()
		       }else{
		       		sessionStorage.removeItem("UserbankAll");
		       		$location.path("/tab/wode/userPerfect/0/"+num);
		       		$ionicLoading.hide()
		       }
			})
		},500)
	}
	//兑换弹窗 
    $scope.Goldf = function () {
    	TALKWATCH("点击兑换星钻");
    	$scope.exHavehl = '';
    	if($scope.shopModal){
    		$scope.shopModal.remove();
    	}
        $ionicModal.fromTemplateUrl('templates/shop2.0/shopModal.html', {
			scope: $scope,
			animation: 'fade-in'
		}).then(function(modal,$event){
			$scope.shopModal = modal;
			$scope.shopModal.show();
		});
    };
    // 关闭弹窗
    $scope.modelCloss = function(){
		$scope.shopModal.remove();
	};
//	$scope.$on("modal.hidden", function(e) {
//		console.log("执行了")
//     $timeout(function(){
//				
//		},100)
//	})
	//头部跳转 
	$scope.shopRecord = function(){
		$location.path('/tab/wode/shoprecord/'+$scope.phone);
	}
	$scope.headtext = '兑换记录'
	$scope.$on('$ionicView.beforeEnter', function(e){
	     	Wode.all().then(function(data) {
				if(data.code == 0) {
					var gggg = $scope.getViableExchange(data.data.coin,$scope.coin)
					$scope.dmdInt = gggg.dmdInt;
					$scope.coin = gggg.defaultValue;
					$scope.coinall = data.data.coin?data.data.coin:0;
				}
			})
	 });
	$scope.$on("$ionicView.beforeLeave",function(){
    	if($scope.shopModal)$scope.shopModal.remove();
    	if($scope.exmAlert) $scope.exmAlert.remove();
	})
	var user = sessionStorage.getItem("user");
	 $scope.Gold = function (data,isAll) {//兑换弹窗 
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
				console.log(Coin);
				Wode.wode_xingbi(Coin).then(function(converResult) {
					console.log(converResult);
					if(converResult.code == 0) {
						TALKWATCH("兑换星钻成功",data.coin);
						$scope.userInfoDetial();
						var getExchange = $scope.getViableExchange(JSON.parse(sessionStorage.getItem("user")).coin,$scope.coin);
				 		$scope.dmdInt = getExchange.dmdInt;
				 		$scope.coin = getExchange.defaultValue;
				 		console.log($scope.dmdInt,$scope.coin)
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
					TALKWATCH("兑换星钻失败")
					$ionicLoading.hide();
				})
			}
			$scope.cancel = function(){//取消兑换
				$scope.exmAlert.remove();
			}
		});
    };
    $scope.user = sessionStorage.getItem("user");
    // 微信提现窗口
    $scope.wxPacket = function(){
		$ionicModal.fromTemplateUrl('templates/shop2.0/shopmodal/wxPacket.html', {
			scope: $scope,
			animation: 'fade-in'
		}).then(function(modal,$event){
			$scope.wxPacketMod = modal;
			$scope.wxPacketMod.show();
			$scope.wxHongbao = function(num){
				var wxInput = num;
				if(!wxInput){
					$scope.alert('请输入兑换金额')
					return false;
				}
				if(wxInput*10 > $scope.coinall){
					$scope.alert('很抱歉,星币不足!参加游戏赚取更多星币再来兑换吧')
					return false;
				}
				if(wxInput>200){
					$scope.alert("很抱歉！每次最多可兑换¥200微信红包");
					return false;
				}
				if(wxInput<20){
					$scope.alert("很抱歉！每次最少兑换¥20微信红包");
					return false;
				}
               var  data = {
	               	withdrawAmt:num,
	               	payType:0,
               }
               $scope.wxPacketMod.remove();
				depositType(data);
			}
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
					$scope.wxPacketMod.hide();
			})
		});
    }
    // 支付宝体现窗口
    $scope.zfbPacket = function(){
    	
    	$ionicModal.fromTemplateUrl('templates/shop2.0/shopmodal/zfbPacket.html', {
			scope: $scope,
			animation: 'fade-in'
		}).then(function(modal,$event){
			$scope.zfbPacketMod = modal;
			$scope.zfbPacketMod.show();
			$scope.zfbNext = 0;
			$scope.zfbHongbao = function(index,num){
				if(index == 0){
					$scope.zfbNext = index;
					return false;
				}
				var zfbInput = num;
				if(!zfbInput){
					$scope.alert('请输入兑换金额')
					return false;
				}
				if(zfbInput*10 > $scope.coinall){
					$scope.alert('很抱歉,星币不足!参加游戏赚取更多星币再来兑换吧')
					return false;
				}
				if(zfbInput>20000){
					$scope.alert("很抱歉！每次最多可兑换¥20000支付宝红包");
					return false;
				}
				if(zfbInput<20){
					$scope.alert("很抱歉！每次最少兑换¥20支付宝红包");
					return false;
				}
				if(!ionic.Platform.isIOS()){
					 var  n = 0;
		              $(".by div:nth-child(3) input[type=text]").focus(function(){
		              	$(".modalCss .warp").animate({"top":-50+"px"},100);
		              	 n = 0;
		              })
		               $(".by div:nth-child(3) input[type=text]").blur(function(){
		              	$(".modalCss .warp").animate({"top":0},100);
		              })
			          $(window).resize(function() {  
			          	 n++;
			          	if(n==2){
			          		 $(".modalCss .warp").animate({"top":0},100);
			          		 $(".by div:nth-child(3) input[type=text]").blur();
			          	}
			          }); 
				}
				$scope.zfbNext = index;
			}
			$scope.zfbApplication = function(num,Account,name){
				console.log(Account,name)
				if(!Account){
					$scope.alert("很抱歉！您还没有输入支付宝账号");
					return false;
				}
				if(!name){
					$scope.alert("很抱歉！您还没有输入姓名");
					return false;
				}
				var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
		        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
				if(regEn.test(name) || regCn.test(name)) {
				    $scope.alert("名称不能包含特殊字符.");
				    return false;
				}
				 var  data = {
	               	withdrawAmt:num,
	               	payType:1,
	               	account:Account,
	               	accountName:name
               }
				$scope.zfbPacketMod.remove(); 
				depositType(data);
			}
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
					$scope.zfbPacketMod.hide();
			})
		});
    }
    
    function depositType(data){
    	ShopUrl.depositType(data).then(function(data){
    		if(data.code == 0){
    			$scope.userInfoDetial();
    			listenUserInfo()
				  $("#msg_success").html('<img src="../../img2.0/shop2.0/shopchange/dh_cg_1.png" alt="" />')
		    		$("#msg_success").fadeIn(100)
					$("#msg_success img").animate({"width":"78vw","opacity": "1"},400,function(){
						$timeout(function(){
					    	$("#msg_success").hide();
					    },2000)	
				})
				return false
    		}
			$scope.alert(data.msg || '系统异常稍后重试');		
		})
    }
    
	function listenUserInfo(){//监听用户信息变化
	   var timerUser = setInterval(function(){
	    	$scope.$apply($scope.user = sessionStorage.getItem("user"));
	    },1000);
		var userWatch = $scope.$watch("user",function(newData,oldData){
			if(newData==oldData) return;
			if(newData!=oldData){
				user = newData;
		 		var getExchange = $scope.getViableExchange(JSON.parse(newData).coin,$scope.coin);
		 		$scope.dmdInt = getExchange.dmdInt;
		 		$scope.coin = getExchange.defaultValue;
		 		$scope.coinall = $scope.dmdInt * 10;
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
	}
	ctrl.$inject = ["$scope","$ionicPopup",'$http',"$ionicLoading",'$ionicModal',"$location","$ionicHistory","$rootScope","$timeout",'ShopUrl','Wode'];
	app.registerController("mineShopCtrl", ctrl); //return ctrl;
})