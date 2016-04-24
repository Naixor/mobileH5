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
			var img = new Image();
			img.setAttribute("src", res[r]);
			img.onload = _onload.call(this, r);

			function _onload(r){
				this.res[r] = img;
				// if( this.UI[r] !== undefined ){
				// 	if (this.UI[r] instanceof Array) {
				// 		for(var ui = this.UI[r], l = ui.length-1;l > -1;l--){
				// 			ui[l].getContext("2d").drawImage(this.res[r], 0, 0, ui[l].width, ui[l].height)
				// 		}
				// 	}else{
				// 		this.UI[r].getContext("2d").drawImage(this.res[r], 0, 0, this.UI[r].width, this.UI[r].height);
				// 	}
				// }
				this.resIndex++;
				callback((this.resIndex/this.res.length).toFixed(2));
				if(this.resIndex === this.res.length) {
					this._onload;
					this._loaded;
				}
			};
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

	window._$ = function (id){
		return document.getElementById(id);
	};
})(window);

app.run(function($app){
	$app.registRes("rocket", "img/rocket.png");
	$app.registRes("moon", "img/moon.png");
	$app.registRes("star", "img/star.png");
	$app.registRes("du", "img/du.png");
	$app.registRes("du1", "img/du1.png");
	$app.registRes("youwantus", "img/youwantus.png");
	$app.registRes("logo", "img/logo.png");
	$app.registRes("line1", "img/line1.png");
	$app.registRes("line2", "img/line2.png");
	$app.registRes("line3", "img/line3.png");
	$app.registRes("line4", "img/line4.png");
	$app.registRes("title1", "img/title1.png");
	$app.registRes("arrowDown-text", "img/arrowDown-text.png");
	$app.registRes("arrowDown-1", "img/arrowDown-1.png");
	$app.registRes("arrowDown-2", "img/arrowDown-2.png");
	$app.registRes("top", "img/top.png");
	$app.registRes("tree", "img/tree.png");
	$app.registRes("earth", "img/earth.png");
	$app.registRes("finger", "img/finger.png")

	$app.initial(function(percent){
		// _$("")
		_$("main").innerText = (percent*90).toFixed(0)+"%";
		// console.log(percent)
	});
});