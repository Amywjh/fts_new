function factoryThr($http, $timeout, $ionicLoading, $q, addressV2) {
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

	function getData($url) {
		var datas = $q.defer();
		$http({
			url: $url,
			method: 'GET',
			timeout: 5000
		}).success(function(data, status, headers, config) {
			//					hideError();
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
		list: function(data) { //房间列表
			var page = data.usePage ? data.usePage : 1; //请求页码
			if(data.data) { //请求的其他参数
				var str = "?";
				for(var key in data.data) {
					str = str + key + "=" + data.data[key] + "&";
				}
				str = str.substring(0, str.length - 1);
			}
			$url = addressV2 + "3v3/list/" + page + str;
			return getData($url);
		},
		lineup: function(roomId, userId) { //显示阵容-赛况
			if(!userId) {
				userId = '';
			}
			$url = addressV2 + "3v3/lineup/" + roomId + "?userId=" + userId;
			return getData($url);

		},
		subLineup: function(roomId, playerIds) { //保存阵容的接口
			$url = addressV2 + "3v3/lineup/" + roomId;
			$data = {
				"playerIds": playerIds
			}
			return postData($url, $data);
		},
		userList: function(roomId, order) { //用户列表
			$url = addressV2 + "3v3/userList/" + roomId + "?order=" + order;
			return getData($url);

		},
		getPlayers: function(roomId, orderId) { //创建修改的球员列表
			orderId = orderId || "";
			$url = addressV2 + "3v3/players/" + roomId + "?order=" + orderId;
			return getData($url);

		},
		playerDetial: function(playerId, onMatch) { //球员详情
			if(!onMatch) {
				$url = addressV2 + "11v11/v2/playerDetail";
			} else {
				$url = addressV2 + "11v11/v2/playerInfoOnMatch";
			}
			$data = {
				"playerId": playerId
			}
			return postData($url, $data);
		},

		resultData: function(roomId) { //赛况的数据
			$url = addressV2 + "3v3/player/data/" + roomId;
			return getData($url);
		},
		//			3v3玩法列表
		thrvsthrtype: function() {
			$url = addressV2 + "category/tradition/play";
			return getData($url);

		},
		//   3v3筛选
		thrvsthrfilter: function(data) {
			$url = addressV2 + "3v3/filter";
			return getData($url);

		},
		//3v3创建房间
		thrvsthrcreatroom: function(data) {
			$url = addressV2 + "3v3/create";
			return postData($url, data);

		},
		//3v3球员列表
		playerslist: function(roomId, order) {
			$url = addressV2 + "3v3/players/" + roomId + "?order=" + order;
			return getData($url);

		},
		//加入房间 房间详情
		joinRoomShow: function(roomId) {
			$url = addressV2 + "3v3/joinRoomShow/" + roomId;
			return getData($url);

		},
		//加入房间
		joinlineup: function(roomId) {
			$url = addressV2 + "3v3/join/" + roomId;
			return postData($url);
		},
	}
}
factoryThr.$inject = ["$http", '$timeout', '$ionicLoading', '$q', 'addressV2'];