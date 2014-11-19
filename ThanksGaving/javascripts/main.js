;(function(window, document){
	var $ = function(_){
		var Node = function(_){
			var that = this;
			this.qs = function(_){
				return document.querySelector(_)
			}
			this.qsa = function(_){
				return document.querySelectorAll(_)
			}
			this.type = function(_){
				return Object.prototype.toString.call(_)
			}
			if (/HTML\w+Element/.test(this.type(_))) {
				this.node = _
			}else if(this.type(_) === "[object String]"){
				this.node = this.qs(_)
			}

			if (this.node === null) {
				throw new Error("node "+_+" is node exist!");
			};
			
			this._addClass = function(ele, classNames) {
				var initialClassName = ele.className;
				var classNameArr = classNames;
				var _classNames = [];
				if (this.type(classNames) === "[object String]") {
					classNameArr = classNames.split(" ")
				}else if (this.type(classNames) !== "[object Array]") {
					return new Error("Type Error")
				}
				for (var i = 0; i < classNameArr.length; i++) {
					if(initialClassName === "" || !new RegExp(initialClassName).test(classNameArr[i])){
						_classNames.push(classNameArr[i])
					}
				};
				ele.setAttribute("class", initialClassName + " "+ _classNames.join(" "));
			}
			this._removeClass = function(ele, classNames){
				var initialClassName = ele.className;
				var classNameArr = classNames;
				if (this.type(classNames) === "[object String]") {
					classNameArr = classNames.split(",")
				}else if (this.type(classNames) !== "[object Array]") {
					return new Error("Type Error")
				}
				for (var n = 0, l = classNames.length-1;n < l; n++) {
					ele.setAttribute("class", initialClassName.toString().replace(classNames[n],""));
				};
			}
			return {
				node: that.node,
				addClass: function(classNames){
					that._addClass(this.node, classNames);
					return this
				},
				removeClass: function(classNames) {
					that._removeClass(this.node, classNames);
					return this
				}
			}
		}
		return new Node(_)
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

			body.addClass("bodyShow");
			title.addClass("moveInLeft");
			lefthand.addClass('handShow');
			righthand.addClass('handShow');
			announce.addClass('handShow');
			leftAdv.addClass('leftAdvShow');
			rightAdv.addClass('rightAdvShow');
		};
	}, false);
})(window, document)