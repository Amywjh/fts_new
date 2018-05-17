function factoryPrizes($http, $timeout, $ionicLoading, $q, addressV2) {
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

	function getData($url, $data) {
		var datas = $q.defer();
		$http({
			url: $url,
			method: 'GET',
			params: $data,
			timeout: 5000
		}).success(function(data, status, headers, config) {
			datas.resolve(data);
		}).error(function(error) {
			datas.reject();
			$ionicLoading.hide();
			//调取断网页面
			$("#online").css("display", "block");
		})
		$timeout(function() {
			datas.reject();
		}, 5000)
		return datas.promise;
	}
	return {
		//			竞猜列表
		all: function(page, recommend) { //recommend查询推荐
			$url = addressV2 + "star/roomList/" + page;
			if(recommend) $url = $url + "?recommend=" + recommend;
			return getData($url);
		},
		//			竞猜详情
		roomDetial: function(roomId) {
			$url = addressV2 + "star/room/" + roomId;
			return getData($url);
		},
		//			投票
		vote: function(roomId, isHome, money) {
			$url = addressV2 + "star/join/" + roomId + "/" + isHome + "/" + money;
			return postData($url);
		},
		//			竞猜赛况列表
		matchList: function(playId, matchId, status, page, userId) { //玩法id，联赛id，房间状态，页码
			$url = addressV2 + "situation/list/" + playId + "/" + status + "/" + page;
			$data = {
				userId: userId
			}
			return getData($url, $data);
		},
		//比赛结果
		matchResult: function(roomId) { //玩法id，联赛id，房间状态，页码
			$url = addressV2 + "star/room/result/" + roomId;
			return getData($url);
		},
		//球员数据
		playerData: function(roomId) { //玩法id，联赛id，房间状态，页码
			$url = addressV2 + "star/room/data/" + roomId;
			return getData($url);
		},
	};
}
factoryPrizes.$inject = ["$http", '$timeout', '$ionicLoading', '$q', 'addressV2'];