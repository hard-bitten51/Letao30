//初始化MUI滑动功能
mui('.category-left .mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条
});
mui('.category-right .mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条
});

// options = {
//     scrollY: true, //是否竖向滚动
//     scrollX: false, //是否横向滚动
//     startX: 0, //初始化时滚动至x
//     startY: 0, //初始化时滚动至y
//     indicators: false, //是否显示滚动条
//     deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
//     bounce: true //是否启用回弹
//    }

$(function(){


    
    queryTopCategory();

    querySecondCategory(1);

    toggleSecondCategory();

    
    //查询左侧分类列表
    function queryTopCategory() {
        $.ajax({
            url:'/category/queryTopCategory',
            success:function(data){
                console.log(data);
                
                var html = template('categoryLeftTpl',data);

                $('.category-left ul').html(html);
            }
        })
    }

    // 
//切换右侧分类
function toggleSecondCategory() {
    //因为内容为模板生成 所以需要使用委托注册
    $('.category-left ul').on('tap','li',function(){
        // console.log($(this));
        // console.log($(this).data('id'));
        var id = $(this).data('id');
        console.log(id);
        querySecondCategory(id);

        $(this).addClass('active').siblings().removeClass('active');
    });
    
};

function querySecondCategory(id) {
    // 实现左侧分类的动态渲染
    //   1. 请求左侧分类的数据
    $.ajax({
        url:'/category/querySecondCategory',
        data:{
            id:id
        },
        success:function (data) {
           console.log(data);
            // console.log(111);
            
           var html = template('categoryRightTpl',data);

           $('.category-right .mui-row').html(html);

        }
    })
}
});

