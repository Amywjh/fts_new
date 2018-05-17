//接口服务
var $hp;
define(["require"],function(require){
	"use strict";
	var services = angular.module('starter.services', [], function($httpProvider) { //优化的$httpProvider服务
		var param = function(obj) {
			var query = '',
				name, value, fullSubName, subName, subValue, innerObj, i;
			for (name in obj) {
				value = obj[name];
				if (value instanceof Array) {
					for (i = 0; i < value.length; ++i) {
						subValue = value[i];
						fullSubName = name + '[' + i + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				} else if (value instanceof Object) {
					for (subName in value) {
						subValue = value[subName];
						fullSubName = name + '[' + subName + ']';
						innerObj = {};
						innerObj[fullSubName] = subValue;
						query += param(innerObj) + '&';
					}
				} else if (value !== undefined && value !== null)
					query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
			}
			return query.length ? query.substr(0, query.length - 1) : query;
		};
		// Override $http service's default transformRequest
		$httpProvider.defaults.transformRequest = [function(data) {
			return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
		}];
		$httpProvider.defaults.cache = false;
		$httpProvider.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded;charset=utf-8";
		$hp = $httpProvider;
		if (localStorage.getItem("userId")) {
			$hp.defaults.headers.common['uk'] = localStorage.getItem("userId");
		}
		$hp.defaults.headers.common['uk'] = 85;
	});
	services.config(function($httpProvider) {
		if (typeof String.prototype.endsWith != 'function') {
			String.prototype.endsWith = function(str) {
				return this.slice(-str.length) == str;
			};
		}
		$httpProvider.interceptors.push(function($rootScope, $timeout, $injector) {
			return {
				request: function(config){
					var str = config.url; //比较字符串
					var compareStr = ".html"; //被比较字符串
					var res = str.endsWith(compareStr);
					if (res) {
						$injector.get('$ionicLoading').show();
					}
					config.headers = config.headers || {};
					return config;
				},
				response: function(response) {
					// console.log(response);
					var str = response.config.url; //比较字符串
					var compareStr = ".html"; //被比较字符串
					var res = str.endsWith(compareStr);
					if (res) {
						$rootScope.$watch('$locationChangeSuccess', function() {
							$("#bgOpc").removeClass("bgOpc");
							$timeout(function(){
								$("html").css({"background":"none"});
							},1000)
							$injector.get('$ionicLoading').hide();
							$("#startLoading").remove();
						})
					}
					return response;
				}
			}
		})
		getUserId($hp);//获取用户userId
	});
	require(["AllServices"]);
	return services;
})