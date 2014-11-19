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
				},
				children: function(_){
					return that.qsa(this.node, _)
				}
			}
		}
		return new Node(_)
	}
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
		var back = ele,
			childrenDiv = back.children(".main"),
			_config = $.extend({
				switchIndex: 0,
				moveTime: 1,
				shake: 0.3
			}, config),
			nowSwitchIndex = _config.switchIndex;

			back.css({
				overflow: "visible",
				webkitTransform: "translate3d("+(-1)*nowSwitchIndex*100+"%,0%,0)",
				webkitTransition: "all "+_config.moveTime+"s linear"
			});
			$.each(childrenDiv, function(key, val){
				$(val).css({
					position: "absolute",
					width: "100%",
					height: "100%",
					left: key*100+"%"
				});
			});
		var _switchIndex = function (index, callback) {
			var length = childrenDiv.length
			if (index >= length) {
				nowSwitchIndex = length-1;
				return;
			}else if(index < 0){
				nowSwitchIndex = 0;
				return;
			}
			nowSwitchIndex = index;				
			back.css("webkitTransform", "translate3d("+(-1)*nowSwitchIndex*100+"%,0,0)");
			if (callback != undefined && callback instanceof Function) {
				// setTimeout(function(){
					callback(nowSwitchIndex);
				// }, 1000);
			}

		}
		_switchIndex(nowSwitchIndex);
		return {
			switchIndex: function(index, callback) {
				_switchIndex(index, callback);
			},
			switchNext: function(callback){
				_switchIndex(nowSwitchIndex+1, callback);
			},
			switchPrev: function(callback){
				_switchIndex(nowSwitchIndex-1, callback);
			}
		}
	};

	var stageHeight = 1.2379 * window.screen.availWidth;
	$.each(document.querySelectorAll(".stage"), function(key, val){
		$(val).css({
			height: stageHeight + "px",
			top: ($(document.body).css("height") - stageHeight)/2 + "px"
		});
	});

	document.addEventListener("DOMContentLoaded", function(e){
		requireIMG([
			"./source/index/pm.png",
			"./source/index/cloud1.png",
			"./source/index/cloud2.png",
			"./source/index/floor.png",
			"./source/index/rd.png",
			"./source/index/table-rd.png",
			"./source/index/shoose.png",
			"./source/index/clock.png",
			"./source/index/qa.png",
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
			ueimage = $("#ueimage");

		function startHandler(res){
			$("#loading").css("display", "none");
			$("#container").css("display", "block");
			var herizon = new HerizonSwitch($(".herizon"), {moveTime: 1.5}); 
			// herizon.switchIndex(0, switchHandler);
			TouchEvent.bindElement(document.body).touchLeft(function(e){
				herizon.switchNext(switchNextHandler)
			}).touchRight(function (e){
				herizon.switchPrev(switchPrevHandler)
			}).tap(function(e){

			});


			cloud.addClass('cloudMove');
			floorImg.addClass('floorMoveIn');

			setTimeout(function(){
				pm.addClass('pm');
			},0);

			function switchNextHandler (index){
				switch(index) {
					case 0:{
						floorImg.addClass('floorMoveIn');
						break;
					}
					case 1:{
						floorImg.addClass('floorMoveOut');
						pm.addClass('pm-left');
						setTimeout(function(){
							rd.addClass('pm');
						}, 1000)
						setTimeout(function(){
							shoose.addClass('shooseDown');						
						}, 1500);
						break;
					}
					case 2:{
						setTimeout(function(){
							qa.addClass('pm');
							magnifier.addClass('magnifierMv');
						}, 500);
						break;
					}
					case 3:{
						setTimeout(function(){
							fe.addClass('pm');
						}, 500);
						break;
					}
					case 4:{
						setTimeout(function(){
							ue.addClass('pm');
						}, 500);
						setTimeout(function(){
							ueimage.addClass('hinge');
						}, 1500);
						break;
					}
				}
			}
			function switchPrevHandler (index){
				switch(index){
					case 0:{
						floorImg.removeClass('floorMoveOut');
						shoose.removeClass('shooseDown');
						rd.removeClass('pm');
						break;
					}
					case 1:{
						qa.removeClass('pm');
						break;	
					}
					case 2:{
						fe.removeClass('pm');
						break;
					}
					case 3:{
						ue.removeClass('pm');
						ueimage.removeClass('hinge');
						break;
					}
				}
			}
		}
	}, false);
})(window)