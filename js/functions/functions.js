function sysPar(){
	this.starToJewel = 10;//星币转星钻
	this.prizeStart = "8:00";
}
//千分位显示函数
function toThousands(num) {
    var result = [ ], counter = 0;
    num = (num || 0).toString().split('');
    for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(num[i]);
        if (!(counter % 3) && i != 0) { result.unshift(','); }
    }
    return result.join('');
}
//添加球员的方法
function lineup_qudh(num,list){
	if (num < 10) {
		var str = num;
		list.numone = "./img2.0/players/" + str + ".png";
	} else {
		var unit = Math.floor(num / 10);
		var decade = Math.floor(num % 10);
		list.numone = "./img2.0/players/" + unit + ".png";
		list.numtwo = "./img2.0/players/" + decade + ".png";
	}
	return list;
}
//计算奖金的方法
/*
 * playId //玩法id
 * num //入场人数
 * fee //入场费
 * rank //排名
 */
function getReward(playId,num,fee){
	var prize = [];
	if(playId==undefined || !num || !fee) return false; 
	if(playId==4 || playId==3){
		prize.push(fee*18)
		return prize;
	}else if(playId==0){
		prize.push(fee*num*9);
		return prize;
	}else if(playId==1){
		if(num<3) return prize;
		prize.push(parseInt(fee*num*9/2));
		prize.push(parseInt(fee*num*9/3));
		prize.push(parseInt(fee*num*9/6));
		return prize;
	}else if(playId==2){
		if(num<4) return prize;
		function reward25(rank){
			return parseInt(fee*num*9*((2*num/4)-(2*rank)+1)/(num/4)/(num/4));
		}
		prize.push(reward25(1));
		prize.push(reward25(2));
		prize.push(reward25(3));
		return prize;
	}else{
		return prize;
	}
}
function getChartData(data){//线性统计图用
	if(!data || data.length<5) return false;
	var dataArr = [];
	var xAxis = [];
	angular.forEach(data,function(item,index){
		dataArr.push(item.expression);
		xAxis.push(index+1);
	})
	return {"series":dataArr,"xAxis":xAxis};
}
//获取code的方法
function getParam(key){
	var search = location.search.substring(1);
	var query = search.split("&");
	for(var i=0;i<query.length;i++){
		var kv = query[i].split("=");
		if(kv[0]==key){
			return kv[1];
		}
	}
	return "";
}
$(function(){
		//断网后点击刷新
	$("#online .break").click(function(){
		if (navigator.onLine) {//联网
			window.location.reload();
			$("#online").css("display", "none");
		} else { //断网
			$("#online").find("p").text("再试一次")
		}
	})


})
//输入框的加减号
function setNum(min,max,sum,changeId){//changeId 1为减，2为加
	if(changeId==1){
		var num = $("#vote_num").val()|0;
		$("#vote_num").val(num);
		if(num>min){
			$("#vote_num").val(num-1);
		}
	}else if(changeId==2){
		var num = $("#vote_num").val()|0;
		$("#vote_num").val(num);
		if(sum!=undefined){
			if(num<sum){
				$("#vote_num").val(num+1);
			}
		}else{
			$("#vote_num").val(num+1);
		}
		if(num>=max){
			$("#vote_num").val(max);
			if(sum && max>sum){
				$("#vote_num").val(sum);
			}
		}
	}
	return $("#vote_num").val();
}
//输入框默认数字
function getVal(event,min,max,sum){
	if(sum || sum==0){
		var reg = new RegExp("^[1-9]{1}[0-9]*$");
		var res = reg.test(event.target.value);//正则匹配的结果
		if(!res){
			var val = event.target.value|0;
			event.target.value = val;
		}
		if(event.target.value>max || event.target.value>sum){
			var m = sum>max?max:sum;
			event.target.value = m;
		}
	}else{
		if(event.target.value>max){
			event.target.value = max;
		}
	}
}
//球星对战获取预计奖励
function getPreIncome(percent,nowNum,leftAll,rightAll,isLeft){//参数依次为：转化率，输入金额，主队投入总额，客队投入总额，是否是主队
	var count = (nowNum + leftAll + rightAll)*percent;
	var num;
	if(!nowNum) return num = false;
	if(isLeft){
		if(!rightAll) return num=false;//如果右边为0
		num = count* nowNum/(nowNum+leftAll);
		if(num<nowNum*10){//预计奖励不足本金，奖励为本金*10星币。
			num = nowNum*10;
		}
	}else{
		if(!leftAll) return num=false;//如果左边为0
		num = count* nowNum/(nowNum+rightAll);
		if(num<nowNum*10){
			num = nowNum*10;
		}
	}
	return num = Math.round(num);	
}

