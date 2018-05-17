define(["app"],function(app){
	"use strict";

	function ctrl($scope, $stateParams, $rootScope, $location,  $ionicLoading,RTAll) {
		function dealData(data){
	      	if(data.timeLine && data.timeLine.length){
				for(var i=0;i<data.timeLine.length;i++){
					switch(data.timeLine[i].eventType){
						case "GOAL":
							var _eventTypeLogo = "../../img2.0/battle/sk_zysj_2.png";
						break;
						case "OWN_GOAL":
							var _eventTypeLogo = "../../img2.0/battle/sk_zysj_8.png";
						break;
						case "YELLOWCARD":
							var _eventTypeLogo = "../../img2.0/battle/sk_zysj_6.png";
						break;
						case "REDCARD":
							var _eventTypeLogo = "../../img2.0/battle/sk_zysj_7.png";
						break;
						case "SECONDYELLOW":
							var _eventTypeLogo = "../../img2.0/battle/sk_zysj_9.png";
						break;
						case "SUBSTITUTION":
							var _eventTypeLogo = "../../img2.0/battle/sk_zysj_4.png";
						break;
					}
					if(_eventTypeLogo) data.timeLine[i].eventTypeLogo = _eventTypeLogo;
					if(data.timeLine[i].relationPlayerName && data.timeLine[i].relationPlayerName!=''){
  						switch(data.timeLine[i].eventType){
  							case "GOAL":
  								var relationLogo = "../../img2.0/battle/sk_zysj_3.png";
  							break;
  							case "SUBSTITUTION":
  								var relationLogo = "../../img2.0/battle/sk_zysj_5.png";
  							break;
  						}
						if(relationLogo) data.timeLine[i].relationLogo = relationLogo;
					}
				}
			}
	      	return data;
		}
		
		$scope.getLive = function(){
        	$scope.connectLive(0,$stateParams.roomId,"",$scope.getEventMsg);//实时结果 拉取   	
        }
      	$scope.getEventMsg = function(data){
      		if(!$scope.eventData) $ionicLoading.show();
      		var matchId = Number($stateParams.matchId);
      		RTAll.matchEvent(matchId).then(function(eventData){
      			if(!eventData.code){
      				$scope.eventData = dealData(eventData.data);
      				sessionStorage.removeItem("eventData");
      				$ionicLoading.hide();
      			}
      		})
      	}
      	$scope.$on("$ionicView.afterEnter",function(){
      		var _eventData = sessionStorage.getItem("eventData");//缓存数组
      		if(_eventData){
      			_eventData = JSON.parse(_eventData);
      			if(_eventData.match.id==$stateParams.matchId){
      				$scope.eventData = dealData(_eventData);
      			}
      		}
      		if($stateParams.statusId==1){//进行中
      			$scope.getLive();
      		}else{//已结束
      			$scope.getEventMsg();
      		}
      	})
		
		
		          /**
     *初始化时间轴参数
     * */
    $scope.timeLineHeight = 100; //可根据实际需求调整
    $scope.factLineHeight = 100; //数据高度
    var obj = document.getElementById("teamContent");
    var contentHeight = obj.clientHeight;
    var contentWidth = obj.clientWidth;
    var num = parseInt(contentHeight/$scope.timeLineHeight) - 1 ;
    $scope.innerContentWidth = contentWidth/2 - 35 - 10 ;
    $scope.innerContentHeight = $scope.timeLineHeight - 20 - 21 - 10;
    /**
     * lineTime样式
     * */
    $scope.lineTime = function(b){
      var str = {
        "height":".1rem",
        "width":".1rem",
        "border-radius":".05rem"
      };
      if(b) {
        str = {
          "height": ".3rem",
          "width": ".3rem",
          "top":".1rem",
          "border-radius": ".15rem"
        }
      }
      return str;
    };	

	}
	ctrl.$inject = ["$scope", "$stateParams", "$rootScope", "$location", "$ionicLoading","RTAll"];
	app.registerController("BattletimeAxisCtrl",ctrl);//return ctrl;
})
