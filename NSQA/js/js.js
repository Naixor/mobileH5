(function(window){
	/*
	*	svg内部元素无法正常使用classList,在IOS设备上完美工作,但是移植到Android设备上出现异常；
	*	因此该用最原始的className去去除和添加class
	*/ 
	var EventUtil = (function (){
		var _addEvent = function(ele, type, func, capture){
			if (window.addEventListener) {
				ele.addEventListener(type, func, capture || false);
				return;
			}else if (window.attachEvent) {
				ele.attachEvent("on"+type, func, capture || false);
				return;
			}else {
				ele["on"+type] = func;
			}
		}

		var _addClass = function(ele, classNames) {
			var initialClassName = ele.className;
			ele.setAttribute("class", initialClassName + " "+ classNames.toString().replace(/,/g," "));
		}

		var _removeClass = function(ele, classNames) {
			var initialClassName = ele.className;
			for (var l = classNames.length-1;-1 < l; l--) {
				ele.setAttribute("class", initialClassName.toString().replace(classNames[l],""));
			};
		}
		
		return {
			addEvent: _addEvent,
			addClass: _addClass,
			removeClass: _removeClass
		}
	})();

	window.EventUtil = EventUtil;

	var Orientation = function(selector) {
		this.selector = selector;
    }
    Orientation.prototype.init = function(){
        window.addEventListener('deviceorientation', this.orientationListener.bind(this));
        window.addEventListener('MozOrientation', this.orientationListener.bind(this));
        window.addEventListener('devicemotion', this.orientationListener.bind(this));
    }
    Orientation.prototype.clear = function(){
        window.removeEventListener('MozOrientation', this.orientationListener.bind(this));
    	window.removeEventListener('deviceorientation', this.orientationListener.bind(this));
        window.removeEventListener('devicemotion', this.orientationListener.bind(this));
    }
    Orientation.prototype.orientationListener = function(evt) {
			// For FF3.6+
		if (!evt.gamma && !evt.beta) {
		// angle=radian*180.0/PI 在firefox中x和y是弧度值,
			evt.gamma = (evt.x * (180 / Math.PI)); //转换成角度值,
			evt.beta = (evt.y * (180 / Math.PI)); //转换成角度值
			evt.alpha = (evt.z * (180 / Math.PI)); //转换成角度值
		}
		/* beta:  -180..180 (rotation around x axis) */
		/* gamma:  -90..90  (rotation around y axis) */
		/* alpha:    0..360 (rotation around z axis) (-180..180) */

		var gamma = evt.gamma;
		var beta = evt.beta;
		var alpha = evt.alpha;

		if(evt.accelerationIncludingGravity){
		// window.removeEventListener('deviceorientation', this.orientationListener, false);
			gamma = event.accelerationIncludingGravity.x*10
			beta = -event.accelerationIncludingGravity.y*10
			alpha = event.accelerationIncludingGravity.z*10
		}
		if (this._lastGamma != gamma || this._lastBeta != beta) {
			this.selector.style.webkitTransform = "translate3d("+gamma/90 * 150+"px,"+ beta/90 * 60 +"px,0)";
			this._lastGamma = gamma;
			this._lastBeta = beta;	   	
		}
    };
    window.Orientation = Orientation;
	

	window.TouchEvent = (function(EventUtil, navigator) {
		var _touch = isNotPC(),
			Start = _touch ? "touchstart" : "mousedown",
			End = _touch ? "touchend" : "mouseup",
			Move = _touch ? "touchmove" : "mousemove",
			mainDiv,
			TouchHandler = {};

		function isNotPC() {
			var userAgentInfo = navigator.userAgent; 
			var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"); 
			var flag = false; 
			for (var v = 0; v < Agents.length; v++) { 
				if (userAgentInfo.indexOf(Agents[v]) > 0) { 
					flag = true; 
					break;
				}
			}
			return flag;
		};
		function fixTouch(e) {
			var touch = _touch ? e.touches[0] : e;
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
			return extend(touch,{
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
	})(EventUtil, navigator);

	var getPx = function (value) {
		return (value+"px").toString();
	}
	var getValue = function (string) {
		return parseInt(/\d+/.exec(string)[0]);
	}
	function extend(target, src) {
		for( var d in src) {
			if (src.hasOwnProperty(d)) {
				target[d] = src[d];
			}
		}
		return target;
	}
	function GetCurrentStyle (obj, prop) {     
	    if (obj.currentStyle) {        
	        return obj.currentStyle[prop];     
	    }      
	    else if (window.getComputedStyle) {        
	        propprop = prop.replace (/([A-Z])/g, "-$1");           
	        propprop = prop.toLowerCase ();        
	        return document.defaultView.getComputedStyle(obj,null)[prop];     
	    }      
	    return null;   
	}

	var VerticalSwitch = function (ele, config){
		var back = ele,
			childrenDiv = back.getElementsByClassName("main"),
			_config = extend({
				switchIndex: 0,
				moveTime: 1,
				shake: 0.3
			}, config),
			nowSwitchIndex = _config.switchIndex;

			extend(back.style, {
				overflow: "visible",
				webkitTransform: "translate3d(0,"+(-1)*nowSwitchIndex*100+"%,0)",
				webkitTransition: "all "+_config.moveTime+"s cubic-bezier(.36,.84,.36,.84)"
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
			back.style.webkitTransform = "translate3d(0,"+(-1)*nowSwitchIndex*100+"%,0)";
			if (callback != undefined && callback instanceof Function) {
				callback(nowSwitchIndex);
			};
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

	var RotateSwitch = function (ele,config) {
		var back = ele,
			childrenDiv = back.getElementsByClassName("rotateMain"),
			_config = extend({
				intervalRotate: 45,
				switchIndex: 0,
				rotateRadius: getValue(GetCurrentStyle(document.querySelector(".container"), "height")),
				rotateTime: 1,
				shake: 0.3
			}, config),
			nowSwitchIndex = _config.switchIndex,
			lastSwitchIndex,
			backDiv = {
				width: getValue(GetCurrentStyle(back, "width")),
				height: getValue(GetCurrentStyle(back, "width")),
				cx: getValue(GetCurrentStyle(back, "width"))/2,
				cy: _config.rotateRadius
			};

		var deg = function (rotate) {
			return Math.PI*rotate / 180;
		}

		for (var i = 0, l = childrenDiv.length; i < l; i++) {
			var ir = _config.intervalRotate*i,
				H = window.screen.availHeight,
				R = _config.rotateRadius;
			extend(childrenDiv[i].style, {
				opacity: "0",
				top: getPx((R-H/2) * (1-Math.cos(deg(ir))) - R+backDiv.cx),
				left: getPx((R-H/2) * Math.sin(deg(ir))),
				height: getPx(H),
				webkitTransition: "opacity "+_config.rotateTime+"s cubic-bezier(.36,.84,.36,.84)",
				webkitTransform: "rotate("+ir+"deg)" 
			});
		};

		extend(back.style, {
			top: getPx(backDiv.cy - backDiv.height/2),
			left: "0px",
			width: getPx(backDiv.width),
			height: getPx(backDiv.height),
			overflow: "visible",
			webkitTransition: "-webkit-transform "+_config.rotateTime+"s cubic-bezier(.36,.84,.36,.84)"
		});


		return {
			nowIndex: function(){
				return nowSwitchIndex;
			},
			switchIndex: function (index, callback) {
				if (index >= childrenDiv.length) {
					nowSwitchIndex = childrenDiv.length - 1;
					// to do
					setTimeout(function(){
						extend(back.style, {
							webkitTransform: "rotate("+(-1)*(nowSwitchIndex+_config.shake)*_config.intervalRotate+"deg)"
						});
					}, _config.rotateTime*500);
					setTimeout(function(){
						extend(back.style, {
							webkitTransform: "rotate("+(-1)*nowSwitchIndex*_config.intervalRotate+"deg)"
						});
					}, _config.rotateTime*1000);
					return;
				}else if (index < 0) {
					nowSwitchIndex = 0;
					//to do
					setTimeout(function(){
						extend(back.style, {
							webkitTransform: "rotate("+(-1)*(nowSwitchIndex-_config.shake)*_config.intervalRotate+"deg)"
						});
					}, _config.rotateTime*500);
					setTimeout(function(){
						extend(back.style, {
							webkitTransform: "rotate("+(-1)*nowSwitchIndex*_config.intervalRotate+"deg)"
						});
					}, _config.rotateTime*1000);
					return;
				}
				nowSwitchIndex = index;
				if (lastSwitchIndex!=undefined) {
					childrenDiv[lastSwitchIndex].style.opacity = "0";
				};
				childrenDiv[nowSwitchIndex].style.opacity = "1";
				lastSwitchIndex = nowSwitchIndex;					
				back.style.webkitTransform = "rotate("+(-1)*nowSwitchIndex*_config.intervalRotate+"deg)"
			
				if (callback != undefined && callback instanceof Function) {
					setTimeout(function(){
						callback(nowSwitchIndex);
					}, _config.rotateTime*1000);
				};
			},
			switchNext: function(callback){
				this.switchIndex(nowSwitchIndex+1, callback);
			},
			switchPrev: function(callback){
				this.switchIndex(nowSwitchIndex-1, callback);
			}
		}
	};

	window.Switch = (function(v, r){
		return {
			Vertical: v,
			Rotate: r
		}
	})(VerticalSwitch, RotateSwitch);
})(window);

var $EventUtil = EventUtil;


document.onreadystatechange = function(){
	if(document.readyState == "complete"){
		_$("main").innerText = "100%";
		setTimeout("appLoad()", 300);
	}
}
// document.addEventListener("DOMContentLoaded", function(){
// 	appLoad();
// }, false);

// window.onload = function(){
// 	appLoad();
// }

window.onresize = function(e){
	e.stopPropagation();
	e.preventDefault();
}

function appLoad() {
	var	earths = document.querySelectorAll(".earth"),
		treeHeight = _$("IDL").height,
		firstCome = true;

	for (var i = earths.length - 1; i >= 0; i--) {
		var w = window.screen.availWidth;
		earths[i].width = earths[i].height = w;
		var ctx = earths[i].getContext("2d");
		ctx.drawImage(app.res["earth"],0,0,w,w);
	};
	_$("search").getContext("2d").drawImage(app.res["tree"], 0,0,_$("search").width,_$("search").height*5);
	_$("IDL").getContext("2d").drawImage(app.res["tree"], 0, -treeHeight, _$("IDL").width,treeHeight*5);
	_$("knowledge").getContext("2d").drawImage(app.res["tree"], 0, -treeHeight*2, _$("knowledge").width, treeHeight*5);
	_$("common").getContext("2d").drawImage(app.res["tree"], 0, -treeHeight*3, _$("common").width, treeHeight*5);
	
	_$("phonecommon").getContext("2d").drawImage(app.res["tree"], 0, -treeHeight*4,_$("phonecommon").width, treeHeight*5);

	var orient, iphone = false;
	if (/iPhone/.test(navigator.userAgent)) {
		orient = new Orientation(_$("starDiv"));
		iphone = true;
	}else {
		$EventUtil.addClass(_$("du"), "display");
		$EventUtil.addClass(_$("line1"), 'display'); 
		$EventUtil.addClass(_$("line2"), 'display'); 
		$EventUtil.addClass(_$("line3"), 'display'); 
		$EventUtil.addClass(_$("line4"), 'display'); 
	}

	var PageAnimate = function () {
		this.element = [];
		this.elementClasses = [];
	};
	PageAnimate.prototype.init = function(func) {
		func(this);
	}
	PageAnimate.prototype.regist = function (ele, classes) {
		this.element.push(ele);
		this.elementClasses.push(classes);
	}
	PageAnimate.prototype.simulate = function(){
		var ele = this.element,
			cla = this.elementClasses;
		for(var i = ele.length-1;i > -1;i--) {
			$EventUtil.addClass(ele[i], cla[i]);
			ele[i].style.display = "block";
		}
	}
	PageAnimate.prototype.clear = function () {
		var ele = this.element,
			cla = this.elementClasses;
		for(var i = ele.length-1;i > -1;i--) {
			ele[i].style.display = "none";
			var rm = (function (ele, cla, i){
				$EventUtil.removeClass(ele[i], cla[i]);
			})(ele, cla, i)
			setTimeout(function(){
				rm;
			},200);
		}
	}

	var page0 = new PageAnimate();
	var page1 = new PageAnimate();
	var page2 = new PageAnimate();
	var page3 = new PageAnimate();
	var page6 = new PageAnimate();

	page0.init(function(page){
		if (iphone) {
			page.regist(_$("du"), ["du", "animate-forwards"]);
			page.regist(_$("du1"), ["du-one", "animate-forwards"]);
			page.regist(_$("youwantus"), ["youwantus","animate-forwards"]);
			page.regist(_$("line1"), ["line1", "animate-forwards"]); 
			page.regist(_$("line2"), ["line2", "animate-forwards"]); 
			page.regist(_$("line3"), ["line3", "animate-forwards"]); 
			page.regist(_$("line4"), ["line4", "animate-forwards"]); 
			page.regist(_$("title1"), ["title1", "animate-forwards"]);
		}else{
			page.regist(_$("du1"), ["du-one-android", "animate-forwards"]);
			page.regist(_$("youwantus"), ["youwantus-android","animate-forwards"]);
			page.regist(_$("title1"), ["title1-android", "animate-forwards"]);
		}
	});
	page1.init(function(page){
		if (iphone) {
			page.regist(_$("circle-line"), ["path"]);		
		}else {
			page.regist(_$("Layer_1"), ["path-android"])
		}
		page.regist(_$("spiderman"), ["spiderman"]);
		page.regist(_$("spiderman-text"), ["spiderman-text"]);
		page.regist(_$("spiderman-logo"), ["spiderman-logo"]);
		page.regist(_$("ironman"), ["ironman"]);
		page.regist(_$("ironman-text"), ["ironman-text"]);
		page.regist(_$("ironman-logo"), ["ironman-logo"]);
		page.regist(_$("point2"), ["point2"]);
	});
	page2.init(function(page){
		if (_$("remind")) {
			page.regist(_$("finger"), ["fingerAnimate"]);
			page.regist(_$("finger_circle"), ["fingerPointAnimate"]);
		};
		page.regist(_$("lightning"), ["lightning-anim"]);
		page.regist(_$("ironman-top"), ["hero-top"]);
		page.regist(_$("search"), ["direction-show"]);
		page.regist(_$("IDL"), ["direction-show"]);
		page.regist(_$("knowledge"), ["direction-show"]);
		page.regist(_$("common"), ["direction-show"]);
	});
	page3.init(function(page){
		page.regist(_$("web"), ["lightning-anim"]);
		page.regist(_$("spiderman-top"), ["hero-top"]);
		page.regist(_$("phonecommon"), ["direction-show"]);
	});
	page6.init(function(page){
		page.regist(_$("surport"), ["surport"]);
	});


	var rotateSwitch1 = new Switch.Rotate(document.querySelectorAll(".rotate")[0], {intervalRotate:60,rotateRadius:568});
	var rotateSwitch2 = new Switch.Rotate(document.querySelectorAll(".rotate")[1], {intervalRotate:60,rotateRadius:568});

	var verticalSwitch = new Switch.Vertical(document.querySelector(".vertical"), {});

	function vSwitch(index) {
		if (index === 0) {			
			document.body.style.backgroundColor = "black";
			orient && orient.init();
			page1.clear();
			page0.simulate();
			return;
		};
		if (index === 1) {
			orient && orient.clear();
			document.body.style.backgroundColor = "rgb(153, 19, 20)";
			page2.clear();
			page0.clear();
			page1.simulate();
			return;
		};
		if (index === 2) {
			document.body.style.backgroundColor = "rgb(225,175,45)";
			rotateSwitch1.switchIndex(0, function(){});
			page3.clear();
			page1.clear();
			page2.simulate();
			return;
		};
		if (index === 3) {
			document.body.style.backgroundColor = "rgb(152, 37, 40)";

			rotateSwitch2.switchIndex(0, function(){});
			page2.clear();
			page3.simulate();
			page6.clear();
			return;
		};
		if (index === 4) {
			page3.clear();
			page6.simulate();
			return;
		};
	}

	var oldSwitchIndex1 = -1,
		oldSwitchIndex2 = -1;

	function RotateSimulate(tcn, type) {
		if (/pageThree/.test(tcn)) {
			rotateSwitch1[type](function(index){

			});
			return;
		}
		if (/pageFour/.test(tcn)) {
			rotateSwitch2[type](function(index){

			});
			return;
		}
	}

	TouchEvent.bindElement(document.body).touchLeft(function(e){

		RotateSimulate(e.target.className, "switchNext");

	}).touchRight(function (e){
		
		RotateSimulate(e.target.className, "switchPrev");
		
	}).touchUp(function(e){
		verticalSwitch.switchNext(function(index){
			vSwitch(index);
		});
	}).touchDown(function(e){
		verticalSwitch.switchPrev(function(index){
			vSwitch(index);
		});
	}).tap(function(e){
		switch(e.target.id) {
			case "search": {
				rotateSwitch1.switchIndex(0);
				break;
			}
			case "IDL": {
				rotateSwitch1.switchIndex(1);
				break;
			}
			case "knowledge": {
				rotateSwitch1.switchIndex(2);
				break;
			}
			case "common": {
				rotateSwitch1.switchIndex(3);
				break;
			}
			default: {
				if ((e.target && e.target.parentNode.id) == "arrow7") {
					verticalSwitch.switchIndex(0);
					vSwitch(0);
				};
			}
		}
	}).registerHandler("start", function(e){
		if (e.target.getAttribute("data-target") === "remindDiv") {
			_$("remind").parentNode.removeChild(_$("remind"));
		};
	});

	_$("loadAnimate").style.display = "none";
	$EventUtil.addClass(_$("rocket"), ["rocketfly"]);
	setTimeout(function(){
		_$("loading").style.display = "none";
		$EventUtil.addClass(_$("loading"), ["zIndexDown"]);
		vSwitch(0);
	}, 2000);
}