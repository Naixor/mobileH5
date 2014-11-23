;(function(window){
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
		if (/POST|GET/.exec(type.toUpperCase()) === null) {
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
		xhr.open(type, url, _async || true);
		xhr.send(_obj);
	}
	var TouchEvent = (function(navigator) {
		var Start = "touchstart",
			End = "touchend",
			Move = "touchmove",
			mainDiv,
			TouchHandler = {};

		function fixTouch(e) {
			var touch = e.touches[0];
			var winPageX = window.pageXOffset,
				winPageY = window.pageYOffset,
				x = touch.clientX,
				y = touch.clientY;

			if (touch.pageY === 0 && Math.floor(y) > Math.floor(touch.pageY) ||
				touch.pageX === 0 && Math.floor(x) > Math.floor(touch.pageX)) {
				x = x - winPageX;
				y = y - winPageY;
			} else if (y < (touch.pageY - winPageY) || x < (touch.pageX - winPageX) ) {
				x = touch.pageX - winPageX;
				y = touch.pageY - winPageY;
			}
			return $.extend(touch,{
				clientX:    x,
				clientY:    y,
				type: 		"",
				preventDefault: e.preventDefault
			});
		};

		function init (){
			var x1, x2, y1, y2;
			var $touch;
			var isMove = false;

			mainDiv.addEventListener(Start, function (e) {
				e = window.event || e;
				e.preventDefault();
				$touch = fixTouch(e);

				x1 = $touch.clientX;
				y1 = $touch.clientY;

				TouchHandler["start"] && TouchHandler["start"].call(mainDiv, e);
			});

			mainDiv.addEventListener(Move, function (e) {
				e = window.event || e;
				// e.preventDefault();
					
				var touch = fixTouch(e);
				x2 = touch.clientX;
				y2 = touch.clientY;

				isMove = true;

				$touch["type"] = "TouchMove";
				TouchHandler["move"] && TouchHandler["move"].call(mainDiv, $touch);
			});

			mainDiv.addEventListener(End, function (e) {
				if(Math.abs(x1-x2) < 50 && Math.abs(y1-y2) < 50) {
					isMove = false;
				}

				if (isMove) {
					if (Math.abs(x1-x2) > Math.abs(y1-y2)) {
						//left or right
						if ((x1-x2) < -100) { //right
							isMove = false;
							
							$touch["type"] = "TouchRight";

							TouchHandler["right"] && TouchHandler["right"].call(mainDiv, $touch);
						}
						else if((x1-x2) > 100) { //left
							isMove = false;
							
							$touch["type"] = "TouchLeft";
							TouchHandler["left"] && TouchHandler["left"].call(mainDiv, $touch);
						}
					}
					else {
								// up or down
						if(y1-y2 > 100) { //up
							isMove = false;

							$touch["type"] = "TouchUp";								
							TouchHandler["up"] && TouchHandler["up"].call(mainDiv, $touch);
						}
						else if (y1-y2 < -100){ //down
							isMove = false;

							$touch["type"] = "TouchDown";
							TouchHandler["down"] && TouchHandler["down"].call(mainDiv, $touch);
						}
					}
				}else {
					$touch["type"] = "TouchTap";
					TouchHandler["tap"] && TouchHandler["tap"].call(mainDiv, $touch);
				}
			});
		}
		return {
			bindElement: function(ele) {
				mainDiv = ele;
				init();
				return this;
			},
			registerHandler: function(type, func) {
				TouchHandler[type] = func;
				return this;
			},
			touchRight: function(func) {
				return this.registerHandler("right", func);
			},
			touchLeft: function(func) {
				return this.registerHandler("left", func);
			},
			touchUp: function(func) {
				return this.registerHandler("up", func);
			},
			touchDown: function(func) {
				return this.registerHandler("down", func);
			},
			tap: function (func) {
				return this.registerHandler("tap", func);
			}
		}
	})(navigator);

	var requireIMG = function(arr, handler){
		var sources = {};
		var length = 0;
		for(var i = 0, l = arr.length;i < l;i++){
			sources[arr[i]] = new Image();
			sources[arr[i]].onload = function(){
				if (++length === l) {
					handler.call(window, sources);
				};
			};
			sources[arr[i]].src = arr[i];
		}
	}

	var HerizonSwitch = function (ele, config){
		var that = this,
			back = ele,
			childrenDiv = back.children(".main"),
			_config = $.extend({
				switchIndex: 0,
				moveTime: 1,
				shake: 0.3
			}, config);
		that.nowSwitchIndex = _config.switchIndex;
		var width = back.css("width"),
			height = back.css("height");

			back.css({
				overflow: "visible",
				webkitTransform: "translate3d("+(-1)*that.nowSwitchIndex*width+"px,0%,0)",
				webkitTransition: "all "+_config.moveTime+"s linear"
			});
			$.each(childrenDiv, function(key, val){
				$(val).css({
					position: "absolute",
					width: width+"px",
					height: height+"px",
					left: key*width+"px"
				});
			});
		
		var _switchIndex = function (index, callback) {
			var length = childrenDiv.length;
			if (index >= length) {
				that.nowSwitchIndex = length-1;
				return;
			}else if(index < 0){
				that.nowSwitchIndex = 0;
				return;
			}
			that.nowSwitchIndex = index;				
			back.css("webkitTransform", "translate3d("+(-1)*that.nowSwitchIndex*width+"px,0,0)");
			if (callback != undefined && callback instanceof Function) {
				// setTimeout(function(){
					callback(that.nowSwitchIndex);
				// }, 1000);
			}
		}

		_switchIndex(that.nowSwitchIndex);
		return {
			nowIndex: function(){
				return that.nowSwitchIndex
			},
			switchIndex: function(index, callback) {
				_switchIndex(index, callback);
			},
			switchNext: function(callback){
				_switchIndex(that.nowSwitchIndex+1, callback);
			},
			switchPrev: function(callback){
				_switchIndex(that.nowSwitchIndex-1, callback);
			},
			move: function(callback){
				callback(this)
			}
		}
	};

	document.addEventListener("DOMContentLoaded", function(e){
		var stageHeight = 1.2379 * $(document.body).css("width");
		// alert(stageHeight);
		$.each(document.querySelectorAll(".stage"), function(key, val){
			$(val).css({
				height: stageHeight + "px",
				top: ($(document.body).css("height") - stageHeight)/4 + "px"
			});
		});
		requireIMG([
			"./source/index/pm.png",
			"./source/index/cloud1.png",
			"./source/index/cloud2.png",
			"./source/index/floor.png",
			"./source/index/rd.png",
			"./source/index/rd2.png",
			"./source/index/table-rd.png",
			"./source/index/shoose.png",
			"./source/index/clock.png",
			"./source/index/qa.png",
			"./source/index/qa2.png",
			"./source/index/table-qa.png",
			"./source/index/magnifier.png",
			"./source/index/paper.png"
		], startHandler);

		var pm = $("#pm"),
			floorImg = $("#floor-img"),
			cloud = $("#cloud"),
			rd = $("#rd"),
			shoose = $("#shoose"),
			qa = $("#qa"),
			magnifier = $("#magnifier"),
			fe = $("#fe"),
			ue = $("#ue"),
			ueimage = $("#ueimage"),
			speak1 = $("#speak1"),
			speak2 = $("#speak2"),
			speak3 = $("#speak3"),
			rdImg1 = $("#rdImg1"),
			rdImg2 = $("#rdImg2"),
			qaImg1 = $("#qaImg1"),
			qaImg2 = $("#qaImg2"),
			feImg1 = $("#feImg1"),
			feImg2 = $("#feImg2"),
			ueImg1 = $("#ueImg1"),
			ueImg2 = $("#ueImg2"),
			sixPage = $("#six"),
			rdF = $("#rd-f"),
			qaF = $("#qa-f"),
			feF = $("#fe-f"),
			ueF = $("#ue-f"),
			pmF = $("#pm-f");
			arrow = $("#arrow");

		function startHandler(res){
			$("#loading").css("display", "none");
			$("#container").css("display", "block");
			var SHAKE_THRESHOLD = 3000;
			var last_update = 0;
			var x = y = z = last_x = last_y = last_z = 0;
			var herizon = new HerizonSwitch($(".herizon"), {moveTime: 1}); 
			TouchEvent.bindElement(document.body).touchLeft(function(e){
				herizon.move(function(move){
					if (move.nowIndex() === 0){
						floorImg.addClass('floorMoveOut');
						setTimeout(function(){
							move.switchNext(switchNextHandler);											
						}, 700);
					}else {
						move.switchNext(switchNextHandler);					
					}
				});
			}).touchRight(function (e){
				herizon.switchPrev(switchPrevHandler)
			});

			cloud.addClass('cloudMove');
			floorImg.addClass('floorMoveIn');
			setTimeout(function(){
				pm.addClass('pm');
			},0);
			setTimeout(function(){
				speak1.css("display", "block");
			}, 750);

			function deviceMotionHandler(eventData) {
			    var acceleration = eventData.accelerationIncludingGravity;
			    var curTime = new Date().getTime();
			    if ((curTime - last_update)> 100) {
			        var diffTime = curTime -last_update;
			        last_update = curTime;
			        x = acceleration.x;
			        y = acceleration.y;
			        z = acceleration.z;
			        var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;
			 
			        if (speed > SHAKE_THRESHOLD) {
			        	window.location.href = window.location.pathname+"/main.html";
			        }
			        last_x = x;
			        last_y = y;
			        last_z = z;
			    }
			}

			function switchNextHandler (index){
				var speakTimeout = undefined;
				switch(index) {
					case 1:{
						speak1.css("display", "none");
						speakTimeout = setTimeout(function(){
							speak2.css("display", "block");
							rdImg2.css("display", "none");
							rdImg1.css("display", "block");
						}, 1750);
						setTimeout(function(){
							shoose.addClass('shooseDown');						
						}, 1250);
						pm.addClass('pm-left');
						setTimeout(function(){
							rd.addClass('pm');
						}, 500);
						break;
					}
					case 2:{
						rd.addClass('rdLeave');
						setTimeout(function(){
							qa.addClass('pm');
							magnifier.addClass('magnifierMv');
						}, 500);
						speak2.css("display", "none");	
						clearTimeout(speakTimeout);
						speakTimeout = setTimeout(function(){
							speak2.css("display", "block");
							qaImg2.css("display", "none");
							qaImg1.css("display", "block");
						}, 1750);
						setTimeout(function(){
							rd.removeClass('rdLeave');
							rdImg1.css("display", "none");
							rdImg2.css("display", "block");
						}, 1250);
						break;
					}
					case 3:{
						qa.addClass('qaLeave');
						speak2.css("display", "none");
						clearTimeout(speakTimeout);
						speakTimeout = setTimeout(function(){
							speak2.css("display", "block");
							feImg2.css("display", "none");
							feImg1.css("display", "block");
						}, 1750);
						setTimeout(function(){
							qa.removeClass('qaLeave');
							qaImg1.css("display", "none");
							qaImg2.css("display", "block");
						}, 1250);
						setTimeout(function(){
							fe.addClass('pm');
						}, 500);
						break;
					}
					case 4:{
						fe.addClass('feLeave');
						speak2.css("display", "none");
						clearTimeout(speakTimeout);
						speakTimeout = setTimeout(function(){
							speak2.css("display", "block");
							ueImg2.css("display", "none");
							ueImg1.css("display", "block");
						}, 1750);
						setTimeout(function(){
							fe.removeClass('feLeave');
							feImg1.css("display", "none");
							feImg2.css("display", "block");
						}, 1250);
						setTimeout(function(){
							ue.addClass('pm');
						}, 500);
						setTimeout(function(){
							ueimage.addClass('hinge');
						}, 1500);
						break;
					}
					case 5:{
						window.addEventListener('devicemotion',deviceMotionHandler, false);
						clearTimeout(speakTimeout);
						speak2.css("display", "none");
						arrow.css("display","none");
						pm.addClass('pmLeave');
						ue.addClass('ueLeave');
						rdF.addClass('rd-f');
						qaF.addClass('qa-f');
						feF.addClass('fe-f saliva');
						ueF.addClass('ue-f');
						setTimeout(function(){
							pmF.css("display", "block");
							speak2.css("display", "none");
						}, 750);
						setTimeout(function(){
							ue.removeClass('ueLeave');
							ueImg1.css("display", "none");
							ueImg2.css("display", "block");
							speak3.css("display", "block");
						}, 1250);
						setTimeout(function(){
							$(pmF.children('img')[1]).css("webkitTransform", "translate(0,0)");
						}, 2750)
						sixPage.addClass('sixPageBack');
						break;
					}
				}
			}
			function switchPrevHandler (index){
				var speakTimeout = undefined;
				switch(index){
					case 0:{
						speak2.css("display", "none");
						pm.removeClass('pm-left');
						shoose.removeClass('shooseDown');
						rd.removeClass('pm');
						rdImg1.css("display", "none");
						rdImg2.css("display", "block");
						clearTimeout(speakTimeout);
						speakTimeout = setTimeout(function(){
							floorImg.removeClass('floorMoveOut');
							speak1.css("display", "block");
						}, 1250);
						break;
					}
					case 1:{
						speak2.css("display", "none");
						clearTimeout(speakTimeout);
						speakTimeout = setTimeout(function(){
							speak2.css("display", "block");
							rdImg2.css("display", "none");
							rdImg1.css("display", "block");
						}, 1750);
						qa.removeClass('pm');
						qaImg1.css("display", "none");
						qaImg2.css("display", "block");
						break;	
					}
					case 2:{
						speak2.css("display", "none");
						clearTimeout(speakTimeout);
						speakTimeout = setTimeout(function(){
							speak2.css("display", "block");
							qaImg2.css("display", "none");
							qaImg1.css("display", "block");
						}, 1750);
						fe.removeClass('pm');
						feImg1.css("display", "none");
						feImg2.css("display", "block");
						break;
					}
					case 3:{
						speak2.css("display", "none");
						clearTimeout(speakTimeout);
						speakTimeout = setTimeout(function(){
							speak2.css("display", "block");
							feImg2.css("display", "none");
							feImg1.css("display", "block");
						}, 1750);
						ue.removeClass('pm');
						ueImg1.css("display", "none");
						ueImg2.css("display", "block");
						ueimage.removeClass('hinge');
						break;
					}
					case 4:{
						clearTimeout(speakTimeout);
						speakTimeout = setTimeout(function(){
							speak2.css("display", "block");
							ueImg2.css("display", "none");
							ueImg1.css("display", "block");
						}, 1750);
						window.removeEventListener('devicemotion',deviceMotionHandler, false);
						speak3.css("display", "none");	
						arrow.css("display","block");
						pm.removeClass('pmLeave');
						pm.addClass('pm-left');
						rdF.removeClass('rd-f');
						qaF.removeClass('qa-f');
						feF.removeClass('fe-f');
						ueF.removeClass('ue-f');
						pmF.css("display", "none");
						sixPage.removeClass('sixPageBack');
						$(pmF.children('img')[0]).css("webkitTransform", "translate(0,-50%)");	
						break;
					}
				}
			}
		}
	}, false);
})(window)