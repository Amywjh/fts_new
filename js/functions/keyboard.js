(function(exports){
  var KeyBoard = function(input, options){
    var body = document.getElementsByTagName('body')[0];
    var DIV_ID = options && options.divId || '__w_l_h_v_c_z_e_r_o_divid';
    var quickBtn = document.getElementById("quickBtn"); 
    if(document.getElementById(DIV_ID)){
      quickBtn.removeChild(document.getElementById(DIV_ID));
    }
     
    this.input = input;
    
    var hallmodelbox = quickBtn.getElementsByClassName("hallmodelbox")[0];
    
    hallmodelbox.style.top="40%";
    
    this.el = document.createElement('div');
     
    var self = this;
    var zIndex = options && options.zIndex || 1000;
    var width = options && options.width || '100%';
//  var height = options && options.height || '193px';
    var fontSize = options && options.fontSize || '15px';
    var backgroundColor = options && options.backgroundColor || 'linear-gradient(rgb(48,56,69) 0%,rgb(25,35,43) 80%)';
    var TABLE_ID = options && options.table_id || 'table_0909099';
    var mobile = typeof orientation !== 'undefined';
     
    this.el.id = DIV_ID;
    this.el.style.position = 'absolute';
    this.el.style.left = 0;
    this.el.style.right = 0;
    this.el.style.bottom = 0;
    this.el.style.zIndex = zIndex;
    this.el.style.width = width;
//  this.el.style.height = height;
    this.el.style.background = backgroundColor;
    this.el.className = "blackbg"
     
    //样式
    var cssStr = '<style type="text/css">';
    cssStr += '#' + TABLE_ID + '{text-align:center;width:100%;}';
    cssStr += '#' + TABLE_ID + ' td{width:33%;border: .01rem solid rgba(0,0,0,.3);border-right:0;border-top:0;height: .6rem;line-height: .6rem;box-sizing: border-box;color: #FFFFFF;font-size:.3rem;font-weight:bold;font-family: "DIN1451EF-EngAlt";}';
    if(!mobile){
      cssStr += '#' + TABLE_ID + ' td:hover{background-color:#1FB9FF;color:#FFF;}';
    }
    cssStr += '</style>';
     
    //Button 完成撤销键盘
    var btnStr = '<div style="width:60px;height:28px;background-color:#1FB9FF;';
    btnStr += 'float:right;margin-right:5px;text-align:center;color:#fff;';
    btnStr += 'line-height:28px;border-radius:3px;margin-bottom:5px;cursor:pointer;">完成</div>';
     
    //table
    var tableStr = '<table id="' + TABLE_ID + '" border="0" cellspacing="0" cellpadding="0">';
      tableStr += '<tr><td>1</td><td>2</td><td>3</td></tr>';
      tableStr += '<tr><td>4</td><td>5</td><td>6</td></tr>';
      tableStr += '<tr><td>7</td><td>8</td><td>9</td></tr>';
      tableStr += '<tr><td></td><td>0</td>';
      tableStr += '<td style="font-size:.18rem;font-weight:500">删除</td></tr>';
      tableStr += '</table>';
    this.el.innerHTML = cssStr + tableStr;
    function addEvent(e){
      var ev = e || window.event;
      var clickEl = ev.element || ev.target;
      var value = clickEl.textContent || clickEl.innerText;
      if(clickEl.tagName.toLocaleLowerCase() === 'td' && value !== "删除"){
        if(self.input){
        	var valueInput = self.input.children[0]
        	var bogusInput = self.input.children[1];
		      var bogusInputArr = bogusInput.children;
		      var maxLength = bogusInputArr.length;
        	valueInput.value += value;
            var real_str = valueInput.value;
            for(var i = 0 ; i < maxLength ; i++){
                bogusInputArr[i].value = real_str[i]?real_str[i]:"";
            }
            if(real_str.length >= maxLength){
                valueInput.value = real_str.substring(0,5);
            }
        }
      }else if(clickEl.tagName.toLocaleLowerCase() === 'div' && value === "完成"){
//      body.removeChild(self.el);
      }else if(clickEl.tagName.toLocaleLowerCase() === 'td' && value === "删除"){
        var num = self.input.children[0].value;
        if(num){
        	var bogusInput = self.input.children[1];
		      var bogusInputArr = bogusInput.children;
          var newNum = num.substr(0, num.length - 1);
          real_str = self.input.children[0].value = newNum;
           for(var i = 0 ; i < 5 ; i++){
                bogusInputArr[i].value = real_str[i]?real_str[i]:"";
            }
        }
      }
    }
     
    if(mobile){
      this.el.ontouchstart = addEvent;
    }else{
      this.el.onclick = addEvent;
    }
    quickBtn.appendChild(this.el)
  }
   
  exports.KeyBoard = KeyBoard;
 
})(window)