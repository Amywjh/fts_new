function factoryLineUp($http, $timeout, $ionicLoading, $q, addressV2) {
	var $data, $url;

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

		getPlayers: function(data) { //默认球员列表
			$url = addressV2 + "11v11/v2/getAllPlayer";
			return postData($url, data);

		},
		//			根据球队获得球员
		teamPlayers: function(data) {
			$url = addressV2 + "11v11/v2/getPlayer";
			//				console.log(data)
			return postData($url, data);

		},
		lossRate: function(data) {
			data = {
				"matchId": Number(data)
			}
			$url = addressV2 + "11v11/v2/oddsAndRank";
			return postData($url, data);
		},
		//			快速布阵
		quickLineup: function(data) {
			$url = addressV2 + "11v11/v2/quickLineUp";
			return postData($url, data);
		},

		//对战未开始的修改阵容服务
		battleUpdateLineup: function(data) {
			$url = addressV2 + "11v11/v2/getLineUp";
			return postData($url, data);
		},
		//			对战未开始的修改阵容的保存阵容服务
		battleLineupSave: function(data) {
			$url = addressV2 + "11v11/updateLineUp";
			return postData($url, data);
		},

	};

}
factoryLineUp.$inject = ["$http", '$timeout', '$ionicLoading', '$q', 'addressV2'];