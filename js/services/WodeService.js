function factoryWode($http, $q, addressV2, $ionicLoading, $timeout) {
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
		//			我的首页
		all: function() {
			$url = addressV2 + "mine/selfInfo";
			//				$url =  "/app/mine/selfInfo";
			var wodeall = $q.defer();
			$http({
				url: $url,
				method: 'POST',
			}).success(function(data, status, headers, config) {
				//					hideError();
				wodeall.resolve(data);
			}).error(function(error) {
				$ionicLoading.hide()
				//调取断网页面
				$("#online").css("display", "block");
			})
			return wodeall.promise;
		},
		//天梯
		wode_cj: function(token) {
			$url = addressV2 + "mine/achievement";
			var wodecj = $q.defer();
			$http({
				url: $url,
				method: "POST",
			}).success(function(data, status, headers, config) {
				wodecj.resolve(data)
			}).error(function(data) {
				$ionicLoading.hide()
				//调取断网页面
				$("#online").css("display", "block");
			})
			return wodecj.promise;
		},
		//星币兑换星钻接口
		wode_xingbi: function(data) {
			$url = addressV2 + "trade/coin2diamond/" + data;
			return postData($url);
		},
		charge_record: function(data) {
			$url = addressV2 + "charge/wechat/history/" + data;
			return postData($url);
		},
		//赛程获取联赛列表
		sch_leagueList: function(data) {
			$url = addressV2 + "game/leagueList";
			return postData($url);
		},
		// 获得比赛信息
		sch_getMatchInfo: function(data) {
			$url = addressV2 + "game/getMatchInfo";
			return postData($url, data);
		},
		// 获得球队球员
		sch_teamAllPlayer: function(data) {
			$url = addressV2 + "game/teamAllPlayer";
			return postData($url, data);
		},
		// 获得某月的有效天数
		sch_getMatchDate: function(data) {
			$url = addressV2 + "game/getMatchDate";
			return postData($url, data);
		},
		// 修改用户头像
		headImg: function(filesData) {
			$url = addressV2 + "user/update/profile";
			var datas = $q.defer();
			$http({
				url: $url,
				method: 'POST',
				headers: {
					'Content-Type': undefined
				},
				transformRequest: function() {
					var formData = new FormData();
					//              		var files = $("#capture")[0].files[0];
					var files = filesData;
					formData.append('file', files);
					return formData;
				},
			}).success(function(data, status, headers, config) {
				//					hideError();
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
		// 修改用户姓名
		headName: function(data) {
			$url = addressV2 + "user/update";
			return postData($url, data);
		},
		// 其他玩家查修
		headSummary: function(usedId) {
			$url = addressV2 + "user/summary/" + usedId;
			return postData($url);
		},
	};
}
factoryWode.$inject = ["$http", "$q", "addressV2", "$ionicLoading", "$timeout"];