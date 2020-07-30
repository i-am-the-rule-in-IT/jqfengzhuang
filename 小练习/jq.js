// JQ匿名函数自调用：避免全局污染问题、闭包知识点
// 传参window的好处：
// 1. 减少对window的查找过程/作用域链
// 2. 有利于代码压缩
// 传参undefined的目的：解决undefined在ie678中存在被篡改的问题
; (function (window, undefined) {
    // 定义jQuery构造函数
    let jQuery = function (el) {
        return new jQuery.init(el)
    }
    // 静态方法
    jQuery.init = function (el) {
        // 获取所有DOM标签
        let els = document.querySelectorAll(el)
        // 遍历绑定到实例对象上
        els.forEach((item, index) => {
            this[index] = item
        })
        // 绑定长度属性
        this.length = els.length
    }
    // 原型方法
    jQuery.init.prototype = {
        css: function (cssAttr, cssValue) {
            for (let i = 0; i < this.length; i++) {
                // CSS DOM 知识点
                // this[i].style.CSS属性名 = CSS属性值
                this[i].style[cssAttr] = cssValue
            }
            // 保证链式条用
            return this
        },
        attr: function (objAttr, objVal) {
            for (let i = 0; i < this.length; i++) {
                this[i].setAttribute(objAttr, objVal)
                return this
            }
        },
        ajax: function (url, data, method, success) {
            var ajax_tool = new XMLHttpRequest();
            if (method == 'get') {
                if (data) {
                    url += '?';
                    url += data;
                } ajax_tool.open(method, url);
                ajax_tool.send();
            } else {
                //post请求不需要改变
                ajax_tool.open(method, url);
                ajax_tool.setRequestHeader("Content-type", "x-www-form-urlencoded");
                if (data) {
                    ajax_tool.send(data);
                } else {
                    ajax_tool.send();
                }
            }
            ajax_tool.onreadystatechange = function () {
                if (ajax_tool.readyState == 4 && ajax_tool.status == 200) {
                    console.log(ajax_tool.responseText);
                    //将数据让外边可以使用
                    return ajax_tool.responseText;
                    // 当 onreadystatechange 调用时 说明 数据回来了
                    // ajax_tool.responseText;
                    success(ajax_tool.responseText);
                }
            }   
        },
    }
    // 将jQuery这个函数暴露到全局对象window上，供外部使用
    window.jQuery = window.$ = jQuery
})(window)


