define(["app","require"],function(app,require){
	"use strict";
	function ctrl($scope,$compile, $location,$stateParams,$ionicHistory, $ionicLoading, $timeout, $rootScope,$ionicModal,$ionicPopup,Hall,Battle, Prizes, LineUp, Rank, Wode, Thr,RTAll) {
		//弱网络保护
		if (navigator.onLine) {//联网
			$("#online").css("display", "none");
		} else { //断网
			$("#online").css("display", "block");
		}
		$scope.sysPar = new sysPar();
		$scope.prizeStart = $scope.sysPar.prizeStart;
		//拉取用户id
		$scope.getUserInfo = function(isShow){
			Hall.user().then(function(data) {
				if (!data.data || data.code != 0){
					localStorage.removeItem("userId");
					localStorage.removeItem("nickName");
					sessionStorage.removeItem("user");
					return false;
				}
				localStorage.setItem("userId", data.data.id);
				sessionStorage.setItem("userId_short", data.data.id);
				$hp.defaults.headers.common['uk'] = data.data.id;
				$scope.firstCharge = data.data.firstCharge;
				$scope.userInfoDetial();
				
			}, function(error) {
				localStorage.removeItem("userId");
				localStorage.removeItem("nickName");
				sessionStorage.removeItem("user");
			})
		}
		$scope.userInfoDetial = function(data){//获取用户基本信息
			if(data){
				var userData = data;
				userData.dmd = toThousands(data.dmd);	
				userData.coin = toThousands(data.coin);
				$scope.userData = userData;
				$scope.firstCharge = data.firstCharge;
				 var time = new Date().getTime(); 
				$scope.userData.head_logo_url = $scope.userData.head_logo_url +'?' + time;
				return $scope.userData;
			}else{
				Wode.all().then(function(data){
					if (!data.data || data.code!= 0){ 
						var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
				        if (ua.match(/MicroMessenger/i) == "micromessenger") {
				               WeixinJSBridge.call('closeWindow');
				        }
						return false;
					};
					sessionStorage.setItem("user", JSON.stringify(data.data));
				    localStorage.setItem("nickName",data.data.name);
			    	$scope.userData = angular.copy($scope.userData = angular.copy(data.data)) ;
				   	$scope.userData.dmd = toThousands($scope.userData.dmd);	
					$scope.userData.coin = toThousands($scope.userData.coin);
					var time = new Date().getTime(); 
					$scope.userData.head_logo_url = $scope.userData.head_logo_url +'?' + time;
					$scope.firstCharge = data.data.firstCharge;
					return $scope.userData;
				}, function(error){
			
				})
			}
		}
		function battle_default(url){
			$scope.playerId = 1; //玩法id
			$scope.matchId = 0; //联赛id，要求默认为英超
			$scope.tabIndex = 0; //房间状态
			$scope.page = 1; //页码
			Battle.list($scope.tabIndex,"",$scope.page).then(function(data){
				if(data.code) return $ionicLoading.hide();
				if(!data.code){
					sessionStorage.setItem("battle_default",JSON.stringify(data));
					$timeout(function() {
						$ionicLoading.hide();
						$location.path(url);
					}, 500)
				}
			},function(error){
				$ionicLoading.hide();
			})
//			Prizes.matchList($scope.playerId, $scope.matchId, $scope.tabIndex, $scope.page).then(function(data) {
//				if(data.code) return $ionicLoading.hide();
//				sessionStorage.setItem("battle_prizes", JSON.stringify(data.data));
//				var battle_prizes = JSON.parse(sessionStorage.getItem('battle_prizes'));
//				if (battle_prizes && data.code == 0) {
//					$timeout(function() {
//						$ionicLoading.hide();
//						$location.path(url);
//					}, 500)
//				} else {
//					$ionicLoading.hide();
//				}
//			}, function(error) {
//				$ionicLoading.hide();
//				$("#online").css("display", "block");
//			})
		}
	
		function rank_default(url) {
			Rank.rankCon(3,1).then(function(data) {
				if(data.code==0){
					sessionStorage.setItem("rank_default", JSON.stringify(data));
					$timeout(function() {
						$ionicLoading.hide();
						$location.path(url);
					}, 500)
				}else{
					$ionicLoading.hide();
				}
			}, function(error) {
				$ionicLoading.hide();
				$("#online").css("display", "block");
			})
		}
	
		function wode_default(url) {
			Wode.all().then(function(data) {
				if(data.code==0){
					sessionStorage.setItem("user", JSON.stringify(data.data));
					$timeout(function() {
						$ionicLoading.hide();
						$location.path(url);
					}, 500)
				}else{
					$ionicLoading.hide();
				}
			}, function(error) {
				$ionicLoading.hide();
				$("#online").css("display", "block");
			})
		}
	
		//	获取首页的房间数据
		$scope.rankUrl = function(url){
			$ionicLoading.show();
			$scope.connectLive();//实时结果 拉取
			switch (url) {
				case "/tab/main":
					$timeout(function() {
							$ionicLoading.hide();
							$location.path(url);
						}, 500);
						//			isUsed = false;
					break;
				case "/tab/battle/3/0/0":
					battle_default(url);
					break;
				case "/tab/rank":
					rank_default(url);
					break;
				case "/tab/wode":
					wode_default(url);
					break;
				default:
					break;
			}
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				$ionicLoading.hide();
			})
		}
	//	赛况没有房间是跳转到主页
		$scope.goMain = function(url){
			if(!url){
				url = "/tab/main"
				$location.path(url);
			}
		}
		$scope.playerDetial = function(id,status,detial) {//球员详情(除竞猜房外)status,detial用于布阵的
			if (id) {
				$ionicLoading.show();
				Thr.playerDetial(id).then(function(data){
					if (data.code == 0) {
						if(sessionStorage.removeItem("playerStatus")) sessionStorage.removeItem("playerStatus");
						if(status){
							if(status.checked) status.disable =false;
							var statusAll = {"status":status,"detial":detial};
							sessionStorage.setItem("playerStatus", JSON.stringify(statusAll));
						} 
						sessionStorage.setItem("playerData", JSON.stringify(data));
						var url = "/tab/lineup/qyxx-second/" + id + "/second";
						$location.path(url);
						$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
							$ionicLoading.hide();
						})
					}else{
						sessionStorage.removeItem("playerData");
						$ionicLoading.hide();
					}
				}, function(error) {
					sessionStorage.removeItem("playerData");
					$ionicLoading.hide();
				})
			}
		}
		//11v11进行中玩家列表,11v11进行中阵容,时间轴,球星竞猜进行中详情
		var liveDataStateArr = ['tab.battleRoomgoing','tab.battle-lineupshow','tab.battle-timeAxis','tab.battle-prizes-going-detial'];//需要实时数据的tab数组
		$scope.getLiveData = function(playId,roomId,userId,getEventMsg,isChat){
			var liveDataState = $ionicHistory.currentStateName();//当前tab
			if(!window.navigator.onLine){
				$scope.alertAct(msg,msgOK,playId,roomId,userId,liveDataState,getEventMsg);return;
			}
			playId = Number(playId);
			roomId = Number(roomId);
			userId = Number(userId);
			RTAll.getItemUser().then(function(data){//获取userInfo
				if(!data.code){
					WebIM.config.appkey = data.data.appkey;//配置key
					$scope.conn = new WebIM.connection({//建立连接
					    https: WebIM.config.https,
					    url: WebIM.config.xmppURL,
					    isAutoLogin: WebIM.config.isAutoLogin,
					    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
//					    heartBeatWait: WebIM.config.heartBeatWait,
//					    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
//					    autoReconnectInterval: WebIM.config.autoReconnectInterval,
					    apiUrl: WebIM.config.apiURL,
					    
					});
			        var options = {
			            apiUrl: WebIM.config.apiURL,
			            appKey: WebIM.config.appkey,
			            user: data.data.imId,
			            pwd: data.data.pwd,
			        };
			        $scope.conn.open(options);//登陆
					$scope.conn.listen({//反馈
					    onOpened: function ( message ) {//连接成功回调  /
					    	WebIM.utils.setCookie('webim_' + data.data.imId, message.accessToken, 1);
					    	if((playId || playId==0) && roomId){
						        RTAll.userLogin(playId,roomId,0)//登陆告知房间id,玩法id
					    	}else{
					    		RTAll.redDotPush();//红点注册
					    	}
					    },  
			    		onClosed: function ( message ) {//连接关闭回调
					    	delete $scope.roomGoingData;
					    	delete $scope.lineupGoingData;
					    	delete $scope.prizesGoingData;
					    	if($.inArray(liveDataState,liveDataStateArr)!=-1){
					    		var userCookieId = 'webim_' + data.data.imId;
					    		var options = {
								    apiUrl: WebIM.config.apiURL,
								    user: data.data.imId,
								    pwd: data.data.pwd,
								    accessToken: WebIM.utils.getCookie('webim_' + data.data.imId)[userCookieId],
								    appKey: WebIM.config.appkey
								};
								$timeout(function(){
	//								$scope.conn.open(options);
								},2000)
					    	}
					    },
					    onTextMessage: function (message) {//收到文本消息   messageTypeDisplay   0推送实时数据  1推送小红点
					    	if(!isChat){//如果不是聊天室的情况
						    	if(roomId) RTAll.receipt(playId,roomId).then(function(data){});//消息回执
						    	if(message.ext.roomId==roomId && message.ext.category==playId && message.ext.messageTypeDisplay==0){//确认收到消息和请求数据匹配
						    		if(message.ext.roomStatus==1|| message.ext.roomStatus==3){//房间进行中
						    			if(message.ext.roomStatus==1){//比赛进行中
						    				$scope.playing_noSendPirze = false;
						    			}else if(message.ext.roomStatus==3){//比赛已结束,房间派奖中
							    			$scope.playing_noSendPirze = true;	
							    		}
						    			if(!message.ext.prizing){//比赛进行中（包括比赛完成到派奖的状态）
						    				if(liveDataState=="tab.battleRoomgoing"){//11v11详情列表页
	//					    					classLive(message);
	//											getEventMsg(message.ext);
						    				}else if(liveDataState=="tab.battle-prizes-going-detial"){//球星竞猜
	//					    					prizesLive(message);
						    				}
						    			}else{}//比赛派奖中,不更新数据,废弃
						    			if(liveDataState=="tab.battle-lineupshow"){//如果是获取阵容,连接成功后立即拉取阵容信息
						    				RTAll.lineupLive(roomId,userId).then(function(data){
						    					if(!data.code) $scope.lineupGoingData = data.data;
						    				})
						    			}
						    			if(getEventMsg) getEventMsg(message.ext);//如果回调存在
						    			$scope.$apply();
						    		}else if(message.ext.roomStatus==2){//房间已结束,页面跳转
						    			imLiveEnd(message.ext.category);
						    		}   		
						    	}else if(message.ext.messageTypeDisplay==1){//如果是小红点推送
						    		pushRed(message.ext,message.ext.status);
						    		$(".battleTab").addClass("battleTabHot");
						    	}
					    	}
					    	if(message.type==="groupchat"){//如果是聊天室
					    		if(!isChat){//如果不在聊天室界面
					    		}
					    		if(getEventMsg) getEventMsg(message);//如果回调存在
					    	}else if(message.type=="error" && message.errorCode=="406"){//如果用户不在该群
					    		if(getEventMsg) getEventMsg(message);
					    	}
					    },
					    onEmojiMessage:function(message){//表情
					    	console.log(message);
					    	if(isChat){
					    		if(getEventMsg) getEventMsg(message.ext);//如果回调存在
					    	}
					    },
					    onPictureMessage:function(message){//图片
					    	console.log(message);
					    	if(isChat){
					    		if(getEventMsg) getEventMsg(message.ext);//如果回调存在
					    	}
					    	
					    },
					    onDeliveredMessage:function(message){//消息回执
					    	console.log(message);
					    },
					    onReceivedMessage: function(message){//收到消息送达服务器回执
					    	console.log(message);
					    },    
					    onOnline: function () {
					    	console.log("onLine");
					    },
					    onOffline: function () {
					    	$scope.alertAct("网络连接错误","重新刷新",playId,roomId,userId,liveDataState,getEventMsg);
					    },
					    onError: function ( message ) {
			//		    	if(message.type==16){
			//		    		$scope.alertAct("网络连接错误","重新刷新",playId,roomId,userId);
			//		    	}
					    },
					});
	
				}
			})
		}
	
	//	实时数据连接调用
		$scope.connectLive = function(playId,roomId,userId,getEventMsg,isChat){//getEventMsg存在回调
			if(typeof WebIM !="undefined"){
				if(!WebIM.connection){
					require(["webimConfig","strophe","websdk"],function(){
						$scope.connectLive(playId,roomId,userId,getEventMsg);
					});
				}else{
					if($scope.conn && $scope.conn.isOpened()){
						$scope.conn.close();
						delete $scope.conn;
					}
					if((playId || playId==0) && roomId){
						$scope.playing_noSendPirze = false;
						$scope.getLiveData(playId,roomId,userId,getEventMsg,isChat);//实时数据 拉取
					}else if(isChat){//聊天室
						$scope.getLiveData(playId,roomId,userId,getEventMsg,isChat);//聊天室
					}else{
						$scope.getLiveData();//实时结果 拉取
					}
				}
			}else{
				require(["webimConfig","strophe","websdk"],function(){
					$scope.connectLive(playId,roomId,userId,getEventMsg,isChat);
				});
			}
		}
	//  11v11推送处理
		function classLive(message){
	    	if(message.ext.matchList.length>0 && message.ext.userList.length>0){
	    		var nowUserId = Number(sessionStorage.getItem("userId_short"));
				$scope.roomGoingData = message.ext;
				angular.forEach($scope.roomGoingData.userList,function(dd,index){
					if(dd.userId == nowUserId){//
						dd.rank = index+1;
						$scope.roomGoingData.mine = dd;
					}
				})
			}
		}
	//  球星竞猜推送处理
		function prizesLive(message){
			if(message.ext.match.length>0){
				$scope.prizesGoingData = message.ext;
				if(message.ext.match.status==5) $scope.playing_noSendPirze = true;
			}
		}
	//	推送结束跳转
		function imLiveEnd(category){
			sessionStorage.removeItem("battle_default");
			sessionStorage.removeItem("battle_prizes");
			sessionStorage.removeItem("battle_thr");
			switch(category){
				case 0:
					$url = "/tab/battle/3//2";
				break;
				case 1:
					$url = "/tab/battle/1/0/2";
				break;
				
				default:
					$url = "/tab/battle/3//2";
				break;
			}
			$location.path($url);
		}
		function pushRed(data,status){//小红点推送结果处理
			if(!$scope.battleRedHot) $scope.battleRedHot = {};
			if(status==1){//进行中
				if(!$scope.battleRedHot.playing) $scope.battleRedHot.playing = {};
				 $scope.battleRedHot.playing.statusShow = true;
			}else if(status==2){//已结束
				if(!$scope.battleRedHot.finished) $scope.battleRedHot.finished = {};
				$scope.battleRedHot.finished.statusShow = true;
			}
			switch(data.category){
				case 0://经典战
					if(status==1){
						if(!$scope.battleRedHot.playing.Tradition) $scope.battleRedHot.playing.Tradition = {};
						$scope.battleRedHot.playing.Tradition.showHas = true;
					} 
					if(status==2){
						if(!$scope.battleRedHot.finished.Tradition) $scope.battleRedHot.finished.Tradition = {};
						$scope.battleRedHot.finished.Tradition.showHas = true;
					} 
				break;
				case 1://球星对战
					if(status==1){
						if(!$scope.battleRedHot.playing.StarGuess) $scope.battleRedHot.playing.StarGuess = {};
						$scope.battleRedHot.playing.StarGuess.showHas = true;
					} 
					if(status==2){
						if(!$scope.battleRedHot.finished.StarGuess) $scope.battleRedHot.finished.StarGuess = {};
						$scope.battleRedHot.finished.StarGuess.showHas = true;
					} 
				break;
			}
		}
		
	//	赛况小红点
		$scope.redDot = function(battleClick){
			RTAll.redDot().then(function(data){
				if(!data.code){
					var redSignArr = data.data;
					redSignArr.unplay = opearRed(redSignArr.unplay,0,battleClick);
					redSignArr.playing = opearRed(redSignArr.playing,1,battleClick);
					redSignArr.finished = opearRed(redSignArr.finished,2,battleClick);
					$scope.battleRedHot = redSignArr;
					if(redSignArr.unplay.statusShow || redSignArr.playing.statusShow || redSignArr.finished.statusShow){
						$(".battleTab").addClass("battleTabHot");
					}else{
						$(".battleTab").removeClass("battleTabHot");
					}
				}else{
					$(".battleTab").removeClass("battleTabHot");
				}
				
			})
		}
		
		function opearRed(data,status,battleClick){
			if(data){
				if(data.Tradition){
					data.Tradition = matchRed(data.Tradition,status,"classics",battleClick);
				}
				if(data.StarGuess){
					data.StarGuess = matchRed(data.StarGuess,status,"prizes",battleClick);
				}
				if(data.Three2Three){
					data.Three2Three = matchRed(data.Three2Three,status,"thrTothr",battleClick);
				}
				if(data.Tradition.showHas || (data.StarGuess && data.StarGuess.showHas) || data.Three2Three.showHas){
					data.statusShow = true;
				}else{
					data.statusShow = false;
				}
			}
			return data;
		}
		function matchRed(data,status,playKind,battleClick){
			var statusSign;var playSign;
			switch(status){
				case 0:
					statusSign = "_noStart";
				break;
				case 1:
					statusSign = "_going";
				break;
				case 2:
					statusSign = "_end";
				break;
			}
			switch(playKind){
				case "classics":
					playSign = "traditionSign";
				break;
				case "prizes":
					playSign = "starGuessSign";
				break;
				case "thrTothr":
					playSign = "thrTothrSign";
				break;
			}
			if(!statusSign || !playSign) return;
			var statusPlaySing = playSign + statusSign;
			if(data.has){//是否有比赛
				if(status!==0){
					var traditionSign = localStorage.getItem(statusPlaySing);
					if(traditionSign){//如果有缓存的情况
						if(traditionSign==data.sign){//判断缓存是否一致,如果一致,说明已经看过,则不再显示红点
							data.showHas = false;
						}else{//如果缓存不一致,说明有新的数据,红点显示，调整缓存的方式
							data.showHas = true;
//							if(battleClick) localStorage.setItem(statusPlaySing,data.sign);
						}
					}else{//如果没有缓存,说明红点第一次显示
//						if(battleClick) localStorage.setItem(statusPlaySing,data.sign);
						data.showHas = true;
					}
				}
				if(status===0) data.showHas = true;//如果是未开始,红点不受点击次数影响
		 	}else{//如果没有比赛,删除已有的缓存
		 		if(status!==0){
		 			sessionStorage.removeItem(statusPlaySing);
		 		}
		 		if(status===0) data.showHas = false;//如果是未开始,红点不受点击次数影响
			}	
			return data;
		}
		$scope.$on("$ionicView.enter",function(){
			var currentPageState = $ionicHistory.currentStateName();
			var diffPageArr = ['tab.hall-joinroom','tab.battle-lineup','tab.creamroom-success','tab.lineupShareEle'];//需要自定义分享的tab数组
			if($.inArray(currentPageState,diffPageArr)==-1){
				if($scope._appId) $scope.creatShare(true);
			}
			
		})
		$scope.creatShare = function(isMain,title,img,desc,roomId,shareHashUrl,shareCall){
//			console.log($ionicHistory.currentStateName());
//			var nowUrl = "http://open.weixin.qq.com/connect/oauth2/authorize?appid=" +data.data.appId + "&redirect_uri=" + encodeURIComponent("http://" + window.location.hostname) +"&response_type=code&scope=snsapi_userinfo&state=STATE";
			var _newUserPath = "&newPath="+encodeURIComponent(encodeURIComponent(window.location.hostname+"/new.html?fromId="+localStorage.getItem("userId")));
			if(localStorage.getItem("userId")){
//				var _parametUser = "&parametUser="+localStorage.getItem("userId")+"&parametTime="+new Date().getTime();
				var _parameterUrl = "parametUser="+localStorage.getItem("userId")+"&parametTime="+new Date().getTime();
			}
			if(!isMain){//如果不是分享到主页
				switch($ionicHistory.currentStateName()){
					case "tab.hall-joinroom"://加入房间分享
						var shareHashUrl = window.location.hash.substring(1);
					break;
					case "tab.battle-lineup"://已加入房间分享
						var shareHashUrl = "/tab/hall/joinroom/" + roomId +"/";
					break;
					case "tab.creamroom-success"://创建房间成功分享
						var shareHashUrl = "/tab/hall/joinroom/" + roomId +"/";
					break;
					case "tab.lineupShareEle"://战报分享
						var shareHashUrl = window.location.hash.substring(1);
						var _newUserPath = "&newPath=";
					break;	
					default ://如果当前tab不在自定义范围内，则默认分享到主页
						var shareHashUrl = '';
						isMain = true;
					break;
				}
				if(roomId){
					var _parameterUrl = _parameterUrl+"&parametRoom="+roomId;	
				} 
			}
			var _parameter = "&parameter="+encodeURIComponent(encodeURIComponent(_parameterUrl));
			var _getHash = isMain?"&hash=":"&hash=" + encodeURIComponent(encodeURIComponent(shareHashUrl));
			var _AllParamet = _getHash + _newUserPath + _parameter;
			var shareUrl = window.location.href.split("#")[0] + _AllParamet;
			var privateData = {
				title:title?title:"StarKings",
				url:shareUrl,
//				url:nowUrl + "#wechat_redirect",
				img:img?img : window.location.hostname + "/img2.0/rank/lxkf_1.png",
				desc:desc?desc:"足球阵容竞猜游戏，猜真实比赛阵容，赢了就有钱"
			}
			wxShare(privateData,connectWX,shareCall);
		}
		$scope.showShareModal = function(shareAction,talkNum){
			$ionicModal.fromTemplateUrl('templates/common/shareModal.html', {
				scope: $scope
			}).then(function(modal){
				$scope.shareModal = modal;
				$scope.shareAction = shareAction;
				if(talkNum == 0){ //公开房点击分享
					TALKWATCH("公开房点击分享");
				}else if(talkNum == 1){ //私密房点击分享
					TALKWATCH("私密房点击分享");
				}else if(talkNum == 2){ //加入房间点击分享
					TALKWATCH("加入房间点击分享");
				}else if(talkNum == 3){ //已加入房间点击分享
					TALKWATCH("已加入房间点击分享");
				}else if(talkNum == 4){ //经典战排名点击分享
					TALKWATCH("经典战排名点击分享");
				}
				$scope.shareModal.show();
				$scope.closeShareModal = function(){
					$scope.shareModal.remove();
				}
				$rootScope.$on('$locationChangeSuccess', function() { //返回前页时，刷新前页
					$scope.shareModal.remove();
				})
			});
		}
	//	去往充值的modal
		$scope.chargeAction = function(msg,qx,qd,isCharge){
			$ionicModal.fromTemplateUrl('templates/common/charge.html', {
				scope: $scope
			}).then(function(modal){
				$scope.chargeModal = modal;
				$scope.msg = msg;
				$scope.isCharge = isCharge;//如果为充值
				$scope.qx = qx?qx:"取消";
				$scope.qd = qd?qd:"确定";
				$scope.chargeModal.show();
				$scope.cancel = function(){
					$scope.chargeModal.hide();
				}
				$scope.commit = function(){
	//				$scope.toastDark("暂未开放,敬请期待");
					var url = url?url:"/tab/wode/sc";
					$location.path(url);
					$scope.chargeModal.hide();
				}
				$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
					$scope.isCharge = false;
					$scope.chargeModal.hide();
				})
			});
		}
	
	//	alert提示
		$scope.alert = function(msg){
			$scope.alertPopup = $ionicPopup.alert({
				cssClass:'erralert-popup',
				template: '<div class="alertText">'+msg +'</div>',
				okText: "确定"
			});
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				$scope.alertPopup.close();
			})
			return $scope.alertPopup;
		}
		$scope.alertDark = function(msg,callFunc){
			var alertPopup = $ionicPopup.alert({
				cssClass:'alert-popup',
				template: '<div class="alertText">'+msg +'</div>',
				okText: "确定"
			});
			alertPopup.then(function(res){
				if(callFunc) callFunc();
			});
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				alertPopup.close();
			})
			return alertPopup;
		}
		$scope.alertAct = function(msg,msgOK,playId,roomId,userId,liveDataState,getEventMsg){//实时数据弱网连接提示
			$(".alert-popup").remove(0);
			var alertPopup = $ionicPopup.alert({
				cssClass:'alert-popup',
				template: '<div class="alertText">'+msg +'</div>',
				okText: msgOK
			});
			alertPopup.then(function(res){
				if(!window.navigator.onLine){
					alertPopup.close();
					$scope.alertAct(msg,msgOK,playId,roomId,userId,liveDataState,getEventMsg);return;
				}
				if($scope.conn && $scope.conn.isOpened()) $scope.conn.close();
				if($.inArray(liveDataState,liveDataStateArr)!=-1){//阵容列表//阵容//竞猜
					$scope.connectLive(playId,roomId,userId);
				}else{
					
				}
			});
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				alertPopup.close();
			})
			return alertPopup;
		}
		$scope.alertShut = function(msg){
			if(!msg){
				msg = "";
				msg +="<div id=''><h1 class='a-text-color-light a-font-size-small'>房间奖励会随着房间参与人数的增加而增长</h1>";
				msg +="<div class=''><span class='a-text-color-light a-font-size-small'>当前奖励：</span><span class='a-text-color-whit a-font-size-small'>在当前房间人数情况下，相应名次所获得的奖励</span></div>";
				msg +="<div class=''><span class='a-text-color-light a-font-size-small'>最高奖励：</span><span class='a-text-color-whit a-font-size-small'>房间满人数下，相应名次所获得的奖励</span></div></div>";
			}
			var alertPopup = $ionicPopup.alert({
				cssClass:'alert-shut-popup',
				template: msg,
				okText: "<img class='a-img-size' style='margin: 0px;' src='../../img2.0/joinroom/jrfj_jjsm_2.png'/>"
			});
			alertPopup.then(function(res){
			});
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				alertPopup.close();
			})
			return alertPopup;
		}
	//	toast提示
		$scope.toast = function(msg){
			$ionicModal.fromTemplateUrl('templates/common/toast.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal,$event){
				$scope.toastModal = modal;
				$scope.msg = msg;
				$scope.toastModal.show();
				$("#toast").parent(".modal-wrapper").siblings(".modal-backdrop-bg").css({background:"none"})
				$timeout(function(){
					$scope.toastModal.remove();
				},1500)
			});
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				if($scope.toastModal){
					$scope.toastModal.remove();
				}
			})
		}
		$scope.toastDark = function(msg,msgSec,isHave){
			$ionicModal.fromTemplateUrl('templates/common/toastDark.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal,$event){
				$scope.toastDarkModal = modal;
				$scope.msg = msg;
				$scope.isHave = isHave;
				if(msgSec){
					$scope.msgSec = msgSec;
				}else{
					delete $scope.msgSec;
				}
				$scope.toastDarkModal.show();
	//			$("#toastDark").parent(".modal-wrapper").siblings(".modal-backdrop-bg").css({background:"none"})
				$timeout(function(){
					$scope.toastDarkModal.remove();
				},1500)
			});
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				if($scope.toastDarkModal){
					$scope.toastDarkModal.remove();
				}
			})
		}
	//	confirm提示
		$scope.url_ts = function(msg,title){
			var confirmPopup = $ionicPopup.confirm({
				cssClass:'confirm-popup',
				title: title,
				template: '<p style="text-align:center;">'+msg +'</p>',
				cancelText: "取消",
				okText: "确定"
			});
			return confirmPopup;
		}
		
	//	 星钻不足直接星币兑换钻石
		$scope.onceExchange = function(title,msg,btn,callFun){//标题，内容msg.money，确定按钮，取消按钮，内容样式
//			如果styleNO不存在,星币转钻石兑换
			if(msg.money){
				var con = '<span class="a-text-color-whitDark">还需<img class="a-img-size" src="../../img2.0/joinroom/zs_28.png"/><span class="a-text-color-whit">'+msg.money+'</span>&nbsp;，是否使用<img class="a-img-size" src="../../img2.0/hall/jdzdt_12.png" alt="" /><span class="a-text-color-whit">'+Number(msg.money)*$scope.sysPar.starToJewel+'</span>&nbsp;兑换?</span>';
			}else{
				return;
			}
			var diamondExchange = $ionicPopup.confirm({
				cssClass:'exchange-popup',
				title:'<div class="font-weight a-text-color-light a-font-size-medium">'+title+'</div>',
				template: con,
				cancelText: "取消",
				okText: btn
			})
			diamondExchange.then(function(res){
				if(res){
					$ionicLoading.show();
					Wode.wode_xingbi(Number(msg.money)*$scope.sysPar.starToJewel).then(function(converResult) {
						if(converResult.code == 0) {
							$ionicLoading.hide();
							if(callFun) callFun();//兑换后回调
						}else{
							$ionicLoading.hide();
							$scope.toastDark("提交失败，请重试");
						}
					},function(){
						$ionicLoading.hide();
						$scope.toastDark("提交失败，请重试");
					})
				}
			})
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				if(diamondExchange) diamondExchange.close();
			})
		}	
	//	余额不足
	    $scope.warnAlert = function (text,fun,cancel,ok){
	    	ok = ok?ok: "前往充值";
	    	cancel = cancel?cancel:"取消";
	    	if(fun == "清空提示"){
	    		fun = '<img src="../../img2.0/lineup2.0/jdz_tc_js.png" alt="" /><span>'+text+'</span>'
	    	    text="";
	    	}
	    	$scope.confirmPopup = $ionicPopup.confirm({
	    		cssClass:'warn-popup',
				template: fun,
				title:text,
				cancelText:cancel,
				okText: ok,
			});
			//                $scope.successsAlert("支持成功,祝你好运!","感觉胜券在握可以追加支持哦");
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				$scope.confirmPopup.close();
			})
	    }
	    
	    //	多行提示
		$scope.successsAlert = function(title,msg){
			$ionicModal.fromTemplateUrl('templates/common/successAlert.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal,$event){
				$scope.successsAlert = modal;
				$scope.successsAlert.show();
				$(".successAlert").html("<h2>"+title+"</h2><p>"+msg+"</p>")
	//			$timeout(function(){
	//				$scope.successsAlert.remove();
	//			},2000)
			});
		}
	    
	    // 失败提示
	    $scope.exErrorAlert = function(title,msg){
	    	$ionicModal.fromTemplateUrl('templates/shop2.0/exErrorAlert.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal,$event){
				$scope.ErrorAlert = modal;
				$scope.title = title;
				$scope.msg = msg;
				$scope.ErrorAlert.show();
			});
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
				$scope.ErrorAlert.remove();
			})
	    }
	    
	     // 验证提示
		$scope.warnAlt = function(alt){
	//		console.log(alt)
			$scope.alt=alt;
			$('.phone .warnAlt').slideDown(100);
			$timeout(function(){
				$('.phone .warnAlt').slideUp(100);
			},2000)
		}
	//  星币星钻列表显示方法
	    $scope.getViableExchange = function(ownValue,defaultValue){
	 		var dmdInt = parseInt(ownValue/10);
	 		angular.forEach(defaultValue,function(row,rowIndex){
	 			angular.forEach(row,function(item,index){
	 				if(item.coin>ownValue){
	 					item.noExchange = true;
	 				}else{
	 					item.noExchange = false;
	 				}
	 			})
	 		})
	 		return {"dmdInt":dmdInt,"defaultValue":defaultValue}
	 	}
	    
	    // 手机号码加密
	    $scope.mmphone = function(phone){
	//  	console.log(phone)
	        return phone.substr(0, 3) + '****' + phone.substr(7);
	    }
	    
	    $scope.showRules = function(ruleId){
			$ionicModal.fromTemplateUrl('templates/common/rule.html', {
				scope: $scope,
				animation: 'fade-in'
			}).then(function(modal,$event){
				$scope.ruleModal = modal;
				$scope.whichRule = ruleId;//显示哪个rule
				$scope.ruleModal.show();
				$scope.closeModal = function(){
					$scope.ruleModal.remove();
				}
		    	$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
					$scope.closeModal();
				})
			});
	   }
	    // 粉色成功提示
	    $scope.successpink = function(msg) {
	     var confirmpink = $ionicPopup.alert({
	        	cssClass:'successpink-popup',
				template: "<div class='pinkbg'>"+msg+"</div>",
				cancelText: "",
	     });
	     $timeout(function(){confirmpink.close();},2000)
	   };
	   // 房间逻辑处理
		$scope.roomhandle = function(list){
			angular.forEach(list, function(data, index, array) {
				data.predictPrizePool = toThousands(data.predictPrizePool);
				data.entryNum = data.entry;
				data.entry = toThousands(data.entry);
				if(data.playTypeName == '第一名'){
					data.playType = '16'
				}else if(data.playTypeName == "前三名"){
					data.playType = '17'
				}else if(data.playTypeName == "前25%"){
					data.playType = '18'
				}else if(data.playTypeName == "前50%"){
					data.playType = '19'
				}else{
					data.playType = '20'
				}
			data.mark = data.currUserNum/parseInt(data.totalUserCount)*100
			})
		}
		
		function connectWX(){
			var nowHref = window.location.href;
			RTAll.wxShare(nowHref.split("#")[0]).then(function(data){
				if(!data.code){
					$scope._appId = data.data.appId;
					privateWxConfig(data.data,false,connectWX);
					$scope.creatShare(true);
				}
			},function(){
			
			})
		}
