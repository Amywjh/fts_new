//球星对战投票
define(["app"],function(app){
	"use strict";
	function ctrl($scope, $ionicScrollDelegate,$ionicModal,$ionicSlideBoxDelegate,$ionicNavBarDelegate,$ionicSideMenuDelegate, $stateParams, $location, $rootScope, $ionicPopup, $ionicLoading,$ionicHistory, $timeout, LineUp,Thr, $state) {
		$scope.home_title="选择";
		$scope.help_title="房间详情";
		$scope.posId = Number($stateParams.positionId);
		$scope.showRule = function(){
			var url = "/tab/hall/joinroom/" + $stateParams.roomId +"/onlyShow";
			$location.path(url);
		}
		$scope.menuWidth =1.1*document.documentElement.clientHeight/6.67 ;
		$scope.goMenus = function(event){
			if($ionicSideMenuDelegate.$getByHandle("zrxzMenu").isOpen()){//如果是打开状态，意味着现在要关闭menu
				$scope.isOpenMenu = false;
			}else{//打开menu
				$scope.isOpenMenu = true;
			}
			$ionicSideMenuDelegate.$getByHandle("zrxzMenu").toggleLeft();	
//			$ionicSideMenuDelegate.canDragContent(true);
		}

		function getPlayerList(players, choosePlayers, maxNum, num) {//筛选球员的方法
			angular.forEach(players, function(data, index, array) {
				players[index].checked = false;
				players[index].disable = false;
				if (choosePlayers.length != 0) {
					angular.forEach(choosePlayers, function(p_data, p_index, p_array) {
						if (data.id == p_data.id) {
							players[index].checked = true;
						}
//						if (num >= maxNum){
//							for (var i = 0; i < players.length; i++) {
//								if (players[i].checked == true) {
//									players[i].disable = false;
//								} else {
//									players[i].disable = true;
//								}
//							}
//						}
					})
				}

			})
			return players;
		}

		function default_num(maxNum, num){//默认可选球员
			var cha = maxNum - num;
			var lineupxh_default = [];
			if (cha > 0) {
				for (var i = 0; i < cha; i++) {
					lineupxh_default.push({});
				}
			}
			return lineupxh_default;
		}
		function actFromParents(salaryHot,fromParents){//处理阵容页缓存的数据
			// 球员角色显示
			$scope.posName = ["前锋","中场","后卫","门将"];
			$scope.posIndex = Number(Number($scope.posId)-1);
			$scope.home_title="选择" + $scope.posName[$scope.posIndex];
			$scope.salaryMax = salaryHot;//工资帽
			$scope.lineupCost = {};//阵容的工资战力信息
			$scope.lineupxhArr = [];//已选球员
			$scope.lineupxhDefArr = [];//已选球员
			if(fromParents.lineupMsg){
				$scope.salarySum = Math.round(parseFloat($scope.salaryMax - fromParents.lineupMsg.surPlusSalary) * 10) / 10; /*已用工资*/
				$scope.lineupCost.restSalary = fromParents.lineupMsg.surPlusSalary;//剩余工资
				$scope.lineupCost.recentExpAll = fromParents.lineupMsg.lineUpFightValue;//战斗力
				$scope.lineupCost.chooseNum = 0;//已选人数计算
				var lineupxh_defaultArr = fromParents.lineupMsg.formation.fmt_name.split("-").reverse();
				lineupxh_defaultArr.push("1");
				if(fromParents.lineupMsg.foward){//前锋
					var chooseFoward = fromParents.lineupMsg.foward;
					$scope.lineupCost.chooseNum+=chooseFoward.length;
					for (var i = 0; i < chooseFoward.length; i++) {
						chooseFoward[i].checked = true;
						chooseFoward[i].disable = false;
						chooseFoward[i] = lineup_qudh(chooseFoward[i].shirt_num, chooseFoward[i]);
					}
					$scope.lineupxhArr.push(chooseFoward);
					$scope.lineupxhDefArr.push(default_num(lineupxh_defaultArr[0], chooseFoward.length));
				}else{
					$scope.lineupxhArr.push([]);
					$scope.lineupxhDefArr.push(default_num(lineupxh_defaultArr[0], 0));
				}
				if(fromParents.lineupMsg.center){//中场
					var chooseCenter = fromParents.lineupMsg.center;
					$scope.lineupCost.chooseNum+=chooseCenter.length;
					for (var i = 0; i < chooseCenter.length; i++) {
						chooseCenter[i].checked = true;
						chooseCenter[i].disable = false;
						chooseCenter[i] = lineup_qudh(chooseCenter[i].shirt_num, chooseCenter[i]);
					}
					$scope.lineupxhArr.push(chooseCenter);
					$scope.lineupxhDefArr.push(default_num(lineupxh_defaultArr[1], chooseCenter.length));
				}else{
					$scope.lineupxhArr.push([]);
					$scope.lineupxhDefArr.push(default_num(lineupxh_defaultArr[1],0));
				}
				if(fromParents.lineupMsg.guard){//后卫
					var chooseGuard = fromParents.lineupMsg.guard;
					$scope.lineupCost.chooseNum+=chooseGuard.length;
					for (var i = 0; i < chooseGuard.length; i++) {
						chooseGuard[i].checked = true;
						chooseGuard[i].disable = false;
						chooseGuard[i] = lineup_qudh(chooseGuard[i].shirt_num, chooseGuard[i]);
					}
					$scope.lineupxhArr.push(chooseGuard);
					$scope.lineupxhDefArr.push(default_num(lineupxh_defaultArr[2], chooseGuard.length));
				}else{
					$scope.lineupxhArr.push([]);
					$scope.lineupxhDefArr.push(default_num(lineupxh_defaultArr[2], 0));
				}
				if(fromParents.lineupMsg.goalkeeper){//门将
					var chooseGoalkeeper = fromParents.lineupMsg.goalkeeper;
					$scope.lineupCost.chooseNum+=chooseGoalkeeper.length;
					for (var i = 0; i < chooseGoalkeeper.length; i++) {
						chooseGoalkeeper[i].checked = true;
						chooseGoalkeeper[i].disable = false;
						chooseGoalkeeper[i] = lineup_qudh(chooseGoalkeeper[i].shirt_num, chooseGoalkeeper[i]);
					}
					$scope.lineupxhArr.push(chooseGoalkeeper);
					$scope.lineupxhDefArr.push(default_num(lineupxh_defaultArr[3], chooseGoalkeeper.length));
				}else{
					$scope.lineupxhArr.push([]);
					$scope.lineupxhDefArr.push(default_num(lineupxh_defaultArr[3], 0));
				}
				if($scope.lineupCost.chooseNum==11){
					$scope.lineupCost.surplusPerAvg = 0;
				}else{
					$scope.lineupCost.surplusPerAvg = Math.round(10*$scope.lineupCost.restSalary/(11-$scope.lineupCost.chooseNum))/10;//剩余人均
				}
			}else{
				$scope.salarySum = 0;
				$scope.lineupCost.chooseNum = 0;
				$scope.lineupxhArr = [[],[],[],[]];
				$scope.lineupxhDefArr = [[],[],[],[]];
			}
			
		}
		function act(data,fromParents){
			actFromParents(data.data.salaryHot,fromParents);
			$scope.num = 0;//当前位置现有球员
			$scope.maxNum = data.data.num; //当前位置所需球员
			$scope.lineupxh = $scope.lineupxhArr[$scope.posId-1];
			$scope.lineupxh_default = $scope.lineupxhDefArr[$scope.posId-1];
			switch ($stateParams.positionId){
				case "1":
					if(fromParents.lineupMsg){
						if(fromParents.lineupMsg.foward){
							$scope.num = fromParents.lineupMsg.foward.length;
						}
					}
					break;
				case "2":
					if(fromParents.lineupMsg){
						if(fromParents.lineupMsg.center){
							$scope.num = fromParents.lineupMsg.center.length;
						}
					}
					break;
				case "3":
					if(fromParents.lineupMsg){
						if(fromParents.lineupMsg.guard){
							$scope.num = fromParents.lineupMsg.guard.length;
						}
					}
					break;
				case "4":
					if(fromParents.lineupMsg){
						if(fromParents.lineupMsg.goalkeeper){
							$scope.num = fromParents.lineupMsg.goalkeeper.length;
						}
					}
					break;
				default:
					$scope.num = 0;
					break;
			}
			//	  	选择具体的球队
			$scope.zrxzdatabnt = data.data.teamList; //获得所有的球队
			$scope.zrxzdatabnt.unshift({
				id:0,
				name:"所有"
			})
			$scope.zrxzdatabnt[0].checked_all = true //默认选中的球队为全部
			//显示球员
			$scope.lineupxx = data.data.playerList; //默认为所有的球员
			angular.forEach($scope.lineupxx, function(data, index, array){
				lineup_qudh(data.shirt_num, data) //球衣号
			})
			//  默认显示的球员和选中球员
			$scope.posPage = $scope.posIndex;
			getPlayerList($scope.lineupxx, $scope.lineupxh, $scope.maxNum, $scope.num);
			$scope.page = data.pageNo;
			if (data.pageNo >= data.totalPageCount) {
				$scope.moreDataCanBeLoaded = true;
				$scope.noMore = true;
			}else{
				$scope.moreDataCanBeLoaded = false;	
				$scope.noMore = false;
			}
		}

		//	跳转后先从获取session数据
		var fromKsbz = JSON.parse(sessionStorage.getItem("battle_lineup_xg"));
		var data = sessionStorage.getItem("lineup_players");
		if (data) { //如果数据存在，执行处理数据的方法
			act(JSON.parse(data),fromKsbz);		
		} else { //如果缓存数据不存在，调取接口数据后再执行处理数据的方法
			getAllPlayers($stateParams.positionId,0,-1,true,$scope.filterData,fromKsbz);
		}
		
		function getAllPlayers(positionId,page,sortId,isStart,filterData,parData){
			$scope.moreDataCanBeLoaded = true;//防止服务慢时持续请求
			var PlayerAllState = {
				"roomId": $stateParams.roomId|0,
				"page": isStart?1:page,
				"position": positionId,
				"fmtType": $stateParams.fmtId,
				"order":(sortId===0||sortId)?sortId:0
			}
			if(!jQuery.isEmptyObject(filterData)){//过滤
				for(var k in filterData){
					if(k=="maxSalary"){
						PlayerAllState[k] = Number(filterData[k]);
					}else{
						PlayerAllState[k] = filterData[k]?1:0;
					}
				}
			}
			LineUp.getPlayers(PlayerAllState).then(function(data){
				if(data.code==0){
					$scope.maxNum = data.data.num;
					$scope.num = $scope.lineupxh.length;
					if(isStart){
						act(data,parData);
					}else{
						var addPlayers = getPlayerList(data.data.playerList, $scope.lineupxh, $scope.maxNum, $scope.num);
						angular.forEach(addPlayers, function(data, index, array){
							lineup_qudh(data.shirt_num, data) //球衣号
						})
						if(data.pageNo==1){
							$scope.lineupxx = addPlayers;
						}else{
							var lists = $scope.lineupxx;
							$scope.lineupxx = new Array().concat(lists,addPlayers);
						}
						if (data.pageNo >= data.totalPageCount){
							$scope.moreDataCanBeLoaded = true;
							$scope.noMore = true;
						}else{
							$scope.moreDataCanBeLoaded = false;
							$scope.noMore = false;
						}
					}
					$timeout(function() {
						$ionicLoading.hide();
					}, 800)
				}
			})
		}
		
		$scope.morePlayer = function(){//分页加载更多球员
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.page +=1;
			getAllPlayers($scope.posId,$scope.page,$scope.pxAction,false,$scope.filterData);
		}
		
		function getTeamPlayers(posId,teamId,sortId,filterData){
			$scope.moreDataCanBeLoaded = true;
			//   		调用服务，根据球队ID选择球员
			if(filterData) console.log(filterData);
			var PlayerState = {
				"roomId": $stateParams.roomId|0,
				"position": posId|0,
				"teamId": teamId,
				"order":(sortId===0||sortId)?sortId:0
			}
			if(!jQuery.isEmptyObject(filterData)){//过滤
				for(var k in filterData){
					if(k=="maxSalary"){
						PlayerState[k] = Number(filterData[k]);
					}else{
						PlayerState[k] = filterData[k]?1:0;
					}
				}
			}
			LineUp.teamPlayers(PlayerState).then(function(data){
				if(data.code==0){
					$scope.lineupxx = data.data;
					getPlayerList($scope.lineupxx, $scope.lineupxh, $scope.maxNum, $scope.num);
					angular.forEach($scope.lineupxx, function(data, index, array) {
						lineup_qudh(data.shirt_num, data) //球衣号
					})
					$timeout(function() {
						$scope.noMore = true;
						$ionicLoading.hide();
					}, 500)
				}else{
					$ionicLoading.hide();
				}
			}, function(error) {
				$timeout(function() {
					$ionicLoading.hide();
				}, 1000)
			})
		}
		$scope.zrxz_bnt = function(teamId) {//点击切换选中的球队
			$scope.nowTeamId = teamId;
			$ionicLoading.show();
			$ionicScrollDelegate.$getByHandle("playScroll").scrollTop(true);
			angular.forEach($scope.zrxzdatabnt, function(data, n_index, array){
				$scope.zrxzdatabnt[n_index].checked_home = false;
				$scope.zrxzdatabnt[n_index].checked_away = false;
				if(n_index==0) $scope.zrxzdatabnt[0].checked_all = false;
				if(!teamId){
					if (data.id == teamId){
						$scope.zrxzdatabnt[0].checked_all = true;
						return false;
					}
				}else{
					if(data.homeTeamId == teamId){
						$scope.zrxzdatabnt[n_index].checked_home = true;
						return false;
					}
					if(data.awayTeamId == teamId){
						$scope.zrxzdatabnt[n_index].checked_away = true;
						return false;
					}
				}
			});
			if(teamId==0){
				$scope.moreDataCanBeLoaded = false;$scope.page = 1;
				getAllPlayers($scope.posId,$scope.page,$scope.pxAction,false,$scope.filterData);
				return;
			}else{
				getTeamPlayers($scope.posId,teamId,$scope.pxAction,$scope.filterData);
			}
		}
			
		$scope.cliP = function(p,fromSon){//控制添加和取消球员的函数
			if($scope.posId != p.positionDisplay){//如果操作元素和当前位置不符
				return p.checked = !p.checked;
			}else if(!p.checked){//如果操作元素取消选择和当前实际选中球员位置不符
				if(p.positionDisplay!=$scope.lineupxh[0].positionDisplay) return p.checked = !p.checked;
			}
			if(fromSon){//如果是球员详情跳转，执行此方法
				for (var i = 0; i < $scope.lineupxx.length; i++){
					if (p.id == $scope.lineupxx[i].id) {
						$scope.lineupxx[i].checked = p.checked;
					}
				}
				if($scope.replacePlayer){
					delete $scope.replacePlayer;
				}
				if(sessionStorage.getItem("playerStatus")){
					sessionStorage.removeItem("playerStatus");
				}
			}
			if (p.checked == true) {
				if ($scope.num >= $scope.maxNum){
					p.checked = !p.checked;
					$scope.replacePlayer = {
						"status":{"change":"replace"},
						"detial":p
					}
					return;
				}
				$scope.lineupxh.push(p);
				$scope.lineupxh_default.splice(0, 1);
				$scope.num++;
				$scope.salarySum += p.salary;
			} else {
				for (var i = 0; i < $scope.lineupxh.length; i++) {
					if ($scope.lineupxh[i].id == p.id) {
						$scope.lineupxh.splice(i, 1);
						$scope.lineupxh_default.push({});
					}
				}
				for (var i = 0; i < $scope.lineupxx.length; i++) {
					if (p.id == $scope.lineupxx[i].id) {
						$scope.lineupxx[i].checked = false;
					}
				}
				$scope.num--;
				if ($scope.num < $scope.maxNum) {
					for (var i = 0; i < $scope.lineupxx.length; i++) {
						$scope.lineupxx[i].disable = false;
					}
				}
				$scope.salarySum -= p.salary;
			}
			$scope.salarySum =  Math.round($scope.salarySum* 10) / 10;
			$scope.lineupCost = getLineupCost(p,p.checked,$scope.lineupCost.recentExpAll,$scope.lineupCost.restSalary,11,$scope.lineupCost.chooseNum);
		}
		/*
		 data 选中的球员
		 maxSalary  工资帽
		 maxNum  最多人数
		 nowNum  目前人数
		 * */
		function getLineupCost(data,isPlus,recentExpAll,oldRestSalary,maxNum,nowNum){//获取工资和战斗力
			var useData = {"restSalary":0,"recentExpAll":recentExpAll,"surplusPerAvg":0};
			var salary = 0;
			if(isPlus){//如果加球员
				salary += data.salary;
				useData.recentExpAll +=data.recentExp;
				nowNum++;
			}else{//如果减球员
				salary -= data.salary;
				useData.recentExpAll -=data.recentExp;
				nowNum--;
			}
			useData.restSalary = Math.round((Number(oldRestSalary) - Number(salary))*10)/10;//表现值
			useData.recentExpAll = Math.round(useData.recentExpAll*100)/100;//战斗力
			useData.surplusPerAvg  = (maxNum>nowNum)?Math.round((useData.restSalary/(maxNum-nowNum))*10)/10 :0 ;//剩余人均
			useData.chooseNum = nowNum;//阵容已选人数
			return useData;
		}
		
		$scope.del_player = function(p,isReplace,replace) {//删除选中球员
			$scope.cliP(p);
			if(isReplace){
				if(p.positionDisplay==replace.positionDisplay){
					replace.checked = true;
					replace.disable = false;
					$scope.cliP(replace,true);
				}else{
					$scope.shut();
				}
			}
		}
		$scope.shut = function(){
			if($scope.replacePlayer){
				delete $scope.replacePlayer;
			}
			if(sessionStorage.getItem("playerStatus")){
				sessionStorage.removeItem("playerStatus");
			}
		}
		$scope.zrxz_tj = function(salary, playerInfo){//确定按钮
			$ionicLoading.show();
			fromKsbz.lineupMsg.surPlusSalary = $scope.lineupCost.restSalary;//剩余工资
			fromKsbz.lineupMsg.lineUpFightValue = $scope.lineupCost.recentExpAll;//阵容战斗力
			fromKsbz.lineupMsg.surplusPerAvg = $scope.lineupCost.surplusPerAvg;//剩余人均
			fromKsbz.lineupMsg.foward  = playerInfo[0];
			fromKsbz.lineupMsg.center  = playerInfo[1];
			fromKsbz.lineupMsg.guard  = playerInfo[2];
			fromKsbz.lineupMsg.goalkeeper  = playerInfo[3];
			sessionStorage.setItem("battle_lineup_xg",JSON.stringify(fromKsbz));
			$timeout(function(){//临时取消，按钮加回时仍要用
//				var path = "#/tab/lineup/ksbz/" + $stateParams.tabId + "/" + $stateParams.roomId + "/" + $stateParams.matchId + "/" + $stateParams.fmtId + "/" + $stateParams.leagueId;
//				history.replaceState({},"",path);
//				history.go(-1);
			},500)
			$rootScope.$on('$locationChangeSuccess', function() {//返回前页时，刷新前页
				$ionicLoading.hide();
			});
		}
		$scope.$on("$stateChangeStart",  function(event, toState, toParams, fromState, fromParams) {  
        	if(toState && fromState){
        		if(toState.name == "tab.lineup-ksbz" && fromState.name == "tab.lineup-zrxz"){//选球员到阵容页
//      			event.preventDefault();//可以阻止跳转
        			$scope.zrxz_tj($scope.salarySum,$scope.lineupxhArr);
        		}
        	}
        }); 
//      筛选
        $scope.zrxz_filter = [{name:"首发登场",checked:false,idType:"start"},{name:'推荐',checked:false,idType:"recommend"}, {name:'不显示伤病',checked:false,idType:"injury"}, {name:'不显示停赛',checked:false,idType:"forbid"}];
//		排序list
		$scope.zrxz_gzpx = [{name:"综合推荐",id:0},{name:'最高身价',id:1}, {name:'最低身价',id:2},{name:'最高战力',id:3},{name:'最高热度',id:4}];
		$scope.nowOrderType = $scope.zrxz_gzpx[0].name;
		function sortAct(sortId){//排序调用的方法
			$scope.page = 1;
			if(!$scope.nowTeamId){//如果是所有的
				$scope.moreDataCanBeLoaded = false;
				getAllPlayers($scope.posId,$scope.page,sortId,false,$scope.filterData);
			}else{//如果是某个球队的
				$scope.moreDataCanBeLoaded = true;
				$scope.nowTeamId = $scope.nowTeamId?$scope.nowTeamId:0;
				getTeamPlayers($scope.posId,$scope.nowTeamId,sortId,$scope.filterData);
			}
		}
		$scope.sortPlayer = function(data,e){//排序按钮事件
			$scope.nowOrderType = data.name;
			$(".orderItem").slideUp();
			$(".orderVal").find("i").removeClass("rollTop");
			event.stopPropagation();//阻止事件冒泡
			event.preventDefault();
			$ionicScrollDelegate.$getByHandle("playScroll").scrollTop(true);
			$(e.currentTarget).css({"color":"#34ed41","font-weight":"bold"}).find("img").attr("src","../../img2.0/common/sx_3.png");
			$(e.currentTarget).siblings().css({"color":"#858ea0","font-weight":"normal"}).find("img").attr("src","../../img2.0/common/sx_4.png");
			switch (data.id) {
				case 1://工资高到低
					$scope.pxAction = -1;
					break;
				case 2://工资低到高
					$scope.pxAction = 1;
					break;
				case 3://近期战力高到低
					$scope.pxAction = -2;
					break;
				case 4://热度从高到低
					$scope.pxAction = -3;
					break;
				case 0://工资高到低
					
					$scope.pxAction = 0;
					break;
				default:
					$scope.pxAction = 0;
					break;
			}
			$ionicLoading.show();
			sortAct($scope.pxAction);//调用排序方法
		}
		function filterAct(filterData){//排序调用的方法
			$scope.page = 1;
			if(!$scope.nowTeamId){//如果是所有的
				$scope.moreDataCanBeLoaded = false;
				getAllPlayers($scope.posId,$scope.page,$scope.pxAction,false,filterData);
			}else{//如果是某个球队的
				$scope.moreDataCanBeLoaded = true;
				$scope.nowTeamId = $scope.nowTeamId?$scope.nowTeamId:0;
				getTeamPlayers($scope.posId,$scope.nowTeamId,$scope.pxAction,filterData);
			}
		}
		$scope.filterData =[];
		$scope.commitFilter = function(){//筛选过滤球员
			$(".orderItem").slideUp();
			event.stopPropagation();//阻止事件冒泡
			event.preventDefault();
			$ionicScrollDelegate.$getByHandle("playScroll").scrollTop(true);
			angular.forEach($scope.zrxz_filter,function(data,index){
				var idType = data.idType;
				$scope.filterData[idType] = data.checked;
				if(data.checked) $scope.hasFilter = true;
			})
			if($("input[name=maxPrice]").val()){//如果input有值
				$scope.filterData["maxSalary"]= $("input[name=maxPrice]").val();
				$scope.hasFilter = true;
			}else{
				delete $scope.filterData["maxSalary"];
			}
			$ionicLoading.show();
			filterAct($scope.filterData);//调用过滤方法
		}
		$scope.restore = function(){//清除筛选
			angular.forEach($scope.zrxz_filter,function(data,index){
				data.checked = false;
			})
			$("input[name=maxPrice]").val('');
		}
		
		$scope.slideChange = function(posAct,posIndex){//切换球员按钮事件
			$scope.shut();
			$ionicLoading.show();
			$scope.filterData =[];
			$scope.hasFilter = false;
			$(".orderItem").slideUp();
			$(".orderVal").find("i").removeClass("rollTop");
			if(posAct==true && posIndex<3){
				$scope.posIndex++;
			}else if(!posAct && posIndex>0){
				$scope.posIndex--;
			}else{
				$ionicLoading.hide();
				return false;
			}
//			event.stopPropagation();//阻止事件冒泡
//			event.preventDefault();
			$scope.posId = Number($scope.posIndex+1);
			$scope.posPage = $scope.posIndex;
		}
		//切换球员位置
		function getPosActplayer(posIndex){
			$scope.home_title="选择" + $scope.posName[posIndex];
			$("title").html($scope.home_title); 
			$scope.lineupxh = $scope.lineupxhArr[posIndex];
			$scope.lineupxh_default = $scope.lineupxhDefArr[posIndex];
			$ionicScrollDelegate.$getByHandle("playScroll").scrollTop(true);
			$ionicScrollDelegate.$getByHandle("teams").scrollTo(0, 0, true);
			angular.forEach($scope.zrxzdatabnt, function(data, n_index, array){	
				$scope.zrxzdatabnt[n_index].checked_home = false;
				$scope.zrxzdatabnt[n_index].checked_away = false;
				if(n_index==0) $scope.zrxzdatabnt[0].checked_all = true;
				$scope.nowTeamId = 0;
			});
			$scope.moreDataCanBeLoaded = false;$scope.page = 1;
			getAllPlayers($scope.posId,$scope.page,$scope.pxAction,false);
		}
		$scope.changeS = function(slideId){//切换球员滑动时间
			$ionicLoading.show();
			$scope.posIndex = $ionicSlideBoxDelegate.$getByHandle('playerPos').currentIndex();
			$scope.posId = Number($scope.posIndex+1);
			getPosActplayer($scope.posIndex);
		}
		$scope.getSkill = function(){
			$location.path("/tab/wode/help/second/chooseSkill");	
			$scope.isPointingShow = false;
		}
		$scope.$on("$ionicView.beforeEnter",function(e){//用于球员详情的按钮时间的跳转
			var historyAdd = $ionicHistory.forwardView();
			if(historyAdd && historyAdd.stateName=="tab.lineup-qyxx-second"){
				if(sessionStorage.getItem("playerStatus")){
					var playerStatus = JSON.parse(sessionStorage.getItem("playerStatus"));
					if(playerStatus.status.change == "change"){//添加或删除
						$scope.cliP(playerStatus.detial,true);
					}else if(playerStatus.status.change == "replace"){//替换
						$scope.replacePlayer = playerStatus;
					}
				}
			}
			// 不用了
//			if(!localStorage.getItem("chooseSkill")){
//				$ionicModal.fromTemplateUrl('templates/lineup/lineup-skill.html', {
//					scope: $scope,
//					animation: 'fade-in'
//				}).then(function(modal) {
//					$scope.chooseSkillModal = modal;
//					$scope.skillSlideIndex = 0;
//					$scope.chooseSkillModal.show();
//					localStorage.setItem("chooseSkill",true);
//					$scope.nextSkill = function(slideIndex){
//						if(slideIndex){
//							$scope.skillSlideIndex = slideIndex;
//						}else{
//							$(".SkillModalShow").addClass("fadeHideModal");
//							$(".SkillModalHide").addClass("SkillModalHideAct");
//							$timeout(function(){
//								$scope.chooseSkillModal.remove();
//								$(".lineupRule").find(".addLight").addClass("addLightAct");
//								$timeout(function(){
//									$(".lineupRule").find(".addLight").removeClass("addLightAct");
//								},1500);
//							},2300)
//						}
//					}
//					$scope.shutModal = function(){
//						$(".SkillModalShow").addClass("fadeHideModal");
//						$(".SkillModalHide").addClass("SkillModalHideAct");
//						$timeout(function(){
//							$scope.chooseSkillModal.remove();
//							$(".lineupRule").find(".addLight").addClass("addLightAct");
//							$timeout(function(){
//								$(".lineupRule").find(".addLight").removeClass("addLightAct");
//							},1500);
//						},2300)
//					}
//				});
//			}
        
	        //  引导
	        $scope.guideFun = function(){
	    		$ionicModal.fromTemplateUrl('templates/main/modal/rewardModal.html', {
					scope: $scope,
					animation: 'fade-in'
				}).then(function(modal) {
					$scope.rewardModal = modal;
					$scope.rewardModal.show();
					$scope.thrPage = true;
					$scope.guiIndex = 0;
				})
				$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { //返回前页时，刷新前页
					$scope.rewardModal.remove();
				})
				
				$scope.nextPage = function(index){
					$scope.guiIndex ++ ;
					if(index == 3){
						if($scope.guiIndex == 1){
							$scope.nextOneImg = true;
						}else if($scope.guiIndex == 2){
							$scope.nextOneImg = false;
							$scope.nextTwoImg = true;
						}
						$scope.nextImg = true;
						if($scope.guiIndex >2){
							$scope.rewardModal.remove();
							$scope.isPointingShow = true;
						}
					}
				}
	        }
		   // 首次进入引导 
		 	var locationGuide = JSON.parse(localStorage.getItem("guideNew"));
			if(locationGuide && locationGuide["chose"] === false){
				locationGuide["chose"] = true;
				$scope.guideFun();
				localStorage.setItem("guideNew",JSON.stringify(locationGuide));
			}


		})
		$(".orderVal").on("click", function(e){
			$scope.shut();
			angular.forEach($scope.zrxz_filter,function(data,index){
				if(!jQuery.isEmptyObject($scope.filterData)){//如果有过滤条件
					$scope.zrxz_filter[index].checked = $scope.filterData[data.idType];
				}else{//如果没有过滤条件
					$scope.zrxz_filter[index].checked = false;
				}
			})
			$("input[name=maxPrice]").val($scope.filterData["maxSalary"]);
			$scope.$apply($scope.zrxz_filter);
//			console.log($scope.filterData);console.log($scope.zrxz_filter);
			$(this).parent(".orderType").siblings(".orderType").find(".orderItem").slideUp("fast");
			$(this).siblings(".orderItem").slideToggle(200);
			if($(this).find("i").hasClass("rollTop")){
				$(this).find("i").removeClass("rollTop");
			}else{
				$(this).find("i").addClass("rollTop");
			}
			$(document).on("click", function(e){
				if($(e.target).hasClass("orderItem")){
					$(".orderItem").slideUp();
					$(".orderVal").find("i").removeClass("rollTop");
				}
			});
			e.stopPropagation();
		});
		$scope.lossPercent = function(btn){// 比赛id
			$ionicLoading.show();
			LineUp.lossRate(btn.matchId).then(function(data){
				if(!data.code){
					if(data.data){
						if(!data.data.home.rank) data.data.home.rank = "-";
						if(!data.data.away.rank) data.data.away.rank = "-";
						if(!data.data.odds){
							data.data.odds = {
							"fail": "-",
				            "equal": "-",
				            "win": "-"
							}
						}
											
					}
					$scope.lossTeams = data.data;
					$ionicLoading.hide();
					if($scope.lossPercentModal){
						$scope.lossPercentModal.show();
					}else{
						$ionicModal.fromTemplateUrl('templates/lineup/modal/teamLoss.html', {
							scope: $scope,
							animation: 'silde-in-up'
						}).then(function(modal){
							$scope.lossPercentModal = modal;
							$scope.lossPercentModal.show();
					    });
					}
				}else{
					$ionicLoading.hide();
				}
			})
		}
		$scope.removeLoss = function(){
			$scope.lossPercentModal.hide();
		}
		$scope.$on("$ionicView.leave",function(e){//用于球员详情的按钮时间的跳转
			if($scope.chooseSkillModal) $scope.chooseSkillModal.remove();
			if($scope.lossPercentModal) $scope.lossPercentModal.hide();
		})
	}
	ctrl.$inject = ['$scope','$ionicScrollDelegate',"$ionicModal",'$ionicSlideBoxDelegate','$ionicNavBarDelegate','$ionicSideMenuDelegate', '$stateParams', "$location", "$rootScope", "$ionicPopup", "$ionicLoading","$ionicHistory", "$timeout", "LineUp","Thr", "$state"];
	app.registerController("luzrxzCtrl",ctrl);//return ctrl;
})