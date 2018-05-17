//主控制器******************************************************
define(["require","services"],function(require,services){
	"use strict";
	var controllers = angular.module('starter.controllers', ["ionic", "ionicLazyLoad"]);
	controllers.filter('trustHtml', function ($sce){//识别js编译的html标签
	    return function (input) {
	        return $sce.trustAsHtml(input);
	    }
	});
//	controllers.controller("allCtrl",require("AllCtrl"));
	return controllers;
})
