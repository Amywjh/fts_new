//指令*********************************************
angular.module('starter.directives', ['ionic'])
.directive('haveMore',function($rootScope){//带头像和规则名称的头部指令
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      template: '<div class="a-havemore">......</div>'
    }
  })
//优化版命令指令
.directive('hideTabs', function($rootScope) {//隐藏tab的指令
      return {
        restrict: 'AE',
        link: function(scope, element, attributes) {
          scope.$on('$ionicView.beforeEnter', function() {
            scope.$watch(attributes.hideTabs, function(value){
              $rootScope.hideTabs = 'tabs-item-hide';
//            $rootScope.hideTabs = true;
            });
          });
//        scope.$on('$ionicView.afterLeave', function(){
//          scope.$watch(attributes.hideTabs, function(value){
//          	console.log("leave")
//            $rootScope.hideTabs = 'tabs-item-hide';
//          });
//          scope.$watch('$destroy',function(){
//          	console.log("destroy")
//            $rootScope.hideTabs = false;
//          })
//        });
        }
      };
   })
//不是同一父子级跳转是tab丢失问题优化指令
.directive('hideTabsT',function($rootScope,$ionicHistory){//显示tab的指令
    return {
      restrict:'AE',
      link:function(scope,element,attributes){
	  	 scope.$on('$ionicView.beforeEnter', function(){
	        scope.$watch(attributes.hideTabs, function(value){
//	          $rootScope.hideTabs = 'tabs-item-hide';
	          $rootScope.hideTabs = false;
	          var currentViewData=$ionicHistory.currentView()
	          if(currentViewData.stateName == 'tab.rank'){
	          	$(".tabs").addClass("tab-shadow");
	          	return false;
	          }
	          	$(".tabs").removeClass("tab-shadow");
	        });
	      })
      }
    }
  })
.directive('battleDefault',function($rootScope){//赛况的传统房指令
    return {
      restrict:'AEC',
      replate:false,
      scope:true,
      templateUrl : './templates/directives/tab-battle-default.html',
    }
  })
.directive('battlePrizes',function($rootScope){//赛况的球星对战指令
    return {
      restrict:'AEC',
      replate:false,
      scope:true,
      templateUrl : './templates/directives/tab-battle-prizes.html',
    }
 })

.directive('headerDefault',function($rootScope){//带头像的头部指令
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/common/tab-header.html',
//    controller:'MainCtrl'//控制器重复
    }
  })
.directive('headerCreat',function($rootScope){//创建按钮的header
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/common/tab-header-creat.html',
      controller:'headerCtrl'
    }
  })
.directive('headerShop',function($rootScope){
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/common/mine-header.html',
      controller:'headerCtrl'
    }
 })
.directive('headerHelp',function($rootScope){//带头像和帮助的头部指令
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/common/tab-header-help.html',
      controller:'headerCtrl'
    }
  })
.directive('headerRule',function($rootScope){//带头像和规则名称的头部指令
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/common/tab-header-rule.html',
      controller:'headerCtrl'
    }
  })
.directive('headerSecHelp',function($rootScope){//二级页面带帮助的头部
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/common/tab-second-help.html',
      controller:'headerCtrl'
    }
  })
.directive('headerTitle',function($rootScope){//带title和帮助的头部指令
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/common/tab-onlyTitle.html',
      controller:'headerCtrl'
    }
})

.directive('lineupThree',function($rootScope){//3人阵容指令   已结束
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/lineup-three.html',
    }
 })
.directive('lineupThr',function($rootScope){//不带球员列表的3人阵容指令 未开始
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/lineupThree.html',
    }
  })
.directive('lineupClassics',function($rootScope){//不带球员列表的11人阵容指令   未开始
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/lineupClassics.html',
    }
  })
.directive('joinList',function($rootScope){//玩家列表指令
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/classics/joinList.html',
    }
 })
.directive('matchList',function($rootScope){//赛况指令
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/classics/matchList.html',
    }
  })
.directive('roomGoingThr',function($rootScope){//赛况进行中三人战阵容
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/goingThree.html',
    }
  })
.directive('roomGoingClassics',function($rootScope){//赛况进行中经典战阵容
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/goingClassics.html',
    }
  })

.directive('closePopupBackDrop', ['$ionicGesture',function($ionicGesture) {  
        return {  
            scope: false,//共享父scope  
            restrict: 'A',  
            replace: false,  
            link: function(scope, element, attrs, controller) {  
                //要在html上添加点击事件, 试了很久- -!  
                var  $htmlEl= angular.element(document.querySelector('html'));  
                $ionicGesture.on("touch", function(event) {  
                    if (event.target.nodeName === "HTML" && scope.myPopup.isPopup) {
                        scope.alertPopup.close();  
                        scope.myPopup.isPopup = false;  
                    }  
                },$htmlEl);  
            }  
        };  
}])  

