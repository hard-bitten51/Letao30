$(function () {
    // 调用查询购物车列表
    // queryCart();
    // 调用下拉刷新购物车列表
    pullRefresh();
    // 调用购物车的删除功能
    deleteCart();
    // 调用购物车的编辑功能
    editCart();

    // 查询购物车的商品的功能
    function queryCart() {
        //  1. 发送请求请求购物车列表数据
        $.ajax({
            url: '/cart/queryCart',
            success: function (res) {
                console.log(res);
                //  2. 后台返回不是对象是一个数组 调用模板要包装一下 把res数组包装在对象的data属性 {data:[]}
                var html = template('cartlistTpl', {
                    data: res
                });
                // 3. 把模板渲染到ul里面
                $('.cart-list').html(html);
                // 4. 渲染完成购物车列表也进行初始化
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });
            }
        })
    }


    // 购物车删除功能
    function deleteCart() {
        // 1. 给所有删除按钮添加点击事件 按钮是动态添加使用委托方式
        $('.cart-list').on('tap', '.btn-delete', function () {
            // 在按钮点击事件的函数里面this == 当前按钮
            console.log(this);
            var id = $(this).data('id');
            // 原生js获取按钮父元素父元素li
            // var li = this.parentNode.parentNode;
            // zepto 获取按钮父元素父元素li
            var li = $(this).parent().parent();

            // 2. 弹出确认框  确认框的第四个参数是回调函数 这个回调函数没有人调用 是window调用
            mui.confirm('确认删除该商品吗？', '温馨提示', ['确认', '取消'], function (e) {
                console.log(e);
                // 表示点击确定
                if (e.index == 0) {
                    // 3. 删除这个商品 调用后台的API删除 获取当前要删除的商品id
                    // 但是在弹框的回调函数里面 this != 当前按钮 得在弹框外面获取id
                    // 4. 调用API根据这个id去删除商品
                    $.ajax({
                        url: '/cart/deleteCart',
                        data: {
                            id: id
                        },
                        success: function (data) {
                            console.log(data);
                            //   5. 判断如果返回success删除成功把当前li删掉
                            if (data.success) {
                                // 6. 获取li的父元素ul把自己删掉
                                // li.parentNode.removeChild(li)
                                // zepto 直接把自己从父元素中删掉
                                li.remove();
                                // 7. 重新调用查询去渲染页面 请求第一页数据调用这个带分页的函数
                                queryCartPaging();
                            }
                        }
                    })
                } else {
                    setTimeout(function () {
                        // 把这个列表滑动回去 使用$不是zepto的$是把mui变成了$
                        // swipeoutClose把列表滑动回去 但是传递参数是dom元素li 如果dom元素之间传人 
                        //如果是zepto 把zepto对象转成dom对象 li[0] 转成dom对象
                        mui.swipeoutClose(li[0]);
                    }, 0);
                }
            });
        });

    }
    // 购物车编辑功能
    function editCart() {
        // 1. 给所有编辑按钮添加点击事件
        $('.cart-list').on('tap', '.btn-edit', function () {
            console.log(this);
            var li = $(this).parent().parent();
            // 2. 弹框之前准备好这些要编辑标签结构 创建模板和调用模板
            // 2.1 因为数据在之前商品列表模板里面每个商品里面 把每个商品通过属性绑定到编辑按钮上 通过属性获取整个商品数据
            var data = $(this).data('product');
            console.log(data);
            var min = +data.productSize.split('-')[0];
            var max = +data.productSize.split('-')[1];
            // 2.2 定义一个新的尺码数组来吧每个加进去
            data.productSize = [];
            // 2.3 循环从min开始到max结束 得包含max
            for (var i = min; i <= max; i++) {
                // 2.4 把每个i的值添加到数组里面
                data.productSize.push(i);
            }

            // 2.5 调用当前编辑购物车模板
            var html = template('editCartTpl', data);
            console.log(html);
            // 把字符串中的回车 换行替换空
            // html = html.replaceAll(/\r\n/,'');
            html = html.replace(/[\r\n]/g, '');
            // 3. 弹出确认框 弹框会模板把字符串的回车换行 替换成br标签 提前把字符串的回车换行去掉
            mui.confirm(html, '编辑商品', ['确定', '取消'], function (e) {
                if (e.index == 0) {
                    // 5. 如果点击确定获取最新的尺码和数量
                    // 5.1 获取当前选择的尺码
                    var size = $('.btn-size.mui-btn-warning').data('size');
                    console.log(size);
                    // 5.2 获取当前选择的数量
                    var num = mui('.mui-numbox').numbox().getValue();
                    console.log(num);
                    // 6. 调用编辑的API接口把最新的尺码数量 商品id传个后台
                    $.ajax({
                        url: '/cart/updateCart',
                        type: 'post',
                        // data里面所有数据 里面包含了id
                        data: {
                            id: data.id,
                            size: size,
                            num: num
                        },
                        success: function (data) {
                            //   7. 判断如果编辑成功调用查询刷新页面
                            if (data.success) {
                                queryCartPaging();
                            }
                        }
                    })
                } else {
                    // 调用mui侧滑列表滑回去的函数 传入当前li
                    mui.swipeoutClose(li[0]);
                }
            });
            // 4. 等弹框出来渲染完成后再初始化尺码和数量
            // 4.1 初始化数字框（也是组件也是动态生成的 也要手动初始化） 基本上初始化组件都是选择组件的大容器
            mui('.mui-numbox').numbox();
            // 4.1 让尺码能够点击也是在渲染完成后加事件和添加类名等 这个时候已经出来了不需要委托
            $('.btn-size').on('tap', function () {
                $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
            });
        });
    }

    // 计算总金额
    function getSum() {
        // 1. 获取所有选中的复选框
        var checkeds = $('.mui-checkbox input:checked');
        console.log(checkeds);
        var sum = 0;
        // 2. 遍历所有选中的复选框
        checkeds.each(function (index, value) {
            //   3. 获取当前每个复选框的价格数量
            var price = $(value).data('price');
            var num = $(value).data('num');
            console.log(price);
            console.log(num);
            // 4. 计算当前每个商品总价
            var count = price * num;
            // 5. 把每个商品总价累加到 sum总金额里面
            sum += count;
        });
        // 6. 保留2位小数
        sum = sum.toFixed(2);
        console.log(sum);
        // 7. 把金额渲染到页面上
        $('.order-count span').html(sum);

    }

    // 带有分页查询购物车列表
    function queryCartPaging() {
        //  1. 发送请求请求购物车列表数据
        $.ajax({
            // 下拉刷新请求第一页数据 需要请求带分页的这个接口
            url: '/cart/queryCartPaging',
            // 一定要传入分页page和pageSize
            data: {
                page: 1,
                pageSize: 4
            },
            success: function (res) {
                console.log(res);
                // 判断当前请求购物车数据是否有error 有error表示有错（原因就是未登录）
                if (res.error) {
                    // 跳转到登录页面但是我也要把returnUrl传递过去 登录成功就可以返回到当前的购物车页面
                    location = 'login.html?returnUrl=' + location.href;
                } else {
                    // 如果没有报错则渲染
                    console.log(res.data);
                    //  2. 请求带分页的接口返回数据不是数组是一个对象不需要包装
                    var html = template('cartlistTpl', res);
                    // 3. 把模板渲染到ul里面
                    $('.cart-list').html(html);
                    // 4. 结束下拉刷新 不结束会会一直转圈圈
                    mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed                  
                    // 5. 下拉刷新完成后要重置上拉加载的效果 (注意一定要等结束转圈圈再重置)
                    mui('#pullrefresh').pullRefresh().refresh(true);
                    // 6. 数据也要重置为第一页开始
                    page = 1;
                    // 在数据渲染完成后 调用计算总金额的功能
                    getSum();
                    // 在页面渲染完成后给所有复选框添加一个改变事件 选择发生变化的时候才要调用 tap很快
                    // tap的时候还没有修改选中状态 使用change事件 
                    $('.mui-checkbox input').on('change', function () {
                        getSum();
                    });
                }

            }
        });
    }
    // 购物车列表下拉刷新和上拉加载更多
    function pullRefresh(params) {
        // 1. 调用mui初始化下拉刷新的函数
        mui.init({
            pullRefresh: {
                // 指定下拉刷新的容器
                container: '.mui-scroll-wrapper',
                // 指定下拉刷新
                down: {
                    // 当初始化完成下拉刷新后马上自动触发一次下拉刷新
                    auto: true,
                    // 下拉刷新的回调函数
                    callback: pulldownRefresh
                },
                // 指定上拉加载更多
                up: {
                    // 上拉加载的回调函数
                    contentrefresh: '正在加载...',
                    callback: pullupRefresh
                }
            }
        });
        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            setTimeout(function () {
                queryCartPaging();
            }, 1500)
        }
        var page = 1;
        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
            setTimeout(function () {
                //  1. 每次上拉加载下一页page++
                page++;
                //  1. 发送请求请求购物车列表数据
                $.ajax({
                    // 下拉刷新请求第一页数据 需要请求带分页的这个接口
                    url: '/cart/queryCartPaging',
                    // 一定要传入分页page和pageSize
                    data: {
                        page: page,
                        pageSize: 4
                    },
                    success: function (res) {
                        console.log(res);
                        console.log(res.data);
                        // 返回的一个数组空数组 res == []  [].data 已经undefined 所以直接判断有没有data属性 有表示有数据 没有表示没有数据
                        if (res.data) {
                            // 2. 请求带分页的接口返回数据不是数组是一个对象不需要包装
                            var html = template('cartlistTpl', res);
                            // 3. 把模板渲染到ul里面 上拉加载要追加数据 使用append
                            $('.cart-list').append(html);
                            // 4. 结束上拉加载 不结束会会一直转圈圈
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(); //refresh completed                  
                        } else {
                            // 5. 没有数据的时候提示没有数据了
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //refresh completed                  
                        }
                    }
                });
            }, 1500)
        }
    }
});