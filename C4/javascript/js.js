(function(window,$){
	window.TouchEvent = (function(navigator, $) {
		var _touch = isNotPC(),
			Start = "touchstart",
			End = "touchend",
			Move = "touchmove",
			Cancel = "touchcancel",
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

				TouchHandler["start"] && TouchHandler["start"].call(mainDiv, $touch);
			},false);

			mainDiv.addEventListener(Move, function(e) {
				e = window.event || e;
				e.preventDefault();
					
				$touch = fixTouch(e);
				x2 = $touch.clientX;
				y2 = $touch.clientY;

				isMove = true;

				$touch["type"] = "TouchMove";
				TouchHandler["move"] && TouchHandler["move"].call(mainDiv, $touch);					
			},false);

			mainDiv.addEventListener(End, function (e) {
				TouchHandler["end"] && TouchHandler["end"].call(mainDiv, $touch);

				if (TouchHandler["right"] || TouchHandler["left"] || TouchHandler["up"] || TouchHandler["down"] || TouchHandler["tap"]) {
					return;
				}

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
			},false);

			mainDiv.addEventListener(Cancel, function(e){
				$touch["type"] = "TouchCancel";
				TouchHandler["cancel"] && TouchHandler["cancel"].call(mainDiv, $touch);
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
			touchStart: function(func) {
				return this.registerHandler("start", func);
			},
			touchMove: function (func){
				return this.registerHandler("move", func);
			},
			touchEnd: function (func){
				return this.registerHandler("end", func);
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
	})(window.navigator, $);

	function getValue(str){
		return parseInt(/\d+/.exec(str)[0]);
	}

	window.Orientation = function(ele) {
		this.ele = ele;
		this._lastGamma = 0;
		this._lastBeta = 0;
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
		if (Math.abs(this._lastGamma - gamma) > 5) {
			this.ele.style.webkitTransform = "rotateY("+(gamma-30)+"deg)";
			this._lastGamma = gamma;  	
		}
    };

	window.VirticalSwitch = function(ele, opt){
		var nowIndex = 0,
			root = $(ele),
			verChildren = root.children('.main'),
			maxIndex = verChildren.length-1,
			touchStartY = 0,
			d = 0,
			containerHeight = getValue(getComputedStyle(document.body)["height"]);

		var _opt = {
			dur: opt.dur || 0.75,
			callback: opt.callback || function(){},
			perspective: opt.perspective || 500
		}

		root.css({
			position: 'absolute',
			width: '100%',
			height: '100%',
			top: '0',
			left: '0',
			overflowY: 'visible',
			perspective: _opt.perspective
		});

		verChildren.each(function(index, val) {
			var top = -100,
				zIndex = 100;
			if(nowIndex !== index){
				top = 0;
				zIndex = -100;
			};
			$(this).css({
				position: "absolute",
				width: "100%",
				height: "100%",
				top: "100%",
				webkitTransform: "translate3d(0,"+top+"%,0)",
				overflow: "hidden"
			});
		});

		TouchEvent.bindElement(document.querySelector(".vertical")).touchStart(function(event){
			touchStartY = event.clientY;
		}).touchMove(function(event){
			d = event.clientY-touchStartY;
			//d > 0 : down 
			//d < 0 : up

			if ( d < 0 ) {
				if (nowIndex !== maxIndex) {
					verChildren.eq(nowIndex).css({
						opacity: 1+d/containerHeight,
						transform: "translate3d(0,-100%,"+(d/containerHeight)*_opt.perspective+"px)",
						transition: "none"
					});
					verChildren.eq(nowIndex+1).css({
						transform: "translate3d(0,"+d/containerHeight*100+"%,0)",
						transition: "none"
					});
				};
			}else if( d > 0 && nowIndex != maxIndex ){
				if (nowIndex !== 0) {
					verChildren.eq(nowIndex-1).css({
						opacity: d/containerHeight,
						transform: "translate3d(0,-100%,"+(d/containerHeight-1)*_opt.perspective+"px)",
						transition: "none"
					});
					verChildren.eq(nowIndex).css({
						transform: "translate3d(0,"+(d/containerHeight-1)*100+"%,0)",
						transition: "none"
					});
				};
			}
			// console.log("D", -d);
		}).touchEnd(function(event){
			if (d === 0) {
				return;
			};

			var direction = (d < 0) ? "up" : "down",
				time = _opt.dur * (1-Math.abs(d)/containerHeight);

			if (Math.abs(d) > 100) {
				switch(direction) {
					case "up": {
						if (nowIndex === maxIndex) {
							return;
						};
						verChildren.eq(nowIndex).css({
							opacity: 0,
							transform: "translate3d(0,-100%,-"+_opt.perspective+"px)",
							transition: "all "+time+"s linear"
						});

						verChildren.eq(nowIndex+1).css({
							transform: "translate3d(0,-100%,0)",
							transition: "all "+time+"s linear"
						});
						nowIndex++;
						break;
					}
					case "down": {
						if (nowIndex === 0) {
							return;
						};
						verChildren.eq(nowIndex-1).css({
							opacity: 1,
							transform: "translate3d(0,-100%,0)",
							transition: "all "+time+"s linear"
						});

						verChildren.eq(nowIndex).css({
							transform: "translate3d(0,0,0)",
							transition: "all "+time+"s linear"
						});
						nowIndex--;
						break;
					}
				}
			}else {
				switch(direction) {
					case "up": {
						if (nowIndex === maxIndex) {
							return;
						};
						verChildren.eq(nowIndex).css({
							opacity: 1,
							transform: "translate3d(0,-100%,0)",
							transition: "all .35s linear"
						});

						verChildren.eq(nowIndex+1).css({
							transform: "translate3d(0,0,0)",
							transition: "all .35s linear"
						});
						break;
					}
					case "down": {
						if (nowIndex === 0) {
							return;
						};
						verChildren.eq(nowIndex-1).css({
							opacity: 0,
							transform: "translate3d(0,-100%,-"+_opt.perspective+"px)",
							transition: "all .35s linear"
						});

						verChildren.eq(nowIndex).css({
							transform: "translate3d(0,-100%,0)",
							transition: "all .35s linear"
						});
						break;
					}
				}
			}

			d = 0;
			setTimeout(function(){
				_opt.callback(nowIndex);
			}, time);
		});
	}

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

	window.PageAnimate = function () {
		this.element = [];
		this.elementClasses = [];
	};
	PageAnimate.prototype.init = function(func) {
		func(this);
	}
	PageAnimate.prototype.regist = function (ele, classes) {
		this.element.push(document.querySelector(ele));
		this.elementClasses.push(classes);
	}
	PageAnimate.prototype.simulate = function(){
		var ele = this.element,
			cla = this.elementClasses;
		for(var i = ele.length-1;i > -1;i--) {
			EventUtil.addClass(ele[i], cla[i]);
			ele[i].style.display = "block";
		}
	}
	PageAnimate.prototype.clear = function () {
		var ele = this.element,
			cla = this.elementClasses;
		for(var i = ele.length-1;i > -1;i--) {
			ele[i].style.display = "none";
			var rm = (function (ele, cla, i){
				EventUtil.removeClass(ele[i], cla[i]);
			})(ele, cla, i)
			setTimeout(function(){
				rm;
			},20);
		}
	}

	var app = function (){
		this.resIndex = 0;
		this.res = {};
		this.UI = {};
		Object.defineProperty(this.res, "length", {
			value: 0,
            writable: true,
            enumerable: false,
            configurable: false
		});
		this._onload = function (){};
		this._loaded = function (){};
	}
	app.prototype.run = function(func){
		func(this);
	}
	app.prototype.registRes = function (name, src) {
		if (this.res[name] !== undefined ) {
			console.info("app got registered resource");
			return;
		}
		this.res[name] = src;
		this.res.length++;
		return this;
	}
	app.prototype.bindUI = function(resName, UI){
		if ( this.res[resName] === undefined ) {
			console.info("a UI regist none of resource name");
			return;
		};
		this.UI[resName] = UI;
		return this;
	}
	app.prototype.initial = function (callback) {
		var res = this.res;
		for(var r in res){
			if (/.svg/.test(res[r])) {
				$.get(res[r], (function(r) {
					return function(data){
						this.res[r] = data.querySelector("svg");
						this.resIndex++;
						if(this.resIndex === this.res.length) {
							callback();
						}
					}
				})(r).bind(this));
			}else {
				var img = new Image();
				img.setAttribute("src", res[r]);
				img.onload = _onload.call(this, r);

				function _onload(r){
					this.resIndex++;
					if(this.resIndex === this.res.length) {
						callback();
					}
				};
			}
		}
	}
	app.prototype.onload = function(func){
		this._onload = func;
	}
	app.prototype.loaded = function(func){
		this._loaded = func;
	}

	window.app = (function(){
		return new app();
	}).call(this);

	window.bubbles = (function(){
		var VELOCITY = 0.5,
			PARTICLES = 20,
			mouse = {x:0, y:0},
			particles = [],
			colors = [ "#417dcc","#16c6c0","#4147c4"],
			canvas = document.getElementById('bubbles'),
			context,
			interval;
		
		function start() {
			if (canvas && canvas.getContext) {
				context = canvas.getContext('2d');
				
				for( var i = 0; i < PARTICLES; i++ ) {
					particles.push( { 
						x: Math.random()*window.innerWidth, 
						y: Math.random()*window.innerHeight, 
						vx: ((Math.random()*(VELOCITY*2))-VELOCITY),
						vy: ((Math.random()*(VELOCITY*2))-VELOCITY),
						size: 1+Math.random()*8,
						color: colors[ Math.floor( Math.random() * colors.length ) ]
					} );
				}
				
				Initialize();
			}
		}

		function stop(){
			clearInterval(interval);
			particles = [];
		}
		
		function Initialize() {
			window.addEventListener('resize', ResizeCanvas, false);
			interval = setInterval( TimeUpdate, 30 );
			
			ResizeCanvas();
		}
		
		function TimeUpdate(e) {
			
			context.clearRect(0, 0, window.innerWidth, window.innerHeight);
			
			var len = particles.length;
			var particle;
			
			for( var i = 0; i < len; i++ ) {
				particle = particles[i];
				
				if (!particle.frozen) {
					particle.x += particle.vx;
					particle.y += particle.vy;
					
					if (particle.x > window.innerWidth) {
						particle.vx = -VELOCITY - Math.random();
					}
					else if (particle.x < 0) {
						particle.vx = VELOCITY + Math.random();
					}
					else {
						particle.vx *= 1 + (Math.random() * 0.005);
					}
					
					if (particle.y > window.innerHeight) {
						particle.vy = -VELOCITY - Math.random();
					}
					else if (particle.y < 0) {
						particle.vy = VELOCITY + Math.random();
					}
					else {
						particle.vy *= 1 + (Math.random() * 0.005);
					}
					
					var distanceFactor = DistanceBetween( mouse, particle );
					distanceFactor = Math.max( Math.min( 15 - ( distanceFactor / 10 ), 10 ), 1 );
					
					particle.currentSize = particle.size*distanceFactor;
				}
				
				context.fillStyle = particle.color;
				context.beginPath();
				context.arc(particle.x,particle.y,particle.currentSize,0,Math.PI*2,true);
				context.closePath();
				context.fill();
				
			}
		}
		
		function MouseMove(e) {
			mouse.x = e.layerX;
			mouse.y = e.layerY;
		}
		
		function ResizeCanvas(e) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
		
		function DistanceBetween(p1,p2) {
			var dx = p2.x-p1.x;
			var dy = p2.y-p1.y;
			return Math.sqrt(dx*dx + dy*dy);
		}
		return {
			start: start,
			stop: stop
		}
	})();
})(window,jQuery);