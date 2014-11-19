;(function(window){
    "use strict";

    var Mobile = function(){};
    if (window.Mobile) {
        window.Mobile = Mobile;
    };
    var WeixinApi = (function () {
        function weixinShareTimeline(data, callbacks) {
            callbacks = callbacks || {};
            var shareTimeline = function (theData) {
                WeixinJSBridge.invoke('shareTimeline', {
                    "appid":theData.appId ? theData.appId : '',
                    "img_url":theData.imgUrl,
                    "link":theData.link,
                    "desc":theData.title,
                    "title":theData.desc, // 注意这里要分享出去的内容是desc
                    "img_width":"640",
                    "img_height":"640"
                }, function (resp) {
                    switch (resp.err_msg) {
                        // share_timeline:cancel 用户取消
                        case 'share_timeline:cancel':
                            callbacks.cancel && callbacks.cancel(resp);
                            break;
                        // share_timeline:confirm 发送成功
                        case 'share_timeline:confirm':
                        case 'share_timeline:ok':
                            callbacks.confirm && callbacks.confirm(resp);
                            break;
                        // share_timeline:fail　发送失败
                        case 'share_timeline:fail':
                        default:
                            callbacks.fail && callbacks.fail(resp);
                            break;
                    }
                    // 无论成功失败都会执行的回调
                    callbacks.all && callbacks.all(resp);
                });
            };
            WeixinJSBridge.on('menu:share:timeline', function (argv) {
                if (callbacks.async && callbacks.ready) {
                    window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();
                    if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
                        window["_wx_loadedCb_"] = new Function();
                    }
                    callbacks.dataLoaded = function (newData) {
                        window["_wx_loadedCb_"](newData);
                        shareTimeline(newData);
                    };
                    // 然后就绪
                    callbacks.ready && callbacks.ready(argv);
                } else {
                    // 就绪状态
                    callbacks.ready && callbacks.ready(argv);
                    shareTimeline(data);
                }
            });
        }

        /**
         * 发送给微信上的好友
         * @param       {Object}    data       待分享的信息
         * @p-config    {String}    appId      公众平台的appId（服务号可用）
         * @p-config    {String}    imgUrl     图片地址
         * @p-config    {String}    link       链接地址
         * @p-config    {String}    desc       描述
         * @p-config    {String}    title      分享的标题
         *
         * @param       {Object}    callbacks  相关回调方法
         * @p-config    {Boolean}   async                   ready方法是否需要异步执行，默认false
         * @p-config    {Function}  ready(argv)             就绪状态
         * @p-config    {Function}  dataLoaded(data)        数据加载完成后调用，async为true时有用，也可以为空
         * @p-config    {Function}  cancel(resp)    取消
         * @p-config    {Function}  fail(resp)      失败
         * @p-config    {Function}  confirm(resp)   成功
         * @p-config    {Function}  all(resp)       无论成功失败都会执行的回调
         */
        function weixinSendAppMessage(data, callbacks) {
            callbacks = callbacks || {};
            var sendAppMessage = function (theData) {
                WeixinJSBridge.invoke('sendAppMessage', {
                    "appid":theData.appId ? theData.appId : '',
                    "img_url":theData.imgUrl,
                    "link":theData.link,
                    "desc":theData.desc,
                    "title":theData.title,
                    "img_width":"640",
                    "img_height":"640"
                }, function (resp) {
                    switch (resp.err_msg) {
                        // send_app_msg:cancel 用户取消
                        case 'send_app_msg:cancel':
                            callbacks.cancel && callbacks.cancel(resp);
                            break;
                        // send_app_msg:confirm 发送成功
                        case 'send_app_msg:confirm':
                        case 'send_app_msg:ok':
                            callbacks.confirm && callbacks.confirm(resp);
                            break;
                        // send_app_msg:fail　发送失败
                        case 'send_app_msg:fail':
                        default:
                            callbacks.fail && callbacks.fail(resp);
                            break;
                    }
                    // 无论成功失败都会执行的回调
                    callbacks.all && callbacks.all(resp);
                });
            };
            WeixinJSBridge.on('menu:share:appmessage', function (argv) {
                if (callbacks.async && callbacks.ready) {
                    window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();
                    if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
                        window["_wx_loadedCb_"] = new Function();
                    }
                    callbacks.dataLoaded = function (newData) {
                        window["_wx_loadedCb_"](newData);
                        sendAppMessage(newData);
                    };
                    // 然后就绪
                    callbacks.ready && callbacks.ready(argv);
                } else {
                    // 就绪状态
                    callbacks.ready && callbacks.ready(argv);
                    sendAppMessage(data);
                }
            });
        }
        function weixinShareWeibo(data, callbacks) {
            callbacks = callbacks || {};
            var shareWeibo = function (theData) {
                WeixinJSBridge.invoke('shareWeibo', {
                    "content":theData.desc,
                    "url":theData.link
                }, function (resp) {
                    switch (resp.err_msg) {
                        // share_weibo:cancel 用户取消
                        case 'share_weibo:cancel':
                            callbacks.cancel && callbacks.cancel(resp);
                            break;
                        // share_weibo:confirm 发送成功
                        case 'share_weibo:confirm':
                        case 'share_weibo:ok':
                            callbacks.confirm && callbacks.confirm(resp);
                            break;
                        // share_weibo:fail　发送失败
                        case 'share_weibo:fail':
                        default:
                            callbacks.fail && callbacks.fail(resp);
                            break;
                    }
                    callbacks.all && callbacks.all(resp);
                });
            };
            WeixinJSBridge.on('menu:share:weibo', function (argv) {
                if (callbacks.async && callbacks.ready) {
                    window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();
                    if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
                        window["_wx_loadedCb_"] = new Function();
                    }
                    callbacks.dataLoaded = function (newData) {
                        window["_wx_loadedCb_"](newData);
                        shareWeibo(newData);
                    };
                    // 然后就绪
                    callbacks.ready && callbacks.ready(argv);
                } else {
                    // 就绪状态
                    callbacks.ready && callbacks.ready(argv);
                    shareWeibo(data);
                }
            });
        }
        function weixinGeneralShare(data, callbacks) {
            callbacks = callbacks || {};
            var generalShare = function (general,theData) {

                // 如果是分享到朋友圈，则需要把title和desc交换一下
                if(general.shareTo == 'timeline') {
                    var title = theData.title;
                    theData.title = theData.desc || title;
                    theData.desc = title;
                }

                // 分享出去
                general.generalShare({
                    "appid":theData.appId ? theData.appId : '',
                    "img_url":theData.imgUrl,
                    "link":theData.link,
                    "desc":theData.desc,
                    "title":theData.title,
                    "img_width":"640",
                    "img_height":"640"
                }, function (resp) {
                    switch (resp.err_msg) {
                        // general_share:cancel 用户取消
                        case 'general_share:cancel':
                            callbacks.cancel && callbacks.cancel(resp ,general.shareTo);
                            break;
                        // general_share:confirm 发送成功
                        case 'general_share:confirm':
                        case 'general_share:ok':
                            callbacks.confirm && callbacks.confirm(resp ,general.shareTo);
                            break;
                        // general_share:fail　发送失败
                        case 'general_share:fail':
                        default:
                            callbacks.fail && callbacks.fail(resp ,general.shareTo);
                            break;
                    }
                    // 无论成功失败都会执行的回调
                    callbacks.all && callbacks.all(resp ,general.shareTo);
                });
            };
            WeixinJSBridge.on('menu:general:share', function (general) {
                if (callbacks.async && callbacks.ready) {
                    window["_wx_loadedCb_"] = callbacks.dataLoaded || new Function();
                    if(window["_wx_loadedCb_"].toString().indexOf("_wx_loadedCb_") > 0) {
                        window["_wx_loadedCb_"] = new Function();
                    }
                    callbacks.dataLoaded = function (newData) {
                        window["_wx_loadedCb_"](newData);
                        generalShare(general,newData);
                    };
                    // 然后就绪
                    callbacks.ready && callbacks.ready(general,general.shareTo);
                } else {
                    // 就绪状态
                    callbacks.ready && callbacks.ready(general,general.shareTo);
                    generalShare(general,data);
                }
            });
        }
        function addContact(appWeixinId,callbacks){
            callbacks = callbacks || {};
            WeixinJSBridge.invoke("addContact", {
                webtype: "1",
                username: appWeixinId
            }, function (resp) {
                var success = !resp.err_msg || "add_contact:ok" == resp.err_msg || "add_contact:added" == resp.err_msg;
                if(success) {
                    callbacks.success && callbacks.success(resp);
                }else{
                    callbacks.fail && callbacks.fail(resp);
                }
            })
        }
        function imagePreview(curSrc,srcList) {
            if(!curSrc || !srcList || srcList.length == 0) {
                return;
            }
            WeixinJSBridge.invoke('imagePreview', {
                'current' : curSrc,
                'urls' : srcList
            });
        }

        /**
         * 显示网页右上角的按钮
         */
        function showOptionMenu() {
            WeixinJSBridge.call('showOptionMenu');
        }


        /**
         * 隐藏网页右上角的按钮
         */
        function hideOptionMenu() {
            WeixinJSBridge.call('hideOptionMenu');
        }

        /**
         * 显示底部工具栏
         */
        function showToolbar() {
            WeixinJSBridge.call('showToolbar');
        }

        /**
         * 隐藏底部工具栏
         */
        function hideToolbar() {
            WeixinJSBridge.call('hideToolbar');
        }
        function getNetworkType(callback) {
            if (callback && typeof callback == 'function') {
                WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                    // 在这里拿到e.err_msg，这里面就包含了所有的网络类型
                    callback(e.err_msg);
                });
            }
        }
        function closeWindow(callbacks) {
            callbacks = callbacks || {};
            WeixinJSBridge.invoke("closeWindow",{},function(resp){
                switch (resp.err_msg) {
                    // 关闭成功
                    case 'close_window:ok':
                        callbacks.success && callbacks.success(resp);
                        break;

                    // 关闭失败
                    default :
                        callbacks.fail && callbacks.fail(resp);
                        break;
                }
            });
        }
        function wxJsBridgeReady(readyCallback) {
            if (readyCallback && typeof readyCallback == 'function') {
                var Api = this;
                var wxReadyFunc = function () {
                    readyCallback(Api);
                };
                if (typeof window.WeixinJSBridge == "undefined"){
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', wxReadyFunc, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', wxReadyFunc);
                        document.attachEvent('onWeixinJSBridgeReady', wxReadyFunc);
                    }
                }else{
                    wxReadyFunc();
                }
            }
        }
        function openInWeixin(){
            return /MicroMessenger/.test(navigator.userAgent);
        }
        function scanQRCode (callbacks) {
            callbacks = callbacks || {};
            WeixinJSBridge.invoke("scanQRCode",{},function(resp){
                switch (resp.err_msg) {
                    // 打开扫描器成功
                    case 'scan_qrcode:ok':
                        callbacks.success && callbacks.success(resp);
                        break;

                    // 打开扫描器失败
                    default :
                        callbacks.fail && callbacks.fail(resp);
                        break;
                }
            });
        }
        return {
            version         :"2.3",
            ready           :wxJsBridgeReady,
            shareToTimeline :weixinShareTimeline,
            shareToWeibo    :weixinShareWeibo,
            shareToFriend   :weixinSendAppMessage,
            generalShare    :weixinGeneralShare,
            addContact      :addContact,
            showOptionMenu  :showOptionMenu,
            hideOptionMenu  :hideOptionMenu,
            showToolbar     :showToolbar,
            hideToolbar     :hideToolbar,
            getNetworkType  :getNetworkType,
            imagePreview    :imagePreview,
            closeWindow     :closeWindow,
            openInWeixin    :openInWeixin,
            scanQRCode      :scanQRCode
        };
    })();

    var Node = function (_){
        var select = document.querySelectorAll;
        if ( select(_) ) {
            // console.log("没有这个元素");
            return ;
        };

        var ele = select(_);
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

        var _css = function(ele, styleAttr, style){
            ele.style[styleAttr] = style;
        }
        return {
            0: ele,
            addClass: function(classNames){
                _addClass(ele, classNames);
                return this;
            },
            removeClass: function(classNames) {
                _removeClass(ele, classNames);
                return this;
            },
            css: function(styleAttr, style){
                _css(ele, styleAttr, style);
                return this;
            }
        }
    }

    var PageAnimate = function (node) {
        this.element = [];
        this.elementClasses = [];
        this.node = node;
    };
    PageAnimate.prototype.init = function(func) {
        func(this);
    }
    PageAnimate.prototype.regist = function (ele, classes) {
        this.element.push(node(ele));
        this.elementClasses.push(classes);
    }
    PageAnimate.prototype.simulate = function(){
        var ele = this.element,
            cla = this.elementClasses;
        for(var i = ele.length-1;i > -1;i--) {
            ele[i].addClass(cla[i]);
            ele[i].style.display = "block";
        }
    }
    PageAnimate.prototype.clear = function () {
        var ele = this.element,
            cla = this.elementClasses;
        for(var i = ele.length-1;i > -1;i--) {
            ele[i].style.display = "none";
            var rm = (function (ele, cla, i){
                ele[i].removeClass(cla[i]);
            })(ele, cla, i)
            setTimeout(function(){
                rm;
                rm = null;
            },200);
        }
    }

    Mobile = function(){
        return {
            node: function (_){
                return Node.call(Mobile, _);
            },
            page: function(){
                return new PageAnimate(this.node);
            }
            WeixinApi: WeixinApi
        }
    }
})(window)