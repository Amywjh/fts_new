//球星对战投票
define(["app"],function(app){
	"use strict";
	function ctrl($scope,$ionicModal, $document, $stateParams, $location, $rootScope, $cacheFactory, $timeout, $ionicLoading, $ionicPopup, LineUp, Battle,Hall) {
		$scope.help_title="竞技规则";
		$scope.showRule = function(){
			var _url = "/tab/wode/help/second/rule";
			$location.path(_url);
		}
		$scope.goback = function(url){
			$ionicLoading.show();
			$scope.msg = true;  
			$scope.cg = "返回后您修改的阵容将不被保存"
			if($stateParams.tabId == 4 || $stateParams.tabId == 2){
				if($stateParams.matchId == "true"){
					$scope.lineupAction($scope.msg,'继续布阵','确定返回',url)
				}else{
	//					$scope.warnAlert()
					$scope.lineupAction($scope.cg,'继续布阵','确定返回',url)
				}
			}else{
				$scope.lineupAction($scope.msg,'继续布阵','确定返回',url)
			}
		}
		$scope.commitGoback = function(url){//确认返回
			$scope.isBack = true;
			sessionStorage.removeItem("one");
			sessionStorage.removeItem("two");
			sessionStorage.removeItem("thr");
			sessionStorage.removeItem("four");
			sessionStorage.removeItem("other");
			$timeout(function(){
				history.replaceState({},"",url);
			},1000)
		}
		$scope.lineupAction = function(msg,qx,qd,url){//返回提示
			$ionicModal.fromTemplateUrl('templates/common/charge.html', {
				scope: $scope,
				backdropClickToClose:false
			}).then(function(modal){
				$scope.lineupModal = modal;
				$scope.msg = msg;
				$scope.qx = qx?qx:"取消";
				$scope.qd = qd?qd:"确定";
				$scope.lineupModal.show();
				$scope.cancel = function(){
	//				if(url!="#/tab/hall/0") location.reload();
					$scope.lineupModal.hide();
					$scope.lineupModal = false;
				}
				$scope.commit = function(){
					$scope.commitGoback(url);
					$scope.lineupModal.hide();							
	//				$scope.lineupModal = false;
				}
			});
		}
		// 返回上一级  1 创建房间 加入房间  2 修改阵容  3 创建赛事后布阵  4 对战未开始修改阵容
		$scope.hrefview = function() {
			$ionicLoading.show();
			sessionStorage.removeItem("one");
			sessionStorage.removeItem("two");
			sessionStorage.removeItem("thr");
			sessionStorage.removeItem("four");
			sessionStorage.removeItem("other");
			sessionStorage.removeItem("battle_lineup_xg");
			sessionStorage.removeItem("hall");
			if($stateParams.tabId == 4){
				$scope.tabIndex = 4;
			}else{
				$scope.tabIndex = 0;
			}
			$scope.page = 1;
			$scope.leagueId = $stateParams.matchId; //11v11接口特殊，1为英超，2为中超，需要+1
				
			var $url = "#/tab/main/hall/lineupsuccess/"+$scope.tt_time.deadTime+"/"+$scope.tt_time.lineupId+"/3/"+$scope.leagueId+"/"+$scope.tabIndex+"/"+$stateParams.roomId
			$timeout(function(){
				history.replaceState({},"",$url);
				$ionicLoading.hide();
			},500)	
			return false;	
				console.log($stateParams.tabId);
				if($stateParams.tabId == 4 ){
					if($stateParams.matchId){//返回赛况
						Battle.list($scope.tabIndex,'', $scope.page).then(function(data) {
							if(data.code==0){
								sessionStorage.setItem("battle_default", JSON.stringify(data));
								$location.path("/tab/battle/3/" + $scope.leagueId + "/0")
							}else{
								$ionicLoading.hide();
							}
						}, function(error) {
							$ionicLoading.hide();
						})
					}else{//返回大厅
						$timeout(function(){
	//						$location.path("/tab/hall/0");
							history.replaceState({},"","#/tab/hall/0");
							$ionicLoading.hide();
						},500)
					}
				}else{//成功页面
					var $url = "#/tab/main/hall/lineupsuccess/"+$scope.tt_time.deadTime+"/"+$scope.tt_time.lineupId+"/3/"+$scope.leagueId+"/"+$scope.tabIndex+"/"+$stateParams.roomId
					$timeout(function(){
						history.replaceState({},"",$url);
						$ionicLoading.hide();
					},500)
				}
		}   
		//经典战修改阵容页
		var modifiLineup = function(data,lineupId,lineupcon){
			var lineupIndex = (lineupId|0)-1;
			var lineupcontent = angular.copy(lineupcontent=angular.copy(lineupcon[lineupIndex])); 
			var maxSalary = data.lineupMsg.salaryHot;
			var sum = data.lineupMsg.surplusPerAvg;
			$scope.lineupNow.lineupMsg.chooseNum = 0;
			if (data.lineupMsg){
				//获得当前阵型
				angular.forEach(data.lineupMsg, function(data_s, index_s){
					switch (index_s) {
						case "foward":
							if (data_s.length > 0) {
								var length = data_s.length;
								$scope.lineupNow.lineupMsg.chooseNum += length;
								var str_f = {
									"playerInfo": data_s,
									"positionDisplay": 1
								};
								var str = JSON.stringify(str_f); //对象转化为字符串
								sessionStorage.setItem('one', str); //存入到session中
								for (var len = 0; len < length; len++) {
									lineupcontent.one[len] = data_s[len];
									lineup_qudh(data_s[len].shirt_num, lineupcontent.one[len]) //球衣号码
								}
							}
							break;
						case "center":
							if (data_s.length > 0) {
								var length = data_s.length;
								$scope.lineupNow.lineupMsg.chooseNum += length;
								var str_f = {
									"playerInfo": data_s,
									"positionDisplay": 2
								};
								var str = JSON.stringify(str_f); //对象转化为字符串
								sessionStorage.setItem('two', str); //存入到session中
								for (var len = 0; len < length; len++) {
									lineupcontent.two[len] = data_s[len];
									lineup_qudh(data_s[len].shirt_num, lineupcontent.two[len]) //球衣号码
								}
							}
							break;
						case "guard":
							if (data_s.length > 0) {
								var length = data_s.length;
								$scope.lineupNow.lineupMsg.chooseNum += length;
								var str_f = {
									"playerInfo": data_s,
									"positionDisplay": 3
								};
								var str = JSON.stringify(str_f); //对象转化为字符串
								sessionStorage.setItem('thr', str); //存入到session中
								for (var len = 0; len < length; len++) {
									lineupcontent.thr[len] = data_s[len];
									lineup_qudh(data_s[len].shirt_num, lineupcontent.thr[len]) //球衣号码
								}
							}
							break;
						case "goalkeeper":
							if (data_s.length > 0) {
								var length = data_s.length;
								$scope.lineupNow.lineupMsg.chooseNum += length;
								var str_f = {
									"playerInfo": data_s,
									"positionDisplay": 4
								};
								var str = JSON.stringify(str_f); //对象转化为字符串
								sessionStorage.setItem('four', str); //存入到session中
								for (var len = 0; len < length; len++) {
									lineupcontent.for[len] = data_s[len];
									lineup_qudh(data_s[len].shirt_num, lineupcontent.for[len]) //球衣号码
								}
							}
							break;
					}
	
				})
			}
			if (data.lineupMsg){
				var s = data.lineupMsg.surPlusSalary;//剩余工资
				var sum = data.lineupMsg.surplusPerAvg;
				var exp = data.lineupMsg.lineUpFightValue?data.lineupMsg.lineUpFightValue:0;
			} else {
				var s = maxSalary;
				var sum = Math.round(maxSalary/11 * 100) / 100;
				var exp = 0;
			}
			var restSalary = Math.round(s * 10) / 10;
			var power = Math.round(parseFloat(exp) * 100) / 100;
			var salarySum = sum;
			return {"lineupcontent":lineupcontent,"restSalary":restSalary,"power":power,"salarySum":salarySum}
		}
		$scope.lineupLists = {1:"4-4-2",2:"4-5-1",3:"5-4-1",4:"5-3-2",5:"4-3-3",6:"3-5-2",7:"3-4-3"};
		var lineupSource = function(){//生成阵型资源
	// 		生成模拟数据	************************************************
			var lineup_forward = {//前锋
				"positionDisplay": 1,
				"recentExp": '',
				"salary": ""
			}
			var lineup_guard = {//中场
				"positionDisplay": 2,
				"recentExp": '',
				"salary": ""
			}
			var lineup_midfield = {//后卫
				"positionDisplay": 3,
				"recentExp": '',
				"salary": ""
			}
			var lineup_goalkeeper = {//门将
				"positionDisplay": 4,
				"recentExp": '',
				"salary": ""
			}
			$scope.listData = [];
			for(var i=1;i<8;i++){
				var arr = $scope.lineupLists[i].split("-");
				$scope.listData[i-1] = {};
				$scope.listData[i-1].players = [];
				$scope.listData[i-1].formation = {
					"id":i,
					"name":$scope.lineupLists[i]
				};
				angular.forEach(arr,function(dd,ii){
					var str ={'0':lineup_midfield,'1':lineup_guard,'2':lineup_forward}[ii];
					for(var ii=0;ii<dd;ii++){
						$scope.listData[i-1].players.push(str)
					}
				})
				$scope.listData[i-1].players.push(lineup_goalkeeper)
			}
		//*************************************************************
			//li按钮内容
			var lineupli = [];
			var lineupcon = [];
			angular.forEach($scope.listData, function(data, index, array){
				lineupli[index] = array[index].formation;
				lineupcon[index] = {};
				lineupcon[index].one = [];
				lineupcon[index].two = [];
				lineupcon[index].thr = [];
				lineupcon[index].for = [];
				var lng = array[index].players.length;
				for (var ii = 0; ii < lng; ii++) {
		//			array[index].list[ii].parentId = array[index].formation.id;
					switch (array[index].players[ii].positionDisplay) {
						case 1:
							lineupcon[index].one.push(array[index].players[ii]);
							break;
						case 2:
							lineupcon[index].two.push(array[index].players[ii]);
							break;
						case 3:
							lineupcon[index].thr.push(array[index].players[ii]);
							break;
						case 4:
							lineupcon[index].for.push(array[index].players[ii]);
							break;
						default:
							break;
					}
				}
			})
			return {"lineupli":lineupli,"lineupcon":lineupcon}
		}
		$scope.$on("$ionicView.beforeEnter",function(e){
			$scope.lineup_li = function(data_s){
				TALKWATCH("经典战布阵-点击阵型");
				$scope.msga = "确认更换阵型为"+data_s.name;
				$scope.warnAlert($scope.msga,'更换后会对已选阵容产生影响',"","确定")
				$scope.confirmPopup.then(function (res) {  
		            if (res) { 
		            	angular.forEach($scope.lineupli,function(datali,indexli){
					if(data_s.id == indexli +1){
					    datali.famid = $scope.liupimg = datali.id -1 +"_1";
						$scope.lineupId = datali.id; //当前阵型的id
						$scope.lineupName = data_s.name;
						var num = data_s.id - 1;
				       $scope.lineupcontent = angular.copy($scope.lineupcontent = angular.copy($scope.lineupcon[num]));
						datali.famT = true;
						return false    
					}
					datali.famT = false;
					datali.famid = datali.id -1;
				})
				$scope.fmtTypem.hide();
				$scope.dataLi = data_s;
				showLineup(sessionStorage,$scope.lineupNow,data_s);//切换阵型
			            }  
			        });
				
			}
			
			$scope.lineupData = lineupSource();//获取所有阵型
			$scope.lineupli = $scope.lineupData.lineupli;//获取所有阵型对应id，name
			$scope.lineupmod={
				one:$scope.lineupli.slice(0,3),
				two:$scope.lineupli.slice(3,6),
				thr:$scope.lineupli.slice(6,7),
			}
			$scope.lineupcon = $scope.lineupData.lineupcon;//获取所有阵型对应布局
			var battle_lineup_xg_act = function(data){
				if (!data.lineupMsg.formation){
					$scope.lineupName = $scope.lineupli[0].name; //阵型名称
					$scope.lineupId = $scope.lineupli[0].id; //阵型ID
					angular.forEach($scope.lineupli,function(datali,indexli){
						if(datali.id == $scope.lineupId){
							datali.famid = $scope.liupimg = datali.id -1 +"_1";
							datali.famT = true;
							return false
						}
						datali.famT = false;
						datali.famid = datali.id -1;
					})
					$scope.dataLi = $scope.lineupli[0];
					$scope.lineupNow.lineupMsg.formation = {};
					$scope.lineupNow.lineupMsg.formation.fmt_name = $scope.lineupName;
					$scope.lineupNow.lineupMsg.formation.fmt_type = $scope.lineupId;
					//获取阵容
					var getData = modifiLineup(data,$scope.lineupId,$scope.lineupcon);
					$scope.lineupcontent = getData.lineupcontent;
					$scope.restSalary = getData.restSalary;
					$scope.power = getData.power;
					$scope.salarySum = getData.salarySum;
					if($scope.salarySum<=0){
						$scope.judgeSum = true;
					}
				}else{
					$scope.lineupName = data.lineupMsg.formation.fmt_name; //阵型名称
					$scope.lineupId = data.lineupMsg.formation.fmt_type ? data.lineupMsg.formation.fmt_type : 1;//阵型Id
					angular.forEach($scope.lineupli,function(datali,indexli){
						if(datali.id == $scope.lineupId){
							datali.famid = $scope.liupimg = datali.id -1 +"_1";
							datali.famT = true;
							return false
						}
						datali.famT = false;
						datali.famid = datali.id -1;
					})
					$scope.dataLi = $scope.lineupli[$scope.lineupId-1];
					//获取阵容
					var getData = modifiLineup(data,$scope.lineupId,$scope.lineupcon);
					$scope.lineupcontent = getData.lineupcontent;
					$scope.restSalary = getData.restSalary;
					$scope.power = getData.power;
					$scope.salarySum = getData.salarySum;
				}
				$ionicLoading.hide();
			}
			var battle_lineup_xg = sessionStorage.getItem("battle_lineup_xg");
			if (battle_lineup_xg) {
				$scope.lineupNow = JSON.parse(battle_lineup_xg);
				battle_lineup_xg_act(JSON.parse(battle_lineup_xg));
			} else {
				//	调用接口需要的参数
				var LineUpState = {
					"roomId": $stateParams.roomId,
				}
				var show = LineUp.battleUpdateLineup(LineUpState);
				show.then(function(data) {
					if(data.code==0){
						sessionStorage.setItem("battle_lineup_xg",JSON.stringify(data.data));
						$scope.lineupNow = data.data;
						battle_lineup_xg_act(data.data);
					}
				}, function(error) {
					var data = {"code":0,"data":{"userInfo":{"id":2,"logo_url":"http://thirdwx.qlogo.cn/mmopen/vi_32/n7pl10NRqpbqvia80GBRLiaVWYzm6QnK2AoN0jFAk6oNZseIOOPq5Bue76rTwPgE5IoPpVIkFmIvI0ekkoKUzHCw/132","user_from":"2","nickName":"Da \uD83D\uDC1Fxiong\uD83D\uDC1F"},"lineupMsg":{"lineUpFightValue":0,"salaryHot":115.0,"LineUpExp":0.0,"lineUpSubmitTime":null,"surPlusSalary":"115.0","surplusPerAvg":10.45},"ids":"1954,1955,1956"}};
					if(data.code==0){
						sessionStorage.setItem("battle_lineup_xg",JSON.stringify(data.data));
						$scope.lineupNow = data.data;
						console.log($scope.lineupNow);
						battle_lineup_xg_act(data.data);
					}
				})
			}
			var showLineup = function(sessionStorage, data,dataLi){//切换阵型用
				//	    	阵型的缓存前锋
				if (sessionStorage.getItem("one")) {
					var jsonData = sessionStorage.getItem("one"); //获取session
					var jsonArrayOne = JSON.parse(jsonData); //转为对象
					var len = jsonArrayOne.playerInfo.length;
					var lenMax = $scope.lineupcontent.one.length;
					if (len > lenMax) {
						jsonArrayOne.playerInfo = jsonArrayOne.playerInfo.slice(0, lenMax);
						len = lenMax;
						var str = JSON.stringify(jsonArrayOne); //对象转化为字符串
						sessionStorage.setItem('one', str); //存入到session中
					}
					$scope.lineupNow.lineupMsg.foward = jsonArrayOne.playerInfo;
					for (var i = 0; i < len; i++) {
						$scope.lineupcontent.one[i] = jsonArrayOne.playerInfo[i];
						lineup_qudh($scope.lineupcontent.one[i].shirt_num, $scope.lineupcontent.one[i]) //球衣号码
					}
				}
				//		    阵型的缓存中场
				if (sessionStorage.getItem("two")) {
					var jsonData = sessionStorage.getItem("two");
					var jsonArrayTwo = JSON.parse(jsonData);
					var len = jsonArrayTwo.playerInfo.length;
					var lenMax = $scope.lineupcontent.two.length;
					if (len > lenMax) {
						jsonArrayTwo.playerInfo = jsonArrayTwo.playerInfo.splice(0, lenMax);
						len = lenMax;
						var str = JSON.stringify(jsonArrayTwo); //对象转化为字符串
						sessionStorage.setItem('two', str); //存入到session中
					}
					$scope.lineupNow.lineupMsg.center = jsonArrayTwo.playerInfo;
					for (var i = 0; i < len; i++) {
						$scope.lineupcontent.two[i] = jsonArrayTwo.playerInfo[i];
						lineup_qudh($scope.lineupcontent.two[i].shirt_num, $scope.lineupcontent.two[i]) //球衣号码
					}
				}
				//		    阵型的缓存后卫
				if (sessionStorage.getItem("thr")) {
					var jsonData = sessionStorage.getItem("thr");
					var jsonArrayThr = JSON.parse(jsonData);
					var len = jsonArrayThr.playerInfo.length;
					var lenMax = $scope.lineupcontent.thr.length;
					if (len > lenMax) {
						jsonArrayThr.playerInfo = jsonArrayThr.playerInfo.splice(0, lenMax);
						len = lenMax;
						var str = JSON.stringify(jsonArrayThr); //对象转化为字符串
						sessionStorage.setItem('thr', str); //存入到session中
					}
					$scope.lineupNow.lineupMsg.guard = jsonArrayThr.playerInfo;
					for (var i = 0; i < len; i++) {
						$scope.lineupcontent.thr[i] = jsonArrayThr.playerInfo[i];
						lineup_qudh($scope.lineupcontent.thr[i].shirt_num, $scope.lineupcontent.thr[i]) //球衣号码
					}
				}
				//		    阵型的缓存门将
				if (sessionStorage.getItem("four")) {
					var jsonData = sessionStorage.getItem("four");
					var jsonArrayFour = JSON.parse(jsonData);
					var len = jsonArrayFour.playerInfo.length;
					var lenMax = $scope.lineupcontent.for.length;
					if (len > lenMax) {
						jsonArrayFour.playerInfo = jsonArrayFour.playerInfo.splice(0, lenMax);
						len = lenMax;
						var str = JSON.stringify(jsonArrayFour); //对象转化为字符串
						sessionStorage.setItem('four', str); //存入到session中
					}
					$scope.lineupNow.lineupMsg.goalkeeper = jsonArrayFour.playerInfo;
					for (var i = 0; i < len; i++){
						$scope.lineupcontent.for[i] = jsonArrayFour.playerInfo[i];
						lineup_qudh($scope.lineupcontent.for[i].shirt_num, $scope.lineupcontent.for[i]) //球衣号码
					}
				}
				var maxSalary = $scope.lineupNow.lineupMsg.salaryHot;
				if(data.lineupMsg){
					var salary = 0,recentExp = 0,salnum = 11,salarySum = 0;
					angular.forEach($scope.lineupcontent, function(data_other, index_other){
						angular.forEach(data_other, function(data_d, index_d) {
							if (data_d.salary) {
								salnum--;
								salary += Number(data_d.salary);
							}
							if (data_d.recentExp != ""){
								recentExp += Number(data_d.recentExp);
							}
						})
					})
					$scope.restSalary = Math.round(parseFloat(maxSalary-salary)*10)/10;
					$scope.power = Math.round(recentExp*100)/100; 
					$scope.salarySum = Math.round($scope.restSalary/salnum*100)/100;
					if($scope.salarySum<=0){
						$scope.judgeSum = true;
					}
				}else{
					$scope.restSalary = maxSalary;
					$scope.salarySum = $scope.lineupNow.lineupMsg.surplusPerAvg;
					$scope.power = 0;
				}
				if($scope.lineupNow.lineupMsg){
					$scope.lineupNow.lineupMsg.lineUpFightValue = $scope.power;
					$scope.lineupNow.lineupMsg.surPlusSalary = $scope.restSalary;
					$scope.lineupNow.lineupMsg.surplusPerAvg = $scope.salarySum;
					if($scope.lineupNow.lineupMsg.formation){
						$scope.lineupNow.lineupMsg.formation.fmt_name = dataLi.name;
						$scope.lineupNow.lineupMsg.formation.fmt_type = dataLi.id;
					}
					sessionStorage.setItem("battle_lineup_xg",JSON.stringify($scope.lineupNow));
					modifiLineup($scope.lineupNow,dataLi.id,$scope.lineupcon);
				}
			};
				//	添加球员的方法   跳转到选择球员页   amy
			$scope.loadplayer = function(positionId, restSalary,dataLi) {
				TALKWATCH("经典战布阵-手动选择球员");
				$ionicLoading.show();
				var PlayerAllState = {
					"roomId": $stateParams.roomId|0,
					"page": 1,
					"position": positionId,
					"fmtType": $scope.lineupId
				}
				if(!$scope.lineupNow.lineupMsg){
					$scope.lineupNow.lineupMsg = {};
					$scope.lineupNow.lineupMsg.lineUpFightValue = $scope.power;//战力
					$scope.lineupNow.lineupMsg.surPlusSalary = $scope.restSalary;//工资
					$scope.lineupNow.lineupMsg.salarySum = $scope.salarySum;//人均
					$scope.lineupNow.lineupMsg.chooseNum = 0;
					$scope.lineupNow.lineupMsg.formation.fmt_name = dataLi.name;
					$scope.lineupNow.lineupMsg.formation.fmt_type = dataLi.id;
					sessionStorage.setItem("battle_lineup_xg",JSON.stringify($scope.lineupNow));
					modifiLineup($scope.lineupNow,dataLi.id,$scope.lineupcon);
				}
				LineUp.getPlayers(PlayerAllState).then(function(data) {
					if(data.code==0){
						sessionStorage.setItem("battle_lineup_xg",JSON.stringify($scope.lineupNow));
						sessionStorage.setItem("lineup_players",JSON.stringify(data));
						var jm = hex_sha1(Math.random().toString()).substr(0,5);//取随机值，防止缓存
						if (data) {
							//		第一个参数是阵型，二：赛事ids 三，阵型位置  四：房间用户ID 五：剩余工资 六 tab编号  七 阵容id
							var url = "/tab/lineup/zrxz/" + PlayerAllState.fmtType + "/" + $scope.lineupNow.ids + "/" + positionId + "/" + $stateParams.roomId + "/" + jm + "/" + $stateParams.tabId + "/" + $stateParams.matchId;
							$timeout(function() {
								$location.path(url);
								$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
									$ionicLoading.hide();
								})
							}, 500)
						}
					}else{
						$ionicLoading.hide();
					}
				}, function(error) {
					$ionicLoading.hide();
				})
	
			}
			
			//  快速布阵
			$scope.bz_sys = function(){
				TALKWATCH("经典战布阵-点击快速布阵");
				ts($scope.lineupNow,$scope.restSalary,$scope.lineupId);
			}
		//	快速布阵功能性函数
			function ts(data,restSalary,lineupId){
				var maxSalary = data.lineupMsg.salaryHot;
				lineup_sys(data,lineupId);
			}
	
			function lineup_sys(data,lineupId){//快速布阵方法
				var ids = "";
				ids = getIds(data.lineupMsg.foward,ids);
				ids = getIds(data.lineupMsg.center,ids);
				ids = getIds(data.lineupMsg.guard,ids);
				ids = getIds(data.lineupMsg.goalkeeper,ids);
				ids = ids.substring(0,ids.length-1);
				$ionicLoading.show()
				var quick = {
					"roomId": $stateParams.roomId|0,
					"fmtType": lineupId,
					"ids":ids,
				}
				LineUp.quickLineup(quick).then(function(quick_data){
					if(quick_data.code==0){
						$scope.lineupNow.lineupMsg.lineUpFightValue = quick_data.data.lineUpFightValue;
						$scope.lineupNow.lineupMsg.surPlusSalary = quick_data.data.surplusSalary;
						$scope.lineupNow.lineupMsg.surplusPerAvg = quick_data.data.surplusPerAvg;
						$scope.lineupNow.lineupMsg.foward = quick_data.data.striker;
						$scope.lineupNow.lineupMsg.center = quick_data.data.midfielder;
						$scope.lineupNow.lineupMsg.guard = quick_data.data.defender;
						$scope.lineupNow.lineupMsg.goalkeeper = quick_data.data.goalkeeper;
						sessionStorage.setItem("battle_lineup_xg",JSON.stringify($scope.lineupNow));
						var getData = modifiLineup($scope.lineupNow,lineupId,$scope.lineupcon);
						$scope.lineupcontent = getData.lineupcontent;
						$scope.restSalary = getData.restSalary;
						$scope.power = getData.power;
						$scope.salarySum = getData.salarySum;
						$timeout(function() {
							$ionicLoading.hide();
						}, 500)
					}else if(quick_data.code==1){
						$scope.alertDark("剩余工资不足，请调整已选球员");
						$ionicLoading.hide();
					}else{
						$scope.alertDark(quick_data.data);
						$ionicLoading.hide();
					}
				}, function(error) {
					$scope.alertDark(quick_data.data);
					$ionicLoading.hide();
				})
			}
			function getIds(data,ids){
				if(data){
					angular.forEach(data,function(dd,index){
						ids = ids + dd.id +",";
					})
				}
				return ids;
			}
			function getLineupFull(data){
				var ids = "";
				ids = getIds(data.lineupMsg.foward,ids);
				ids = getIds(data.lineupMsg.center,ids);
				ids = getIds(data.lineupMsg.guard,ids);
				ids = getIds(data.lineupMsg.goalkeeper,ids);
				ids = ids.substring(0,ids.length-1);
				$scope.ids = ids.split(",");
				return ($scope.ids.length==11)?true:false;
			}
			//显示时间
			$scope.tt_time="";
			// 	确定布阵  amy
			$scope.bz_commit = function(restSalary, power){
				TALKWATCH("经典战布阵-确定布阵");
				var playerIds = []; //组合接口需要的ID
				angular.forEach($scope.lineupcontent, function(data_c, index_c) {
					angular.forEach(data_c, function(data_cc, index_cc) {
						if (data_cc.id) {
							playerIds.push(
								data_cc.id
							);
						}
					})
				});
				if(playerIds.length<11){
					$scope.alertDark("不完整的阵容无法参与排名，请完善后提交");return;
				}else if (restSalary < 0) {
					var remind = "您选择的阵容超过工资上限，请调整球员后再提交"
					$scope.alertDark(remind);
					return;
				} else {
					$ionicLoading.show();
				}
				$scope.updateLineUp(playerIds,$scope.lineupId)
			}
			//清除布阵 
			$scope.bz_empty = function() {
				
				$scope.warnAlert("清空现有阵容并重新布阵？","清空提示","","确定");
				$scope.confirmPopup.then(function(res) {
					if (res) {
						TALKWATCH("经典战布阵-点击清除布阵");
						var maxSalary = $scope.lineupNow.lineupMsg.salaryHot;
						if($scope.lineupNow.lineupMsg){
							$scope.lineupNow.lineupMsg.center = [];
							$scope.lineupNow.lineupMsg.foward = [];
							$scope.lineupNow.lineupMsg.goalkeeper = [];
							$scope.lineupNow.lineupMsg.guard = [];
							$scope.lineupNow.lineupMsg.surPlusSalary = maxSalary;
							$scope.lineupNow.lineupMsg.lineUpFightValue = 0;
							$scope.lineupNow.lineupMsg.surplusPerAvg = Math.round(maxSalary/11 * 100) / 100;
							sessionStorage.setItem("battle_lineup_xg",JSON.stringify($scope.lineupNow))
							var getData = modifiLineup($scope.lineupNow,$scope.lineupId,$scope.lineupcon);
							$scope.lineupcontent = getData.lineupcontent;
							$scope.restSalary = getData.restSalary;
							$scope.power = getData.power;
							$scope.salarySum = getData.salarySum;
						}else{
							$scope.restSalary = maxSalary;
							$scope.power = 0;
						}
						//清除缓存
						sessionStorage.removeItem("one");
						sessionStorage.removeItem("two");
						sessionStorage.removeItem("thr");
						sessionStorage.removeItem("four");
						sessionStorage.removeItem("other");
						sessionStorage.removeItem("lineup_players");
					}
				});
				$scope.$on("$ionicView.beforeLeave",function(e){
					$scope.confirmPopup.close();
					$scope.firstEnter = false;
				})
			}
			// 解决单独替换球员有缓存为问题
			$scope.copylength = false;
			Hall.lineuprecent($stateParams.roomId).then(function(data){
				if(data.code == 0){
					if(data.data){
						$scope.copylength = data.data.lineups.length;
						$scope.lineupcopys(data.data);
						return false;
					}
					$scope.copylength = false;
				}
			})
			
			$scope.isBack = false;
			 // 首次进入引导 
		 	var locationGuide = JSON.parse(localStorage.getItem("guideNew"));
			if(locationGuide && locationGuide["lineup"] === false){
				locationGuide["lineup"] = true;
				$scope.firstEnter = true;
				localStorage.setItem("guideNew",JSON.stringify(locationGuide));
			}
		})
	  	var address = location.hash;
	  	var matchId = $stateParams.matchId;
	  	var isBack = $scope.isBack;
		$scope.$on("$ionicView.beforeLeave", function(e){
			var nexUrl="#/tab/battle/3/" + matchId  + "/0";
			if($scope.lineupModal){
				$scope.isBack = true;
				$scope.lineupModal.remove();
				$scope.lineupModal  = false;
			}
			if($scope.fmtTypem){
				$scope.fmtTypem.hide()
			}
			if($scope.everoncem){
				$scope.everoncem.hide()
			}
			if(location.hash=="#/tab/hall/0" && $scope.isBack == false){
				history.replaceState({},"","#/tab/hall/0");
				location.hash = address;//$scope.lineupId为当前所选的阵型
				$scope.goback("#/tab/hall/0");
			}else if(location.hash==nexUrl && $scope.isBack == false){
				$scope.goback(nexUrl);
				$timeout(function(){
					history.replaceState("","",nexUrl);
					$(".tabs").css({opacity:0});
					location.hash = address;//$scope.lineupId为当前所选的阵型
				},100)
			}
			$scope.firstEnter = false;
		})
		$scope.$on('$destroy', function() {
			if($scope.everoncem){
				$scope.everoncem.remove()
			}
			if($scope.fmtTypem){
				$scope.fmtTypem.remove()
			}
		})
		
		//**********************new 
		$scope.headtext = '房间详情'
		$scope.shopRecord = function(){
			var url = "/tab/hall/joinroom/" + $stateParams.roomId +"/onlyShow";
			$location.path(url);
		}
		$ionicModal.fromTemplateUrl('templates/lineup/linup-fmtTypem.html', {
			scope: $scope,
			 animation: 'fade-in'
		}).then(function(modal) {
			$scope.fmtTypem = modal;
		});
		
		$ionicModal.fromTemplateUrl('templates/lineup/lineup-everonce.html', {
			scope: $scope,
			 animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.everoncem = modal;
		});
		
		$scope.lineup_fam = function(){
			$scope.onePointing = false;
			$scope.fmtTypem.show();
		}
		//点击曾经阵容同步
		$scope.bz_everonce = function(){
			if($scope.copylength){
				$scope.everoncem.show()
				return false;
			}
			$scope.toastDark("您还未参加过相同场次的房间，暂无曾用阵容可用");
		}
		//滑动提供索引值
		$scope.copySlide = function(index){
			$scope.slideindex = index;
		}
		//提交历史阵容
		$scope.btncopythis = function(){
			if(!$scope.slideindex){
				$scope.slideindex = 0
			}
			$scope.lineupcontent = angular.copy($scope.lineupcontent = angular.copy($scope.lineups[$scope.slideindex].licontent));
			$scope.everoncem.hide();
			//foward 1 center 2 guard 3 goalkeeper 4
			$scope.restSalary = $scope.lineups[$scope.slideindex].SalaryRemain;
			$scope.power = $scope.lineups[$scope.slideindex].power;
			$scope.salarySum = 0;
			$scope.liupimg = $scope.lineups[$scope.slideindex].formationDisplay -1 + "_1";
			$scope.lineupId = $scope.lineups[$scope.slideindex].formationDisplay;
			$scope.lineupName = $scope.lineupLists[$scope.lineups[$scope.slideindex].formationDisplay];
			angular.forEach($scope.lineupli,function(datali,indexli){
				if(datali.id == $scope.lineupId){
					datali.famid = $scope.liupimg = datali.id -1 +"_1";
					datali.famT = true;
					return false
				}
				datali.famT = false;
				datali.famid = datali.id -1;
			})
			$scope.lineupNow.lineupMsg.foward = $scope.lineupcontent.one;
			$scope.lineupNow.lineupMsg.center = $scope.lineupcontent.two;
			$scope.lineupNow.lineupMsg.guard = $scope.lineupcontent.thr;
			$scope.lineupNow.lineupMsg.goalkeeper = $scope.lineupcontent.for;
			$scope.lineupNow.lineupMsg.formation = {};
			$scope.lineupNow.lineupMsg.formation.fmt_name = $scope.lineupName;
			$scope.lineupNow.lineupMsg.formation.fmt_type = $scope.lineupId;
			$scope.lineupNow.lineupMsg.lineUpFightValue = $scope.lineups[$scope.slideindex].power;
			$scope.lineupNow.lineupMsg.surPlusSalary = $scope.lineups[$scope.slideindex].salaryRemain;
			$scope.lineupNow.lineupMsg.surplusPerAvg = 0;
			sessionStorage.setItem("battle_lineup_xg",JSON.stringify($scope.lineupNow));
			var getData = modifiLineup($scope.lineupNow,$scope.lineupId,$scope.lineupcon);
			$scope.lineupcontent = getData.lineupcontent;
			$scope.restSalary = getData.restSalary;
			$scope.power = getData.power;
			$scope.salarySum = getData.salarySum;
		}
		// 保存阵容方法
	    $scope.updateLineUp = function(playerIds,fmtTypeid){
				var savedata = {
					"roomId": $stateParams.roomId|0, //房间id
					"fmtType":fmtTypeid?fmtTypeid:1, //阵型id 没有错误
					"playerIds": playerIds.join(),//字符串形式
				}
				$("#bgOpc").addClass("bgOpc");
				var save = LineUp.battleLineupSave(savedata);
				save.then(function(data){
					if (data.code == 0){
						$scope.strall ={
							savedata:savedata,
							lineupcontent:$scope.lineupcontent
						}
						sessionStorage.setItem("lineupSuccess",JSON.stringify($scope.strall))
						$scope.isBack = true;
						$scope.tt_time=data.data;
						$ionicLoading.hide();
						suc_lineup();
					} else {
						$ionicLoading.hide();
						$scope.alertDark(data.msg || "部分球员工资有改动请重新，选择球员！");
					}
					$("#bgOpc").removeClass("bgOpc");
				}, function(error) {
					$ionicLoading.hide();
					$scope.alertDark("提交失败，请重试");
					$("#bgOpc").removeClass("bgOpc");
				})
	    }
		
		
		// 获取历史阵容方法
		$scope.lineupcopys = function(data){
				$scope.lineups = data.lineups;
				$scope.playersall = data.players;
				angular.forEach($scope.lineups,function(obj,key){
					// 需要修改
					obj.modliupimg = obj.formationDisplay - 1;
					obj.modliupfamid = $scope.lineupLists[obj.formationDisplay];
					obj.licontent = {};
					obj.licontent.one =[]
					obj.licontent.two =[]
					obj.licontent.thr =[]
					obj.licontent.for =[]
				    angular.forEach(obj.playerWithPosition,function(ids,positionii){
				    	if(positionii == 3){
				    		angular.forEach(ids,function(id){
				    			angular.forEach($scope.playersall,function(player,playid){
					    			if(id == playid){
					    				lineup_qudh(player.shirt_num,player)
					    				obj.licontent.one.push(player);
					    			}
					    		})
				    		})
				    		return false
				    	}
				    	if(positionii == 2){
				    		angular.forEach(ids,function(id){
				    			angular.forEach($scope.playersall,function(player,playid){
					    			if(id == playid){
					    				lineup_qudh(player.shirt_num,player)
					    				obj.licontent.two.push(player);
					    			}
					    		})
				    		})
				    		return false
				    	}
				    	if(positionii == 1){
				    		angular.forEach(ids,function(id){
				    			angular.forEach($scope.playersall,function(player,playid){
					    			if(id == playid){
					    				lineup_qudh(player.shirt_num,player)
					    				obj.licontent.thr.push(player);
					    			}
					    		})
				    		})
				    		return false
				    	}
				    	if(positionii == 0){
				    		angular.forEach(ids,function(id){
				    			angular.forEach($scope.playersall,function(player,playid){
					    			if(id == playid){
					    				lineup_qudh(player.shirt_num,player)
					    				obj.licontent.for.push(player);
					    			}
					    		})
				    		})
				    		return false
				    	}
				    })
				})
		}
		// 
		function suc_lineup() {
			$scope.hrefview();
		}
	}
	ctrl.$inject = ['$scope',"$ionicModal", '$document', "$stateParams", "$location", "$rootScope", "$cacheFactory", "$timeout", "$ionicLoading", "$ionicPopup", "LineUp", "Battle","Hall"];
		app.registerController("luksbzCtrl",ctrl);//return ctrl;
})