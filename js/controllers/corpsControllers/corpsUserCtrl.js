define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$rootScope,$ionicScrollDelegate,$ionicPosition,$ionicModal,$location,$ionicLoading,$timeout,$stateParams,$cacheFactory,$state,$ionicPopup,Corps) {
		
		$scope.butList = [
		  {but:"留言板",index:0,isShow:true},
		  {but:"成员",index:1,isShow:false},
		  {but:"公告",index:2,isShow:false},
		]
		$scope.$on("$ionicView.beforeEnter",function(){
			$scope.teamId = $stateParams.isroomId;
			Corps.teamDetail({fightTeamId:$scope.teamId}).then(function(data){
				if(!data.code){
					$scope.teamDetail = data.data;
					$scope.teamDetail.percent = $scope.teamDetail.curEXP / $scope.teamDetail.totalEXP * 100 + "%";
					if($scope.teamDetail.level <= 2){
						$scope.teamDetail.reward = '1%'
					}else if($scope.teamDetail.level <= 5){
						$scope.teamDetail.reward = '2%'
					}else if($scope.teamDetail.level <= 8){
						$scope.teamDetail.reward = '3%'
					}else{
						$scope.teamDetail.reward = '4%'
					}
					getOldRecord($scope.teamId,1,$scope.teamDetail.easemodeGroupNumbers);
					// 记录首次加入战队成员欢迎
					 var firstJionWelcome = localStorage.getItem('firstJionWelcome');
					 if(!firstJionWelcome){
					 	changeAlert('first');
					 	localStorage.setItem('firstJionWelcome',$scope.teamDetail.id)
					 }else if(firstJionWelcome && firstJionWelcome != $scope.teamDetail.id){
					 	changeAlert('first');
					 	localStorage.setItem('firstJionWelcome',$scope.teamDetail.id)
					 }
				}else{
					$scope.toastDark('由于您的战队长期没有参加比赛，所以已经被解散了！','',true);
					$location.path('/tab/main/corpsHall');
					history.replaceState({},"","#/tab/main");
					history.pushState({},"","#/tab/main/corpsHall");
				}
			});
			 redHot('','corpsNotice');
		})
		$scope.page = 1;
		$scope.moreRecord = true;
		var getOldRecord = function(teamId,page,fightMembers){//		获取历史记录
			$scope.recordParam = {
				fightTeamId:teamId,
				page:page?page:1
			}
			Corps.chatRecord($scope.recordParam).then(function(data){
				if(!data.code){
					$scope.page = data.pageNo;
					if(data.pageNo==1){
						$ionicScrollDelegate.$getByHandle("chat_con").scrollBottom(false);
					}
					if(data.pageNo>=data.totalPageCount){
						$scope.moreRecord = true;
					}else {
						$scope.moreRecord = false;
					}
					if(!$scope.messageArr){
						$scope.messageArr = [];
					}
					for(var index in data.data){
						angular.forEach(fightMembers,function(item){
							if(data.data[index].userId==item.userId){
								data.data[index].headImg = item.headImg;
								data.data[index].fromName = item.nickName;
								data.data[index].isOwner = item.owner;
								
							}
						})
						data.data[index].timeStamp = data.data[index].chatTime;
						data.data[index].time = getNormal(data.data[index].timeStamp);
						data.data[index].data = data.data[index].chat;
						if(data.data[index].msgType===0){
							data.data[index].groupSysType = "sys" + data.data[index].msgType;
						}else if(data.data[index].msgType===2){
							data.data[index].groupSysType = false;
						}else{
							data.data[index].groupSysType = data.data[index].msgType;
						}
						
						if(data.data[index].userId==$scope.userData.userId){//如果是当前用户自己的
							data.data[index].isSelf = true;
						}else{
							data.data[index].isSelf = false;
						}
//						$scope.messageArr.push(data.data[index]);
					}
					$scope.messageArr = data.data.concat($scope.messageArr);
					if(data.pageNo>1){
//						$ionicScrollDelegate.$getByHandle('chat_con').getScrollView().__clientHeight;
//						$scope.oldTop;
						$timeout(function(){
//							$ionicScrollDelegate.$getByHandle('chat_con').scrollTop(true);
						},500)
					}
				}
			})
		}
		$scope.GetMoreRecord = function(){
			if($scope.moreRecord){
				$scope.$broadcast('scroll.refreshComplete');
//				$ionicScrollDelegate.$getByHandle('chat_con').scrollTop(true);
				return;
			}
			$scope.page +=1;
			getOldRecord($scope.teamId,$scope.page,$scope.teamDetail.easemodeGroupNumbers);
			$scope.$broadcast('scroll.refreshComplete');
		}
		// 战队信息刷新
		var teamreNovate = function(){
			Corps.teamDetail({fightTeamId:$scope.teamId}).then(function(data){
				if(!data.code){
					$scope.teamDetail = data.data;
					$scope.teamDetail.percent = $scope.teamDetail.curEXP / $scope.teamDetail.totalEXP * 100 + "%";
					if($scope.teamDetail.level <= 2){
						$scope.teamDetail.reward = '1%'
					}else if($scope.teamDetail.level <= 5){
						$scope.teamDetail.reward = '2%'
					}else if($scope.teamDetail.level <= 8){
						$scope.teamDetail.reward = '3%'
					}else{
						$scope.teamDetail.reward = '4%'
					}
				}
			});
		}
		
		// 显示小红点方法 接口位置 本地储存 显示开关
		var redHot = function(urlIndex,localhost,view){
			if(urlIndex == 1){ // 验证申请列表
				Corps.applyRedHot().then(function(data){
					if(!data.code){
					  $scope.corpsApply = redTest(data,localhost,view);
					}
				})
			}else{
				Corps.fightTeamNotice().then(function(data){
					if(!data.code){
				      $scope.corpsNotice = redTest(data,localhost,view);
					}
				})
			}
		}
		var redTest = function(data,localhost,view){
			if(data.data.hasData){
				var locationHas = localStorage.getItem(localhost);
				if(!locationHas){
					localStorage.setItem(localhost,data.data.sign);
					view = true;
				}else{
					if(data.data.sign === locationHas){
						view = false;
					}else{
						localStorage.setItem(localhost,data.data.sign);
					    view = true;
					}
				}
				return view;
			}
		}
		// 本地记录点击后小红点
		var clickRed = function(urlIndex){
			if(urlIndex == 1){ // 验证申请列表
			   $scope.corpsApply = false;
			}else{
				$scope.corpsNotice = false;
			}
		}
		$scope.$on("$ionicView.enter",function(){
//			$("#chatMsg").focus();//获取焦点     $("#chatMsg").blur();//失去焦点
			$ionicScrollDelegate.$getByHandle("chat_con").scrollBottom();//监听获取焦点事件。失去焦点时间。调用键盘时间
		})
		var getNormal = function(data){//data为时间戳
			if(!data) return false;
			var chatTime = gettimeform(data);
			var chatTimeForm = '';
			chatTimeForm += chatTime.month + "月";
			chatTimeForm += chatTime.dates + "日 ";
			chatTimeForm += chatTime.hours + ":";
			chatTimeForm += chatTime.minutes ;
			return chatTimeForm;
		}
		
		var getOldChat = function(message){//接收聊天消息
			if(!$scope.messageArr){
				$scope.messageArr = [];
//				$scope.$apply($scope.messageArr);
			}
			if(message.ext) message.isSelf = false;//如果是推送消息
			message.timeStamp = new Date().getTime();
			if(message.ext){//如果是推送消息
				if(message.type=="error" && message.errorCode=="406"){//如果用户已被移出战队
					if(message.from==$scope.userData.easemodName){
						changeAlert();
					}
				}
				if(message.type=="error") return false;
				if($scope.teamDetail.easemodeGroupNumbers.length){
					angular.forEach($scope.teamDetail.easemodeGroupNumbers,function(data,index){
						if(message.from==data.easemodName.toLowerCase()){
							message.fromName = data.nickName;
							message.headImg =data.headImg;
							message.isOwner = data.owner;
						}
					})
					
				}
				
				if(message.delay){//如果延迟消息
					message.timeStamp = Date.parse(new Date(message.delay)) + 8*60*60;
					message.time = getNormal(message.timeStamp);
				}else{//如果消息没有延迟
					message.time = getNormal(message.timeStamp);
				}
				if(message.ext){
					if(message.ext.groupSysType || message.ext.groupSysType===0){//如果是系统消息
						message.groupSysType = message.ext.groupSysType;
						if(message.ext.groupSysType===0){//0是踢人
							message.groupSysType = "sys" + message.groupSysType;
						}
					}
				}
				$timeout(function(){
					$ionicScrollDelegate.$getByHandle("chat_con").scrollBottom();
				},500)
			} 
			if(!message.delay){ //如果是延迟消息，暂不处理   || (message.delay && message.groupSysType)
				if(message.ext){
					$scope.dissTeam = message.ext.dissTeam;
					if(message.ext.dissTeam == 1){
						changeAlert('',true);return;
					}
				}
				$scope.messageArr.push(message);
			}
		}
		$scope.connectLive(null,null,null,getOldChat,true);
		$scope.sendMsg = function(msgWill){
			var msgWill = $("input[name='chatMsg']").val();
			var sendGroupText = function (sendData) {
			    var id = $scope.conn.getUniqueId();            // 生成本地消息id
			    var msg = new WebIM.message('txt', id); // 创建文本消息
			    var options = {
			    	apiUrl:WebIM.config.apiURL,
			        msg: sendData,             // 消息内容
			        to: $scope.teamDetail.easemodeGroupId, // 接收消息对象(群组id)
			        roomType: false,
			        chatType: 'chatRoom',
			        success: function (){//发送成功回调
			        	var saveChatData = {
							"chat":sendData,
							"fightTeamId":$scope.teamId
						}
			            Corps.rocordToServ(saveChatData).then(function(data){})
			        },
			        fail: function (){
			            
			        }
			    };
			    msg.set(options);
			    msg.setGroup('groupchat');
			    $scope.conn.send(msg.body);
			};
			if(msgWill){//发送时需要content的scrollBottom
				$scope.firstSend = true;
				var setData = {
					"chat":msgWill
				}
				Corps.isSensWord(setData).then(function(data){
					if(!data.code){
						sendGroupText(data.data);
					}
				})
				$ionicScrollDelegate.$getByHandle("chat_con").scrollBottom();
				var timestampChat = new Date().getTime();//获取当前的时间戳
				var chatTimeForm = getNormal(timestampChat);//组合时间
				var chatData = {
					data:msgWill,
					time:chatTimeForm,
					type:"groupchat",
					isSelf:true
				}
				getOldChat(chatData);
				$("input[name='chatMsg']").val('');
				$scope.firstSend = false;
//				$("input[name='chatMsg']").blur(function () {
//					var that = this; //或者用闭包
//					$(that).focus();
//					setTimeout(function () {
//					},100);
//				});
			}
		}

		
	$scope.changeH = function(isShow){
		var w_h=$(window).height();
		if(isShow){
			$ionicScrollDelegate.$getByHandle("chat_con").scrollBottom(true);
		}
		if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
			if(isShow){
//				$(".chat_slideBox").css({"bottom":289+"px"});
			}else{
				$(".chat_slideBox").css({"bottom":0});
			}
//		    var w_h=$(window).height();
//			$(window).on("resize",function(){//安卓有效
//				var t_h=$(this).height();
//				var hig = w_h-t_h;
//				alert(hig);
//				if(hig>50){
//					$(".chat_slideBox").css({"bottom":hig+"px"});
//				}else{
//					$(".chat_slideBox").css({"bottom":0});
//				}
//			})
		} else if (/(Android)/i.test(navigator.userAgent)) {
		
		} else {
		
		};
		
	}
		
		var userList = function(page){
			var dataList = {
				fightTeamId:$scope.teamId,
				page:page?page:1,
			}
			$scope.pageNo = page;
			Corps.userList(dataList).then(function(data){
				if(!data.code){
					if(data.pageNo == 1){
						$scope.userList = data.data.userList;
						$scope.teamDetail.captain = data.data.captain;
						$scope.teamDetail.userNum = data.totalCount;
					}else{
						$scope.userList = $scope.userList.concat(data.data.userList);
					}
					 $scope.moreRecordStop = false;
					 $scope.listTotalPageCount = data.totalPageCount;
					 if(page == (data.totalPageCount?data.totalPageCount:1)){
					 	$scope.moreRecordStop = true;
					 }
				}else if(data.code == 2){//如果是没有加入战队，返回战队列表
					$timeout(function(){
						changeAlert();
					},1500)
				}
			})
		}
		
		// 申请列表接口
		var applyListFun = function(page){
			var page = page?page:1; 
			$scope.pageNoMod = page;
			Corps.applyList({page:page,fightTeamId:$scope.teamId}).then(function(data){
				if(!data.code){
					if(data.pageNo == 1){
						$scope.modList = data.data;
					}else{
						$scope.modList = $scope.modList.concat(data.data)
					}
					$scope.moreAgree = false;
				    $scope.applyTotalPageCount = data.totalPageCount;
					 if(page == (data.totalPageCount?data.totalPageCount:1)){
					 	$scope.moreAgree = true;
					 }
				}
			})
		}
		
		$scope.loadMore = function(index){
			$timeout(function(){
				if(!$scope.moreRecordStop && index == 1){
					$scope.pageNo ++;
					userList($scope.pageNo);
				}
				if(!$scope.moreAgree && index == 2){
					$scope.pageNoMod ++;
					applyListFun($scope.pageNoMod);
				}
				 $scope.$broadcast('scroll.infiniteScrollComplete');
			},500)
		}
		// 切换按钮
		$scope.butClick = function(item){
			if(item.isShow === true) return;
			item.isShow = true;
			$scope.corps_slide = item.index;
			angular.forEach($scope.butList,function(array,index){
				if(array.index !== item.index){
					array.isShow = false;
				}
			})
			switch(item.index){
				case 0:
					Corps.teamDetail({fightTeamId:$scope.teamId}).then(function(data){
						if(!data.code){
							$scope.teamDetail.easemodeGroupNumbers = data.data.easemodeGroupNumbers;
						}else if(data.code=="200105"){//如果是没有加入战队，返回战队列表
							changeAlert();
						}
					});
				break;
				case 1:
					    $scope.pageNo = 1;
					    userList($scope.pageNo);
					    redHot(1,'corpsApply');
	  			break;
	  			case 2:
	  			       clickRed();
	  			break;
			}
			
		}
		// 退出战队接口方法
		var corpsQuitFun = function(){
	       	var alertPopup = $ionicPopup.confirm({
		       title: '<span class="font-weight a-font-size-medium a-text-color-whit">确定要退出战队？</span>',
		       cancelText:'取消',
		       okText:'确认',
		       cssClass:'corps-confirm'
		     });
		     alertPopup.then(function(res) {
		         if(res){
		         	TALKWATCH("退出战队",$scope.teamDetail.name)
		         	Corps.corpsQuit({teamId:$scope.teamId}).then(function(data){
                     	if(!data.code){
				         	$location.path('/tab/main/corpsHall');
				         	$scope.$on("$ionicView.beforeLeave",function(){
								history.replaceState({},"","#/tab/main");
								history.pushState({},"","#/tab/main/corpsHall");
								localStorage.removeItem('firstJionWelcome');
							})
		         	 	}
		          })
		         }
		     });
		}
		// 退出战队
		$scope.corpsQuit = function(captain){
			if(captain && $scope.userList.length>1){//如果有其他成员存在且自己是队长
				var alertPopup = $ionicPopup.alert({
			       title: '<span class="font-weight a-font-size-medium a-text-color-whit">退出战队前请先任命新的队长</span>',
			       okText:'确认',
			       cssClass:'corps-alert'
			     });
			     alertPopup.then(function(res) {});
			}else{//如果自己不是队长或者战队仅此一人
				corpsQuitFun();
			}
		}
		// 成员管理按钮
		$scope.handleCheck = function($event,list){
			$event.stopPropagation();   //stopPropagation是目前最常用也是最标准的解决事件冒泡的方法
			list.checked = !list.checked
		}
		// 踢出人员
		$scope.shotOffBtn = function($event,list){
			$event.stopPropagation();   //stopPropagation是目前最常用也是最标准的解决事件冒泡的方法
			if(list.clickoff) return;
			list.clickoff = true;
			TALKWATCH("踢出战队",$scope.teamDetail.name)
			Corps.takeOut({userId:list.userId}).then(function(data){
				if(!data.code){
					// 接口调用成功后执行
			       $scope.userList.splice($scope.userList.indexOf(list), 1);
			        teamreNovate();
			       if($scope.pageNo < $scope.listTotalPageCount){
			       	$scope.pageNo++;
			       	 userList($scope.pageNo);
			       }
				}else{
					$scope.toastDark(data.msg || '操作失败请稍后重试！','',true);
				}
				list.click = false;
			})
		}
		// 任命人员
		$scope.appointBtn = function($event,list){
			$event.stopPropagation();   //stopPropagation是目前最常用也是最标准的解决事件冒泡的方法
			 var alertPopup = $ionicPopup.confirm({
		       title: '<span class="font-weight a-font-size-medium a-text-color-whit">确定任命该玩家为战队队长？</span>',
		       cancelText:'取消',
		       okText:'确认',
		       cssClass:'corps-confirm'
		     });
		     alertPopup.then(function(res) {
		     	if(res){
		     		TALKWATCH("任命队长",$scope.teamDetail.name)
		     		Corps.changeCaptain({userId:list.userId}).then(function(data){
						if(!data.code){
							// 接口调用成功后执行
							angular.forEach($scope.userList,function(array,index){
								if(array.userId === list.userId){
									array.captain = true;
									$scope.teamDetail.captain = false;
								}else{
									array.captain = false;
								}
							})
						}else{
							$scope.toastDark(data.msg || '操作失败请稍后重试！','',true);
						}
					});	
		     	}
			})
		}
		// 队长同意加入接口 handleType 0同意 1拒绝
		$scope.agreeBtn = function(list){
			if(list.checked) return;
			list.checked = true;
			var obj = {
				applyId:list.userId,
				handleType:0
			}
			Corps.accessApply(obj).then(function(data){
				if(!data.code){
					// 接口调用成功后执行
			        $scope.modList.splice($scope.modList.indexOf(list), 1);
			        $scope.pageNo = 1;
					userList($scope.pageNo);
					teamreNovate();
					if($scope.pageNoMod < $scope.applyTotalPageCount){
			       	$scope.pageNoMod++;
			       	 applyListFun($scope.pageNo);
			       }
				}else{
					$scope.toastDark(data.msg || '操作失败请稍后重试！','',true);
				}
				list.checked = false;
			})
		}
		// 对战拒绝加入接口
		$scope.refuseBtn = function(list){
			if(list.checked) return;
			list.checked = true;
			var obj = {
				applyId:list.userId,
				handleType:1
			}
			Corps.accessApply(obj).then(function(data){
				if(!data.code){
					// 接口调用成功后执行
			        $scope.modList.splice($scope.modList.indexOf(list), 1);
			        list.checked = false;
			        if($scope.pageNoMod < $scope.applyTotalPageCount){
				       	 $scope.pageNoMod++;
				       	 applyListFun($scope.pageNo);
			       }
			        return false;
				}
				$scope.toastDark(data.msg || '操作失败请稍后重试！','',true);
			})
		}
		
		// 公告编辑
		$scope.textEdit = function(){
			$ionicModal.fromTemplateUrl('templates/corps/modal/textEditModal.html', {
					scope: $scope,
					animation: 'fade-in'
				}).then(function(modal) {
					$scope.textEditModal = modal
				    $scope.textEditModal.show();
				    $scope.edit = {
				    	texts:""
				    }
				})
		}
		//提交编辑公告
		$scope.editBtn = function(){
			if(!$scope.edit.texts){
				$scope.toastDark('编辑公告内容不能为空!','',true);
				return false;
			}
			$ionicLoading.show();
		   Corps.updateMemo({memo:$scope.edit.texts}).then(function(data){
				if(!data.code){
					$scope.teamDetail.memo = $scope.edit.texts;
					$scope.textEditModal.remove();
				}else if(data.code == 200115 || data.code == 200116 || data.code == 200117){
					$scope.toastDark('不能含有敏感词"'+data.data+'"','',true);
				}else{
					$scope.toastDark(data.msg || '编辑失败请检查网络!','',true);
				}
				$ionicLoading.hide();
			 })
		}
		
		var changeAlert = function(first,msg){
			$ionicModal.fromTemplateUrl('templates/corps/modal/corpsAlert.html', {
				 scope: $scope,
				 animation: 'fade-in'
			}).then(function(modal) {
				$scope.corpsAlert = modal;
				$scope.corpsAlert.show();
				$scope.textAlert = first?'恭喜你成功加入战队<span class="a-text-color-whit">'+$scope.teamDetail.name+'</span>，快快参与竞猜帮助战队升级，获得更多<span class="a-text-color-orange">星币奖励</span>！':'很抱歉你已被移出战队<span class="a-text-color-whit">'+$scope.teamDetail.name+'</span>，记得经常参与竞猜获得活跃度，这样才不容易被移出哦'
			    if(msg){
			    	$scope.textAlert = '因长期无人参与日常竞猜，您所在的战队活跃度降为0，现已被解散。请重新加入新的战队。'
			    }
			});
			$scope.corpsalertC = function(){
				if(!first){
					$scope.userInfoDetial();
					$location.path('/tab/main/corpsHall');
					history.replaceState({},"","#/tab/main");
					history.pushState({},"","#/tab/main/corpsHall");
				}
				$scope.corpsAlert.remove();
			}
		}
		// 队长处理球员申请弹窗 按钮保护
		$scope.haveButton = true;
		$scope.teamApply = function(){
			TALKWATCH("查看战队申请列表",$scope.teamDetail.name)
			if(!$scope.haveButton) return;
			if($scope.haveButton){
				$scope.haveButton = false;
			}
			$scope.moreAgree = true;
			clickRed(1);
			$scope.pageNoMod = 1
		    applyListFun();
		    $timeout(function(){
		    	$ionicModal.fromTemplateUrl('templates/corps/modal/captain-powerMod.html', {
					 scope: $scope,
					 animation: 'slide-in-up'
				}).then(function(modal) {
					$scope.applyListMod = modal;
					$scope.applyListMod.show();
					$scope.haveButton = true;
				});
		    },500)
		}
		// 获取经验规则
		$scope.ruleBtn = function(){
			TALKWATCH("查看战队经验获取规则")
			$ionicModal.fromTemplateUrl('templates/corps/modal/corpsBewrite.html', {
					 scope: $scope,
					 animation: 'fade-in'
				}).then(function(modal) {
					$scope.corpsBewrite = modal;
					$scope.corpsBewrite.show();
				});
		}
		// 修改队伍口号  tab.corps-submit
		$scope.updateText = function(){
			$state.go('tab.corps-submit',{isLogo:$scope.teamDetail.logo,isName:$scope.teamDetail.name,isText:$scope.teamDetail.slogan,id:$scope.teamId,isJoin:$scope.teamDetail.joinType}); 
		}
		// 关闭弹窗
		$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { 
				if($scope.corpsAlert){
					$scope.corpsAlert.remove();
				}
				if($scope.textEditModal){
					$scope.textEditModal.remove();
				}
				if($scope.applyListMod){
					$scope.applyListMod.remove();
				}
				if($scope.corpsBewrite){
					$scope.corpsBewrite.remove();
				}
			})
	}
	ctrl.$inject = ['$scope',"$rootScope",'$ionicScrollDelegate','$ionicPosition','$ionicModal','$location','$ionicLoading', '$timeout','$stateParams',"$cacheFactory",'$state','$ionicPopup','Corps'];
	app.registerController("corpsUserCtrl",ctrl);//return ctrl;
})
