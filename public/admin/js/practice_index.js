$(function () {
    
    queryUser();


    //1.查询用户数据列表
    function queryUser() {
        $.ajax({
            url:'/user/queryUser',
            // data传分页信息
            data:{
                page:1,
                pageSize:5
            },
            success:function (data) {
                console.log(data);
                
                var html = template('userTpl',data);
                $('#info table tbody').html(html)
            }
        })
    }
    //改变用户的状态
    function updateUser() {
        $('#info table tbody').on('click','.btn-option',function(){
            console.log(this);
            
        })
    }
})