function convertImgToBase64(url, callback, outputFormat){//base64
  	var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'),
    img = new Image;
  	img.crossOrigin = 'Anonymous';
  	img.src = url;
 	img.onload = function(){
    	canvas.height = img.height;
    	canvas.width = img.width;
    	ctx.drawImage(img,0,0);
    	var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    	callback.call(this, dataURL);
    	canvas = null;
  	};
}
//卡号加密
function card(cd){
	var xx = '';
	for(var i=0;i<cd.length-8;i++){
		 xx += "*";
	}
    return cd.replace(/^(\d{4})\d+(\d{4})$/, "$1"+xx+"$2");
}
function loseTime(oldTimes){//判断是否为7天前的房间
	var dateObj = new Date();
	var cha = dateObj.getTime()-oldTimes;
	return (cha>1000*60*60*24*7)?true:false;
}

function getTimeCount(futureTimes){//倒计时函数
	var dateObj = new Date();
	var cha = futureTimes - dateObj.getTime();
	if(cha>0){
		var dates=Math.floor(cha/1000/60/60/24);//日
	    var hours=Math.floor(cha/1000/60/60%24);//时
	    var minutes=Math.floor(cha/1000/60%60);//分
	    return {"dates":dates,"hours":hours,"minutes":minutes};
	}
	return false;
	
}
function matchDeadTime(prizeArr){//倒计时自定义格式（即将废弃）
	if(prizeArr.length>0){
		for(var i=0;i<prizeArr.length;i++){
			var times = getTimeCount(prizeArr[i].deadTime);
			if(!times){
				prizeArr[i].timeCount = null;
			}else{
				var daojishi = "";
				if(times.dates) daojishi = daojishi + times.dates +"天";
				if(times.hours) daojishi = daojishi + times.hours +"时";
				if(times.minutes) daojishi = daojishi + times.minutes +"分";
				if(daojishi=="") delete daojishi;
				prizeArr[i].timeCount = daojishi;
			}
		}
	}
	return prizeArr;
}
function getCountTime(futureTimes){//倒计时html格式
	var times = getTimeCount(futureTimes);
	var djs = "<img class='a-img-size' src='../../img2.0/prize2.0/qxdz_djs_1.png' alt='' /> ";  
	if(!times) return djs +=0;
	if(times.dates) djs += times.dates +"<span style='font-size: 0.12rem;font-weight: normal;color: #fff;'>&nbsp;天&nbsp;</span>";
	if(times.hours) djs += times.hours +"<span style='font-size: 0.12rem;font-weight: normal;color: #fff;'>&nbsp;时&nbsp;</span>";
	if(times.minutes) djs += times.minutes +"<span style='font-size: 0.12rem;font-weight: normal;color: #fff;'>&nbsp;分&nbsp;</span>";
	return djs;
}
function getDay(futureTimes){//获取星期
	var str;var dateTime = 1000*24*60*60; //一天的时间戳
	var now = new Date();
	now.setHours(0, 0, 0, 0);//小时,分钟，秒，毫秒
	var nexTime = new Date(now.getTime()).getTime() + dateTime;
	var cha = futureTimes - nexTime;
	if(cha<0){
		str = "今日";
	}else if(cha>=0 && cha<dateTime){
		str = "明日"
	}else{
		var futureStr = new Date(futureTimes);
		var weekday=new Array(7)
		weekday[0]="星期日"
		weekday[1]="星期一"
		weekday[2]="星期二"
		weekday[3]="星期三"
		weekday[4]="星期四"
		weekday[5]="星期五"
		weekday[6]="星期六"
		str = weekday[futureStr.getDay()];
		
	}
	var hour = new Date(futureTimes).getHours();
	var minutes = new Date(futureTimes).getMinutes();
	return {"day":" ("+str+") ","hourMinutes":hour+":"+minutes};
}
function add0(m){return m<10?'0'+m:m }
function gettimeform(needTime,deadTime){
  	var  newDate = new Date();
	newDate.setTime(needTime);
	var nextDay = false;
	if(isNaN(newDate.setTime(needTime))){
		return {"years":"00","month":"00","dates":"00","hours":"00","minutes":"00","isNextDay":nextDay}
	}
    var y = newDate.getFullYear();  
    var m = newDate.getMonth()+1;  
    var d = newDate.getDate();  
    var h = newDate.getHours();  
    var mm = newDate.getMinutes();  
    var s = newDate.getSeconds();
    if(deadTime){
    	var deadDate = new Date();
    	deadDate.setTime(deadTime);
    	var deadDay = deadDate.getDate();
    	var deadMonth = deadDate.getMonth()+1;
    	if((d-deadDay)==1 || ((m-deadMonth)==1 && d==1 && (d-deadDay)>=27)){
    		nextDay = "次日 ";
    	}
    }
    return {"years":y,"month":add0(m),"dates":add0(d),"hours":add0(h),"minutes":add0(mm),"isNextDay":nextDay}
}
//去除千分位
function commafyback(num){
	var x = num.split(',');
	return parseFloat(x.join(""));
} 