// 2017-07-05  (2.0)*****************************************************************************
.directive('prizesList',function($rootScope){//球星对战list
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/prizes/prizesList.html',
    }
  })
.directive('prizesItemNostart',function($rootScope){//球星对战list
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/prizes/prizesItemNostart.html',
    }
  })
.directive('prizesNostartHeadTop',function($rootScope){//球星对战list
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/prizes/prizesNostartHeadTop.html',
    }
  })
.directive('prizesItemGoing',function($rootScope){//球星对战list
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/prizes/prizesItemGoing.html',
    }
  })
.directive('prizesItemEnd',function($rootScope){//球星对战list
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/prizes/prizesItemEnd.html',
    }
  })
.directive('prizesVote',function($rootScope){//球星对战投票
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/prizes/vote.html',
      controller:"voteCtrl"
    }
  })
.directive('inputNum',function($rootScope){//球星对战投票
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/common/inputNum.html',
//    controller:"voteCtrl"
    }
  })
.directive('noRoom',function($rootScope){//无房间指令
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/noRoom.html',
    }
 })
//表现值计算
.directive('ruleExp',function($rootScope){//表现值计算tab
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/rules/expression.html',
      controller:"ruleCtrl"
    }
 })
//规则说明
.directive('rulePrize',function($rootScope){//球星对战规则
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/rules/rulePrize.html',
      controller:"ruleCtrl"
    }
})
.directive('rulePlayer',function($rootScope){//球员详情规则
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/rules/rulePlayer.html',
      controller:"ruleCtrl"
    }
 })
.directive('ruleClassics',function($rootScope){//11v11规则
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/rules/ruleClassics.html',
      controller:"ruleCtrl"
    }
 })
.directive('runingCircle',function($rootScope){//11v11规则
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/going/goingCircle.html',
//    controller:"AllCtrl"
    }
 })
 .directive('repeatDone', function () {//slide清除2条数据bug
   return function (scope, element, attrs) {
     if (scope.$last) { // all are rendered
       scope.$eval(attrs.repeatDone);
     }
   }
})
// 2017-10-26  (2.2)*****************************************************************************
.directive('roomDetialTop',function($rootScope){//11v11房间详情头部
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/classics/roomDetialTop.html',
//    controller:"AllCtrl"
    }
 })
.directive('roomDetialGoodstop',function($rootScope){//11v11活动房房间详情头部
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/classics/roomDetialGoodstop.html',
//    controller:"AllCtrl"
    }
 })
.directive('prizeTeams',function($rootScope){//球星pk的比赛信息
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/prizes/prizeTeams.html',
//    controller:"AllCtrl"
    }
 })
.directive('prizeTeamsGoing',function($rootScope){//球星pk的比赛信息进行中
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/prizes/prizeTeamsGoing.html',
//    controller:"AllCtrl"
    }
 })
.directive('corpsHeader',function($rootScope){//战队头部
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/corps/corps-head.html',
//    controller:"AllCtrl"
    }
 })
.directive('corpsPlayerList',function($rootScope){//战队队员列表
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      templateUrl: './templates/directives/corps/corps-playerlist.html',
//    controller:"AllCtrl"
    }
 })
.directive('clickImgBig',function($rootScope,$timeout,$ionicModal){//点击图片放大
    return {
      restrict:'AEC',
      replace:false,
      scope:true,
      link: function($scope,$element){
	      		$element.on('click', function(e){
	      			    $scope.inforReviseMod.hide();
	                    var img = $(this).attr("src");//获取当前点击的value值;
	                    $scope.noticeType = true;
	                    $scope.noticeShow = {};
	                    $scope.noticeShow.pic1 = img;
	                     $ionicModal.fromTemplateUrl('templates/common/notice.html',{
							scope: $scope,
							animation: 'silde-in-up'
						}).then(function(modal) {
							$scope.imgEnlargeMod = modal;
							$timeout(function(){
								$scope.imgEnlargeMod.show();
							},200)
					    });
	                    $scope.notice_close = clearImg;
	                  $rootScope.$on('$locationChangeSuccess',clearImg) ; 
			     })
      	       var clearImg = function(e){
      	       	   $scope.imgEnlargeMod.remove();
      	       	   $timeout(function(){
      	       	   	  $scope.inforReviseMod.show();
      	       	   },200)
      	       }
		 }
    }
 })
