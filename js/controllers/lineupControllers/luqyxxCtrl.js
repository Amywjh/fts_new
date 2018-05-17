//球星对战投票
define(["app"],function(app){
	"use strict";
	function ctrl($scope, $stateParams, $rootScope, $location, $ionicHistory, $timeout, $ionicLoading, LineUp, Thr) {
		$scope.home_title="球员详情";$scope.help_title="表现值计算";
		$scope.showRule = function(){//说明弹窗
			$scope.showRules("player");
		}
		TALKWATCH("球员详情")
			// 图表
	      Highcharts.theme = {
	        chart: {
	        	backgroundColor: "none",//图表背景
	            type: 'line',//图表类型
	            className:"playerD",//该图表的自定义类名
	            width:document.documentElement.clientWidth-40,//图表的宽度
	            height:2.8*document.documentElement.clientHeight/6.67,//图表的高度
	            spacingBottom: 10,//图表底部边缘与内容的内部边距
				spacingLeft: 0,
				spacingRight: 0,
				spacingTop:0,
	            marginTop:30,
	        },
	        labels: {
	        	useHTML:true,
			    style: {                         // 标签全局样式
			        "color": "rgb(133,142,160)",
			        "font-size": '0.1rem',
			        fontWeight: 'normal',
			        fontFamily: '',
			        overflow:"visible"
			    }
			 },
	        title: {
	            text: ''
	        },
	        xAxis: {
	        	title:{
	        		text:"场次",
	        		align: 'high',
	                style:{
	                	"font-size":"0.1rem",
	                	"line-height":"1em",
	                	"color":"#858ea0",
	                	"font-weight":"normal",
	                }
	        	},
	        	gridLineColor:'#28313C',
	        	gridLineWidth:1,
				tickWidth:0,
				//tickAmount:5,
				categories: [],
	            lineWidth: 0,
	            labels: {
			         style: {
			            fontSize: '0.1rem',
			            color:"rgb(133,142,160)",
			         }
				  }
	        },
	        yAxis: {
	            tickInterval: 5,//刻度单元
	            max:50,//最大刻度
	            min:-10,//最小刻度
	            allowDecimals:true,
	            gridLineColor:'#28313C',
	            gridLineWidth:1,
	            alternateGridColor:"#313A46",
	            title: {
	                align: 'high',
	                offset: 0,
	                text: '表现值',
	                rotation: 0,
	                y: -20,
	                style:{
	                	"font-size":"0.1rem",
	                	"color":"#858ea0",
	                	"font-weight":"normal",
	                }
	            },
	            labels: {
	             	y:5,
			        style: {
			            fontSize: '0.1rem',
			            color:"rgb(133,142,160)",
			        }
				}
	        },
	        legend: {   //图例
	        	enabled: false,  //是否显示
	        },
	        plotOptions: {
        	  	series: {           // 针对所有数据列有效的配置
				    lineWidth: 2,
				    enableMouseTracking: true,
			  	},
	            line: {
	                dataLabels: {
	                    enabled: false,          // 开启数据标签
	                },
	        		enableMouseTracking: false, // 关闭鼠标跟踪，对应的提示框、点击事件会失效
	    		},
//		        events: {
//	                click: function (event) {
//	                }
//	            }
	        },
		    tooltip: {
		    	useHTML:true,
		    	backgroundColor:"none",
	            borderColor: 'null',         // 边框颜色
	            borderWidth: 0,               // 边框宽度
	            positioner: function (labelWidth,labelHeight,point) {
	                return { x:point.plotX+8,y:20};//point.plotY 
	            },
	            shadow: false,                 // 是否显示阴影
	            animation: true,              // 是否启用动画效果
	            style:{                      // 文字内容相关样式
	                color: "#34ed41",
	                padding:0,
	            },
				headerFormat: '',
	            pointFormat: '<span style="color:{series.color}"></span>{point.y}<br/>',//{series.name}:
//	            footerFormat: '</table>',
				crosshairs: [{            // 设置准星线样式
				    width: 1,
				    color: '#34ed41',
				    dashStyle: 'ShortDot',
				}],
				shared: true,
	        },
	        series: [{
				       data: [],name:"",color:['#34ed41']
				    }]
	      };
//	      Highcharts.setOptions(Highcharts.theme);
      	$scope.qyxxChartConfig = Highcharts.theme;
		$('#chart1').highcharts($scope.qyxxChartConfig);  
		function getDatasAll(ids){
			var playerData = sessionStorage.getItem("playerData");
			if (playerData) {
				$scope.playerDetial = JSON.parse(playerData).data;
				$scope.playerDetial = getDatas($scope.playerDetial,ids).playerDetial;
	
			} else {
				Thr.playerDetial($stateParams.quId).then(function(data) {
					if (data.code == 0){
						sessionStorage.setItem("playerData", JSON.stringify(data));
						$scope.playerDetial = data.data;
						$scope.playerDetial = getDatas($scope.playerDetial,ids).playerDetial;
					} else {
						$ionicLoading.hide();
					}
				}, function(error) {
	
				})
			}
		}
		function getDatas(playerDetial,ids) { //重组球员数据的函数
			radialIndicator.defaults.radius = 70;
			radialIndicator.defaults.barColor = "#34ed41";      
			radialIndicator.defaults.barBgColor = "#1e2631";      
			radialIndicator.defaults.barWidth = 6;      
			radialIndicator.defaults.minValue = 0;  
			radialIndicator.defaults.initValue = 0;
			radialIndicator.defaults.displayNumber = false;      
			radialIndicator('#indicatorExp', {//近期战力
				maxValue: 200,
			}).animate(10*Math.ceil($scope.playerDetial.recentExp)); //目前值*10
			radialIndicator('#indicatorCount', {//首发情况
				maxValue: $scope.playerDetial.teamMatchCount?$scope.playerDetial.teamMatchCount:Infinity,
			}).animate($scope.playerDetial.firstCount); //目前值
	//		
			radialIndicator('#indicatorAvg', {//场均时间
				maxValue: 90,
			}).animate($scope.playerDetial.avgPlayTime); //目前值
			
			
			var chartData = getChartData($scope.playerDetial.recentExpList);
			if(!chartData){
				$('#chart1').css({display:"none"});
				$("#chart1").parent(".playerStatus").css({display:"none"});
			}else{
				$("#chart1").parent(".playerStatus").css({display:"block"});
				$('#chart1').css({display:"block"});
				$scope.qyxxChartConfig.series[0].data = chartData.series;
				$scope.qyxxChartConfig.series[0].name = $scope.playerDetial.info.name;
				$scope.qyxxChartConfig.xAxis.categories = chartData.xAxis;
				$('#chart1').highcharts($scope.qyxxChartConfig);  
			}
			
			lineup_qudh(playerDetial.info.shirt_num, playerDetial.info);
			angular.forEach(playerDetial.recent, function(datas, index, array){
				var timeArr = getData(datas.startTime);
				playerDetial.recent[index].startMonth = timeArr.month;
				playerDetial.recent[index].startDay = timeArr.day;
				playerDetial.recent[index].fight = datas.homeName + "vs" + datas.awayName;//这个暂时弃用
				if(datas['expression']==0 && datas['dimensions']["上场时间"]==0){//如果经验值和上场时间为0，其他参数显示-
					angular.forEach(datas['dimensions'], function(d, i, arr) {
						if(i!="上场时间"){
							datas['dimensions'][i]="-";
						}
					})
				}
			})
			if(sessionStorage.getItem("playerStatus")){
				playerDetial.status = JSON.parse(sessionStorage.getItem("playerStatus"));
			}
			
			if(ids=="prizes"){
				playerDetial.hot = "-";
			}
			return {
				'playerDetial': playerDetial
			};
		}
		function getData(data){
			var pos = data.indexOf("-");
			var month = data.substring(0,pos);
			var day = data.substring(pos+1);
			return {"month":month,"day":day}
		}
		if ($stateParams.ids == "second" || $stateParams.ids == "prizes" ) {
			getDatasAll($stateParams.ids)
		}
		
		$scope.changeRecent = function(checked){//比赛数据按钮事件
			$ionicLoading.show();
			if(checked){
				$scope.recentAll = angular.copy($scope.playerDetial.recent);
				Thr.playerDetial($stateParams.quId,checked).then(function(data) {
					if (data.code == 0){
						$scope.playerDetial.recent = data.data.recent;
						angular.forEach($scope.playerDetial.recent, function(datas, index, array){
							var timeArr = getData(datas.startTime);
							$scope.playerDetial.recent[index].startMonth = timeArr.month;
							$scope.playerDetial.recent[index].startDay = timeArr.day;
							if(datas['expression']==0 && datas['dimensions']["上场时间"]==0){//如果经验值和上场时间为0，其他参数显示-
								angular.forEach(datas['dimensions'], function(d, i, arr) {
									if(i!="上场时间"){
										datas['dimensions'][i]="-";
									}
								})
							}
						})
						$ionicLoading.hide();
					} else {
						$ionicLoading.hide();
					}
				})
			}else{
				$scope.playerDetial.recent = $scope.recentAll;
				$ionicLoading.hide();
			}
		}
		
		$scope.changeStatus = function(player){
			if(player.status.disable){//替换
				player.status.change = "replace";
			}else{//添加或者删除
				player.status.change = "change";
				player.detial.checked = !player.detial.checked;
			}
			sessionStorage.setItem("playerStatus",JSON.stringify(player));
			history.go(-1);
		}
		
		$scope.whatRecentExp = function(){
			var msg = "";
			msg +="<div class='a-font-size-small a-text-color-whit'>";
			msg +="<span class='a-text-color-light a-font-size-small'>近期战力</span>根据球员近期场上的表现情况进行评分（未上场也计算在内），分值越高，说明球员近期表现越好，下一场获得最高值的可能性越大。";
			msg +="</div>";
			$scope.alertShut(msg);
		}
		$scope.onDragUp = function($event){
			$(".quyy_scroll").attr("direction","y")
			$(".quyy_scroll").addClass("scroll-y")
		}
		
	}
	ctrl.$inject = ["$scope", "$stateParams", "$rootScope", "$location", "$ionicHistory", "$timeout", "$ionicLoading", "LineUp", "Thr"];
		app.registerController("luqyxxCtrl",ctrl);//return ctrl;
})