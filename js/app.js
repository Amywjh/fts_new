//路由*********************************************
define(["services", "controllers"], function(services,controllers) {
	"use strict";
	var app = angular.module('starter', ['ionic', "ionicLazyLoad", "starter.directives", 'starter.controllers', 'starter.services', 'ui.router', 'highcharts-ng'])
	app.run(function($ionicPlatform) {})
		//定义常量(接口地址)
//		.constant('addressV2', "/api/v2/")
		.constant('addressV2', "/app/")
		.constant("$ionicLoadingConfig", {
			template: '<div class="position-center"><img id="load_bg" src="img2.0/main/2.png" /></div>',
			content: '加载中...',
			animation: 'fade-out',
			showBackdrop: true,
			maxWidth: 200,
			delay: 0
		})
		.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $controllerProvider, $provide) {
			app.registerfactory = $provide.factory;
			app.registerController = $controllerProvider.register;
			app.loadControllers = function(controllerJs) {
				return function($rootScope, $q) {
					var def = $q.defer(),
						deps = [];
					angular.isArray(controllerJs) ? (deps = controllerJs) : (deps.push(controllerJs));
					require(deps, function() {
						$rootScope.$apply(function() {
							def.resolve();
						})
					})
					return def.promise;
				}
			};
			//			调整Android和ios平台下的样式
			$ionicConfigProvider.platform.ios.tabs.style('standard');
			$ionicConfigProvider.platform.ios.tabs.position('bottom');
			$ionicConfigProvider.platform.android.tabs.style('standard');
			$ionicConfigProvider.platform.android.tabs.position('standard');

			$ionicConfigProvider.platform.ios.navBar.alignTitle('center');
			$ionicConfigProvider.platform.android.navBar.alignTitle('left');

			$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
			$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

			$ionicConfigProvider.platform.ios.views.transition('ios');
			$ionicConfigProvider.platform.android.views.transition('android');
			//同意title居中
			$ionicConfigProvider.navBar.alignTitle('center');

			$ionicConfigProvider.views.transition('none');
			$ionicConfigProvider.scrolling.jsScrolling(true);//解决scroll安卓机的适配问题
			//防止ios键盘挡住键盘
			//	$ionicConfigProvider.scrolling.jsScrolling(false);
			// 记录加载过的html以及controller，防止重复网络加载
			var files = {
				html: {}
			};

			// 声明延迟加载html方法
			function getHtml(name) {
				if(!files.html[name]) {
					// 同步ajax请求加载html，并缓存
					files.html[name] = jQuery.ajax({
						url: 'templates/' + name + ".html",
						async: false
					}).responseText;
				}
				return files.html[name];
			}

			$stateProvider
				//			主页面
				.state('tab', {
					url: "/tab",
					abstract: true,
					templateUrl: "templates/tabs.html",
					controller: "AllCtrl",
					resolve: {
						deps: app.loadControllers("AllCtrl")
					}
				})
				//引导页
				.state('intro', {
					url: '/',
					templateUrl: 'templates/guide/intro.html',
					controller: 'IntroCtrl',
					resolve: {
						deps: app.loadControllers("IntroCtrl")
					}
				})

				//主页
				.state('tab.main', {
					url: '/main',
					cache: true,
					scope: false,
					views: {
						'tab-main': {
							templateUrl: 'templates/tab-main.html',
							//          template:function() { return getHtml("tab-main"); },
							controller: 'MainCtrl',
							resolve: {
								deps: app.loadControllers("MainCtrl")
							}
						}
					}
				})
				//参赛总结页面
				.state('tab.main-joinSum', {
					url: '/main/joinSum',
					cache: false,
					views: {
						'tab-main': {
							template: function() {
								return getHtml("main/joinSum");
							},
							controller: 'matchGatherCtrl',
							resolve: {
								deps: app.loadControllers("matchGatherCtrl")
							}
						}
					}
				})
//				首页房间推荐页面
				.state('tab.main-matchHint', {
					url: '/main/matchHint',
					cache: false,
					views: {
						'tab-main': {
							template: function() {
								return getHtml("main/matchHint");
							},
							controller: 'matchGatherCtrl',
							resolve: {
								deps: app.loadControllers("matchGatherCtrl")
							}
						}
					}
				})
				//竞猜房
				.state('tab.main-prizes', {
					url: '/main/prizes',
					cache: false,
					views: {
						'tab-main': {
							//          templateUrl: 'templates/prizes/main-prizes.html',
							template: function() {
								return getHtml("prizes/main-prizes");
							},
							controller: 'prizesCreatroomCtrl',
							resolve: {
								deps: app.loadControllers("prizesCreatroomCtrl")
							}
						}
					}
				})
				//竞猜房详情
				.state('tab.prizes-detial', {
					url: '/main/prizes/detial/:prizesRoomId/:classicId/:matchId/:tabId/:isMine',
					cache: false,
					views: {
						'tab-main': {
							//          templateUrl: 'templates/prizes/prizes-detial.html',
							template: function() {
								return getHtml("prizes/prizes-detial");
							},
							controller: 'prizesDetialCtrl',
							resolve: {
								deps: app.loadControllers("prizesDetialCtrl")
							}
						}
					}
				})
				//		经典
				.state('tab.hall', {
					url: '/hall/:lineupId',
					cache: true,
					views: {
						'tab-main': {
							//          templateUrl: 'templates/classics/tab-hall.html',
							template: function() {
								return getHtml("classics/tab-hall");
							},
							controller: 'HallCtrl',
							resolve: {
								deps: app.loadControllers("HallCtrl")
							}
						}
					}
				})

				//    加入房间
				.state('tab.hall-joinroom', {
					url: '/hall/joinroom/:roomId/:lineupId',
					cache: false,
					views: {
						'tab-main': {
							template: function() {
								return getHtml("classics/hall-joinroom");
							},
							//			        templateUrl:function($stateParams){
							//				        	return 'templates/classics/hall-joinroom.html';
							//			        } 
							controller: "JoinRoomCtrl",
							resolve: {
								deps: app.loadControllers("JoinRoomCtrl")
							}
						}
					}
				})
				//整容提交成功提示
				.state('tab.hall-lineupsuccess', {
					url: '/main/hall/lineupsuccess/:time/:lineupId/:state/:leagueId/:tabIndex/:roomId',
					views: {
						'tab-main': {
							template: function() {
								return getHtml("classics/lineupsuccess");
							},
							//			        templateUrl: 'templates/classics/lineupsuccess.html',
							controller: "lineupsuccessCtrl",
							resolve: {
								deps: app.loadControllers("lineupsuccessCtrl")
							}
						}
					}
				})
				//    玩家列表
				.state('tab.join_playerlist', {
					url: '/hall/join_playerlist/:roomId',
					cache: false,
					views: {
						'tab-main': {
							//          templateUrl: 'templates/classics/join_playerlist.html',
							template: function() {
								return getHtml("common/playerlist_page");
							},
							controller: "JoinPlayerCtrl",
							resolve: {
								deps: app.loadControllers("JoinPlayerCtrl")
							}
						}
					}
				})
				//			对战
				.state('tab.battle', { //tab.当前的页面文件名
					url: '/battle/:classicId/:matchId/:tabId', //玩法id，联赛id，tab状态id,参见接口文档规定
					cache: false,
					views: {
						'tab-battle': { //当前类的名字
//							templateUrl: 'templates/tab-battle.html',//跳转的实际页面
							template: function() {
								return getHtml("tab-battle");
							},
							controller: 'BattleCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("BattleCtrl")
							}
						}
					}
				})
				//	历史记录页面
				.state('tab.hisBattle', { 
					url: '/hisBattle/:classicId/:userId', 
					cache: true,
					views: {
						'tab-battle': { //当前类的名字
//							templateUrl: 'templates/tab-battle.html',//跳转的实际页面
							template: function() {
								return getHtml("battle/historyBattle");
							},
							controller: 'hisBattleCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("hisBattleCtrl")
							}
						}
					}
				})
				//    	赛况已结束
				.state('tab.battle-room', {//tab.当前的页面文件名
					//用户私有userId    playId玩法类型id
					url: '/battle/battle-room/:statusId/:roomId/:playId/:userId', //这个和html里面跳转的地址对应
					cache: true,
					views: {
						'tab-battle': { //当前类的名字
							//            templateUrl: 'templates/battle/battle-room.html',//跳转的实际页面
							template: function() {
								return getHtml("battle/battle-room");
							},
							controller: 'BattleRoomCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("BattleRoomCtrl")
							}
						}
					}
				})
				//    	进行中或已结束查看阵容 
				.state('tab.battle-lineupshow', {
					url: '/battle/lineup/Linupshow/:roomId/:userId/:statusId', //statusId 房间状态  1进行中   2已结束
					views: {
						'tab-battle': { //当前类的名字
							template: function() {
								return getHtml("battle/battle-lineup");
							},
							controller: 'battleLinupshowCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("battleLinupshowCtrl")
							}
						}
					}
				})
				//				战报分享
				.state('tab.lineupShareEle', {
					url: '/battle/lineup/lineupShare/:roomId/:userId', //房间id,玩法id
					cache: false,
					views: {
						'tab-battle': {//当前类的名字
							template: function() {
								return getHtml("battle/lineupResultEle");
							},
							controller: 'lineupShareCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("lineupShareCtrl")
							}
						}
					}
				})
				// 进行中和已结束三人战
				.state('tab.battle-room-thr', { //tab.当前的页面文件名
					//状态，房间id， 玩法id，用户id
					url: '/battle/battle-room-thr/:statusId/:roomId/:playId/:userId', //这个和html里面跳转的地址对应
					cache: true,
					views: {
						'tab-battle': { //当前类的名字
							//            templateUrl: 'templates/three/battle-room.html',//跳转的实际页面
							template: function() {
								return getHtml("three/battle-room");
							},
							controller: 'BattleRoomCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("BattleRoomCtrl")
							}
						}
					}
				})
				//      未开始经典房
				.state('tab.battle-lineup', { //tab.当前的页面文件名
					//roomId房间id      playId玩法id  1球星对战   2三人战   3传统房   matchId  判断已参加是否提交阵容 true false
					url: '/battle/battle-lineup/:roomId/:playId/:matchId/:fromId', //这个和html里面跳转的地址对应
					cache: false,
					views: {
						'tab-battle': { //当前类的名字
							//            templateUrl: 'templates/battle/myRoomDetial.html',//跳转的实际页面
							template: function() {
								return getHtml("battle/myRoomDetial");
							},
							controller: 'BattleLineupCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("BattleLineupCtrl")
							}
						}
					}
				})
				//未开始三人战阵容
				.state('tab.lineup-thr', {
					//   			房间id，玩法id
					url: '/battle/lineup-thr/:roomId/:playId/:matchId/:fromId', //fromId 0表示赛况，1球星对战   2三人战   3传统房
					cache: false,
					views: {
						'tab-battle': {
							//            templateUrl: 'templates/battle/myRoomDetial.html',
							template: function() {
								return getHtml("battle/myRoomDetial");
							},
							controller: 'BattleLineupCtrl',
							resolve: {
								deps: app.loadControllers("BattleLineupCtrl")
							}
						}
					}
				})
				//赛况进行中房间展示页
				.state('tab.battleRoomgoing', {
					url: '/battle/roomGoing/:roomId/:playId/:fromId', //房间id，玩法id,fromId 0表示赛况，1球星对战   2三人战   3传统房
					cache: false,
					views: {
						'tab-battle': {
							template: function() {
								return getHtml("battle/myRoomGoing");
							},
							controller: 'BattleGoingCtrl',
							resolve: {
								deps: app.loadControllers("BattleGoingCtrl")
							}
						}
					}
				})
				//赛况进行中房间展示页
				.state('tab.bonusPlan', {
					url: '/common/bonusPlan/:roomId/:isNoStart', //房间id
					cache: false,
					views: {
						'tab-battle': {
							template: function() {
								return getHtml("common/bonusPlan");
							},
							controller: 'BonusPlanCtrl',
							resolve: {
								deps: app.loadControllers("BonusPlanCtrl")
							}
						}
					}
				})
				//      对战竞猜房已结束
				.state('tab.battle-prizes-end-detial', { //tab.当前的页面文件名
					//用户的私有id
					url: '/battle/battle-prizes-end-detial/:prizesRoomId/:classicId/:matchId/:tabId', //这个和html里面跳转的地址对应
					cache: true,
					views: {
						'tab-battle': { //当前类的名字
							//            templateUrl: 'templates/battle/battle-prizes-end-detial.html',//跳转的实际页面
							template: function() {
								return getHtml("prizes/prizes-end-detial");
							},
							controller: 'battlePrizesDetialCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("battlePrizesDetialCtrl")
							}
						}
					}
				})
				//对战竞猜房进行中
				.state('tab.battle-prizes-going-detial', { //tab.当前的页面文件名
					//用户的私有id
					url: '/battle/battle-prizes-going-detial/:prizesRoomId/:classicId/:matchId/:tabId', //这个和html里面跳转的地址对应
					cache: false,
					views: {
						'tab-battle': { //当前类的名字
							//            templateUrl: 'templates/battle/battle-prizes-end-detial.html',//跳转的实际页面
							template: function() {
								return getHtml("prizes/prizes-going-detial");
							},
							controller: 'battlePrizesDetialCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("battlePrizesDetialCtrl")
							}
						}
					}
				})
				// 带有快速布阵
				.state('tab.lineup-ksbz', {
					url: '/lineup/ksbz/:tabId/:roomId/:ids/:fmtId/:matchId', //tabid用于判断是由哪个路径跳转的阵容1创建房间 2大厅 4赛况   房间用户id   赛事id  阵型id    如果为阵容跳转，第四个为阵容id
					cache: true,
					views: {
						'tab-main': {
							//            	templateUrl: 'templates/lineup/lineup-ksbz.html',
							template: function() {
								return getHtml("lineup/lineup-ksbz");
							},
							controller: 'luksbzCtrl',
							resolve: {
								deps: app.loadControllers("luksbzCtrl")
							}
						}
					}
				})
				//球员详细信息柱状图
				.state('tab.lineup-qyxx-second', {
					url: '/lineup/qyxx-second/:quId/:ids',
					cache: false,
					views: {
						'tab-battle': {
							//            templateUrl: 'templates/three/lineup-qyxx.html',
							template: function() {
								return getHtml("lineup/lineup-qyxx");
							},
							controller: 'luqyxxCtrl',
							resolve: {
								deps: app.loadControllers("luqyxxCtrl")
							}
						}
					}
				})
				//阵容//添加阵容球员
				.state('tab.lineup-zrxz', {
					//		第一个参数是阵型，二：赛事ids 三，阵型位置  四：房间用户ID 五：剩余工资   六、联赛id
					url: '/lineup/zrxz/:fmtId/:matchId/:positionId/:roomId/:salary/:tabId/:leagueId',
					cache: true,
					views: {
						'tab-main': {
							//            templateUrl: 'templates/lineup/lineup-zrxz.html',
							template: function() {
								return getHtml("lineup/lineup-zrxz");
							},
							controller: 'luzrxzCtrl',
							resolve: {
								deps: app.loadControllers("luzrxzCtrl")
							}
						}
					}
				})
				//排行
				.state('tab.rank', {
					url: '/rank',
					cache: false,
					views: {
						'tab-rank': {
							//            templateUrl: 'templates/tab-rank.html',
							template: function() {
								return getHtml("tab-rank");
							},
							controller: 'rankCtrl',
							resolve: {
								deps: app.loadControllers("rankCtrl")
							}
						}
					}
				})
				//我的
				.state('tab.wode', {
					url: '/wode',
					cache: false,
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/tab-wode.html',
							template: function() {
								return getHtml("mine/tab-wode");
							},
							controller: 'wodeCtrl',
							resolve: {
								deps: app.loadControllers("wodeCtrl")
							}
						}
					}
				})
				//我的商城  //兑换
				.state('tab.wode-sc', {
					url: '/wode/sc',
					cache: false,
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-sc.html',
							template: function() {
								return getHtml("mine/wode-exchange");
							},
							controller: 'exchangeCtrl',
							resolve: {
								deps: app.loadControllers("exchangeCtrl")
							}
						}
					}
				})

				//我的活动商城 
				.state('tab.wode-shop', {
					url: '/wode/shop',
					cache: false,
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-hdsc.html',
							template: function() {
								return getHtml("shop2.0/mineShop");
							},
							controller: 'mineShopCtrl',
							resolve: {
								deps: app.loadControllers("mineShopCtrl")
							}
						}
					}
				})
				//我的商城 京东购买
				.state('tab.wode-jdsc', {
					url: '/wode/hdsc/jdsc',
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-jdsc.html',
							template: function() {
								return getHtml("mine/wode-jdsc");
							},
							controller: 'wdjdscCtrl',
							resolve: {
								deps: app.loadControllers("wdjdscCtrl")
							}
						}
					}
				})
				//我的兑换记录
				.state('tab.wode-dhjl', {
					url: '/wode/dhjl',
					case: false,
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-dhjl.html',
							template: function() {
								return getHtml("mine/wode-dhjl");
							},
							controller: 'charRecordCtrl',
							resolve: {
								deps: app.loadControllers("charRecordCtrl")
							}
						}
					}
				})
				//我的帮助
				.state('tab.wode-help', {
					url: '/wode/help',
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-help.html',
							template: function() {
								return getHtml("mine/wode-help");
							},
							controller: 'wdhelpCtrl',
							resolve: {
								deps: app.loadControllers("wdhelpCtrl")
							}
						}
					}
				})
				//我的帮助//奖金分配
				.state('tab.wode-help-reward', {
					url: '/wode/help/reward',
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-help-reward.html',
							template: function() {
								return getHtml("mine/wode-help-reward");
							},
							//            controller: 'wdgzCtrl'
						}
					}
				})
				//我的帮助//奖金分配
				.state('tab.wode-help-second', {
					url: '/wode/help/second/:helpIndex',
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-help-expression.html',
							template: function() {
								return getHtml("mine/wode-help-second");
							},
							controller: 'wdgzCtrl',
							resolve: {
								deps: app.loadControllers("wdgzCtrl")
							}
						}
					}
				})
				//我的更多
				.state('tab.wode-more', {
					url: '/wode/more',
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-more.html',
							template: function() {
								return getHtml("mine/wode-more");
							},
							//            controller: 'wdhelpCtrl'
						}
					}
				})
				//我的帮助//规则
				.state('tab.wode-help-gz', {
					url: '/wode/help/gz',
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-help-gz.html',
							template: function() {
								return getHtml("mine/wode-help-gz");
							},
							controller: 'wdgzCtrl',
							resolve: {
								deps: app.loadControllers("wdgzCtrl")
							}
						}
					}
				})
				.state('tab.wode-help-problem', {
					url: '/wode/help/problem',
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-help-problem.html',
							template: function() {
								return getHtml("mine/wode-help-problem");
							},
							controller: 'wdgzCtrl',
							resolve: {
								deps: app.loadControllers("wdgzCtrl")
							}
						}
					}
				})
				.state('tab.wode-help-xy', {
					url: '/wode/help/xy',
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-help-xy.html',
							template: function() {
								return getHtml("mine/wode-help-xy");
							},
							controller: 'wdgzCtrl',
							resolve: {
								deps: app.loadControllers("wdgzCtrl")
							}
						}
					}
				})
				.state('tab.wode-help-us', {
					url: '/wode/help/us',
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-help-us.html',
							template: function() {
								return getHtml("mine/wode-help-us");
							},
							controller: 'wdgzCtrl',
							resolve: {
								deps: app.loadControllers("wdgzCtrl")
							}
						}
					}
				})
				.state('tab.wode-help-call', {
					url: '/wode/help/call',
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-help-call.html',
							template: function() {
								return getHtml("mine/wode-help-call");
							},
							controller: 'wdgzCtrl',
							resolve: {
								deps: app.loadControllers("wdgzCtrl")
							}
						}
					}
				})
				//我的成就规则
				.state('tab.wode-cjgz', {
					url: '/wode/cjgz',
					views: {
						'tab-wode': {
							//            templateUrl: 'templates/mine/wode-cjgz.html',
							template: function() {
								return getHtml("mine/wode-cjgz");
							},
							controller: 'wdcjgzCtrl',
							resolve: {
								deps: app.loadControllers("wdcjgzCtrl")
							}
						}
					}
				})
				//3v3大厅页
				.state('tab.thrvsthr', {
					url: '/main/thrvsthr',
					cache: true,
					views: {
						'tab-main': {
							//            templateUrl: 'templates/three/thrvsthr.html',
							template: function() {
								return getHtml("three/thrvsthr");
							},
							controller: 'thrvsthrCtrl',
							resolve: {
								deps: app.loadControllers("thrvsthrCtrl")
							}
						}
					}
				})
				//    3v3加入房间
				.state('tab.thrvsthr-joinroom', {
					url: '/main/thrvsthr/joinroom/:roomId/:fee',
					cache: false,
					views: {
						'tab-main': {
							//					        templateUrl: 'templates/three/thrvsthr-joinroom.html',
							template: function() {
								return getHtml("three/thrvsthr-joinroom");
							},
							controller: "thrvsthrJoinCtrl",
							resolve: {
								deps: app.loadControllers("thrvsthrJoinCtrl")
							},
						}
					}
				})
				// 3v3房间人员list   
				.state('tab.thrvsthr-playerlist', {
					url: '/main/thrvsthr_playerlist/:roomId',
					views: {
						'tab-main': {
							//					        templateUrl: 'templates/three/thrvsthr_playerlist.html',
							template: function() {
								return getHtml("common/playerlist_page");
							},
							controller: "thrvsthrListCtrl",
							resolve: {
								deps: app.loadControllers("thrvsthrListCtrl")
							},
						}
					}
				})
				//    3v3创建房间
				.state('tab.thrvsthr-creatroom', {
					url: '/thrvsthr/creatroom/:playId/:privacy',  //privacy  0公开房  1私密房
					cache: false,
					views: {
						'tab-main': {
							//		          templateUrl: 'templates/three/thrvsthr-creatroom.html',	   
							template: function() {
								return getHtml("classics/thrvsthr-creatroom");
							},
							controller: 'thrvsthrCreatroomCtrl',
							resolve: {
								deps: app.loadControllers("thrvsthrCreatroomCtrl")
							},
						}
					}
				})
				//3v3添加球员
				.state('tab.thrvsthr-addplayer', {
					url: '/main/thrvsthr/addplayer/:roomId/:playId/:matchId/:fromId',
					cache: true,
					views: {
						'tab-main': {
							//            templateUrl: 'templates/three/thrvsthr-addplayer.html',
							template: function() {
								return getHtml("three/thrvsthr-addplayer");
							},
							controller: 'thrvsthrAddCtrl',
							resolve: {
								deps: app.loadControllers("thrvsthrAddCtrl")
							}
						}
					}
				})
				//3v3展示页，添加球员前面
				.state('tab.thrvsthr-lineupshow', {
					url: '/main/thrvsthr/lineupshow/:roomId/:playId/:matchId/:fromId',
					cache: true,
					views: {
						'tab-main': {
							//            templateUrl: 'templates/three/thr-lineupshow.html',
							template: function() {
								return getHtml("three/thr-lineupshow");
							},
							controller: 'thrvsthrShowCtrl',
							resolve: {
								deps: app.loadControllers("thrvsthrShowCtrl")
							}
						}
					}
				})
				//3v3 规则
				.state('tab.thrvsthr-rule', {
					url: '/thrvsthr/rule/',
					views: {
						'tab-main': {
							template: function() {
								return getHtml("three/rule");
							},
							controller: "headerCtrl",
							resolve: {
								deps: app.loadControllers("headerCtrl")
							}
						}
					}
				})
				//   		成就规则
				.state("tab.wo-achieve-rule", {
					url: "/achieve/rule/",
					views: {
						"tab-main": {
							//						templateUrl:"templates/mine/achieve-rule.html",
							template: function() {
								return getHtml("mine/achieve-rule");
							},
							controller: "headerCtrl",
							resolve: {
								deps: app.loadControllers("headerCtrl")
							}
						}
					}
				})
				//	  商城记录
				.state("tab.shop-record", {
					url: "/wode/shoprecord/:phone",
					cache: false,
					views: {
						"tab-wode": {
							template: function() {
								return getHtml("shop2.0/shopRecord");
							},
							controller: "shopRecordCtrl",
							resolve: {
								deps: app.loadControllers("shopRecordCtrl")
							}
						}
					}
				})
				//手机短信验证
				.state("tab.phone-test", {
					url: "/wode/phoneTest/:sum",
					cache: false,
					views: {
						"tab-wode": {
							template: function() {
								return getHtml("shop2.0/phoneTest");
							},
							controller: "phoneTestCtrl",
							resolve: {
								deps: app.loadControllers("phoneTestCtrl")
							}
						}
					}
				})
				//完善银行卡信息 revise 0 2商城进入 3个人信息进入 4 商城绑定修改
				// new revise 0初次进入  sum 金额
				.state("tab.user-perfect", {
					url: "/wode/userPerfect/:revise/:sum",
					cache: false,
					views: {
						"tab-wode": {
							template: function() {
								return getHtml("shop2.0/userPerfect");
							},
							controller: "userPerfectCtrl",
							resolve: {
								deps: app.loadControllers("userPerfectCtrl")
							}
						}
					}
				})
				// 银行
				.state('tab.wode-bank', {
					url: '/wode/shop/bank/:revise/:sum',
					views: {
						'tab-wode': {
							template: function() {
								return getHtml("shop2.0/userBankshtml");
							},
							controller: 'userBanksCtrl',
							resolve: {
								deps: app.loadControllers("userBanksCtrl")
							}
						}
					}
				})
				// 支行页面
				.state('tab.wode-bankbranch', {
					url: '/wode/shop/bankbranch/:revise/:sum',
					cache: false,
					views: {
						'tab-wode': {
							template: function() {
								return getHtml("shop2.0/userbranchBankhtml");
							},
							controller: 'branchBankCtrl',
							resolve: {
								deps: app.loadControllers("branchBankCtrl")
							}
						}
					}
				})
				//兑换确认
				.state("tab.user-confirm", {
					url: "/wode/userconfirm/:revise/:sum", //保存信息 0 首次进入  1修改信息 2直接提交流水
					cache: false,
					views: {
						"tab-wode": {
							template: function() {
								return getHtml("shop2.0/userconfirm");
							},
							controller: "userConfirmCtrl",
							resolve: {
								deps: app.loadControllers("userConfirmCtrl")
							}
						}
					}
				})
				//绑定之后发送验证码
				.state("tab.user-againphone", {
					url: "/wode/againphone/:sum",
					cache: false,
					views: {
						"tab-wode": {
							template: function() {
								return getHtml("shop2.0/againphoneTest");
							},
							controller: "againphoneTestCtrl",
							resolve: {
								deps: app.loadControllers("againphoneTestCtrl")
							}
						}
					}
				})
				//个人信息
				.state("tab.user-information", {
					url: "/wode/userinformation",
					views: {
						"tab-wode": {
							template: function() {
								return getHtml("shop2.0/userinformation");
							},
							controller: "userinformationCtrl",
							resolve: {
								deps: app.loadControllers("userinformationCtrl")
							}
						}
					}
				})
				//个人信息发送验证码
				.state("tab.user-inforphonetest", {
					url: "/wode/userinformation/phonetest/:phone",
					views: {
						"tab-wode": {
							template: function() {
								return getHtml("shop2.0/infortestphone");
							},
							controller: "userinformationCtrl",
							resolve: {
								deps: app.loadControllers("userinformationCtrl")
							}
						}
					}
				})
				//个人信息解除手机号
				.state("tab.user-inforphoneconf", {
					url: "/wode/userinformation/userinforphoneconf/:phone",
					cache: false,
					views: {
						"tab-wode": {
							template: function() {
								return getHtml("shop2.0/againphoneTest");
							},
							controller: "userinforphoneconfCtrl",
							resolve: {
								deps: app.loadControllers("userinforphoneconfCtrl")
							}
						}
					}
				})
				//个人信息银行卡
				.state("tab.user-inforbank", {
					url: "/wode/userinformation/userinforbank",
					cache: false,
					views: {
						"tab-wode": {
							template: function() {
								return getHtml("shop2.0/userinforbank");
							},
							controller: "userinforbankCtrl",
							resolve: {
								deps: app.loadControllers("userinforbankCtrl")
							}
						}
					}
				})
				//赛程
				.state("tab.schedule", {
					url: "/wode/schedule",
					views: {
						"tab-wode": {
							template: function() {
								return getHtml("mine/wode-schedule");
							},
							controller: "scheduleCtrl",
							resolve: {
								deps: app.loadControllers("scheduleCtrl")
							}
						}
					}
				})
				//球队球员信息
				.state("tab.schedule-players", {
					url: "/wode/schedule/players/:playerId/:leagueId",
					views: {
						"tab-wode": {
							template: function() {
								return getHtml("mine/wode-teamPlayers");
							},
							controller: "teamPlayersCtrl",
							resolve: {
								deps: app.loadControllers("teamPlayersCtrl")
							}
						}
					}
				})
				// 创建成功
				.state('tab.creamroom-success', {
					url: '/hall/creamroomSuccess/:roomId/:league/:roomPWD/:privacy',
					cache: false,
					views: {
						'tab-main': {
							//            	templateUrl: 'templates/lineup/lineup-ksbz.html',
							template: function() {
								return getHtml("classics/creamroomSuccess");
							},
							controller: 'creamroomSuccessCrl',
							resolve: {
								deps: app.loadControllers("creamroomSuccessCrl")
							}
						}
					}
				})
				//    	赛况时间轴页面  battle-timeAxis
				.state('tab.battle-timeAxis', { 
					url: '/battle/battle-timeAxis/:roomId/:matchId/:statusId/', 
					cache: true,
					views: {
						'tab-battle': { 
							template: function() {
								return getHtml("battle/battle-timeAxis");
							},
							controller: 'BattletimeAxisCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("BattletimeAxisCtrl")
							}
						}
					}
				})
				//   3.0 战队大厅  
				.state('tab.corps-hall', { 
					url: '/main/corpsHall', 
					cache: true,
					views: {
						'tab-main': { 
							template: function() {
								return getHtml("corps/corps-hall");
							},
							controller: 'corpsCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("corpsCtrl")
							}
						}
					}
				})
				// 创建战队
				.state('tab.corps-cream', { 
					url: '/main/corps/cream', 
//					params: {'isLogo': null,'isUplogo':null,'isName':null,'isText':null,'isJoin':null},
					cache: false,
					views: {
						'tab-main': { 
							template: function() {
								return getHtml("corps/corps-cream");
							},
							controller: 'corpsCreamCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("corpsCreamCtrl")
							}
						}
					}
				})
				// 选择logo
				.state('tab.corps-logo', { 
					url: '/main/corps/logo', 
//					params: {'isName':null,'isText':null,'isJoin':null},
					cache: false,
					views: {
						'tab-main': { 
							template: function() {
								return getHtml("corps/corps-logo");
							},
							controller: 'corpsLogoCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("corpsLogoCtrl")
							}
						}
					}
				})
				// 确定对战修改战队口号页
				.state('tab.corps-submit', { 
					url: '/main/corps/submit', 
					params: {'isLogo': null,'isName':null,'isText':null,'isJoin':null,'id':null},
					cache: true,
					views: {
						'tab-main': { 
							template: function() {
								return getHtml("corps/corps-submit");
							},
							controller: 'corpsSubmitCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("corpsSubmitCtrl")
							}
						}
					}
				})
				// 我的战队
				.state('tab.corps-user', { 
					url: '/main/corps/user/:isroomId', 
					cache: false,
					views: {
						'tab-main': { 
							template: function() {
								return getHtml("corps/corps-user");
							},
							controller: 'corpsUserCtrl', //使用的控制器
							resolve: {
								deps: app.loadControllers("corpsUserCtrl")
							}
						}
					}
				})
			// if none of the above states are matched, use this as the fallback
			$urlRouterProvider.otherwise('/'); //默认访问的
		});
	return app;
});