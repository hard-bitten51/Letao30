$(function () {
    queryUser();
    updateUser();
    exit();
    //   1. 查询用户信息列表
    function queryUser() {
        // 1. 调用查询用户信息的API
        $.ajax({
            url: '/user/queryUser',
            data: {
                page: 1,
                pageSize: 5
            },
            success: function (data) {
                console.log(data);
                // 2. 调用模板生成html
                var html = template('userTpl', data);
                // 3. 渲染tr到表格的tbody里面
                $('#info table tbody').html(html);
            }
        })
    }
    // 改变用户状态
    function updateUser() {
        // 1. 使用委托给所有禁用或者启用按钮添加点击事件
        $('#info table tbody').on('click', '.btn-option', function () {
            console.log(this);
            //   2. 获取当前按钮身上的id和is-delete的值
            var id = $(this).data('id');
            var isDelete = $(this).data('is-delete');
            // 3. 修改isDelete的值 如果之前是0 变成 1 是1变成0  判断isDelete是否等于1  等于 返回0 否则返回1
            isDelete = isDelete ? 0 : 1;
            // 4. 把修改完后id和isDelete传递给后台接口
            $.ajax({
                url: '/user/updateUser',
                type: 'post',
                data: {
                    id: id,
                    isDelete: isDelete
                },
                success: function (data) {
                    console.log(data);
                    // 5. 判断如果修改成功调用查询重新渲染页面
                    if (data.success) {
                        queryUser();
                    }
                }
            })
        })
    }

    function exit() {
        // 1. 获取退出登录按钮添加点击事件
        $('.exit').on('click', function () {
            //   2. 调用请求退出登录
            $.ajax({
                url: '/employee/employeeLogout',
                success: function (data){
                  console.log(data);
                //   3. 判断退出成功就跳转到登录
                  if(data.success){
                      location = 'login.html';
                  }
                }
            })
        });
    }
});