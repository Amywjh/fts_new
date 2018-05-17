function factoryShopUrl($http, $timeout, $ionicLoading, $q, addressV2) {
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
		//发送短信验证码
		sendSms: function(data) {
			$url = addressV2 + "fengxin/sendSms";
			$data = data;
			return postData($url, $data);
		},
		// 获取省  
		privinceList: function() {
			$url = addressV2 + "fengxin/privinceList";
			$data = "";
			return postData($url, $data);
		},
		//  获取市 
		cityList: function(provinceId) {
			$url = addressV2 + "fengxin/cityList";
			$data = {
				"provinceId": provinceId
			};
			return postData($url, $data);
		},
		//  获取全部银行
		bankList: function() {
			$url = addressV2 + "fengxin/bankList";
			$data = '';
			return postData($url, $data);
		},
		//  获取银行支行信息
		bankBranchList: function(provinceId, bankId, cityId) {
			$url = addressV2 + "fengxin/bankBranchList";
			$data = {
				provinceId: provinceId,
				bankId: bankId,
				cityId: cityId
			};
			return postData($url, $data);
		},
		//  绑定手机号码
		openSingleEmployeeAccountAndActive: function(data) {
			$url = addressV2 + "fengxin/openSingleEmployeeAccountAndActive";
			$data = data;
			return postData($url, $data);
		},
		//  校验手机验证码
		validateUserCode: function(data) {
			$url = addressV2 + "fengxin/validateUserCode";
			$data = data;
			return postData($url, $data);
		},
		//  查询用户转账历史查询
		saleWalletList: function(page) {
			$url = addressV2 + "fengxin/getExchangeCashList/" + page;
			return postData($url);
		},
		coinChage: function(page) { //星币兑换星钻记录
			$data = {
				page: page
			}
			$url = addressV2 + "exchange/recode";
			return postData($url, $data);
		},
		//用户转账
		//			addSaleWallet: function(data) {
		//				$url = addressV2 + "fengxin/addSaleWallet";
		//				$data = data;
		//				return postData($url, $data);
		//			},
		// 保存用户绑定的银行信息  
		//			 bindBankInfo: function(data) {
		//				$url = addressV2 + "mine/bindBankInfo";
		//				$data = data;
		//				return postData($url, $data);
		//			},
		// 更新用户银行信息  
		//			updateBankInfo: function(data) {
		//				$url = addressV2 + "mine/updateBankInfo";
		//				$data = data;
		//				return postData($url, $data);
		//			},
		// 获取用户银行信息  /mine/getBankInfo
		//			getBankInfo: function(data) {
		//				$url = addressV2 + "mine/getBankInfo";
		//				$data = data;
		//				return postData($url, $data);
		//			},
		// 绑定手机号码  
		bindPhone: function(data) {
			$url = addressV2 + "fengxin/bindPhone";
			$data = data;
			return postData($url, $data);
		},
		// 提现方式申请
		depositType: function(data) {
			$url = addressV2 + "withdraw/type";
			$data = data;
			return postData($url, $data);
		},
	};

}
factoryShopUrl.$inject = ["$http", '$timeout', '$ionicLoading', '$q', 'addressV2'];