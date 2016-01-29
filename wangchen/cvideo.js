(function (window) {
    'use strict';

    var Frame = function () {
        var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(fn) {
                return setTimeout(fn, 1000 / 60);
            };
        var cancelAnimationFrame =
            window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            window.clearTimeout;

        var frameRequestId;
        var pendingFrames = [];

        function pushFrame(frame) {
            if (pendingFrames.push(frame) === 1) {
                frameRequestId = requestAnimationFrame(execPendingFrame);
            };
        }

        function execPendingFrame() {
            while (pendingFrames.length) {
                execFrame(pendingFrames.pop());
            }
        }

        function execFrame(frame) {
            var time = +new Date(),
                dur = time - frame.time;

            frame.time = time;
            frame.dur = dur;
            frame.elapsed += dur;
            frame.index++;
            frame.action.call(null, frame);
        }

        function initFrame(action) {
            var frame = {
                index: 0,
                time: +new Date(),
                dur: 0,
                elapsed: 0,
                action: action,
                next: function () {
                    pushFrame(frame);
                }
            };
            return frame;
        }

        function requestFrame(fn) {
            var frame = initFrame(fn);
            pushFrame(frame);
            return frame;
        }

        function releaseFrame(frame) {
            var index = pendingFrames.indexOf(frame);
            if (~index) {
                pendingFrames.splice(index, 1);
            }
            if (pendingFrames.length === 0) {
                cancelAnimationFrame(frameRequestId);
            }
        }

        return {
            requestFrame: requestFrame,
            releaseFrame: releaseFrame
        }
    }

    var GetImage = function (task) {
        if (task) {
            this.id = task.id;
            this.url = task.url;
            this.callback = task.callback;
        }
    }

    GetImage.prototype.load = function () {
        var self = this;
        var img = new Image();
        img.onload = (function (i) {
            return function () {
                self.callback.call(self, i, img);
            }
        })(this.id);
        img.onerror = (function (i) {
            return function () {
                self.callback.call(self, i, null);
            }
        })(this.id);
        img.src = this.url;
    }

    GetImage.prototype.next = function (task) {
        this.id = task.id;
        this.url = task.url;
        if (!this.callback) {
            this.callback = task.callback;
        }
        this.load();
    }

    var Loader = function (resouces, preline) {
        this.__rCount = resouces.length;
        this.__finishCount = 0;
        this.__events = {};
        this.__resources = resouces.map(function (url) {
            return {
                status: 'pending',
                url: url,
                img: null
            }
        });
        this.__loadIdx = 0;
        this.__loadList = [];
        this.__maxParallelNum = 4;
        for (var i = 0; i < this.__maxParallelNum; i++) {
            this.__loadList.push(new GetImage());
        }
        this.__preline = preline;
    }

    Loader.prototype.preload = function () {
        var loader = this;
        loader.__loadList.forEach(function (getImage) {
            getImage.next({
                id: loader.__loadIdx,
                url: loader.__resources[loader.__loadIdx++].url,
                callback: function (id, img) {
                    loader.__resources[id].img = img;
                    loader.__resources[id].status = 'ready';
                    loader.fire('loadfinish', id);
                    if (loader.__loadIdx === loader.__preline) {
                        loader.fire('preloadfinish');
                    }
                    if (loader.__loadIdx < loader.__rCount) {
                        var idx = loader.__loadIdx++;
                        this.next({
                            id: idx,
                            url: loader.__resources[idx].url
                        });
                    } else {
                        loader.fire('loadallfinish');
                    }
                }
            });
            // loader.__loadIdx++;
        });

        return loader.__resources;
    }

    Loader.prototype.load = function (i) {
        var loader = this;
        var img = new Image();
        img.onload = (function (i) {
            return function () {
                loader.__resources[i].img = img;
                loader.__resources[i].status = 'ready';
                loader.fire('loadfinish', i);

            }
        })(i);
        img.onerror = (function (i) {
            return function () {
                loader.__resources[i].status = 'ready';
                loader.fire('loadfinish', i);
                if (++loader.__finishCount === loader.__rCount) {
                    loader.fire('loadallfinish');
                }
            }
        })(i);
        img.src = loader.__resources[i].url;
    }

    Loader.prototype.schedule = function () {
        return (this.__finishCount / this.__rCount)*100;
    }

    Loader.prototype.on = function (event, fn) {
        if (this.__events[event]) {
            this.__events.push(fn);
        } else {
            this.__events[event] = [fn];
        }
    }

    Loader.prototype.off = function (event, fn) {
        if (fn) {
            var index = this.__events[event].indexOf(fn);
            if (~index) {
                this.__events.splice(index, 1);
            }
        } else {
            this.__events[event] = [];
        }
    }

    Loader.prototype.fire = function (event, arg) {
        var loader = this;
        if (this.__events[event]) {
            this.__events[event].forEach(function (fn) {
                fn.call(loader, arg);
            });
        }
    }

    window.Loader = Loader;
})(window);
