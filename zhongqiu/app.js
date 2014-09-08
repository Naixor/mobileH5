(function(window){
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
	}
	app.prototype.init = function(func){
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
	app.prototype.run = function (callback) {
		var res = this.res;
		for(var r in res){
			var src = res[r];
			res[r] = new Image();
			res[r].setAttribute("src", src);
			res[r].addEventListener("load", (function(){
				// return function(r, callback){
					this.resIndex++;
					
					if(this.resIndex === this.res.length) {
						callback(this.res);
					}
				// };
			}).bind(this), false);

			function _onload(img, r, callback){
				
			};
		}
	}

	window.app = (function(){
		return new app();
	}).call(this);
})(window);