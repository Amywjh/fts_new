define(["app"], function(app) {
	"use strict";
	function ctrl($scope,$rootScope,$ionicModal, $location,$ionicLoading,$state,$timeout,$stateParams, $cacheFactory,Corps) {
		$scope.$on('$ionicView.beforeEnter',function(){
			var corpsLogo = sessionStorage.getItem('corps-teamLogo');
			if(corpsLogo){
				$scope.leagueTeams = JSON.parse(corpsLogo).data;
			}else{
				Corps.corpsLogo().then(function(data){
					if(!data.code){
						$scope.leagueTeams = data.data;
					}
				})
			}
			var corpsInfor = JSON.parse(sessionStorage.getItem('corpsInfor'));
//			$scope.isName = $stateParams.isName?$stateParams.isName:'';
//			$scope.isText = $stateParams.isText?$stateParams.isText:'';
//			$scope.isJoin = $stateParams.isJoin?$stateParams.isJoin:1;
            if(corpsInfor){
            	$scope.isName = corpsInfor.isName?corpsInfor.isName:'';
				$scope.isText = corpsInfor.isText?corpsInfor.isText:'';
				$scope.isJoin = corpsInfor.isJoin;
            }
		})
		 
		 $scope.data = {
	        clientSide: ''
	      };
	      $scope.urlLogo = '';
	      // 获取选择
	      $scope.serverSideChange = function(item) {
	        $scope.urlLogo = item.logo_url;
	      };
		 // 确认选择
		 $scope.submitLogo = function(){
		 	if(!$scope.urlLogo){
		 		$scope.toastDark('请确定战队logo!','',true);
            	return false;
		 	}
//		 	$state.go('tab.corps-cream',{isLogo:$scope.urlLogo,isName:$scope.isName,isText:$scope.isText,isJoin:$scope.isJoin});  
            $location.path("/tab/main/corps/cream");
            var obj = {isLogo:$scope.urlLogo,isName:$scope.isName,isText:$scope.isText,isJoin:$scope.isJoin};
            sessionStorage.setItem('corpsInfor',JSON.stringify(obj));
		 	$scope.$on("$ionicView.beforeLeave",function(){
				history.replaceState({},"","#/tab/main");
				history.pushState({},"","#/tab/main/corps/cream");
			})
		 }
		 //		// 上传头像
		$scope.imgChange = function (element) { 
		    if (!element.files[0]) {
		        return;  
		    }  
		   var  fileSize = element.files[0].size;
		   var size = fileSize / 1024 / 1024;
            if (size > 4) {
                $scope.toastDark("上传图片不能大于4m！",'',true);
                element.value = '';
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
					 	 TALKWATCH("上传战队头像")
					 	 var croppedCanvas;
						 var rectCanvas;
						 var rectImage;
						 if (!$image.data('cropper')){
						    return false;
						 }
						 var $imgData=$image.cropper('getCroppedCanvas')
                         var dataurl = $imgData.toDataURL("image/jpeg", 0.3);
						 $scope.getImg = dataURLtoBlob(dataurl);
						 Corps.headImg($scope.getImg).then(function(data){
		                	$("#submitN").attr("disable",true)
		                	if(data && data.code == 0){
	                			$scope.canvasImg.remove();
	                			$scope.urlLogo = data.data;
//	                			$state.go('tab.corps-cream',{isLogo:$scope.urlLogo,isName:$scope.isName,isText:$scope.isText,isJoin:$scope.isJoin});  
	                			$location.path("/tab/main/corps/cream");
					            var obj = {isLogo:$scope.urlLogo,isName:$scope.isName,isText:$scope.isText,isJoin:$scope.isJoin};
	                			sessionStorage.setItem('corpsInfor',JSON.stringify(obj));
	                			$("#submitN").attr("disable",false);
	                			$scope.$on("$ionicView.beforeLeave",function(){
									history.replaceState({},"","#/tab/main");
				                    history.pushState({},"","#/tab/main/corps/cream");
								})
		                		return false;
		                	}
		                	 $scope.canvasImg.remove();
		                	 $scope.toastDark(data.data || "上传数据错误请稍后重试！",'',true)
		                },function(err){
		                	$scope.canvasImg.remove();
		                	$scope.toastDark("网络异常请稍后重试！",'',true)
		                });
			  	 }
			}
		};
		
	}
	ctrl.$inject = ['$scope',"$rootScope",'$ionicModal','$location','$ionicLoading', '$state','$timeout','$stateParams','$cacheFactory','Corps'];
	app.registerController("corpsLogoCtrl",ctrl);//return ctrl;
})
