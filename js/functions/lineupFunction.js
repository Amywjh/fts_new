var getLineup = function(other) {//获取阵容的函数
	if(other.code!=0) return;
	var ids = other.data.ids;//跳转球员详情用
	var lineup_data = other.data.userInfo?other.data.userInfo:{};//用户信息
	var otherData = other.data.lineupMsg;//阵容信息
	var lineupcontent = {}
	lineupcontent.one = [];
	lineupcontent.two = [];
	lineupcontent.thr = [];
	lineupcontent.for = [];
	var model_data = {
		"expression": '',
		"numone": "",
		"numtwo": "",
		"dfIcon": "",
		"bjIcon": "",
		"headIcon": "",
		"id": '',
		"name": "",
		"position": '',
		"salary": ""
	};
	lineup_data.expression = otherData.LineUpExp; //表现值
	lineup_data.surPlusSalary = otherData.surPlusSalary; //剩余工资
	lineup_data.lineUpSubmitTime = otherData.lineUpSubmitTime; //提交时间
	if (otherData.formation == null){
		lineup_data.lineup_name = "4-4-2"
		lineup_data.lineup_nameId = 1;
		lineup_data.expression = 0; //表现值

		for (var i = 0; i < 2; i++) {
			lineupcontent.one.push(model_data)
		}
		for (var i = 0; i < 4; i++) {
			lineupcontent.two.push(model_data)
		}
		for (var i = 0; i < 4; i++) {
			lineupcontent.thr.push(model_data)
		}
		for (var i = 0; i < 1; i++) {
			lineupcontent.for.push(model_data)
		}
	} else if (otherData.formation != null) {
		lineup_data.lineup_name = otherData.formation.fmt_name;
		lineup_data.lineup_nameId = otherData.formation.fmt_type;
		switch (otherData.formation.fmt_type){
			case 1:
				for (var i = 0; i < 2; i++) {
					lineupcontent.one.push(model_data)
				}
				for (var i = 0; i < 4; i++) {
					lineupcontent.two.push(model_data)
				}
				for (var i = 0; i < 4; i++) {
					lineupcontent.thr.push(model_data)
				}
				for (var i = 0; i < 1; i++) {
					lineupcontent.for.push(model_data)
				}
				break;
			case 2:
				for (var i = 0; i < 1; i++) {
					lineupcontent.one.push(model_data)
				}
				for (var i = 0; i < 5; i++) {
					lineupcontent.two.push(model_data)
				}
				for (var i = 0; i < 4; i++) {
					lineupcontent.thr.push(model_data)
				}
				for (var i = 0; i < 1; i++) {
					lineupcontent.for.push(model_data)
				}
				break;
			case 3:
				for (var i = 0; i < 1; i++) {
					lineupcontent.one.push(model_data)
				}
				for (var i = 0; i < 4; i++) {
					lineupcontent.two.push(model_data)
				}
				for (var i = 0; i < 5; i++) {
					lineupcontent.thr.push(model_data)
				}
				for (var i = 0; i < 1; i++) {
					lineupcontent.for.push(model_data)
				}
				break;
			case 4:
				for (var i = 0; i < 2; i++) {
					lineupcontent.one.push(model_data)
				}
				for (var i = 0; i < 3; i++) {
					lineupcontent.two.push(model_data)
				}
				for (var i = 0; i < 5; i++) {
					lineupcontent.thr.push(model_data)
				}
				for (var i = 0; i < 1; i++) {
					lineupcontent.for.push(model_data)
				}
				break;
			case 5:
				for (var i = 0; i < 3; i++) {
					lineupcontent.one.push(model_data)
				}
				for (var i = 0; i < 3; i++) {
					lineupcontent.two.push(model_data)
				}
				for (var i = 0; i < 4; i++) {
					lineupcontent.thr.push(model_data)
				}
				for (var i = 0; i < 1; i++) {
					lineupcontent.for.push(model_data)
				}
				break;
			case 6:
				for (var i = 0; i < 2; i++) {
					lineupcontent.one.push(model_data)
				}
				for (var i = 0; i < 5; i++) {
					lineupcontent.two.push(model_data)
				}
				for (var i = 0; i < 3; i++) {
					lineupcontent.thr.push(model_data)
				}
				for (var i = 0; i < 1; i++) {
					lineupcontent.for.push(model_data)
				}
				break;
			case 7:
				for (var i = 0; i < 3; i++) {
					lineupcontent.one.push(model_data)
				}
				for (var i = 0; i < 4; i++) {
					lineupcontent.two.push(model_data)
				}
				for (var i = 0; i < 3; i++) {
					lineupcontent.thr.push(model_data)
				}
				for (var i = 0; i < 1; i++) {
					lineupcontent.for.push(model_data)
				}
				break;
			default:
				break;
		}
		if (otherData){
			angular.forEach(otherData, function(data_s, index_s) {
				switch (index_s) {
					case "foward":
						if (data_s.length > 0) {
							var length = data_s.length;
							for (var len = 0; len < length; len++) {
								lineupcontent.one[len] = data_s[len];
								lineupcontent.one[len].bjIcon = "";
								lineupcontent.one[len].dfIcon = "";
								lineup_qudh(data_s[len].shirt_num, lineupcontent.one[len]) //球衣号码
							}
						}
						break;
					case "center":
						if (data_s.length > 0) {

							var length = data_s.length;
							for (var len = 0; len < length; len++) {
								lineupcontent.two[len] = data_s[len];
								lineupcontent.two[len].bjIcon = "";
								lineupcontent.two[len].dfIcon = "";
								lineup_qudh(data_s[len].shirt_num, lineupcontent.two[len]) //球衣号码
							}
						}
						break;
					case "guard":
						if (data_s.length > 0) {
							var length = data_s.length;
							for (var len = 0; len < length; len++) {
								lineupcontent.thr[len] = data_s[len];
								lineupcontent.thr[len].bjIcon = "";
								lineupcontent.thr[len].dfIcon = "";
								lineup_qudh(data_s[len].shirt_num, lineupcontent.thr[len]) //球衣号码
							}
						}
						break;
					case "goalkeeper":
						if (data_s.length > 0) {

							var length = data_s.length;
							for (var len = 0; len < length; len++) {
								lineupcontent.for[len] = data_s[len];
								lineupcontent.for[len].bjIcon = "";
								lineupcontent.for[len].dfIcon = "";
								lineup_qudh(data_s[len].shirt_num, lineupcontent.for[len]) //球衣号码
							}
						}
						break;
					default:
						break;
				}
			})
		}
	}
	return {"lineupcontent":lineupcontent,"lineup_data":lineup_data,"ids":ids}
};