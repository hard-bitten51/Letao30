$(function(){

    login();

    //定义一个登陆功能的函数
    function login() {
        $('.btn-login').on('tap',function () {
            var username = $('.username').val().trim();
            if (!username) {
                mui.toast('请输入用户名',{ duration:'long', type:'div' }); 
                return;
            }
            //输入密码
            var password = $('.password').val().trim();
            if (!password) {
                mui.toast('请输入密码',{ duration:'long', type:'div' }); 
                return;
            }       
            //发请求
            $.ajax({
                url:'/user/login',
                type:'post',
                data:{
                    username:username,
                    password:password
                },
                success:function(data){
                    if (data.error) {
                        mui.toast(data.massage,{ duration:'long', type:'div' });
                        return;
                    }else{
                        var returnUrl = getQueryString('returnUrl');
                        // console.log(returnUrl);
                        
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
})