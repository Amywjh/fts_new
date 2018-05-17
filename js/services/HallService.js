function factoryHall($http, $timeout, $q, $ionicLoading, addressV2) { // Might use a resource here that returns a JSON array   // Some fake testing data
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
				datas.reject(error);
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
		user: function() { //用户信息服务
			var userinfo = $q.defer();
			$url = addressV2 + "wechat/weChatLogin?token=" + getParam("code"); //"abc,0,123"
			$http.post($url).success(function(data, status, headers, config) {
				userinfo.resolve(data);
			}).error(function(error, status, headers, config) {
				userinfo.reject();
			})
			return userinfo.promise;
		},
		contestType: function() { //大厅获取所有的玩法接口
			$url = addressV2 + "11v11/playType";
			return getData($url);

		},
		list: function(data) { //房间列表及所有的筛选功能调用的服务
			$url = addressV2 + "11v11/v2/roomList";
			return postData($url, data);
		},
		sub_creatroom: function(data) { //提交创建房间调用的服务
			$url = addressV2 + "11v11/create";
			return postData($url, data);

		},
		sub_joinRoom: function(data) { //加入房间调用的服务
			$url = addressV2 + "11v11/joinRoom";
			return postData($url, data);
		},
		playershow: function(roomId) {
			$url = addressV2 + "11v11/userList";
			$data = {
				"roomId": roomId
			}
			return postData($url, $data);

		},
		//模糊查询
		hallSearch: function(data) {
			$url = addressV2 + "11v11/v2/search";
			$data = data;
			return postData($url, $data);

		},
		//主页轮播图接口
		rollPic: function() {
			$url = addressV2 + "mine/rollPic";
			$data = '';
			return postData($url, $data);
		},
		//主页公告接口
		announcement: function() {
			$url = addressV2 + "mine/announcement";
			$data = '';
			return postData($url, $data);
		},
		// 10.23 大厅比赛信息
		evematchList: function(data) {
			$url = addressV2 + "11v11/v2/matchList";
			return postData($url);
		},
		// 10.19.同步阵容显示房间列表
		lineupRoomList: function(pageNo, roomId, lineupId) {
			$url = addressV2 + "11v11/lineup/sync/roomList/" + roomId + "/" + lineupId + "/" + pageNo;
			return postData($url);
		},
		// 10.21.布阵显示阵容列表
		lineuprecent: function(roomId) {
			$url = addressV2 + "11v11/lineup/recent/" + roomId;
			return postData($url);
		},
		// 10.20.同步阵容
		lineupSync: function(roomId, lineupId) {
			$url = addressV2 + "11v11/lineup/sync/" + roomId + "/" + lineupId;
			return postData($url);
		},
		// 17.1 阅读新手引导送
		newStudent: function() {
			$url = addressV2 + "activity/newStudent";
			return postData($url);
		},
		// 6.17 快速搜索
		joinRoomByRN: function(roomNum) {
			$data = {
				roomNum: roomNum
			}
			$url = addressV2 + "11v11/v2/joinRoomByRN";
			return postData($url, $data);
		},
		//11.2获取好友邀请
		getInvite: function() {
			$url = addressV2 + "11v11/v2/inviteInfo";
			return postData($url);
		},
		//7.轮播公告
		carousel: function() {
			$url = addressV2 + "mine/carousel";
			return postData($url);
		},
	};
}
factoryHall.$inject = ["$http", '$timeout', '$q', '$ionicLoading', 'addressV2'];