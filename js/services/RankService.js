function factoryRank($http, $timeout, $ionicLoading, $q, addressV2) {
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
		rankCon: function(id, page) { //财富榜   couponRanking
			$url = addressV2 + "rank/v2/coinRank";
			//				$url = "/app/rank/v2/coinRank";
			$data = {
				page: page,
			}
			return postData($url, $data);
		},
		rankGrade: function(page) { //等级榜
			$url = addressV2 + "rank/v2/levelRank";
			$data = {
				page: page,
			}
			return postData($url, $data);
		},
		Rank_winning: function(page) { //胜率榜
			$url = addressV2 + "rank/v2/winRateRank";
			$data = {
				page: page,
			}
			return postData($url, $data);
		},
	};
}
factoryRank.$inject = ["$http", '$timeout', '$ionicLoading', '$q', 'addressV2'];