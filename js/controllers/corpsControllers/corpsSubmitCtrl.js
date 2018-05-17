define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$rootScope,$ionicModal, $location,$ionicLoading,$timeout,$stateParams,$cacheFactory, Corps) {
		$scope.$on('$ionicView.beforeEnter',function(){
			$scope.corpsCraem = {
				corpsText:$stateParams.isText,
				corpsName:$stateParams.isName,
				corpsLogo:$stateParams.isLogo,
				corpsTeamid:$stateParams.id,
				corpsJoin:$stateParams.isJoin,
			}
			$scope.joinType = [
			   {'text':'不审核直接加入','type':1},
			   {'text':'队长审核加入','type':0},
			]
			$scope.isJoin = {
				type:$scope.corpsCraem.corpsJoin,
			}
		})
		
		
		$scope.submitBtn = function(text){
			if(!text){
				$scope.toastDark('口号不能为空！','',true);
				return false;
			}
			$ionicLoading.show();
			var obj = {
				type:'0,1',
				fightTeamId:$scope.corpsCraem.corpsTeamid,
				slogan:text,
				fightTeamJoinType:$scope.isJoin.type
			}
			Corps.updateSlogan(obj).then(function(data){
				if(!data.code){
					$ionicLoading.hide();
					$scope.toastDark('修改成功！','',true)
					$timeout(function(){
						history.replaceState({},"","#/tab/main");
						history.pushState({},"","#/tab/main/corps/user/"+$stateParams.id);
					},600);
					return false;
				}else if(data.code == 200115 || data.code == 200116 || data.code == 200117){
					$ionicLoading.hide();
					$scope.toastDark('不能含有敏感词"'+data.data+'"','',true);
					return false;
				}
				$ionicLoading.hide();
				$scope.toastDark(data.msg || '网络异常！','',true);
			})
		}
		
	}
	ctrl.$inject = ['$scope',"$rootScope",'$ionicModal','$location','$ionicLoading', '$timeout','$stateParams','$cacheFactory','Corps'];
	app.registerController("corpsSubmitCtrl",ctrl);//return ctrl;
})
