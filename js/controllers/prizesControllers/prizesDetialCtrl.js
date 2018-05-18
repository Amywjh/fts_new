//球星对战投票
define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$ionicLoading,$location,$ionicHistory,$timeout,$stateParams,Prizes,Thr) {
		$scope.showRule = function(){//规则
			$scope.showRules("prize");
		}
		if($stateParams.isMine=='false'){
			$scope.home_title="球星对战"
		}else{
			$scope.home_title="赛况"
		}
		var dealPrizeData = function(data){//竞猜详情处理
//			data = matchDeadTime([data])[0];//去掉倒计时
			lineup_qudh(data.home.shirtNum, data.home)//球衣号码
			lineup_qudh(data.away.shirtNum, data.away)//球衣号码
			var left_Start = gettimeform(data.leftMatch.start_time,data.deadTime);
			var right_Start = gettimeform(data.rightMatch.start_time,data.deadTime);
			data.leftMatch.start_timeHour = (left_Start.isNextDay?left_Start.isNextDay:'')+left_Start.hours +":"+left_Start.minutes;
			data.rightMatch.start_timeHour = (right_Start.isNextDay?right_Start.isNextDay:'')+right_Start.hours +":"+right_Start.minutes;
			return data;
		}
		//	调用服务的detial方法，获取房间详情的数据
		var prizes_detial = JSON.parse(sessionStorage.getItem('prizes_detial'));
		if(prizes_detial && prizes_detial.code==0){
			$scope.prizesDetial = dealPrizeData(prizes_detial.data);
			$scope.prize = $scope.prizesDetial;
		}else{
			Prizes.roomDetial($stateParams.prizesRoomId).then(function(data){
				if(data.code==0){
					$scope.prizesDetial = dealPrizeData(data.data);
					$scope.prize = $scope.prizesDetial;
				}else{
					$ionicLoading.hide();
				}
			},function(error){
				$ionicLoading.hide();
			})		
		}
//		var timerPrize = setInterval(function(){//倒计时的定时器//去掉倒计时
//			$scope.prizesDetial = matchDeadTime([$scope.prizesDetial])[0];
//			$scope.$apply();
//			$scope.$on("$destroy",function(){//移除modal
//				if(timerPrize) clearInterval(timerPrize);
//			})
//		},10000);
		if($ionicHistory.currentStateName()=="tab.prizes-detial") $scope.hidePrizesPre =true;//指令中百分比的显示与否
		Prizes.playerData($stateParams.prizesRoomId).then(function(data){//获取球员数据
			if(data.code==0){
				$scope.playerData = data.data;
				var powerPercent = getPercent(data.data.home.power,data.data.away.power);
				var startHomePercent = getPercent(data.data.home.startCount,0,data.data.home.teamMatchCount);
				var startAwayPercent = getPercent(data.data.away.startCount,0,data.data.away.teamMatchCount);
				var avgTimePercent = getPercent(data.data.home.avgPlayTime,data.data.away.avgPlayTime,90);
				$scope.playerData.home.powerPercent = powerPercent.dataOnePercent;//战力
				$scope.playerData.home.startCountPercent = startHomePercent.dataOnePercent;//首发次数
				$scope.playerData.home.avgTimePercent = avgTimePercent.dataOnePercent;//上场时间
				$scope.playerData.away.powerPercent = powerPercent.dataTwoPercent;//战力
				$scope.playerData.away.startCountPercent = startAwayPercent.dataOnePercent;//首发次数
				$scope.playerData.away.avgTimePercent = avgTimePercent.dataTwoPercent;//上场时间
				angular.forEach($scope.playerData,function(item,index){
					angular.forEach(item.recentMatch,function(dataItem,dataIndex){
						var timeArr = getData(dataItem.startTime);
						$scope.playerData[index].recentMatch[dataIndex].startMonth = timeArr.month;
						$scope.playerData[index].recentMatch[dataIndex].startDay = timeArr.day;
					})
				})
				var chartHome = getChartData($scope.playerData.home.recentExpression);
				var chartAway = getChartData($scope.playerData.away.recentExpression);
				if(!chartAway && !chartHome){
					$('#chart2').css({display:"none"});
				}else{
					$('#chart2').css({display:"block"});
					if(chartAway){
						$scope.detailChartConfig.series[1].data = chartAway.series;
						$scope.detailChartConfig.series[1].name = $scope.playerData.away.name;
						$scope.detailChartConfig.xAxis.categories = chartAway.xAxis.length;
					}
					if(chartHome){
						$scope.detailChartConfig.series[0].data = chartHome.series;
						$scope.detailChartConfig.series[0].name = $scope.playerData.home.name;
						$scope.detailChartConfig.xAxis.categories = chartHome.xAxis.length;
					}
					if(chartAway && chartHome){
						$scope.detailChartConfig.xAxis.categories = chartHome.xAxis.length>chartAway.xAxis.length?chartHome.xAxis.length:chartAway.xAxis.length;
					}
					$('#chart2').highcharts($scope.detailChartConfig);  
				}
			}
		})
		function getData(data){//获得月，天
			var pos = data.indexOf("-");
			var month = data.substring(0,pos);
			var day = data.substring(pos+1);
			return {"month":month,"day":day}
		}
		
		function getPercent(dataOne,dataTwo,sum){//获得百分比
			if(!sum){
				var sum = Number(dataOne) + Number(dataTwo);
				if(sum){
					var dataOnePercent = Math.round((Number(dataOne)/sum)*100) +"%";
					var dataTwoPercent = Math.round((1-Number(dataOne)/sum)*100) +"%";
				}else{
					var dataOnePercent = 0+'%';
					var dataTwoPercent = 0+'%';
				}
			}else{
				var dataOnePercent = Math.round((Number(dataOne)/sum)*100) +"%";
				var dataTwoPercent = Math.round((Number(dataTwo)/sum)*100) +"%";
			}
			return {"dataOnePercent":dataOnePercent,"dataTwoPercent":dataTwoPercent};
		}
		
		$scope.$on("$ionicView.afterEnter",function(){
			
		})
	
	//	球员详情
		$scope.playerDetialPrizes = function(playerId){
			sessionStorage.setItem("prizes_detial",JSON.stringify($scope.prizesDetial))
			$ionicLoading.show();
			$scope.playerDetial(playerId);
		}
		$scope.vote = function(rule,data,room){/*点击投票调用的方法*/	
			if(rule == true){
				if(room.homeCost){
					$scope.textmsg = "追加支持"
				}else{
					$scope.textmsg = "支持"
				}
			}else{
				if(room.awayCost){
					$scope.textmsg = "追加支持"
				}else{
					$scope.textmsg = "支持"
				}
			}
			TALKWATCH("球星对战详情"+$scope.textmsg)
			$scope.isHome = rule;//		判断是否是主场球员
			$scope.voteInfo = {
				"isHome":rule,
				"roomId":room.id,
				"isList":false,
				"dataName":"prizesDetial",
			}
			$scope.voter = data;//投票球员
			$scope.voter.expectPrize =getPreIncome(1,$scope.prizesDetial.prizePool,$scope.prizesDetial.homeTotalCost,$scope.prizesDetial.awayTotalCost,rule);
		/*剩余星钻*/
			var user = sessionStorage.getItem("user");
		 	if(user){
		 		$scope.userInfoDetial(JSON.parse(user));
		 		$scope.xz = $scope.userData.dmd;
		 		$scope.xz_f = JSON.parse(user).dmd + parseInt((JSON.parse(user).coin)/($scope.sysPar.starToJewel));
		 	}else{
		 		$scope.userInfoDetial();
		 		$timeout(function(){	 			
			 		var user = sessionStorage.getItem("user");
			 		if(user){
				 		$scope.userInfoDetial(JSON.parse(user));
				 		$scope.xz = $scope.userData.dmd;
				 		$scope.xz_f = JSON.parse(user).dmd + parseInt((JSON.parse(user).coin)/($scope.sysPar.starToJewel));
			 		}else{
			 			$scope.xz = 0;$scope.xz_f = 0;
			 		}
		 		},1000)
		 	}
	
		/*显示输入框*/
			$("#vote_num").val('1');
			var min = $("#vote_num").val();
			$('.prizes-room').find('.input_bg').css({display:"block"});
			$("#vote_num").bind('input oninput',function(event){
				getVal(event,min,99999,$scope.xz_f);
				$scope.voter.expectPrize = getPreIncome(Number(event.target.value),$scope.prizesDetial.prizePool,$scope.prizesDetial.homeTotalCost,$scope.prizesDetial.awayTotalCost,rule);
				$scope.$apply();
			})
			$scope.changeInput = function(changeId){
				var nowNum = setNum(min,99999,$scope.xz_f,changeId);//调用加减得函数
				$scope.voter.expectPrize = getPreIncome(Number(nowNum),$scope.prizesDetial.prizePool,$scope.prizesDetial.homeTotalCost,$scope.prizesDetial.awayTotalCost,rule);
			}
		}
		// 图表
		$scope.detailChartConfig = {
	        chart: {
//	        	backgroundColor: "none",
//	            type: 'line',
//	            width:document.documentElement.clientWidth-40,
//	            height:2.8*document.documentElement.clientHeight/6.67,
//	            marginLeft: 40,
//	            marginTop:20,
	        	backgroundColor: "none",//图表背景
	            type: 'line',//图表类型
	            className:"playerD",//该图表的自定义类名
	            height:2.8*document.documentElement.clientHeight/6.67,//图表的高度
	            spacingBottom: 10,//图表底部边缘与内容的内部边距
				spacingLeft: 0,
				spacingRight: 0,
				spacingTop:0,
	            marginTop:30,
	        },
	        labels: {
	        	useHTML:true,
			    style: {// 标签全局样式
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
				categories: [],
	            lineWidth: 0,
	            labels: {
	            	formatter:function(){
					    return this.value+1;
					},
	            	//rotation: 60,
//	            	y: 20, //x轴刻度往下移动20px
	            	align:"right",
			        style: {
			            fontSize: '0.1rem',
			            color:"rgb(133,142,160)",
			        }
			  	}
	        },
	        yAxis: {
	            tickInterval: 5,
	            max:50,//最大刻度
	            min:-10,//最小刻度
	            allowDecimals:true,
	            gridLineColor:'#28313C',
	            gridLineWidth:1,
	            alternateGridColor:"#313A46",
//	            tickPixelInterval:"0.24rem",
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
//			            min:1
		         	}
			  	}
	        },
	        legend: {   //图例
	        	enabled: false,  //是否显示
	//                  reversed: false
	        },
	        plotOptions: {
        	  	series: {           // 针对所有数据列有效的配置
				    lineWidth: 2,
				    enableMouseTracking: true
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
		    	enabled:true,
		    	useHTML:true,
	            backgroundColor:"none",
//	            borderRadius: 5,             // 边框圆角
	            borderWidth: 0,               // 边框宽度
	            borderColor: 'null',
	            shadow: false,                 // 是否显示阴影
	            animation: true,              // 是否启用动画效果
	            style:{                      // 文字内容相关样式
	                color: "#CCCCCC",
	            },
				headerFormat: '',
	            pointFormat: '<span style="color:{series.color}">{point.y}</span><br/>',
	            positioner: function (labelWidth,labelHeight,point) {
	                return { x:point.plotX+8,y:10};//point.plotY 
	            },
	            crosshairs: [{            // 设置准星线样式
				    width: 1,
				    color: '#34ed41',
				    dashStyle: 'ShortDot',
				}],
				shared: true,
	       	},
	        series: [{
				        data: [],name:"主队",color:['rgb(255,0,22)']
			    	}, {
				        data: [],name:"客队",color:['rgb(0,170,255)']
				    }]
	      }; 
	    TALKWATCH("球星对战未开始详情");
	}
	ctrl.$inject = ["$scope","$ionicLoading","$location","$ionicHistory","$timeout","$stateParams",'Prizes','Thr'];
		app.registerController("prizesDetialCtrl",ctrl);//return ctrl;
})