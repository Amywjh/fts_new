//球星对战投票
define(["app"],function(app){
	"use strict";
	function ctrl($scope,$rootScope,$ionicActionSheet,$http,$timeout,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicSlideBoxDelegate,$location,$stateParams,$ionicHistory,Thr,Hall,Prizes,Wode,Main) {	
		$scope.$on("$ionicView.beforeEnter",function(){
			$scope.defaultGive = function(){
				if(!$scope.noticeImg){//页面有缓存，如果公告变量存在，则不继续请求接口
					Hall.announcement().then(function(data){//公告
						if(data.code == 0){
							$scope.noticeImg=data.data;
							var newDate= new Date();//欢迎页
							var guide_time=JSON.parse(localStorage.getItem("guide_time"));
						  	if($scope.noticeImg.length){
						  		if(isValidTime("guide_time")){//如果是有效的时间
						  			mainDefaultShow("notice",1);
						  		}
						  	}
						}
					});
				}
			}
			if(!$scope.activityTest){
				$scope.activityTest = true;
				Hall.announcement().then(function(data){//公告
				    if(!data.code && data.data){
				    	$scope.noctiAdata = data.data
				    }
				})
                Wode.all().then(function(data){
                	var locationGuide = localStorage.getItem("guideNew");
                	if(!locationGuide && data.data){//&& isNew.data === false
					    var guiArray ={'hall':false,'join':false,'lineup':false,'chose':false,'submit':false,'prize':false,'unnaming':false,'userCoin':data.data.coin}
						localStorage.setItem('guideNew',JSON.stringify(guiArray));
					    var getInvite = JSON.parse(sessionStorage.getItem("getInvite"));//邀请缓存数据
					    if(getInvite){
//					    	forFriendrequest();
					    	return false;
					    }
			 			$timeout(function(){
				 			$("#guide").addClass("mainCover");
				 			$("#guide").append('<div class="guiContentAll"><p class="a-text-color-whit font-weight a-font-size-medium-m a-flex-center textDescribe">点击参与进入一个玩法</p><img class="imgDescribe onePointing" src="../img2.0/guide/hand.png" alt="" /></div>');
							$("#guide").on("click",function(e){
								 var xx=e.pageX-$(this).offset().left;
								 var yy=e.pageY-$(this).offset().top;
								 var ww=parseInt($(this).css('border-top-width'))||0;
								 var hh = yy - ww;
							    if(hh >= 0 && hh < parseInt($(this).innerHeight()/2)){
							    	$scope.entry_rooms('/tab/main/prizes');
							    }
							    if(hh >= parseInt($(this).innerHeight()/2)){
							    	$scope.entry_rooms('/tab/hall/0')
							    }
							    $timeout(function(){
						    		$("#guide").removeClass("mainCover");
						    		$("#guide").empty();
						    	},750)
							})	
			 			},300)
				    }else{
						$scope.defaultGive();
					}
                })
			}
		   // 跑马灯公告
			var degreeStr = sessionStorage.getItem("degreeStr");
			if(!degreeStr || Number(degreeStr) ){
				$scope.carousel();
			}
			
			// 遍历消息
			$scope.newsListCheck = function(newsAll){
				var n = 0;
				angular.forEach(newsAll,function(value,key){
					if(!value.status){
						n++;
						return false
					}
				})
				$scope.isNew = true;
				if(n<=0){
					$scope.isNew = false;
				}
			}
			
			// 消息公告
			Main.msgList().then(function(data){
				if(data && data.code ==0 && data.data.length>0){
					$scope.newsAll = data.data;
					$scope.newsAllNum = data.data.length;
					$scope.newsListCheck($scope.newsAll)
					return false;
				}
				$scope.newsAllNum = 0 ;
				$scope.isNew = false;
			})
	 	
		})
	//	房间类型的点击方法
		$scope.entry_rooms = function(url){
			if(url){
				$ionicLoading.show();
				switch(url){
					case "/tab/hall/0" :
					    TALKWATCH ("主页-进入传统经典房");
						hall_all(url);
					break;
					case "/tab/main/prizes" :
					 	TALKWATCH ("主页-进入竞猜房");
						prizes_all(url);
					break;
					default:
					   	if(!$scope.userData.fightTeamId){
					      	$location.path(url);
					   	}else{
					   	   	$location.path('/tab/main/corps/user/'+$scope.userData.fightTeamId);
					   	}
						TALKWATCH ("主页-点击其他玩法");
						$ionicLoading.hide();
					break;
				}
			}else{
	
			}
		}
		$rootScope.$on("api:get",function(event,data){//接听赛前赛后的广播处理
			if(data) $scope.entry_rooms(data);
		})
	//	导航条的点击方法
		$scope.head_pro = function(url){
			if(url){
				$ionicLoading.show();
			   	if(url == '/tab/wode/schedule'){
			    	TALKWATCH("主页-点击赛程");
			    }
				$location.path(url);
				$ionicLoading.hide();
			}else{
				newsAlert()
			}
	
		}
	//	大厅经典房的接口数据
		function hall_all(url){
			Hall.evematchList().then(function(data){//获取玩法类型
				if(data.code==0 && data.data.gameMatchList && data.data.gameMatchList.length>0){
						var str = JSON.stringify(data);
						var gameDateList = data.data.gameMatchList;
					    sessionStorage.setItem("hallvsthrfilter",str); //将玩法存入到缓存中
						var ids = '';
						angular.forEach(gameDateList[0].matchList,function(list,index){
							ids += list.id + ',';
						})
						var page ={
							page:1,
							status:0,
							filter:1,
							league:gameDateList[0].league,
	                        ids:ids.substring(0,ids.length-1),
							matchDate:gameDateList[0].matchDate
						}
						Hall.list(page).then(function(data){
							if(data.code==0){
								sessionStorage.setItem("hall",JSON.stringify(data));
								var hall = sessionStorage.getItem("hall");
								if(hall){
									$timeout(function(){
										$ionicLoading.hide();
										$ionicHistory.clearHistory();
										$location.path(url);
									},500)
								}else{
									$ionicLoading.hide();
								}
							}else{
								$ionicLoading.hide();
							}
						},function(error){
							$ionicLoading.hide();
						})
				}else{
					$timeout(function(){
						$ionicLoading.hide();
						$location.path(url);
					},500)
				}
			})
		}
	
	//	竞猜房的接口数据
		function prizes_all(url){
			$timeout(function(){
				$ionicLoading.hide();return;
			},5000)
			Prizes.all(1).then(function(data){
				sessionStorage.setItem("prizes",JSON.stringify(data));
				var prizes = JSON.parse(sessionStorage.getItem("prizes"));
				if(prizes && (prizes.code==0 || prizes.code==20001 || prizes.code==20000)){
					$timeout(function(){
						$ionicLoading.hide();
						$location.path(url);
					},500)
				}else{
					$ionicLoading.hide();
				}
			},function(error){
				$ionicLoading.hide();
			})
		}
	
//		var forFriendrequest = function(modalShowId){// 邀请弹窗
//			$scope.modalShowId = modalShowId;
//		 	$scope.getInvite = JSON.parse(sessionStorage.getItem("getInvite"));//获取邀请缓存
//			$ionicModal.fromTemplateUrl('templates/common/forFriendrequest.html', {
//					scope: $scope,
//					animation: 'silde-in-up'
//			}).then(function(modal) {
//				if(!$scope.forFriendrequest && $scope.getInvite){
//					var _date = gettimeform($scope.getInvite.matchDay);
//					$scope.getInvite.timeDay = _date.month +"月" + _date.dates +"日";
//					$scope.forFriendrequest = modal;
//					$scope.forFriendrequest.show();
//				}
//		    });
//		}
//		$scope.removeRequest = function(modalShowId,roomId){
//			if(roomId){//加入房间页
//				var _path ="tab/hall/joinroom/" + roomId +"/";
//				$location.path(_path);
//				$scope.forFriendrequest.remove();//关闭后跳转到房间
//			}else{//移除邀请modal
//				$scope.forFriendrequest.remove();
//				nextMainModal(modalShowId);//关闭后是否有下一个弹窗
//			}
//			sessionStorage.setItem("getInvite",false);//关闭邀请弹窗，缓存置为假
//		}
//	    
	    $scope.notice_close=function(modalShowId,moreInfo){//公告窗口关闭
//	    	if(moreInfo) nextMainModal(modalShowId);
	    	$scope.notice.hide();
	    }
//	    function nextMainModal(nowModalId,data){
//	    	var nextMainReady = function(nowModalId,data){
//		    	for(var i=0;i<$scope.modalArr.length;i++){
//		    		if($scope.modalArr[i].id==nowModalId){//在弹窗数组中找到对应的位置
//		    			var usedModalArr = $scope.modalArr.slice(i+1);//获取当前位置以后的弹窗数组
//		    			for(var ii=0;ii<usedModalArr.length;ii++){//遍历为显示的数组
//		    				if(usedModalArr[ii].show && !usedModalArr[ii].haveShow){//如果为显示的数组仍有需要显示的
//		    					var nowIndex = i+1;nowIndex = nowIndex +ii;
//		    					$scope.modalArr[nowIndex].haveShow = true;
//		    					switch(usedModalArr[ii].id){//找到要显示弹窗的id，并根据id判断要显示的弹窗
//		    						case 0://公告
//		    							if(!data) data = 1;
//		    							notice(data,usedModalArr[ii].id,true);
//		    						break;
//		    						case 1://邀请
//		    							forFriendrequest(usedModalArr[ii].id);
//		    						break;
//		    						default:
//		    							var _goUrl = usedModalArr[ii].path;
//		    							if(_goUrl){
//		    								$location.path(_goUrl);
//		    							}
//		    							
//		    						break;
//		    					}
//		    					return;
//		    				}
//		    				
//		    			}
//		    		}
//		    	}
//	    	}
//	    	if($scope.modalArr[2] && !$scope.modalArr[2].readying){//如果赛前赛后没有准备好
//	    		$ionicLoading.show();
//		    	var readyWatch = $scope.$watch("modalArr",function(newData,oldData){
//		    		if(newData[2]){
//		    			if(newData[2].readying){
//		    				readyWatch();
//		    				nextMainReady(nowModalId,data);
//		    				$ionicLoading.hide();
//		    			}
//		    		};
//			    },true)
//		    	$timeout(function(){//如果两秒内提示没有准备好，则不显示
//		    		readyWatch();
//		    		$ionicLoading.hide();
//		    	},2000)
//	    	}else{//如果已经准备好
//	    		nextMainReady(nowModalId,data);
//	    	}
//	    }
	    var isValidTime = function(oldTimeName){//判断是否是有效时间，缓存时间戳名
	    	var oldTime=JSON.parse(localStorage.getItem(oldTimeName));
	    	var newDate= new Date();//当前时间
	    	var timestamp = newDate.getTime();//当前时间戳
	    	if(oldTime){
	    		var oldDate = new Date();oldDate.setTime(oldTime);
	    		if(newDate.getDate() == oldDate.getDate() && newDate.getMonth() == oldDate.getMonth()){//缓存存在并且是当天的，则不执行
					return false;
				}else{
					localStorage.setItem(oldTimeName,JSON.stringify(timestamp));//缓存不存在或者不是当天的
					return true;
				}
	    	}else{
    			localStorage.setItem(oldTimeName,JSON.stringify(timestamp));//缓存不存在或者不是当天的
				return true;
	    	}
	    }
//	    var isValidTimeArr = function(timeSum,oldTimeName1,oldTimeName2){//判断是否是有效时间，缓存时间戳名
//	    	var oldTime1=JSON.parse(localStorage.getItem(oldTimeName1));
//	    	var oldTime2=JSON.parse(localStorage.getItem(oldTimeName2));
//	    	var newDate= new Date();//当前时间
//	    	var timestamp = newDate.getTime();//当前时间戳
//	    	if(oldTime1 && oldTime2){
//	    		var oldDate1 = new Date();oldDate1.setTime(oldTime1);
//	    		var oldDate2 = new Date();oldDate2.setTime(oldTime2);
//	    		if(newDate.getDate() == oldDate1.getDate() && newDate.getMonth() == oldDate1.getMonth() && newDate.getMonth() == oldDate2.getMonth() && newDate.getDate() == oldDate2.getDate()){
//	    			localStorage.setItem(timeSum,JSON.stringify(timestamp));//缓存不存在或者不是当天的
//	    		}else{
//	    			localStorage.removeItem(timeSum);
//	    		}
//	    	}else{
//	    		localStorage.removeItem(timeSum);
//	    	}
//	
//	    }
//	    var opearMatchGather = function(matchGatherData){//赛前赛后数据处理
//  		var matchGather = [];
//  		if(!jQuery.isEmptyObject(matchGatherData.matchSummary)){//如果有赛后总结时
//  			var modalJoinSum = {"id":2,"readying":true,"show":true,"haveShow":false,"data":"","path":"tab/main/joinSum"};
//  			if(isValidTime("matchSumTime")){//如果总结时间有效
//  				matchGather.push(modalJoinSum);
//  			}else{
//  				
//  			}
//  		}
//  		if(!jQuery.isEmptyObject(matchGatherData.matchCommend)){//如果有赛前推荐
//  			var modalMatchHint = {"id":3,"readying":true,"show":true,"haveShow":false,"data":"","path":"tab/main/matchHint"};
//  			if(isValidTime("matchHintTime")){//如果推荐时间有效
//  				matchGather.push(modalMatchHint);
//  			}else{
//  				
//  			}
//  		}
//  		isValidTimeArr("matchGatherTime","matchSumTime","matchHintTime");//判断赛前和赛后是否都出现过，如果没有，则删除比赛总结时间戳
//  		if(matchGather.length){//如果有赛前赛后的时候
//	    		for(var m=0;m<matchGather.length;m++){
//	    			if(matchGather[m].show && !matchGather[m].haveShow){//matchGatherItem为下一页跳转
////	    				localStorage.setItem("matchGatherTime",JSON.stringify(new Date().getTime()));//缓存不存在或者不是当天的
//	    				sessionStorage.setItem("matchGather",JSON.stringify(matchGather));
//	    				return {"matchGather":matchGather,"matchGatherItem":matchGather[m]};
//	    			}
//	    		}
//  		}else{//如果没有赛前赛后
//  			$scope.modalArr.splice(2);
//  			$scope.modalArr.push({"id":2,"readying":true,"show":false,"haveShow":false,"data":"","path":""});
//  			sessionStorage.removeItem("matchGather");//如果没有，则不返回值
//  			return false;
//  		}
//	    }
//	    var matchGatherFunc = function(data){//获取赛前赛后的数据
//	    	if(isValidTime("matchGatherTime")){//如果是有效时间
//	    		var matchGatherData = sessionStorage.getItem("matchGatherData");
//		    	if(matchGatherData){
//		    		matchGatherData = JSON.parse(matchGatherData);//赛前赛后数据
//		    		$scope.modalArr.splice(2);
//		    		return opearMatchGather(matchGatherData);
//		    	}else{
//		    		Main.matchGather().then(function(data){
//			    		if(!data.code){
//			    			sessionStorage.setItem("matchGatherData",JSON.stringify(data.data));
//			    			var matchGatherResult = opearMatchGather(data.data);
//			    			$scope.modalArr.splice(2);
//			    			if(matchGatherResult){
//			    				$scope.modalArr.push(matchGatherResult.matchGatherItem);
//			    			}else{
//			    				$ionicLoading.hide();
//			    			}
//			    		}else{
//			    			$ionicLoading.hide();
//			    		}
//			    	})
//		    	}
//		    	sessionStorage.removeItem("matchGather");
//		    	return false;
//	    	}else{//如果不是有效时间
//  			$scope.modalArr.splice(2);
//				$scope.modalArr.push({"id":2,"readying":true,"show":false,"haveShow":false,"data":"","path":""});
//				sessionStorage.removeItem("matchGather");//如果没有，则不返回值
//				return false;
//	    	}
//	    }
	    function mainDefaultShow(actionType,num){//操作类型  notice公告，invite邀请，,公告num，
	    	var getInvite = JSON.parse(sessionStorage.getItem("getInvite"));//邀请缓存数据
	    	$scope.modalArr = [];
	    	if(actionType=="notice" && $scope.noticeImg){//$scope.noticeImg公告的数据
	    		var modalNotice = {"id":0,"readying":true,"show":true,"haveShow":false,"data":$scope.noticeImg};
	    	}else{
	    		var modalNotice = {"id":0,"readying":true,"show":false,"haveShow":false,"data":""};
	    	}
	    	$scope.modalArr.push(modalNotice);
//	    	if(getInvite){//新人推荐
//	    		var modalInvite = {"id":1,"readying":true,"show":true,"haveShow":false,"data":getInvite};
//	    	}else{
//	    		var modalInvite = {"id":1,"readying":true,"show":false,"haveShow":false,"data":""};
//	    	}
//	    	$scope.modalArr.push(modalInvite);
//	    	//赛前赛后
//	    	var matchGatherReady = {"id":2,"readying":false,"show":false,"haveShow":false,"data":""};
//	    	$scope.modalArr.push(matchGatherReady);	    	
//	    	var matchGatherResult = matchGatherFunc();
//	    	if(matchGatherResult){
//	    		$scope.modalArr.push(matchGatherResult.matchGatherItem);
//	    	}
	    	switch(actionType){
	    		case "notice":
		    		notice(num,$scope.modalArr[0].id,true);
	    		break;
	    		case "invite":
//		    		nextMainModal($scope.modalArr[0].id);
	    		break;
	    		default:
	    		break;
	    	}
	    }
	    
	    
	 	function notice(num,modalShowId,moreInfo) {//公告方法
	 		if(modalShowId===0) $scope.modalShowId = modalShowId;
	 		var moreInfoOld = $scope.moreInfo;
	 		$scope.moreInfo = moreInfo?true:false;
	 		$scope.noticeShow = num;
	 		$scope.noticeType = false;
	 		if(Number(num)){
	 			$scope.noticeType = true;
	 			$scope.noticeShow = $scope.noticeImg[num];
	 		}
	 		if(!$scope.noticeShow) return; 
			if($scope.notice){
		    	$scope.notice.show();
	    	}else{    		
			     $ionicModal.fromTemplateUrl('templates/common/notice.html',{
					scope: $scope,
					animation: 'silde-in-up'
				}).then(function(modal) {
					$scope.notice = modal;
					$scope.notice.show();
//					$scope.activity = num;
			    });
		   	}
		}
	 	$scope.titleMsg = [
	 		{id:0,msg:'消息',disabled:true},
	 		{id:1,msg:'公告',disabled:false},
	 	]
	 	
	 // 黑色背景带竖线叉号提示公用弹窗
     $scope.blackVerticalModal = function(msg){//一个不知道的弹窗
     	$ionicModal.fromTemplateUrl('templates/main/modal/blackVerticalModal.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal) {
				$scope.blackVertical = modal;
				$scope.msgHtml = msg;
				$scope.blackVertical.show();
			})
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				$scope.blackVertical.remove();
			})
     }
     // 邀请成功提示信息
       $scope.inviteSuccessModal = function(msg){
       	$scope.msg = msg;
     	$ionicModal.fromTemplateUrl('templates/main/modal/inviteSuccess.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal) {
				$scope.inviteSuccessMod = modal;
				$scope.inviteSuccessMod.show();
			})
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				$scope.inviteSuccessMod.remove();
			})
     }
	 	
	 	function newsAlert(){//消息公告
	 		if($scope.newsAlertModel){
		    	$scope.newsAlertModel.show();
	    	}else{    		
			     $ionicModal.fromTemplateUrl('templates/main/modal/newsAlertModal.html',{
					scope: $scope,
					animation: 'silde-in-up'
				}).then(function(modal) {
					$scope.newsAlertModel = modal;
					$scope.newsAlertModel.show();
					$scope.isList = true;
					$scope.newsBtn = function(data){//公告切换
						$.each($scope.titleMsg, function(index,one) {
							one.disabled = false;
							if(data.id == one.id){
								one.disabled = true;
								$scope.newsIndex = data.id;
							}
						})
					}
					
					$scope.onlyNewBtn = function(data){//消息处理
						$scope.msgContent = data
						var typeNew =  data.type;
						if(!data.status){
							data.status = 1;
							Main.msgUpdateStatus({msgId:data.id}).then(function(data){
								if(data && data.code == 0){
									return false;
								}
							})
						}
						$scope.newsListCheck($scope.newsAll)
						var msg = '';
						if(typeNew == 2){  // 活动奖励 2
							 var msgdate = gettimeform($scope.msgContent.date);
							 msg = '<div class="a-text-color-light">'+$scope.msgContent.tContent+'</div>'
						}else if(typeNew == 0){ // admin
							msg = '<p class="a-text-color-light a-font-size-small-x font-weight">'+$scope.msgContent.tTitle+'</p>';
							msg  += '<p class="a-text-color-whit a-font-size-small-x textMt">'+$scope.msgContent.tContent+'</p>';
						}else{//邀请成功
							$scope.inviteSuccessModal($scope.msgContent);
							return false;
						}
						$scope.blackVerticalModal(msg)
					}
			    });
		   	}
	 	}
		$scope.$on("$ionicView.afterEnter",function(){
			var user = sessionStorage.getItem("user");
			history.replaceState({},"","#/tab/battle/0/0/0");
			history.pushState({},"","#/tab/main");
			if(user){
				$scope.userInfoDetial(JSON.parse(user));
			}else{
				$scope.userInfoDetial();
			}
			$scope.redDot();//红点，因为房间操作会有红点更新，需要更新数据
			/*
			 * 轮播图手动事件
			 * */
			$scope.slideHasChanged = function(index){ 
		        $scope.slideIndex = index;  
		        if($ionicHistory.currentStateName()=="tab.main"){
		        	if ( ($ionicSlideBoxDelegate.$getByHandle('expand').count() -1 ) == index ) {  
		        	    $timeout(function(){  
		        	    	$ionicSlideBoxDelegate.$getByHandle('expand').slide(0);  
		        	    },3000);  
		        	}  
		        }
		    };
			//轮播图
		 	if(!$scope.mainImg){
		 		Hall.rollPic().then(function(data){
					if(data.code == 0){
//						sessionStorage.setItem("mainImg",JSON.stringify(data));
						$scope.mainImg = data.data;
						$ionicSlideBoxDelegate.$getByHandle("expand").start();
						$ionicSlideBoxDelegate.$getByHandle("expand").update(); //解决图片加载不出来的问题
						if($scope.mainImg.length>2){
							$ionicSlideBoxDelegate.$getByHandle("expand").loop(true); //解决轮播至最后一个不轮播的问题
						}
					}else{
				  		$ionicLoading.hide();
				  	}
			   	})
		 	}else{
		 		$ionicSlideBoxDelegate.$getByHandle("expand").start();
		 		$ionicSlideBoxDelegate.$getByHandle("expand").update(); //解决图片加载不出来的问题
 				if($scope.mainImg.length>2){
					$ionicSlideBoxDelegate.$getByHandle("expand").loop(true); //解决轮播至最后一个不轮播的问题
				}
		 	}
		 	//首页获取是否有推荐的球星竞猜
		 	Prizes.all(1,true).then(function(data){
		 		if(!data.code && data.totalCount && data.data.length){
		 			$scope.hotFight = data.data[0];
		 			$scope.hotFightBg = "./img2.0/main/zy_qxdz_bg.jpg";
		 		}else{
		 			$scope.hotFight = false;
		 			$scope.hotFightBg = "./img2.0/main/zy_4.jpg";		
		 		}
		 	},function(error){
		 		$scope.hotFight = false;
		 		$scope.hotFightBg = "./img2.0/main/zy_4.jpg";
		 	})
		})
