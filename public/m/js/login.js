$(function () {
    // 调用登录功能函数
    login();
    // 定义一个登录功能的函数
    function login() {
        // 1. 点击登录给登录按钮添加点击事件
        $('.btn-login').on('tap', function () {
            // 2. 获取当前用户输入的用户名
            var username = $('.username').val().trim();
            // 判断用户名为空 username为空 一定为false  !false == true
            if (!username) {
                mui.toast('请输入用户名', {
                    duration: 'short',
                    type: 'div'
                });
                return;
            }
            // 3. 获取当前输入的密码
            var password = $('.password').val().trim();
            if (!password) {
                mui.toast('请输入密码', {
                    duration: 'short',
                    type: 'div'
                });
                return;
            }
            // 4. 调用登录API实现登录功能
            $.ajax({
                url: '/user/login',
                type: 'post',
                data: {
                    username: username,
                    password: password
                },
                success: function (data) {
                    console.log(data);
                    // 5. 如果返回有错表示用户名或者密码错误提示一下
                    if (data.error) {
                        mui.toast(data.message, {
                            duration: 'short',
                            type: 'div'
                        });
                    } else {
                        // 6. 如果没有错表示登录成功 获取当前要返回的页面url 通过地址栏参数去获取要返回的url
                        // 6.1 先获取当前要返回的url地址
                        var returnUrl = getQueryString('returnUrl');
                        console.log(returnUrl);
                        // 6.2 跳转回到这个地址 (不使用location跳转是无法回去 使用location去跳转)
                        location = returnUrl;
                    }
                }
            })
        });
    }
    // 使用正则匹配url参数 返回这个匹配成功的值 根据参数名获取参数的值
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            console.log(r);
            // 别人之前使用unescape 方式解密  但是我们默认是encodeURI加密 使用 decodeURI 解密
            return decodeURI(r[2]);
        }
        return null;
    }
});