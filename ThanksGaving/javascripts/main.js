;(function(window, document){
	var $ = function(_){
		var Node = function(_){
			var that = this,
				parentNode = document,
				type = $.type(_);
			this.qs = function(parent, _){
				return parent.querySelector(_)
			}
			this.qsa = function(parent, _){
				return parent.querySelectorAll(_)
			}
			
			if (/HTML\w+Element/.test(type)) {
				this.node = _
			}else if(type === "[object String]"){
				try{
					this.node = this.qs(parentNode, _)			
				}catch(e){
					throw e;
				}
			}

			if (this.node === null || this.node === undefined) {
				throw new Error("node "+_+" is node exist!");
			};
			
			this._addClass = function(ele, classNames) {
				var initialClassName = ele.className;
				var classNameArr = classNames;
				var _classNames = [];
				if ($.type(classNames) === "[object String]") {
					classNameArr = classNames.split(" ")
				}else if ($.type(classNames) !== "[object Array]") {
					return new Error("Type Error")
				}
				for (var i = 0; i < classNameArr.length; i++) {
					if(initialClassName === "" || !new RegExp(classNameArr[i], "g").test(initialClassName)){
						_classNames.push(classNameArr[i])
					}
				};
				ele.setAttribute("class", initialClassName + " "+ _classNames.join(" "));
			}
			this._removeClass = function(ele, classNames){
				var initialClassName = ele.className;
				var classNameArr = classNames;
				if ($.type(classNames) === "[object String]") {
					classNameArr = classNames.split(",")
				}else if ($.type(classNames) !== "[object Array]") {
					return new Error("Type Error")
				}
				for (var n = 0, l = classNameArr.length;n < l; n++) {
					ele.setAttribute("class", initialClassName.toString().replace(new RegExp(classNameArr[n], "g"),""));
				}
			}
			this._getComputedStyle = function(){
				if (arguments.length) {
					return +(/\d+/.exec(window.getComputedStyle(this.node)[arguments[0]])[0])
				}
				return window.getComputedStyle(this.node)				
			}
			return {
				parentNode: parentNode,
				node: that.node,
				addClass: function(classNames){
					that._addClass(this.node, classNames);
					return this
				},
				removeClass: function(classNames) {
					that._removeClass(this.node, classNames);
					return this
				},
				html: function(){
					if (arguments.length === 0) {
						return this.node.innerHTML;
					}else if (arguments.length === 1) {
						if ($.type(arguments[0]) === "[object String]") {
							this.node.innerHTML = arguments[0];
							return this;
						}else {
							throw new Error("参数类型错误");
						}
					}
				},
				css: function(){
					if (arguments.length === 1) {
						var o = arguments[0];
						if ($.type(o) === "[object String]"){
							return that._getComputedStyle(o)
						}
						if ($.type(o) === "[object Object]") {
							$.extend(this.node.style, o);
						};
					}else if (arguments.length === 2) {
						var key = arguments[0],
							val = arguments[1];
						if (this.node.style.hasOwnProperty(key)) {
							this.node.style[key] = val;							
						};
					};
					return this;
				},
				children: function(_){
					return that.qsa(this.node, _)
				},
				on: function(type, handler){
					this.node.addEventListener(type, handler, false);
				}
			}
		}
		return new Node(_)
	}
	$.os = (function(navigator){
		return /Android|iPhone/.exec(navigator.userAgent) && /Android|iPhone/.exec(navigator.userAgent)[0];
	})(window.navigator)
	$.type = function(_){
		return Object.prototype.toString.call(_)
	}
	$.each = function(o, f) {
		for(var i in o){
			if (o.hasOwnProperty(i) && i !== "length") {
				f(i, o[i])
			}
		}
	}
	$.extend = function(oldOne, newOne, deep) {
		var isDeep = deep || false;
		var type = $.type(newOne);
		if (isDeep) {
			for(var d in newOne) {
				switch(type){
					case "[object String]":
					case "[object Number]":
					case "[object Boolean]":{
						oldOne[d] = newOne[d];
						return ;
					}
					case "[object Array]":{
						oldOne[d] = [];
						for (var i = 0, l = newOne[d].length; i < l; i++) {
							oldOne[d].push(newOne[d][i]);
						};
						break;
					}
					case "[object Object]": {
						oldOne[d] = {};
						this.extend(oldOne[d], newOne[d], isDeep);
					}
				}
			}	
			return oldOne;
		}
		switch(type){
			case "[object String]":
			case "[object Number]":
			case "[object Boolean]":{
				oldOne = newOne;
				return ;
			}
			case "[object Array]":{
				for (var i = 0, l = newOne.length; i < l; i++) {
					oldOne[i] = newOne[i];
					if (oldOne.length-1 < i) {
						oldOne.push(newOne[i]);
					}	
				};
				break;
			}
			case "[object Object]": {
				for(var i in newOne){
					oldOne[i] = newOne[i];
				}
			}
		}
		return oldOne;
	}
	$.ajax = function(type, url, obj, callback, async){
		var xhr = new XMLHttpRequest(),
			_async = async,
			_obj = obj || null;

		if ($.type(type) !== "[object String]") {
			throw new Error("参数类型错误");
		}
		var _type = type.toUpperCase();
		if (/POST|GET/.exec(_type) === null) {
			throw new Error("未知的参数:"+type);
		}

		xhr.onreadystatechange = function (){
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					callback(xhr.responseText)
				}else {
					callback("field", xhr.status)
				}
			}
		}
		if ($.type(_async) !== "[object Boolean]") {
			_async = true;
		}
		xhr.open(_type, url, _async || true);
		xhr.send(_obj);
	}
	document.addEventListener("readystatechange", function(e){
		if (document.readyState === "complete") {
			document.body.style.fontSize = document.documentElement.clientWidth/20 + "px";
			// DOM Elements		
			var body = $(document.body);
			var title = $("#title-img");
			var lefthand = $("#lefthand");
			var righthand = $("#righthand");
			var announce = $("#announce");
			var leftAdv = $("#leftAdv");
			var rightAdv = $("#rightAdv");
			var ad1 = $("#ad1");
			var ad2 = $("#ad2");
			var ad3 = $("#ad3");
			var how = $("#how");

			body.addClass("bodyShow");
			title.addClass("moveInLeft");
			lefthand.addClass('handShow');
			righthand.addClass('handShow');
			announce.addClass('handShow');
			leftAdv.addClass('leftAdvShow');
			rightAdv.addClass('rightAdvShow');
			how.on("click", function(){
				showLabel("<t>如何报名：</t><br><article>1. 点击右上角“分享”至朋友圈<br>2. 在朋友圈截图<br>3.  family上搜“感恩节，一起去吃Fun”进入活动页<br>4. 将截图回复至活动页<br>5. 详情见活动页</article><br><span>（PS：现场活动仅限百度员工）羡慕吧？还不是百度员工？无法参加？赶快去点击众测、滴答、外卖线上活动，免费早餐给您送到家！</span>");
			});
			ad1.on("click", function(event){
				var link = ($.os === "iPhone")?"https://itunes.apple.com/us/app/bai-du-wei-ren-wu/id808641624":"http://cq01-testing-sdc06.vm.baidu.com:8373/crowdtest_hzy/crowdtest/iteststore/downloadoffline";
				$.ajax("get", "count.php",{type: "zhongce"},function(data, status){});
				showLabel('点击<a href="'+ link +'">下载APP</a>，进入活动页面（新用户辛苦花3秒下载一下呢），支持你喜欢的菜系，即有机会免费获得价值免费早餐券or众测积分哦！~ ');
			});
			ad2.on("click", function(event){
				$.ajax("get", "count.php",{type: "dida"},function(data, status){
					window.location.href = "http://mp.weixin.qq.com/s?__biz=MzA3MDk0NDczNw==&mid=202312434&idx=1&sn=5d8444c3354f730e178da4b1bae443c6#rd";
				});			
			});
			ad3.on("click", function(event){
				$.ajax("get", "count.php",{type: "waimai"},function(){
					window.location.href = "http://map.baidu.com/zt/y2014/waimai1117/mobile/index.html?fr=tx";
				});
			});

			function showLabel(text){
				$("#label").html(text);
				$("#tips").css("display", "block");
			}

			$("#tips").on("click", tipsClickHandler, false);
			function tipsClickHandler(e){
				e.stopPropagation();
				if (e.target != document.getElementById("label")) {
					$("#tips").css("display", "none");				
				};
			}
		};
	}, false);
})(window, document)