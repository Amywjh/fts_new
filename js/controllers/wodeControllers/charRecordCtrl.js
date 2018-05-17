
//兑换记录
define(["app"], function(app) {
	"use strict";
	function ctrl($scope, $location,Wode) {
		function getChargeRecord(page){//调取充值记录函数
			$scope.moreData = true;
			Wode.charge_record($scope.page).then(function(data){
				console.log(data)
				if(!data.code){
					if(data.totalCount===0){//如果没有记录时
						$scope.noRecord = true;return false;
					}else{//如果有记录时
						$scope.noRecord = false;
					}
					page = data.pageNo;
					angular.forEach(data.data,function(d,i){
						var pos = d.createTimeDisplay.indexOf("-");
						d.createYear = d.createTimeDisplay.substring(0,pos);
						d.createMonth = d.createTimeDisplay.substring(pos+1);
					})
					if(data.pageNo==1){
						$scope.chargeRecord = data.data;
					}else{
						$scope.chargeRecord = new Array().concat($scope.chargeRecord,data.data);
					}
					if(data.pageNo < data.totalPageCount) $scope.moreData = false;
				}
			})
		}
		$scope.page = 1;
		getChargeRecord($scope.page);//默认调用
		$scope.moreRecord = function(){//分页加载
			$scope.page+=1;
			getChargeRecord($scope.page);
		}
	}
	ctrl.$inject = ['$scope', '$location',"Wode"];
	app.registerController("charRecordCtrl",ctrl);//return ctrl;
})