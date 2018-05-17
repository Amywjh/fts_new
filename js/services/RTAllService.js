function factoryRTAll($http, $timeout, $ionicLoading, $q, addressV2) {
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
				//				$("#online").css("display", "block");
			});
		$timeout(function() {
			datas.reject();
		}, 5000)
		return datas.promise;
	}

	function getData($url) {
		var datas = $q.defer();
		$http({
			url: $url,
			method: 'GET',
			timeout: 5000
		}).success(function(data, status, headers, config) {
			datas.resolve(data);
		}).error(function(error) {
			datas.reject();
			$ionicLoading.hide();
			//调取断网页面
			//			$("#online").css("display", "block");
		})
		$timeout(function() {
			datas.reject();
		}, 5000)
		return datas.promise;
	}
	return {
		getItemUser: function() { //获取用户的聊天id
			$url = addressV2 + "im/user";
			return getData($url);
		},
		userLogin: function(playId, roomId, loginId) { //登陆登出
			/*
			 * 0传统11人    1球星竞猜          2 3V3     3匹配赛
			 * loginId 0登入   1登出
			 * */
			$url = addressV2 + "im/loginRoom/" + playId + "/" + roomId + "/" + loginId;
			return getData($url);
		},
		receipt: function(playId, roomId) { //消息回执
			$url = addressV2 + "im/receipt/" + playId + "/" + roomId;
			return getData($url);
		},
		lineupLive: function(roomId, userId) { //进行中球员数据
			$url = addressV2 + "11v11/lineup/live/" + roomId + "/" + userId;
			return getData($url);
		},
		matchEvent: function(matchId) { //获取比赛重要时间
			$url = addressV2 + "/match/timeline/" + matchId;
			return getData($url);
		},
		redDotPush: function() {
			$url = addressV2 + "im/push/1/1";
			return postData($url);
		},
		redDot: function() {
			$url = addressV2 + "game/redDot";
			return getData($url);
		},
		wxShare: function(data) {
			$url = addressV2 + "wechat/share";
			$data = {
				'url': data
			};
			return postData($url, $data);
		}
	};
}
factoryRTAll.$inject = ["$http", '$timeout', '$ionicLoading', '$q', 'addressV2'];