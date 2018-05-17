//对战js***********************************************
define(["app"],function(app){
	"use strict";
	function ctrl($scope,$ionicHistory, $stateParams, $ionicSlideBoxDelegate, $location, $rootScope, $ionicLoading, $timeout,$ionicModal,Battle,LineUp,Main) {
	    if($stateParams.userId!=localStorage.getItem("userId")){//如果是用户自己
	    	$(".shareRemider").css({"display":"none"});
	    	$scope.showQR = true;
	    }
//	    $scope.$on("$ionicView.beforeEnter",function(){//追加主页历史栈
//			if(!$ionicHistory.backView()){
//				var address = location.hash;
//				history.pushState({},"","#/tab/main");
//		 		location.hash = address;
//			}
//		})
	    var _shareInfo = sessionStorage.getItem("shareInfo");
	    if(_shareInfo){
	    	var _shareInfo = JSON.parse(_shareInfo);
	    	if(_shareInfo._userInfo.userInfo.id==$stateParams.userId) var shareInfoOk = true;
	    }
	    if(_shareInfo && shareInfoOk){
	    	$scope._userInfo = _shareInfo._userInfo;
	    	$scope._lineupInfo = _shareInfo._lineupInfo;
	    }else{
	    	Battle.lineupShare($stateParams.roomId,$stateParams.userId).then(function(other){
				if(!other.code){
					$scope._userInfo = other.data;
					var _date = gettimeform(other.data.matchDay);
					$scope._userInfo.lineupTitle = _date.month +"月" + _date.dates +"日" + other.data.leagueName +"阵容竞猜";
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
					$scope._lineupInfo = getLineup(other);
				}else{
					$ionicLoading.hide();
				}
			},function(error){
				$ionicLoading.hide();
			})
	   	}
	    $scope.shareFun = function(){
		    if(!$scope._appId){
		    	$timeout(function(){
			    	if($ionicHistory.currentStateName() == "tab.lineupShareEle"){
			    		var shareTitle = $scope._userInfo?("我参加"+$scope._userInfo.lineupTitle+"战胜了"+$scope._userInfo.winRate+"的人"):"我的战报";
			    		var _imgUrl = window.location.hostname + "/img2.0/guide/ydy_10.jpg";
			    		$scope.creatShare(false,shareTitle,_imgUrl,"StarKings，专业足球阵容竞猜游戏，赢了就有钱",false,false,lineupShareCall);
			    	}else{
			    		sessionStorage.removeItem("shareInfo");
			    	}
		    	},2000)
		    }else{
		    	if($ionicHistory.currentStateName() == "tab.lineupShareEle"){
		    		var shareTitle = $scope._userInfo?("我参加"+$scope._userInfo.lineupTitle+"战胜了"+$scope._userInfo.winRate+"的人"):"我的战报";
		    		var _imgUrl = window.location.hostname + "/img2.0/guide/ydy_10.jpg";
		    		$scope.creatShare(false,shareTitle,_imgUrl,"StarKings，专业足球阵容竞猜游戏，赢了就有钱",false,false,lineupShareCall);
		    	}else{
		    		sessionStorage.removeItem("shareInfo");
		    	}
		    }
	    }
	    $scope.shareFun();
	    function lineupShareCall(){
	    	Main.shareExp().then(function(data){
	    		if(!data.code){
	    			var usefulData = data.data;
	    			if(usefulData){
	    				growHtml(usefulData);
	    			}else{
	    				$scope.alertDark("分享成功，今日已获得分享经验，无法再次获得");
	    			}
	    		}
	    	})
	    	
	    	function growHtml(usefulData){//经验值增长
	    		$scope.oldUsefulData = usefulData;
	    		$scope.usefulData = expSum(usefulData);
	    		$ionicModal.fromTemplateUrl('templates/common/grow.html', {
	    			scope: $scope,
	    			animation: 'fade-in'
	    		}).then(function(modal,$event){
	    			$scope.growSuccess = modal;
	    			$scope.growSuccess.show();
	    			$timeout(function(){
	    				growAnimation();
	    			},500)
	    		});
	    		function growAnimation(){
	    			
	    			var _widthGrow = $scope.usefulData.growExp;
	    			$(".growModal").find(".expStrip").find(".growExpAct").width(0).css({opacity:1});
	    			$(".growModal").find(".expStrip").find(".growExpAct").animate({"width":_widthGrow},800,function(){
	    				if($scope.oldUsefulData.upgrade){
	    					$scope.oldUsefulData.upgrade = false;
							$scope.usefulData = expSum($scope.oldUsefulData);
	    					$(".growModal").find(".growExpAct").width(0);
	    					$(".growModal").find(".growExpAct").animate({"width":$scope.usefulData.inExpPercent},500);
	    				}
	    			});
	    		}
	    		function expSum(expData){
					var expDataPrivate;
					if(expData.upgrade){//如果是升级先用旧的
						expDataPrivate = {
							"Level":expData.oldLevel,
							"oldExp":expData.oldExperience,
							"growExp":expData.oldIncrementExperience,
							"maxExp":expData.oldMaxExperience,
							"expPercent":expData.oldExpPercent,
							"growExpPercent":expData.oldIncrementExpPercent,
						};
					}else{//如果没有升级，之间用新的
						expDataPrivate = {
							"Level":expData.level,
							"oldExp":expData.currLevelExp,
							"growExp":expData.incrementExp,
							"maxExp":expData.levelMaxExp,
							"expPercent":expData.expPercent,
							"growExpPercent":expData.InExpPercent,
						};
					}
					return expDataPrivate;
				}
	    		
	    	}
	    	
	    }
	    $scope.$on("$ionicView.leave",function(){
	    	if($scope.growSuccess) $scope.growSuccess.remove();
	    	sessionStorage.removeItem("shareInfo");
	    })
	}
	ctrl.$inject = ['$scope',"$ionicHistory", '$stateParams', '$ionicSlideBoxDelegate', '$location', "$rootScope", "$ionicLoading","$timeout","$ionicModal", 'Battle',"LineUp","Main"];
	app.registerController("lineupShareCtrl",ctrl);//return ctrl;
})