/**
 * @author amy
 */
require.config({
    baseUrl: 'js',
    deps:["directives","bootstrap"],
    paths: {
    	'css':"../lib/jq/css.min",//异步css
    	'jquery': '../lib/jq/jquery-1.7.2.min',
    	'services':"services",//启动services
    	"controllers":"controllers",//启动controllers
    	"AllCtrl":"controllers/AllCtrl",//主tab控制器
    	"Functions":"functions/functions-90c9f77707",//functions
    	"LineupFunction":"functions/lineupFunction-6c47979b0a",//布阵func
    	"IntroCtrl":"controllers/guideControllers/IntroCtrl",// 引导页控制器
    	"headerCtrl":"controllers/commonControllers/headerCtrl",//header
    	"voteCtrl":"controllers/commonControllers/voteCtrl",//投票
    	"ruleCtrl":"controllers/commonControllers/ruleCtrl",//规则
    	"MainCtrl":"controllers/mainControllers/MainCtrl",//首页 
    	"HallCtrl":"controllers/hallControllers/HallCtrl",//经典房大厅
    	"JoinRoomCtrl":"controllers/hallControllers/JoinRoomCtrl",//加入房间
    	"JoinPlayerCtrl":"controllers/hallControllers/JoinPlayerCtrl",//玩家列表
    	"lineupsuccessCtrl":"controllers/hallControllers/lineupsuccessCtrl",//提交成功
    	"luksbzCtrl":"controllers/lineupControllers/luksbzCtrl",//布阵
    	"luzrxzCtrl":"controllers/lineupControllers/luzrxzCtrl",//选球员
    	"luqyxxCtrl":"controllers/lineupControllers/luqyxxCtrl",//球员详情
    	"prizesCreatroomCtrl":"controllers/prizesControllers/prizesCreatroomCtrl",//球星对战大厅
    	"prizesDetialCtrl":"controllers/prizesControllers/prizesDetialCtrl",//球星对战详情
    	"battlePrizesDetialCtrl":"controllers/prizesControllers/battlePrizesDetialCtrl",//球员对战已结束进行中
    	"BattleCtrl":"controllers/battleControllers/BattleCtrl",//赛况整体list
    	"BattleLineupCtrl":"controllers/battleControllers/BattleLineupCtrl",//赛况未开始房间详情
    	"battleLinupshowCtrl":"controllers/battleControllers/battleLinupshowCtrl",//赛况进行中已结束阵容
    	"lineupShareCtrl":"controllers/battleControllers/lineupShareCtrl",//战报分享
    	"BattleRoomCtrl":"controllers/battleControllers/BattleRoomCtrl",//赛况已结束房间详情
    	"BattleGoingCtrl":"controllers/battleControllers/BattleGoingCtrl",//赛况进行中房间详情
    	"BonusPlanCtrl":"controllers/battleControllers/BonusPlanCtrl",//奖金分配详情
    	"rankCtrl":"controllers/rankControllers/rankCtrl",//排行
    	"wodeCtrl":"controllers/wodeControllers/wodeCtrl",//我的
    	"exchangeCtrl":"controllers/wodeControllers/exchangeCtrl",//兑换
    	"charRecordCtrl":"controllers/wodeControllers/charRecordCtrl",//兑换
    	"wdcjgzCtrl":"controllers/wodeControllers/wdcjgzCtrl",//兑换
    	"wdgzCtrl":"controllers/wodeControllers/wdgzCtrl",//兑换
    	"wdhelpCtrl":"controllers/wodeControllers/wdhelpCtrl",//兑换
    	"courseCtrl":"controllers/guideControllers/courseCtrl",//引导
    	"againphoneTestCtrl":"controllers/shopControllers/againphoneTestCtrl",//商城
    	"mineShopCtrl":"controllers/shopControllers/mineShopCtrl",//我的
    	"phoneTestCtrl":"controllers/shopControllers/phoneTestCtrl",//我的
    	"shopRecordCtrl":"controllers/shopControllers/shopRecordCtrl",//我的
    	"userConfirmCtrl":"controllers/shopControllers/userConfirmCtrl",//我的
    	"userinforbankCtrl":"controllers/shopControllers/userinforbankCtrl",//我的
    	"userinformationCtrl":"controllers/shopControllers/userinformationCtrl",//我的
    	"userinforphoneconfCtrl":"controllers/shopControllers/userinforphoneconfCtrl",//我的
    	"userPerfectCtrl":"controllers/shopControllers/userPerfectCtrl",//我的
    	"userBanksCtrl":"controllers/shopControllers/userBanksCtrl",//我的
    	"branchBankCtrl":"controllers/shopControllers/branchBankCtrl",//我的
    	"thrvsthrCreatroomCtrl":"controllers/hallControllers/thrvsthrCreatroomCtrl",//创建房间
    	"scheduleCtrl":"controllers/wodeControllers/scheduleCtrl",//我的赛程
    	"teamPlayersCtrl":"controllers/wodeControllers/teamPlayersCtrl",//球队信息
    	"creamroomSuccessCrl":"controllers/hallControllers/creamroomSuccessCrl",//创建房间成功提示
    	"BattletimeAxisCtrl":"controllers/battleControllers/BattletimeAxisCtrl",//时间轴
		"matchGatherCtrl":"controllers/mainControllers/matchGatherCtrl",//赛事汇总，（历史参赛总结，历史成就汇总，未来推荐赛事）

        "MinServices":"../build/js/services-bafa2e932b.min",//各类服务
        "AllServices":"../build/js/AllServices-a47aa05f77",//service注册
    	
    	"corpsCtrl":"controllers/corpsControllers/corpsCtrl", //战队大厅
    	"corpsCreamCtrl":"controllers/corpsControllers/corpsCreamCtrl", //战队创建
    	"corpsSubmitCtrl":"controllers/corpsControllers/corpsSubmitCtrl", //战队设置
    	"corpsLogoCtrl":"controllers/corpsControllers/corpsLogoCtrl", //logo选择
    	"corpsUserCtrl":"controllers/corpsControllers/corpsUserCtrl", //我的战队
    	// 3.0新增加历史记录
    	"hisBattleCtrl":"controllers/battleControllers/hisBattleCtrl",//历史赛况
//  	md5加密
		"md5":"../lib/jq/md5",
//  	实时数据
    	"webimConfig":"../javascripts/src/webim.config",
    	"strophe":"../javascripts/src/strophe-1.2.8.min",
    	"websdk":"../javascripts/src/websdk-1.4.12",
//		自定义键盘
		"keyboard":"functions/keyboard-446f825536",
//      剪裁工具
		'cropper':'/javascripts/src/cropper',
//		jweixin
		"wx":"https://res.wx.qq.com/open/js/jweixin-1.2.0",
//  	talkingdata
//  	"talkData": "http://sdk.talkingdata.com/app/h5/v1?appid=864972A13E1E4DB29799CB5EA282321E&vn=xuanxiudashi&vc=2.1",
    	"talkData": "https://jic.talkingdata.com/app/h5/v1?appid=864972A13E1E4DB29799CB5EA282321E&vn=xuanxiudashi&vc=2.1",
    },
    shim: {
    	"cropper": {
    		exports: "cropper",
    		deps:["jquery","css!../javascripts/src/cropper.min.css"]
    	},
    	"services": {
    		exports: "services",
    		deps:["Functions"]
    	},
    	'mainCtrl': {
    	    exports: 'mainCtrl',
    	    deps: ['AllCtrl']
    	},
    	"HallCtrl":{
    		exports: 'HallCtrl',
    	    deps: ['keyboard','AllCtrl']
    	},
    	"JoinRoomCtrl":{
    		exports: 'JoinRoomCtrl',
    	    deps: ['AllCtrl']
    	},
    	'BattleCtrl': {
    	    exports: 'BattleCtrl',
    	    deps: ['AllCtrl']
    	},
    	'wodeCtrl': {
    	    exports: 'wodeCtrl',
    	    deps: ['AllCtrl',"MainCtrl","cropper"]
    	},
    	'corpsCtrl': {
    	    exports: 'corpsCtrl',
    	    deps: ['AllCtrl',"cropper"]
    	},
    	"IntroCtrl":{
    		exports: 'IntroCtrl',
    	    deps: ['AllCtrl']
    	},
    	'AllCtrl': {
            exports: 'AllCtrl',
            deps: ["Functions","LineupFunction","headerCtrl","voteCtrl","ruleCtrl","md5"]
       	},
        'websdk': {
            exports: 'websdk',
            deps: ["webimConfig","strophe"]
       	},
   }
});