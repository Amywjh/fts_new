//我的商城控制器
define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$stateParams,$ionicModal,$location,$ionicLoading,$ionicHistory,$ionicScrollDelegate,$timeout,ShopUrl) {
	  	$scope.moreRecordStop = true;
	  	$scope.recordTypes = [
	  		{name:"红包",id:1,page:1,activated:false},{name:"星钻",id:2,page:1,activated:false}
	  	]
	  	function activedRecord(recordItem){
	  		var recordId = recordItem.id;
	  		for(var i=0;i<$scope.recordTypes.length;i++){
	  			$scope.recordTypes[i].activated = false;
	  			$scope.recordTypes[i].page = 1;
	  			if($scope.recordTypes[i].id==recordId){
	  				$scope.recordTypeIndex = i;//选中的兑换tab及相应的slide
	  				$scope.recordTypes[i].activated = true;
	  			}
	  		}
	  		$scope.page = recordItem.page;
	  		getRecordParent(recordId,$scope.page,$scope.recordTypeIndex);//获取数据
	  	}
	  	$scope.recordTab = function(recordItem){
	  		$ionicLoading.show();
	  		$ionicScrollDelegate.$getByHandle("recordCon").scrollTop(true);
	  		activedRecord(recordItem);
	  	}
	  	$scope.recordTab($scope.recordTypes[0]);
	  	function getRecordParent(recordId,page,recordTypeIndex){
	  		console.log(recordId,page,recordTypeIndex)
	  		switch(recordId){
	  			case 1:
	  				saleWalletList(page,recordTypeIndex);
	  			break;
	  			case 2:
	  				coinChangeList(page,recordTypeIndex);
	  			break;
	  		}
	  	}
	   	$scope.loadMore = function(recordItem){
	   		console.log(recordItem);
	        //这里使用定时器是为了缓存一下加载过程，防止加载过快
			$timeout(function() {
			 	if($scope.moreRecordStop){
				   	$scope.$broadcast('scroll.infiniteScrollComplete');
				 	return;
			 	}
				 recordItem.page++;
				 getRecordParent(recordItem.id,recordItem.page,(recordItem.id-1));
//				 saleWalletList($scope.curPage);
				 $scope.$broadcast('scroll.infiniteScrollComplete');
			},500);
	  	};
	  	$scope.$on('stateChangeSuccess', function() {
	     	$scope.loadMore();
	  	});
	  	function saleWalletList(page,recordTypeIndex){
		  	$scope.moreRecordStop = true;
		  	page = page?page:1;
		  	 ShopUrl.saleWalletList(page).then(function(data){
	    		$timeout(function(){
  					$ionicLoading.hide();
  				},500)
		    	if(data.code == 0){
		    		if(data.data.length == 0 && page == 1){
		    			$scope.msgCash = true;
		    			return false;
		    		}
		    		$scope.msgCash = false;
		    		if(!$scope.saleWallets){
		    			$scope.saleWallets = [];
		    		}
		    		data.data.forEach(function(value, index, array) {
		    			var times = gettimeform(value.createTime);
			            value.years = times.years;
			            value.month = times.month +'-'+times.dates;
			            value.hours = times.hours + ":" + times.minutes;
		        	});
		        	if(data.pageNo==1){
		  					$scope.saleWallets = data.data;
		  			}else if(data.pageNo>1){
	  					if($scope.saleWallets){
	  						var lists = $scope.saleWallets;
							$scope.saleWallets = new Array().concat(lists,data.data);
	  					}else{
	  						$scope.saleWallets = data.data;
	  					}
	  				}
	  				$scope.recordTypes[recordTypeIndex].page = data.pageNo;
	  				$timeout(function(){
	  					$ionicLoading.hide();
	  				},500)
		        	if(data.pageNo<data.totalPageCount){
		  				$scope.moreRecordStop = false;
		  			}
		    	}else{
		    		$scope.msgCash = true;
		    	}
		    })
		  }
		  function coinChangeList(page,recordTypeIndex){
		  	$scope.moreRecordStop = true;
		  	ShopUrl.coinChage(page).then(function(data){
		  		if(!data.code){
		  			if(data.data.length){
		  				$scope.msgJewel = false;
			  			data.data.forEach(function(value, index, array){//切换日期
			    			var times = gettimeform(value.create_time);
				            value.years = times.years;
				            value.month = times.month +'-'+times.dates;
				            value.hours = times.hours + ":" + times.minutes;
			        	});
		  				if(data.pageNo==1){
		  					$scope.coinChange = data.data;
		  				}else if(data.pageNo>1){
		  					if($scope.coinChange){
		  						var lists = $scope.coinChange;
								$scope.coinChange = new Array().concat(lists,data.data);
		  					}else{
		  						$scope.coinChange = data.data;
		  					}
		  				}
		  				$scope.recordTypes[recordTypeIndex].page = data.pageNo;
		  				$timeout(function(){
		  					$ionicLoading.hide();
		  				},500)
		  			}else{
		  				$scope.msgJewel = true;
		  				$scope.coinChange = false;
		  				$timeout(function(){
		  					$ionicLoading.hide();
		  				},500)
		  			}
		  			if(data.pageNo<data.totalPageCount){
		  				$scope.moreRecordStop = false;
		  			}
		  		}else{
		  			$scope.msgJewel = true;
		  			$scope.coinChange = false;
	  				$timeout(function(){
	  					$ionicLoading.hide();
	  				},500)
		  		}
		  	})
		  	
		  }
		   $scope.exError = function(index,state,resultMsg){
			if(state == 2){
				  $scope.alert("兑换失败",'很抱歉兑换失败!星币已返回至您的账户内,请确保自己的银行卡信息正确,并重新兑换')
			  }else if(resultMsg){
			  	$scope.alert(resultMsg)
			  }else{
			  	$scope.alert("红包兑换失败，星币已返还，请重新兑换")
			  }
		}
	}
	ctrl.$inject = ["$scope","$stateParams",'$ionicModal',"$location","$ionicLoading","$ionicHistory","$ionicScrollDelegate","$timeout",'ShopUrl'];
	app.registerController("shopRecordCtrl", ctrl); //return ctrl;
})