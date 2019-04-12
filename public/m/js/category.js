// zepto的入口函数 和jquery一样
$(function () {
    // 调用初始化左侧的函数
    initLeftScroll();
    // 调用初始化右侧的函数
    initRightScroll();
    // 调用查询左侧分类列表
    queryTopCategory();
    // 调用查询右侧分类列表的函数 默认查第一个传人id为1
    querySecondCategory(1);
    // 调用左侧点击切换功能
    toggleSecondCategory();

    // 初始化左侧区域滚动函数
    function initLeftScroll() {
        // 初始化左侧不要滚动条
        mui('.category-left .mui-scroll-wrapper').scroll({
            indicators: false, //是否显示滚动条
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    }
    // 初始化右侧区域滚动的函数
    function initRightScroll() {
        // 初始化右侧 需要滚动条
        mui('.category-right .mui-scroll-wrapper').scroll({
            indicators: true, //是否显示滚动条
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    }

    // 查询左侧分类列表
    function queryTopCategory() {
        /* 实现左侧分类的动态渲染
          1. 请求左侧分类的数据
          2. 调用模板生成html
          3. 渲染到页面的ul */
        // 1. 请求左侧分类的数据
        $.ajax({
            // / 表示网站根目录 当前网站根目录就是 localhost:3000 会自动把 这个localhost:3000跟上
            url: '/category/queryTopCategory',
            success: function (data) {
                console.log(data);
                // 因为你们以前数据可能不是对象可能是一个数组 才需要 {list:data}
                // 2. 调用模板生成html
                var html = template('categoryLeftTpl', data);
                // 3. 渲染到页面的ul
                $('.category-left ul').html(html);
                // 调用左侧切换的函数 因为li是在请求完成才渲染出来 
                // 要获取元素必须等渲染完成后获取函数等渲染li再调用
                // toggleSecondCategory();
                // 获取ul里面的第一个li添加active
                // $('.category-left ul li:first-child').addClass('active');
            }
        })
    }

    // 切换右侧分类列表数据
    function toggleSecondCategory() {
        // 当点击左侧分类列表要切换右侧分类的数据
        // 1. 左边所有元素添加一个点击事件 因为移动端点击(click)事件有延迟 推荐使用tap事件(zepto封装的事件解决延迟)
        // 2. 获取所有的li标签
        // 3. 点击了获取当li标签的data-属性的值
        // 4. 拿这个属性的值请求右侧分类数据和渲染
        // var lis = $('.category-left ul li');
        // console.log(lis);
        // 1. 给左侧分类的所有li添加 点击事件 推荐使用tap事件        
        // lis.on('tap', function () {
        // 2. 使用事件委托方式添加事件 当遇到这种异步的元素添加事件 推荐使用事件委托方式
        $('.category-left ul').on('tap','li',function(){
            // 获取自定义属性的值的方式
            // console.log(this.dataset['id']);// 原生方式获取都是字符串
            // console.log($(this).data('id'));// zepto的函数方式封装了函数会获取数据并做类型转换 (推荐使用)
            // 2. 点击了获取当li标签的data-属性的值
            var id = $(this).data('id');
            // 3. 拿这个属性的值请求右侧分类数据和渲染
            querySecondCategory(id);
            // 4. 切换li的active  给当前点击li添加active 其他兄弟去删除active
            $(this).addClass('active').siblings().removeClass('active');
        });
        // 这个click函数在zepto里面没有
        // lis.click(function (){

        // });
    }

    // 查询分类右侧列表
    function querySecondCategory(id) {
        /* 查询二级分类
         1. 请求二级分类的API接口
         2. 这个接口需要一个参数（调用函数的时候就应该把参数传递过来）
         3. 接收到这个id去 请求数据把id参数放在ajax的参数对象里面
         4. 接收后台返回的数据并渲染到右侧分类 */
        // 1. 请求二级分类的API接口
        $.ajax({
            url: '/category/querySecondCategory',
            // 3. 接收到这个id去 请求数据把id参数放在ajax的参数对象里面
            data: {
                id: id
            },
            success: function (data) {
                console.log(data);
                var html = template('categoryRightTpl', data);
                $('.category-right .mui-row').html(html);
            }
        })
    }
});