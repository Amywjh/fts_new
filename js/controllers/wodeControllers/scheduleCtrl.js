define(["app"], function(app) {
	"use strict";
	function ctrl($scope, $ionicPopup, $ionicScrollDelegate,$location, $ionicLoading, $timeout, $rootScope,$ionicModal,Wode, Hall) {
	   		
		var sch_leagueList = sessionStorage.getItem("sch_leagueList");
		if (sch_leagueList) {
			creatroom_fun(JSON.parse(creatroom));
		} else {
			Wode.sch_leagueList().then(function(data){
				creatroom_fun(data);
			})
		}
	    function creatroom_fun(list) {
	   			$scope.leagueList = list.data;
	   			$scope.leagueList[0].check = true;
	   			$scope.leagueId = $scope.leagueList[0].match_type;
	   			$scope.begin_time = $scope.leagueList[0].begin_time;
	   			$scope.end_time = $scope.leagueList[0].end_time;
	   			kalendar($scope.leagueList);
	   	}
	    function  kalendar(list){
	    	 // 设置日历
//		     var d2 = new Date(list[0].begin_time);    // 月是从0开始计数， 需要减一
//				 d2.getFullYear();          // 2016
//				 d2.getMonth();            // 2
//				 d2.getDate();            // 15
//				 d2.toLocaleDateString();      // "2016/3/15" 证明设置正确 
//				 console.log(d2.toLocaleDateString()) 
//				 console.log(d2.getFullYear());
	    
	    
	    
	    var dateObj = (function(){
		    var _date = new Date();    // 默认为当前系统时间
		    return {
		      getDate : function(){
		        return _date;
		      },
		      setDate : function(date) {
		        _date = date;
		      }
		    };
		  })()
		 // 设置calendar div中的html部分
	     renderHtml();
		  // 表格中显示日期
		  showCalendarData();
		  // 绑定事件
		  bindEvent();
		  
		  	    // 点击联赛
	    $scope.clkleague = function(data){
//	    	console.log(data)
	    	angular.forEach($scope.leagueList,function(datack,index){
	    		if(datack.id == data.id ){
	    			datack.check = true;
	    			$scope.leagueId = datack.match_type;
	    			$scope.begin_time = datack.begin_time;
	   			    $scope.end_time = datack.end_time;
	   			    dateObj.setDate(new Date());
		            showCalendarData();
	    			return false;
	    		}
	    		datack.check = '';
	    	})
	    	
	    }
		  

  /**
   * 渲染html结构
   */
	  function renderHtml() {
	    var calendar = document.getElementById("calendar");
	    var titleBox = document.createElement("div");  // 标题盒子 设置上一月 下一月 标题
	    var bodyBox = document.createElement("div");  // 表格区 显示数据
	    var footBox = document.createElement("div");  // 底部显示
	
	    // 设置标题盒子中的html
	    titleBox.className = 'calendar-title-box';
	    titleBox.innerHTML = "<span class='prev-month' id='prevMonth'><i class='ion-ios-arrow-left'></i>&nbsp;上个月</span>" +
	      "<span class='calendar-title' id='calendarTitle'></span>" +
	      "<span id='nextMonth' class='next-month'>下个月&nbsp;<i class='ion-ios-arrow-right'></i></span>";
	    calendar.appendChild(titleBox);    // 添加到calendar div中
	
	    // 设置表格区的html结构
	    bodyBox.className = 'calendar-body-box';
	    var _headHtml = "<tr class='bodytitle'>" + 
	              "<th>日</th>" +
	              "<th>一</th>" +
	              "<th>二</th>" +
	              "<th>三</th>" +
	              "<th>四</th>" +
	              "<th>五</th>" +
	              "<th>六</th>" +
	            "</tr>";
	    var _bodyHtml = "";
	
	    // 一个月最多31天，所以一个月最多占6行表格
	    for(var i = 0; i < 6; i++) {  
	      _bodyHtml += "<tr>" +
	              "<td></td>" +
	              "<td></td>" +
	              "<td></td>" +
	              "<td></td>" +
	              "<td></td>" +
	              "<td></td>" +
	              "<td></td>" +
	            "</tr>";
	    }
	    bodyBox.innerHTML = "<table id='calendarTable' class='calendar-table'>" +
	              _headHtml + _bodyHtml +
	              "</table>";
	    // 添加到calendar div中
	    calendar.appendChild(bodyBox);
	    footBox.className = 'footclick'
	     footBox.innerHTML = '<div class=" flex-justify-b"><div class="footdate a-text-color-whit a-font-size-medium-x font-weight">'
	            +'</div><div class="footbtn a-flex-center a-text-colorgreen a-font-size-small blackroom" ng-click="btnn()">竞猜提醒</div></div>'
	    
	     //calendar.appendChild(footBox);  // 添加底部
	  }

  /**
   * 表格中显示数据，并设置类名
   */
	  function showCalendarData() {
	    var _year = dateObj.getDate().getFullYear();
	    var _month = dateObj.getDate().getMonth() + 1;
	    var _dateStr = getDateStr(dateObj.getDate());
	  
	    // 设置顶部标题栏中的 年、月信息
	    var calendarTitle = document.getElementById("calendarTitle");
	    var titleStr = _dateStr.substr(0, 4) + "年" + _dateStr.substr(4,2) + "月";
	    calendarTitle.innerText = titleStr;
	    
	    var footdate =  document.getElementsByClassName("footdate")[0];
	    var footbtn =  document.getElementsByClassName("footbtn")[0];
	
	    // 设置表格中的日期数据
	    var _table = document.getElementById("calendarTable");
	    var _tds = _table.getElementsByTagName("td");
	    var _firstDay = new Date(_year, _month - 1, 1);  // 当前月第一天
	    
	    var prevMonth = document.getElementById("prevMonth");
	    var nextMonth = document.getElementById("nextMonth");
	    
	    var begin_time = new Date($scope.begin_time)
	    if(_year==begin_time.getFullYear() && (_month - 1)==begin_time.getMonth()){
	    	prevMonth.className = "prev-month color";
	    }else{
	    	prevMonth.className = "prev-month";
	    }
	    
	     var end_time = new Date($scope.end_time)
	    if(_year==end_time.getFullYear() && (_month - 1)==end_time.getMonth()){
	    	nextMonth.className = "next-month color";
	    }else{
	    	nextMonth.className = "next-month";
	    }
	    
	   var timeBox =[];
	   // 获取有效时间
	  var dateInfor = {
	  	'date':_dateStr.substr(0, 4) + _dateStr.substr(4,2),
	  	"league":$scope.leagueId
	  }
	  Wode.sch_getMatchDate(dateInfor).then(function(datatime){
	  	if(datatime.code == 0 ){
	  		$scope.timeData = datatime.data.MatchDateList;
	  		$scope.latestMatchDate = datatime.data.latestMatchDate;
	  		for(var k=0;k<$scope.timeData.length;k++){
	      	var dataTime = new Date($scope.timeData[k]);
	      	var datatday = getDateStr(dataTime);
	      	timeBox.push(datatday);
	      }
	  		var latedataTime = new Date($scope.latestMatchDate);
	      	var latedatatday = getDateStr(latedataTime);
	  		_dayaddClass(latedatatday);
	  		return false;
	  	}
	  })
        function _dayaddClass(latedatatday) {
        	for(var i = 0; i < _tds.length; i++) {
		      var _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
		      var _thisDayStr = getDateStr(_thisDay);
		      var _thisData = _thisDayStr.substr(0, 4)+","+_thisDayStr.substr(4, 2)+","+_thisDayStr.substr(6, 2)
		      if(_firstDay.getMonth() == _thisDay.getMonth()){
		      	_tds[i].innerText = _thisDay.getDate();
		      }else{
		      	 _tds[i].innerText = '';
		      }
		      _tds[i].setAttribute('data', _thisData);
		      
		      if(_tds[i].innerHTML != '') {    // 其他月
				       _tds[i].className = 'otherMonth';
				}else{
					_tds[i].className = '';
				}
	         if(timeBox.length>0){
	         	for(var ii=0;ii<timeBox.length;ii++){
		         		if(_thisDayStr.substr(0, 8) == timeBox[ii]) {
		         			_tds[i].className = 'currentMonth';  // 有效
					        if(ii == 0 && _thisDayStr.substr(0,6) != latedatatday.substr(0,6)){
		         				 _tds[i].className = 'currentMonth currentDay';
		         				 var time = timejr(_tds[i].getAttribute('data'))
		         				 var date = new Date(time);
				  	             getSameDate(date.getTime(),$scope.leagueId)
		         			}else if(timeBox[ii] == latedatatday){
					        	 var trueclass = document.getElementsByClassName("currentMonth");
					        	 for(var k=0;k<trueclass.length;k++){
					        	 	trueclass[k].className = "currentMonth"
					        	 }
		         				_tds[i].className = 'currentMonth currentDay';
		         				 var time = timejr(_tds[i].getAttribute('data'))
		         				 var date = new Date(time);
				  	             getSameDate(date.getTime(),$scope.leagueId)
		         			}
		         		}
			        }
	         	}else{
	         		$scope.temalist = '';
					$scope.tongzhi = "今天暂无比赛";
	         	}
		    }
        }
	  }

  /**
   * 绑定上个月下个月事件
   */
	  function bindEvent() {
	    var prevMonth = document.getElementById("prevMonth");
	    var nextMonth = document.getElementById("nextMonth");
	    var footdate =  document.getElementsByClassName("footdate")[0];
	    var footbtn = document.getElementsByClassName("footbtn")[0];
	    addEvent(prevMonth, 'click', toPrevMonth);
	    addEvent(nextMonth, 'click', toNextMonth);
	    
    /**
     * 点击日期事件
     */
	    var table = document.getElementById("calendarTable");
		var tds = table.getElementsByTagName('td');
		
		for(var i = 0; i < tds.length; i++) {
			tds[i].index = i;
			 tds[i].onclick= function(e){
			 	if(this.className == "" || this.className == "otherMonth")return false;
//			  	console.log(this.getAttribute('data'))
               var trueclass = document.getElementsByClassName("currentMonth");
               var time = timejr(this.getAttribute('data'));
			  	var date = new Date(time);
			  	getSameDate(date.getTime(),$scope.leagueId)
			  	var _thisDayStr = this.getAttribute('data').replace(/,/g,'');
			  	for(var j=0;j<trueclass.length; j++){
			  			trueclass[j].className = 'currentMonth'
			  	}
			  	this.className = "currentMonth currentDay";
			  }
		}	
		
		// 竞赛提醒
//		footbtn.onclick = function(){
//			console.log(11)
//			console.log(this.getAttribute('data'));
//			$scope.toastDark("我们将在比赛日中午12:00给您发送提醒通知，请您留意微信通知")
//		}
				
	  }
	  
	  	// 点击球队logo
	$scope.teamBtn = function(id){
		getTeamPalyers(id);
	}

  /**
   * 绑定事件
   */
	  function addEvent(dom, eType, func) {
	    if(dom.addEventListener) {  // DOM 2.0
	      dom.addEventListener(eType, function(e){
	        func(e);
	      });
	    } else if(dom.attachEvent){  // IE5+
	      dom.attachEvent('on' + eType, function(e){
	        func(e);
	      });
	    } else {  // DOM 0
	      dom['on' + eType] = function(e) {
	        func(e);
	      }
	    }
	  }

  /**
   * 点击上个月图标触发
   */
	  function toPrevMonth() {
	    var date = dateObj.getDate();
	    var begin_time = new Date($scope.begin_time)
	    if(date.getFullYear()==begin_time.getFullYear() && date.getMonth()==begin_time.getMonth())return false;
	    dateObj.setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
	    showCalendarData();
	  }

  /**
   * 点击下个月图标触发
   */
		  function toNextMonth() {
		    var date = dateObj.getDate();
		    var end_time = new Date($scope.end_time)
	       if(date.getFullYear()==end_time.getFullYear() && date.getMonth()==end_time.getMonth())
	       return false;
		    dateObj.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
		    showCalendarData();
		  }
		  
  /**
   * 获取某天的比赛信息
   */
		function getSameDate(matchDate,league){
			$ionicScrollDelegate.$getByHandle('sch_small').scrollTop(true);
			var data={
				matchDate:matchDate,
				league:league
			}
			Wode.sch_getMatchInfo(data).then(function(reselt){
				if(reselt.code == 0 && reselt.data.matchInfo.length>0){
					$scope.tongzhi = "";
					$scope.temalist = reselt.data.matchInfo;
				}else{
					$scope.temalist = '';
					$scope.tongzhi = "今天暂无比赛";
				}
			})
		}	  

  /**
   * 日期转化为字符串， 4位年+2位月+2位日
   */
		 function getDateStr(date) {
			    var _year = date.getFullYear();
			    var _month = date.getMonth() + 1;    // 月从0开始计数
			    var _d = date.getDate();
			    
			    _month = (_month > 9) ? ("" + _month) : ("0" + _month);
			    _d = (_d > 9) ? ("" + _d) : ("0" + _d);
			    return _year + _month + _d;
			  }
	    }
	    
  /**
   * 获取某个球队球员信息
   */
      function getTeamPalyers(id){
	        var listdata={
		      		teamId:id,
		      		league:$scope.leagueId,
		      	}
	      	$ionicLoading.show()
	      	Wode.sch_teamAllPlayer(listdata).then(function(data){
	      		if(data.code == 0){
	      			sessionStorage.setItem("teamPlayersinfor",JSON.stringify(data))
	      			$location.path("/tab/wode/schedule/players/"+id+"/"+$scope.leagueId)
	      		}
	      		$timeout(function(){$ionicLoading.hide()},500)
	      	},function(){
	      		$ionicLoading.hide()
	      	})
		}
			 
	    function timejr(time){
	      time = time.replace(/\,/g, "/");
	    	return time
	    }
	}
	ctrl.$inject = ["$scope", "$ionicPopup", "$ionicScrollDelegate","$location", "$ionicLoading", "$timeout", "$rootScope","$ionicModal","Wode", "Hall"];
		app.registerController("scheduleCtrl",ctrl);//return ctrl;
})