var jsAll = {};
function jsRequire(jsFile,callAct){//异步加载
	if(!jsAll[jsFile]){
		jsAll[jsFile] = require([jsFile],function(wx){
			if(callAct) callAct();
			if(jsFile=="wx"){
				window.wx = wx;
				return window.wx;
			}
		});
	}
}
function TALKWATCH(action,actionId,obj){//talkingdata接入
	try{
		TDAPP.onEvent(action,actionId,obj);
	}catch(e){
		jsRequire("talkData");
	}
	
}
//获取用户信息
function getUserId($hp){
	$.ajax({
		url:"/api/v2/" + "wechat/weChatLogin?token=" + getParam("code"),
		type:"POST",
		success:function(data){
			if (!data.data || data.code != 0){
				localStorage.removeItem("userId");
				localStorage.removeItem("nickName");
				sessionStorage.removeItem("user");
				return false;
			}
			localStorage.setItem("userId", data.data.id);
			sessionStorage.setItem("userId_short", data.data.id);
			$hp.defaults.headers.common['uk'] = data.data.id;
			weixinAddContact(data.data.nickName);
		},
		error:function(error){
			localStorage.removeItem("userId");
			localStorage.removeItem("nickName");
			sessionStorage.removeItem("user");
		}
	})
	
}
//加载默认图片
function loadDefaultImg(defaultType){//defaultType 1为用户，0为运动员
	var img=event.srcElement;
	img.src=defaultType?"../../img/common/touxiang_default.png":"../../img/common/player_default.png";
	img.onerror=null;
}
function privateWxConfig(data,isDebug,callAct){//微信sdk配置
	try{
		wx.config({  
		        debug: isDebug?true:false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
		        appId: data.appId, // 必填，公众号的唯一标识  
		        timestamp: data.timestamp, // 必填，生成签名的时间戳  
		        nonceStr: data.nonceStr, // 必填，生成签名的随机串  
		        signature: data.signature,// 必填，签名，见附录1  
		        jsApiList: data.jsApiList,
	//	        [
	//	            'checkJsApi',  //判断当前客户端版本是否支持指定JS接口
	//	            'onMenuShareTimeline',  //分享到朋友圈
	//	            'onMenuShareAppMessage',  //分享给朋友
	//	            'onMenuShareQQ',  //分享到qq
	//	            'onMenuShareWeibo', //分享到微博 
	//	            'chooseWXPay'  
	//	        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2  
	   }); 
//	   console.log(wx.config);
	}catch(e){
		setTimeout(function(){
			jsRequire("wx",callAct);
		},500)
	}
}
function wxShare(privateData,callAct,shareCall){//微信分享
		try{
		    wx.ready(function() {
				wx.onMenuShareTimeline({
			
			        title: privateData.title, // 分享标题
			
			        link: privateData.url,
			
			        imgUrl:"https://" + privateData.img, // 分享图标
			        success: function () {
			        	if(shareCall) shareCall();
	//	    			alert("分享成功朋友圈")
		    	        // 用户确认分享后执行的回调函数
		
		    	    },
		    	    cancel: function () { 
	//					alert("取消朋友圈");
		    	        // 用户取消分享后执行的回调函数
		
		    	    }
			
			    });
		    	wx.onMenuShareAppMessage({
		    	    title: privateData.title, // 分享标题
		
		    	    desc: privateData.desc, // 分享描述
		
		    	    link: privateData.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		
		    	    imgUrl:"https://" + privateData.img, // 分享图标
		
		    	    type: '', // 分享类型,music、video或link，不填默认为link
		
		    	    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		
		    	    success: function () {
		    	    	if(shareCall) shareCall();
	//	    			alert("分享成功朋友")
		    	        // 用户确认分享后执行的回调函数
		
		    	    },
		    	    
		    	    cancel: function () {
	//					alert("取消朋友");
		    	        // 用户取消分享后执行的回调函数
		
		    	    }
		
		    	});
		    });
	        wx.error(function(res){ 
	            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。  
//		        alert("errorMSG:"+res.errMsg);  
	        });  
		}catch(e){
			setTimeout(function(){
				jsRequire("wx",callAct);
			},1000)
		}
}
function weixinAddContact(name){
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		// 分享到朋友圈
		WeixinJSBridge.invoke("addContact", {webtype: "1",username: name}, function(e) {
			//e.err_msg:add_contact:added 已经添加
			//e.err_msg:add_contact:cancel 取消添加
			//e.err_msg:add_contact:ok 添加成功
//	　　　　　WeixinJSBridge.log(d.err_msg);
			if(e.err_msg == 'add_contact:added' || e.err_msg == 'add_contact:ok'){
			    //关注成功，或者已经关注过
			}
	
		})
	}, false);
}
//绘制矩形canvas
function getRectCanvas(sourceCanvas) {
	 var canvas = document.createElement('canvas');
	 var context = canvas.getContext('2d');
	 var width = sourceCanvas.width;
	 var height = sourceCanvas.height;
	
	 canvas.width = width;
	 canvas.height = height;
	
	 context.imageSmoothingEnabled = true;
	 context.drawImage(sourceCanvas, 0, 0, width, height);
	 context.globalCompositeOperation = 'destination-in';
	 context.beginPath();
	 context.rect(0,0,width,height);
	 context.fill();
	
	 return canvas;
}

/** 
* 将以base64的图片url数据转换为Blob 
* @param urlData 
* 用url方式表示的base64图片数据  
*/ 
function dataURLtoBlob(dataurl) {  //将base64格式图片转换为文件形式
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}