//		$scope.help_title = true;	 		
		$scope.$on("$ionicView.beforeLeave", function(e){//页面离开时
			console.log(location.hash);
			if(location.hash == "#/tab/battle/0/0/0" || location.hash == "#/tab/main"){
	//			location.hash = "#/tab/main";
				window.close();
				var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					WeixinJSBridge.call('closeWindow');
				}
			}
		})
		$scope.lbEvent = function(bgimg){//	轮播图跳转
			if(bgimg.position == 1){
				TALKWATCH("点击-盛开体育logo");
			}
			if(bgimg.linkType == 1){  //内部链接
				$location.path(bgimg.jumpLink)
			}else if(bgimg.linkType == 2){//外部链接
//				window.location.href = bgimg.jumpLink;
			}else if(bgimg.linkType == 3){  // 弹窗
				if(bgimg.jumpLink){
					notice(bgimg);
				}else{
					$scope.toast("近期暂无活动")
				}
			}
			TALKWATCH("主页-点击轮播图");
		}
		TALKWATCH ("进入主页");
	}
	ctrl.$inject = ['$scope',"$rootScope",'$ionicActionSheet','$http','$timeout','$ionicModal','$ionicLoading',"$ionicScrollDelegate","$ionicSlideBoxDelegate",'$location',"$stateParams","$ionicHistory","Thr",'Hall','Prizes',"Wode","Main"];
	app.registerController("MainCtrl",ctrl);
	//return ctrl;
})