function factoryMain($http, $timeout, $ionicLoading, $q, addressV2) {
	var $url, $data;

	function postData($url, $data) { //post请求的方法    $url请求路径  $data请求数据
		var datas = $q.defer();
		$http({
				url: $url,
				method: 'POST',
				data: $data
			}).success(function(data, status, headers, config) {
				//					hideError();
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
		//赛前赛后
		matchGather: function(page) {
			$url = addressV2 + "game/matchCmdAndSum";
			return postData($url);
		},
		//分享后经验成长
		shareExp: function(page) {
			$url = addressV2 + "share/addExp";
			return postData($url);
		},
		// 14.1 获取用户消息
		msgList: function() {
			$url = addressV2 + "msg/list";
			return postData($url);
		},
		// 14.2.更新消息状态
		msgUpdateStatus: function(data) {
			$url = addressV2 + "msg/updateStatus";
			$data = data;
			return postData($url, $data);
		},
		// 是否领取星钻
		activityJoind: function(data) {
			$url = addressV2 + "activity/joind/" + data;
			$data = data;
			return postData($url, $data);
		},
	};
}
factoryMain.$inject = ["$http", '$timeout', '$ionicLoading', '$q', 'addressV2'];