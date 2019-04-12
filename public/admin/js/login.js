$(function () {
    login();
    // 后台的登录功能
    function login() {
        // 1. 给登录按钮添加点击事件 现在是在开发PC端没有tap事件 (tap是移动端  PC使用click)
        $('.btn-login').on('click', function () {
            // 2. 获取当前用户输入的用户名和密码
            var username = $('.username').val().trim();
            var password = $('.password').val().trim();
            // 3. 判断当前用户名密码是否输入
            if (!username) {
                alert('请输入用户名');
                return;
            }
            if (!password) {
                alert('请输入密码');
                return;
            }
            // 4. 调用后台登录接口去登录 后台接口文档里面员工登录API
            $.ajax({
                url: '/employee/employeeLogin',
                type: 'post',
                data: {
                    username: username,
                    password: password
                },
                success: function (data) {
                    console.log(data);
                    //   5. 判断后台返回的数据有没有error 
                    if (data.error) {
                        // 6. 有error表示有错提示用户名错误信息
                        alert(data.message);
                    }else{
                        // 7. 如果登录成功 跳转到主页让用户去管理
                        location = 'index.html';
                    }
                }
            })

        })
    }
});