//		connectWX();
		$scope.$on("$ionicView.afterEnter",function(){
			jsRequire("talkData");
			jsRequire("websdk");
			jsRequire("wx",connectWX);
		})
		
		
		// 轮播公告
		 var html = ' <div id="carousel" ng-if="carouselshow" class="left-center" style="width: 90%;height: .24rem;display: -webkit-flex;display:flex;line-height: .24rem;top:.51rem;background: rgb(255,196,23);position: fixed;z-index: 10;background: url(../img2.0/main/gdbb_bg.png)no-repeat center ;background-size: 100% 100%;" class="a-flex-center">'
		  html+='<span style="width: 6%;" class="a-flex-center"></span>'
		  html+='<div id="carouseltext" style="width: 80%;height: 100%;;line-height: .24rem;position:relative;overflow: hidden;" class="a-font-size-small a-text-color-light"><nav id="wslider"  act-carouseltext  style="white-space: nowrap;position: absolute"></nav></div>'	
		  html+='<span style="width: 14%;" ng-click="carouselhide()"  class="a-flex-center"><img src="../img2.0/main/gdbb_ch.png"  style="height: .12rem;" /></span>'
          html+='</div>'
		var content =  $compile(html)($scope); //编译DOM 否则绑定事件不生效
		angular.element("ion-tabs").append(content);
		
		$scope.carousel = function(viewName){
        Hall.carousel().then(function(data){
				if(data && data.code == 0){
					$scope.carcontentAll = data.data;
					 $scope.carcontent = $scope.carcontentAll[0];
					 $scope.degreeAll = $scope.carcontentAll.length<=3?$scope.carcontentAll.length:3;
					 $scope.carouselshow = true;
					return false;
				}
			})	
			$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
			     	$scope.carouselshow = false;
			})
			 $scope.degree = 1;
		    $scope.$on("childChange", function(e, m) {
	            $scope.carouselshow = m;
	        })
		}
		// 公告页判断方法
		$scope.isNocticePage = function(stateName){
			var degreeStr = sessionStorage.getItem("degreeStr");
			if(Number(degreeStr)){
				$scope.carousel($ionicHistory.currentView().stateName);
			}
		}
		// 查看个人信息
		$scope.nameGet = function(userId){
			$scope.peopleType = userId;
			$scope.isUser = false;
			if(!$scope.userData){
				$scope.userInfoDetial();
				return false;
			}
			if(userId == $scope.userData.userId){
				$scope.isUser = true;
			}
			$ionicLoading.show();
			Wode.headSummary($scope.peopleType).then(function(data){
				if(data && data.code == 0){
					$scope.otherPeople = data.data;
					$ionicModal.fromTemplateUrl('templates/mine/mineModal/mineInforRevise.html', {
					scope: $scope,
					animation: 'fade-in'
					}).then(function(modal) {
						$scope.inforReviseMod = modal;
						$scope.inforReviseMod.show();
					})
					$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
						$scope.inforReviseMod.remove();
					})
				}
				$ionicLoading.hide();
			})
			// 查看历史记录
			$scope.historyQuery = function(id){
				if(id == $scope.userData.userId){
					$location.path('/tab/battle/3//2');
					return false;
				}
				Battle.list(2,"",1,id).then(function(dataAll){
					if(dataAll.code==0){
						console.log(dataAll)
						 $location.path('/tab/hisBattle/3/'+id);
						sessionStorage.setItem("battle_default_his",JSON.stringify(dataAll));
					}
				})
			}
		}
		
	}
	ctrl.$inject = ["$scope","$compile","$location","$stateParams","$ionicHistory", "$ionicLoading", "$timeout", "$rootScope","$ionicModal","$ionicPopup", "Hall","Battle", "Prizes", "LineUp", "Rank", "Wode", "Thr","RTAll"];
	app.registerController("AllCtrl",ctrl);
//	return ctrl;
})