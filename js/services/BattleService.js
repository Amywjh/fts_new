function factoryBattle($http, $timeout, $ionicLoading, $q, addressV2) {
	var $data,$url;
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
				$("#online").css("display", "block");//调取断网页面
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
			datas.reject();$ionicLoading.hide();
			$("#online").css("display", "block");//调取断网页面
		})
		$timeout(function() {
			datas.reject();
		}, 5000)
		return datas.promise;
	}
	return {
		list:function(status,league,page,userId) {
			$url = addressV2 + "11v11/v2/roomResultList";//该接口的的联赛id     1为英超，2为中超
			$data = {
					'page':page|0,
					"status":status|0,
					"isJoin":1,
			};
			if(userId){
				$data.userId = userId;
			}
//				if((league|0)+1){//联赛id
//					$data.id = league|0;
//				}
			return postData($url,$data);

		},
		//			排名  
		battleRanking: function(roomId,userId) {
			$url = addressV2 + "11v11/v2/endMatch/rank";
			$data = {
				"roomId": roomId
			};
			if(userId){
				$data.userId = userId;
			}
			return postData($url, $data);

		},
		
		//战报
		battlerecord: function(roomId) {
			$url = addressV2 + '11v11/v2/endMatch/record';
			$data = {
				"roomId": roomId
			};
			return postData($url, $data);
		},
		bonusPlan: function(roomId) {//奖金分配
			$url = addressV2 + "11v11/room/" + roomId + "/current/prize";
			return getData($url);
		},
	   bonusPlanNoStart: function(roomId) {//未开始奖金分配
			$url = addressV2 + "11v11/v2/room/prizeList";
			$data = {
				"roomId": roomId
			};
			return postData($url,$data);
		},
		// 阵容
		battleLineup: function(roomId, userId) {
			$url = addressV2 + "11v11/v2/getLineUp";
			$data = {
				"roomId": roomId,
				"userId": userId
			};
			return postData($url, $data);

		},
		//			球员表现
		playerDataShow: function(roomId,playerId) {
			$url = addressV2 + "11v11/playerExpression";
			$data = {
				"roomId": roomId,
				"playerId": playerId
			};
			return postData($url, $data);

		},
		//3v3已参加的房间未开始时的房间详情
		lineupNostart: function(roomId){
			$url = addressV2 + "3v3/partInRoomInfo";
			$data = {
				"roomId": roomId,
				"order": 0
			};
			return postData($url, $data);

		},
		//11v11已参加的房间未开始时的房间详情
		lineupNostartEle: function(roomId) {
			$url = addressV2 + "11v11/v2/partInRoomInfo";
			$data = {
				"roomId": roomId
			};
			return postData($url, $data);

		},
		//11v11战报分享
		lineupShare: function(roomId,userId) {
			$url = addressV2 + "/11v11/v2/shareResult";
			$data = {
				"roomId": roomId,
				"userId":userId
			};
			return postData($url, $data);

		},
	};
}
factoryBattle.$inject = ["$http", '$timeout', '$ionicLoading', '$q', 'addressV2'];