.directive('actCarouseltext',function($rootScope,$timeout){//滚动播报指令
    return {
      restrict:'AEC',
      template: '<span  class="a-text-color-whit"  ng-repeat="content in carcontent.contentList" ng-bind-html="content | trustHtml">{{content}}</span>',
      scope:false,
      link: function($scope,$rootScope,$element){
			    var sspeed = 1;
			    var $Width = $("#carouseltext").innerWidth();
			    var $el = $("#carouseltext")
	      		$scope.timelist = function(){
	      			$timeout(function(){
	      				$scope.$watch($scope.carcontent,function(nv,ov){
	      				var $wslider = $el.find("#wslider");
		                $wslider.hide()	
		      		  	for(var i=0;i<$scope.carcontent.contentList.length;i++){
			        	  $("#carouseltext").find(".spaceShow").eq(i).css("width",$Width/3 + "px");
			        	  if(i == $scope.carcontent.contentList.length-1){
			        	  	  $("#carouseltext").find(".spaceShow").eq(i).css("display","none");
			        	  }
			      	   }
		                	var degreeStr = sessionStorage.getItem("degreeStr");
							if(!degreeStr){
								sessionStorage.setItem("degreeStr",$Width);
							}
							$wslider.css("left",$Width+"px");
							$wslider.show()
		                	var $winnerWidth = $("#wslider").innerWidth();
		                	console.log($wslider.position().left)
						    $scope.ieslidew = function(){
                                if(!$scope.carouselshow) return; 
						    	if($wslider.position().left>=$winnerWidth*(-1)){
						    		 $wslider.css("left",$wslider.position().left-sspeed + "px");
							    	 $timeout( $scope.ieslidew, 20);
							    }else {
							    	$scope.$emit("childChange", false)
							    	$wslider.css("left",$Width + "px");
							    	sessionStorage.setItem("degreeStr",false);
							    }
					    	}
					      	$scope.ieslidew();
					     },true);
	      			})
		      		  }
	      		$scope.timelist();
	      		$scope.carouselhide = function(){
	      		    $scope.$emit("childChange", false);
	      		    sessionStorage.setItem("degreeStr",false);
	      		}
      	}
    }
 })
.directive('focusInput', ['$ionicScrollDelegate', '$window', '$timeout', '$ionicPosition', function ($ionicScrollDelegate, $window, $timeout, $ionicPosition) { 
  return { 
    restrict: 'A', 
    scope: false, 
    link: function ($scope, iElm, iAttrs, controller) { 
      if (ionic.Platform.isIOS()) { 
        iElm.on('focus', function () { 
          var top = $ionicScrollDelegate.getScrollPosition().top; 
          var eleTop = ($ionicPosition.offset(iElm).top) / 2 ;
          var realTop = 0 - eleTop + top; 
          realTop = realTop + top; 
          $timeout(function () { 
            if (!$scope.$last) { 
            	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
//          		var aim = $('#chatS');
            		var aim = $('#corpsView');
//          		aim.css('transform', 'translate3d(0px,'+"-"+289 + 'px, 0px) scale(1)'); 
            		aim.css('transform', 'translate3d(0px,'+"-"+310 + 'px, 0px) scale(1)'); 
            		$ionicScrollDelegate.$getByHandle("chat_con").scrollBottom();
            	}
            } else { 
//            try { 
//              var aim = angular.element(document).find('.scroll') 
//              aim.css('transform', 'translate3d(0px,' + realTop + 'px, 0px) scale(1)'); 
//              $timeout(function (){ 
//                iElm[0].focus(); 
//              }, 100) 
//            } catch (e) { 
//            } 
           	} 
          },100) 
        })
        iElm.on('blur', function () { 
          $timeout(function () { 
//        	var aim = $('#chatS');
          	var aim = $('#corpsView');
          	aim.css('transform', 'translate3d(0px,'+ 0 + 'px, 0px) scale(1)'); 

          },100) 
        })
      } 
    } 
  } 
}])
.directive('keyoutHide', [ '$window', '$timeout', function ( $window, $timeout) { //解决安卓手机键盘把底部定位顶上去
  return { 
    restrict: 'AEC', 
    scope: false, 
    link: function ($scope, $element) { 
      if (!ionic.Platform.isIOS()) {
      	 var h=$(window).height();
      	 $(window).resize(function() {
	        if($(window).height()<h){
	            $element.hide();
	        }
	        if($(window).height()>=h){
	            $element.show();
	        }
	    });
      }
    } 
  } 
}])
.directive('imgResize', [ '$window', '$timeout', function ( $window, $timeout) { //识别图片大小
  return { 
    restrict: 'AEC', 
    scope: false, 
    link: function ($scope, $element) { 
    	var oldwidth,oldheight;
		var maxwidth= '65%';
		var maxheight= '100%';
		$element.load(function(){
			oldwidth = $element.height();
			oldheight =  $element.width();
			if(oldwidth == oldheight && oldwidth == 160){
				$element.css('maxWidth',maxwidth);
				return false;
			}
			$element.css('maxHeight',maxheight);
		})
	    
    } 
  } 
}])
.directive('textLeft', [ '$window', '$timeout', function ( $window, $timeout) { //解决ios textarea不右对齐问题
  return { 
    restrict: 'AEC', 
    scope: false, 
    link: function ($scope, $element) { 
      if (ionic.Platform.isIOS()) {
      	  $element.css({'textIndent':'-.02rem'})
      }
    } 
  } 
}])