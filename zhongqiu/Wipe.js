(function(window){
    var Wipe = function(){
        return {
        	init: function (canvas, checkPointCallback) {
	        	this.canvas = canvas;
	        	this.checkPointCallback = checkPointCallback;
	            this.load();
	        },
	        load: function () {
	            this.x = [];//记录鼠标移动是的X坐标
	            this.y = [];//记录鼠标移动是的Y坐标
	            this.clickDrag = [];
	            this.lock = false;//鼠标移动前，判断鼠标是否按下
	            this.strokeWidth = 35;

	            this.ctx = this.canvas.getContext('2d');
	            this.w = this.canvas.width;//取画布的宽
	            this.h = this.canvas.height;//取画布的高 
	            this.ctx.lineJoin = "round";//context.lineJoin - 指定两条线段的连接方式
	            this.ctx.lineWidth = this.strokeWidth;//线条的宽度
	            this.ctx.strokeStyle = "rgba(255,255,255,1)";

	            this.pixsData = this.ctx.getImageData(0, 0, this.w, this.h);
	        	this.pixs = this.pixsData.data;
	        	this.total = this.pixs.length/4;
	        	this.clearSum = 0;

	            this.touch = ("createTouch" in document);//判定是否为手持设备
	            this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
	            this.MoveEvent = this.touch ? "touchmove" : "mousemove";
	            this.EndEvent = this.touch ? "touchend" : "mouseup";
	            this.bind();        
	        },
	        bind: function () {
	            var t = this;
	            /*鼠标按下事件，记录鼠标位置，并绘制，解锁lock，打开mousemove事件*/
	            this.canvas.addEventListener(t.StartEvent,function (e) {
	                e.preventDefault();
	                var touch = t.touch ? e.touches[0] : e;
	                var _x = touch.clientX - touch.target.offsetLeft;//鼠标在画布上的x坐标，以画布左上角为起点
	                var _y = touch.clientY - touch.target.offsetTop;//鼠标在画布上的y坐标，以画布左上角为起点  
	                // t.resetEraser(_x, _y, touch);
	                    t.movePoint(_x, _y);
	                    t.drawPoint(_x, _y);                    
	                t.lock = true;
	            }, false);
	            /*鼠标移动事件*/
	            this.canvas.addEventListener(t.MoveEvent, function (e) {
	                e.preventDefault();
	                var touch = t.touch ? e.touches[0] : e;
	                if (t.lock)//t.lock为true则执行
	                {
	                    var _x = touch.clientX - touch.target.offsetLeft;//鼠标在画布上的x坐标，以画布左上角为起点
	                    var _y = touch.clientY - touch.target.offsetTop;//鼠标在画布上的y坐标，以画布左上角为起点

	                    t.movePoint(_x, _y);
	                    t.drawPoint(_x, _y);
	                }
	            }, false);
	            this.canvas.addEventListener(t.EndEvent, function (e) {
	                /*重置数据*/
	                 e.preventDefault();
	                t.lock = false;
	                t.x = [];
	                t.y = [];
	                t.clickDrag = [];

	                t.pixsData = t.ctx.getImageData(0, 0, t.w, t.h);
		        	t.pixs = t.pixsData.data;
	            	t.checkPoint();
	            }, false);
	           
	        },
	        checkPoint: function (){
	        	var clearSum = 0;
	        	for(var i = 0, len = this.pixs.length;i < len;i += (4*this.strokeWidth)){
					if (this.pixs[i+3] == 0){
						clearSum++;
					}
				}
				if(clearSum*this.strokeWidth > this.total*0.9){
					$(this.canvas).addClass("fadeOut animate-forwards");
					setTimeout(function(){
						$("#frontface").css("display", "none");
					}, 750);
					this.checkPointCallback();
				}
	        },
	        movePoint: function (x, y, dragging) {
	            /*将鼠标坐标添加到各自对应的数组里*/
	            this.x.push(x);
	            this.y.push(y);
	            this.clickDrag.push(y);
	        },
	        drawPoint: function (x, y, radius) {
	            for (var i = 0; i < this.x.length; i++)//循环数组
	            {
	            	this.ctx.globalCompositeOperation = "destination-out";
	                this.ctx.beginPath();//context.beginPath() , 准备绘制一条路径

	                if (this.clickDrag[i] && i) {//当是拖动而且i!=0时，从上一个点开始画线。
	                    this.ctx.moveTo(this.x[i - 1], this.y[i - 1]);//context.moveTo(x, y) , 新开一个路径，并指定路径的起点
	                } else {
	                    this.ctx.moveTo(this.x[i] - 1, this.y[i]);
	                }
	                this.ctx.lineTo(this.x[i], this.y[i]);//context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起来
	                this.ctx.closePath();//context.closePath() , 如果当前路径是打开的则关闭它
	                this.ctx.stroke();//context.stroke() , 绘制当前路径
	                this.ctx.globalCompositeOperation = "source-over";
	            }
	        },
	        clear: function () {
	            this.ctx.clearRect(0, 0, this.w, this.h);//清除画布，左上角为起点
	        },
	        preventDefault: function (e) {
	            var touch = this.touch ? e.touches[0] : e;
	            if (this.touch) 
	            	touch.preventDefault();
	            else 
	            	window.event.returnValue = false;
	        }
	    }
    };

    window.Wipe = (function(){
    	return new Wipe();
    })()
})(window);