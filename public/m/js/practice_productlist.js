$(function(){
    var search;


    searchProduct();

    nowSearchProduct();
    sortProduct();
    //下拉的函数
    pullRefresh();

    //跳转detail页面
    gotDetail();


    var nowPraductId;
    //定义一个搜索商品的函数
    function searchProduct() {
        search = getQueryString('search');

        queryProduct({proName:search});
    }
    //定义当前搜索商品的函数
    function nowSearchProduct() {
        $('.btn-search').on('tap',function(){
            // console.log(111);
            

            var search = $('.input-search').val().trim();
            //做非空判断
            if (search == "") {
                return; 
            }

            queryProduct({
                proName:search,
                page:1,
                pageSize:3
            })
        })    
    }
    //定义一个模板封装的函数
    //params是传来的参数的对象
    function queryProduct(params) {
        params.page = params.page || 1;
        params.pageSize = params.pageSize || 2;
        console.log(params);
        
        //发Ajax请求
        $.ajax({
            url:'/product/queryProduct',
            data:params,
            success: function (res) {
                console.log(res);
                console.log(res.data);
                console.log(res.data[0].id);
                nowPraductId = res.data[0].id;
                // 3. 调用模板指定模板id和当前后台返回的数据对象
                var html = template('productlistTpl', res);
                // 4. 把模板渲染到页面mui-row里面
                $('.product-list .mui-row').html(html);
            }
        })
    }
    //定义一个商品排序的函数
    function sortProduct() {
        //点击排序
            //注册点击事件
            $('.product-list .mui-card-header a').on('tap',function(){
                // console.log(this);
                var type = $(this).data('type');
                var sort = $(this).data('sort');
                //需要修改sort
                if (sort == 1) {
                    sort = 2;
                    $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
                }else{
                    sort = 1;
                    $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
                }

                //改后重新保存
                $(this).data('sort',sort);

                //切换active类名
                $(this).addClass('active').siblings().removeClass('active');

                var obj = {
                    proName:search,
                    page:1,
                    pageSize:4
                }
                // obj[key] = value;//给对象动态添加键
                obj[type] = sort;
                queryProduct(obj);
            })
    }


    //上拉和下拉的功能函数
    function pullRefresh() {
        // 3. 初始化
        mui.init({
            // 初始化下拉刷新
            pullRefresh: {
                // 下拉刷新的容器 区域滚动的容器 选择器
                container: '.mui-scroll-wrapper',
                // 表示初始化下拉刷新
                down: {
                    contentdown: "正在下拉", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    contentover: "嘿！可以松手了", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh: "正在拼命刷新中...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    // 下拉刷新的回调函数 触发了下拉刷新就执行回调
                    callback: pulldownRefresh
                },
                // 表示初始化上拉加载
                up: {

                    contentrefresh: '骑手正在火速前往...',
                    // 上拉加载的回调函数 触发上拉加载会执行回调函数
                    callback: pullupRefresh
                }
            }
        });
        /**
         * 下拉刷新具体业务实现 发送请求刷新数据
         */
        function pulldownRefresh() {
            // 为了模拟请求延迟添加一个定时器
            setTimeout(function () {
                //    下拉刷新业务功能分析
                // 1. 请求刷新刷新页面
                queryProduct({
                    proName: search,
                    page: 1,
                    pageSize: 3
                });
                // 2. 结束转圈圈 调用结束方法
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
            }, 1500)

        }
        var page = 1;
        /**
         * 上拉加载具体业务实现 发送请求 追加更多数据
         */
        function pullupRefresh() {
            // 为了模拟请求延迟添加一个定时器
            setTimeout(function () {
                // 上拉加载的业务思路
                // 1. 上拉加载更多数据(请求下一页的数据)page默认为1  每次上拉把page++ 变成下一页数据
                // 2. 渲染使用追加渲染 使用append 追加dom元素（不能使用html）
                // 3. 结束转圈圈
                // 4. 如果没有数据 不仅要结束转圈圈还要传一个参数 true 会提示没有数据了
                // 1. 指定一个page每次上拉就page++ 变成下一页
                page++;
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        // 2. 把++之后的page作为请求参数
                        page: page,
                        pageSize: 2,
                        proName: search
                    },
                    success: function (res) {
                        console.log(res);
                        console.log(res.data);
                        // 3. 可能上拉会没有数据 要判断有数据就调用模板去渲染 
                        if (res.data.length > 0) {
                            // 4. 调用模板指定模板id和当前后台返回的数据对象
                            var html = template('productlistTpl', res);
                            // 5. 渲染使用追加渲染 使用append 追加dom元素到mui-row（不能使用html）
                            $('.product-list .mui-row').append(html);
                            // 6. 有数据还是要结束转圈圈 只是不需要传参
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                        } else {
                            // 7. 没有数据结转圈圈 并提示没有数据了
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                        }

                    }
                })
            }, 1500);
        }

    }

    //跳转到商品详情
    function gotDetail() {
        //给立即购买添加点击事件
        //委托添加
        $('.product-list').on('tap','.product-buy',function () {
            // console.log(this);
            var id  = $(this).data('id');
            console.log(id);
            //跳转到商品对应的id
            location = 'practice_detail.html?id=' +nowPraductId;
            
        })
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