$(function () {

    login();

    function login() {
        $('.btn-login').on('click',function () {
            var username = $('.username').val().trim();
            var password = $('.password').val().trim();
            console.log(username);
            console.log(password);
            //做非空判断
            if (!username) {
                alert('Please check your name !')
                return;
            }
            if (!password) {
                alert('Please check your password !')
                return;
            }
            //发请求
            $.ajax({
                url:'/employee/employeeLogin',
                type:'post',
                data:{
                    username:username,
                    password:password
                },
                success:function (data) {
                    console.log(data);
                    if (data.error ) {
                        alert(data.message);
                    }else{
                        location = 'practice_index.html';
                    }
                }
            })
        })
    }
})