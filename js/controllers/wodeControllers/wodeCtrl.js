define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$rootScope,$ionicModal, $location,$ionicLoading,$timeout, Wode,ShopUrl) {
		history.pushState({},"","#/tab/wode");
		// 数据更新
		$scope.wodaAllInfor = function(){
			Wode.all().then(function(data) {
				if(data.code == 0) {
					sessionStorage.setItem("user", JSON.stringify(data.data));
					$scope.userData = data.data;
					$scope.userData.dmd = toThousands($scope.userData.dmd);
					$scope.userData.coin = toThousands($scope.userData.coin);
					var time = new Date().getTime();    //用于提供实时随机数
					$scope.userData.head_logo_url = $scope.userData.head_logo_url + "?" + time;
					if(parseInt($scope.userData.currExp) <= parseInt($scope.userData.maxExp)) {
						$scope.bl = parseInt($scope.userData.currExp) / parseInt($scope.userData.maxExp) * 100;
					} else {
						$scope.bl = 100;
					}
				}
			})
		}
		
		var user = sessionStorage.getItem("user");
		TALKWATCH("我的")
		if(user) {
			$scope.userInfoDetial(JSON.parse(user));
			if(parseInt($scope.userData.currExp) <= parseInt($scope.userData.maxExp)) {
				$scope.bl = parseInt($scope.userData.currExp) / parseInt($scope.userData.maxExp) * 100;
			} else {
				$scope.bl = 100;
			}
		} else {
			$scope.wodaAllInfor();
		}
		
		$scope.wdGetSecond = function(url) {
				$location.path(url);
		}
		
		
		
		// 经验公告弹窗
		$scope.bewrite = function(){
			$ionicModal.fromTemplateUrl('templates/mine/mineModal/mineBewrite.html', {
				scope: $scope,
				 animation: 'fade-in'
			}).then(function(modal) {
				$scope.mineBewrite = modal;
				$scope.mineBewrite.show();
				
				$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { 
					$scope.mineBewrite.remove();
				})
			});
		}
		
		//个人信息修改

//		// 上传头像
		$scope.imgChange = function (element) { 
		    if (!element.files[0]) {
		        return;  
		    }  
		    console.log(element.files[0]);
		   var  fileSize = element.files[0].size;
		   var size = fileSize / 1024 / 1024;
            if (size > 4) {
                $scope.toastDark("上传图片不能大于4m！");
                return false;
            }
	  
           $ionicModal.fromTemplateUrl('templates/mine/mineModal/canvasImg.html', {
				scope: $scope,
				 animation: 'fade-in'
			}).then(function(modal) {
				$scope.canvasImg = modal;
				var reader = new FileReader();
				reader.readAsDataURL(element.files[0]);
				 reader.onload = function(evt){
				  $scope.imgGG = evt.target.result;
				  $timeout(iniCropper,500)
				}
				 $timeout(function(){
				 	$scope.canvasImg.show(); 
				 	element.value = '';
				 })
				 
				$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { 
					$scope.canvasImg.remove();
				})
			})
					
			 var iniCropper = function(){
			  	 var $image = $('#image');
			  	 var $dataRotate = $('#dataRotate')
				  var options = {
				        aspectRatio: 16 / 9,
				       modal:true,//背景颜色
				        background:false,
				        scalable:true, //是否允许缩放
				        zoomable:false, //是否允许缩放图片
				        rotatable:true, //是否允许旋转图片
				        viewMode : 1,//显示  
				        guides :true,//裁剪框虚线 默认true有  
				        dragMode : "move",  
				        build: function (e) { //加载开始  
				            //可以放你的过渡 效果  
				        },  
				        built: function (e) { //加载完成  
				        },  
				        zoom: function (e) {  
				         
				        }, 
				        movable : true,//是否能移动图片  
				        cropBoxMovable :true,//是否允许拖动裁剪框  
				        cropBoxResizable :true,//是否允许拖动 改变裁剪框大小 
				         aspectRatio: 1 / 1,//裁剪框比例 1：1
				        crop: function (e) {
				        	$dataRotate.val(e.rotate);
				        }
				      };
					$image.cropper(options);
					
					$scope.dataRotate = function(e){
						$image.cropper("rotate", 45)
					}
					
//		            // 提交修改图片
					 $scope.submitCut = function(e){
					 	 var croppedCanvas;
						 var rectCanvas;
						 var rectImage;
						 if (!$image.data('cropper')){
						    return false;
						 }
						 var $imgData=$image.cropper('getCroppedCanvas')
                         var dataurl = $imgData.toDataURL("image/jpeg", 0.3);
						 $scope.getImg = dataURLtoBlob(dataurl);
						 Wode.headImg($scope.getImg).then(function(data){
		                	$("#submitN").attr("disable",true)
		                	if(data && data.code == 0){
	                			$scope.wodaAllInfor();
	                			$scope.canvasImg.remove();
	                			$("#submitN").attr("disable",false)
		                		return false;
		                	}
		                	 $scope.canvasImg.remove();
		                	$scope.toastDark("上传数据错误请稍后重试！")
		                },function(err){
		                	$scope.canvasImg.remove();
		                	$scope.toastDark("网络异常请稍后重试！")
		                });
			  	 }
			}
		};
//		// 修改姓名
		$scope.nameRevise = function(el){
			$ionicModal.fromTemplateUrl('templates/mine/mineModal/mineNamelnput.html', {
				scope: $scope,
				 animation: 'fade-in'
			}).then(function(modal) {
				$scope.userName={
					nickName : '',
				}
				$scope.mineNamelnput = modal;
				$scope.mineNamelnput.show();
            	$scope.userName.nickName = $scope.userData.name;
//                          	$timeout(function(){
//                                  if($scope.mineNamelnput){
//                                  	$("#nickName").trigger("click").focus();
//                                  }
//                          	});
				$scope.namePush = function(){
				    if(!$scope.userName.nickName){
				    	$scope.toastDark("名字不能为空！")
				    	return false;
				    }
				    if($scope.userName.nickName.length<2 || $scope.userName.nickName.length>7){
				    	$scope.toastDark("名字字数要在2-7以内！")
				    	return false;
				    }
				    var reg = /^[\u4e00-\u9fa5A-Za-z0-9-_]*$/ ;
				    if(!reg.test($scope.userName.nickName)){
				    	$scope.toastDark("无法使用特殊字符！")
				    	return false;
				    }
				    var dataList = {
				    	nickName:$scope.userName.nickName
				    }
					 Wode.headName(dataList).then(function(data){
	                	if(data && data.code == 0){
	                		$scope.wodaAllInfor();
	                		$scope.mineNamelnput.remove();
	                		return false;
	                	}
	                	$scope.toastDark(data.msg || "名字不符合,请重新输入！")
				      })
				}
				
				$rootScope.$on('$locationChangeSuccess', function(ev, to, toParams, from, fromParams) { 
					$scope.mineNamelnput.remove();
				})
			});
		}

		
	}
	ctrl.$inject = ['$scope',"$rootScope",'$ionicModal','$location','$ionicLoading', '$timeout','Wode','ShopUrl'];
	app.registerController("wodeCtrl",ctrl);//return ctrl;
})
