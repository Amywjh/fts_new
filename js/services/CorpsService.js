function factoryCorps($http, $q, addressV2, $ionicLoading, $timeout) {
	var $url, $data;

	function postData($url, $data) { //post请求的方法    $url请求路径  $data请求数据
		var datas = $q.defer();
		$http({
				url: $url,
				method: 'POST',
				data: $data
			}).success(function(data, status, headers, config) {
				datas.resolve(data);
			})
			.error(function(error, status, headers, config) {
				datas.reject();
				$ionicLoading.hide();
				//调取断网页面
				$("#online").css("display", "block");
			});
		$timeout(function() {
			datas.reject();
		}, 5000)
		return datas.promise;
	}
	return {
		// 战队大厅
		hall: function(data) {
			$url = addressV2 + "fightTeam/teamList";
			return postData($url, data);
		},
		// 申请加入
		corpsJoin: function(data) {
			$url = addressV2 + "fightTeam/applyJoin";
			return postData($url, data);
		},
		// 获取联赛队徽   
		corpsLogo: function(data) {
			$url = addressV2 + "fightTeam/logo/lib";
			return postData($url, data);
		},
		// 创建战队  
		create: function(data) {
			$url = addressV2 + "fightTeam/create";
			//				$url = "/app/fightTeam/create";
			return postData($url, data);
		},
		// 战队详情
		teamDetail: function(data) {
			$url = addressV2 + "fightTeam/teamDetail";
			//				$url = "/app/fightTeam/teamDetail";
			return postData($url, data);
		},
		// 战队成员列表
		userList: function(data) {
			$url = addressV2 + "fightTeam/userList";
			//				$url = "/app/fightTeam/userList";
			return postData($url, data);
		},
		//  更新战队公告
		updateMemo: function(data) {
			$url = addressV2 + "fightTeam/updateMemo";
			return postData($url, data);
		},
		// 上传队伍logo
		headImg: function(filesData) {
			$url = addressV2 + "fightTeam/update/teamlogo";
			var datas = $q.defer();
			$http({
				url: $url,
				method: 'POST',
				headers: {
					'Content-Type': undefined
				},
				transformRequest: function() {
					var formData = new FormData();
					var files = filesData;
					formData.append('file', files);
					return formData;
				},
			}).success(function(data, status, headers, config) {
				datas.resolve(data);
			}).error(function(error) {
				$ionicLoading.hide()
				//调取断网页面
				$("#online").css("display", "block");
			})
			$timeout(function() {
				datas.reject();
			}, 5000)
			return datas.promise;
		},
		// 队员申请列表  
		applyList: function(data) {
			$url = addressV2 + "fightTeam/applyList";
			return postData($url, data);
		},
		//  队长同意申请
		accessApply: function(data) {
			$url = addressV2 + "fightTeam/accessApply";
			return postData($url, data);
		},
		// 队长修改战队口号
		updateSlogan: function(data) {
			$url = addressV2 + "fightTeam/update";
			//				$url = "/app/fightTeam/update";
			return postData($url, data);
		},
		// 更换队长
		changeCaptain: function(data) {
			$url = addressV2 + "fightTeam/changeCaptain";
			return postData($url, data);
		},
		// 退出战队
		corpsQuit: function(data) {
			$url = addressV2 + "fightTeam/quitTeam";
			return postData($url, data);
		},
		// 战队申请列表小红点
		applyRedHot: function(data) {
			$url = addressV2 + "fightTeam/applyRedHot";
			return postData($url, data);
		},
		// 战队公告小红点
		fightTeamNotice: function(data) {
			$url = addressV2 + "fightTeam/fightTeamNotice";
			return postData($url, data);
		},
		// 对战踢人接口
		takeOut: function(data) {
			$url = addressV2 + "fightTeam/takeOut";
			return postData($url, data);
		},
		isSensWord: function(data) {
			$url = addressV2 + "fightTeam/chat/checkSensitive";
			return postData($url, data);
		},
		rocordToServ: function(data) {
			$url = addressV2 + "fightTeam/chat/save";
			return postData($url, data);
		},
		chatRecord: function(data) {
			$url = addressV2 + "fightTeam/chat/history";
			return postData($url, data);
		}
	};
}
factoryCorps.$inject = ["$http", "$q", "addressV2", "$ionicLoading", "$timeout"];