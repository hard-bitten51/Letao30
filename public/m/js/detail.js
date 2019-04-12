$(function () {
    // 1. 使用getQueryString 函数获取当前id 详情和加入购物车都需要放到全局
    var id = getQueryString('id');
    // 调用 查询商品详情
    queryProductDetail();
    // 调用加入购物车
    addCart();
    // 查询商品详情
    function queryProductDetail() {
        // 2. 根据当前id去请求数据
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: id
            },
            success: function (data) {
                console.log(data);
                // 3. 由于数据格式不是我们想要的单独处理尺码 40-50字符串 把字符串变成一个 [40,41..50]
                // 3.1 把字符串的最小值和最大值取出 并转成数字
                var min = +data.size.split('-')[0];
                var max = +data.size.split('-')[1];
                // 3.2 定义一个新的尺码数组来吧每个加进去
                data.size = [];
                // 3.3 循环从min开始到max结束 得包含max
                for (var i = min; i <= max; i++) {
                    // 3.4 把每个i的值添加到数组里面
                    data.size.push(i);
                }
                console.log(data.size);
                var html = template('productDetailTpl', data);
                $('#main').html(html);
                // 4. 这种组件是动态ajax添加进来的默认没有被初始化 得等渲染完成再手动初始化
                //获得slider插件对象
                var gallery = mui('.mui-slider');
                gallery.slider({
                    interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
                });
                // 5. 初始化数字框（也是组件也是动态生成的 也要手动初始化） 基本上初始化组件都是选择组件的大容器
                mui('.mui-numbox').numbox();
                // 6. 让尺码能够点击也是在渲染完成后加事件和添加类名等 这个时候已经出来了不需要委托
                $('.btn-size').on('tap', function () {
                    $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
                });
                // 7. 初始化区域滚动 这个时候区域滚动才出现了
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });
            }
        })
    }

    // 加入购物车
    function addCart() {
        // 1. 给加入购物车的按钮添加点击事件
        $('.btn-add-cart').on('tap', function () {
            //   2. 获取当前选择的尺码
            var size = $('.btn-size.mui-btn-warning').data('size');
            console.log(size);
            // 把值取反 取他的布尔值 没有值布尔值就是false  !false == ture
            if (!size) {
                // 提示用户去选择尺码
                mui.toast('请选择尺码', {
                    duration: 1000,
                    type: 'div'
                });
                // 后面的代码就不执行了
                return;
            }
            // 3. 获取当前选择的数量
            var num = mui('.mui-numbox').numbox().getValue();
            console.log(num);
            // 4. 调用加入购物的API去加入购物车
            $.ajax({
                url: '/cart/addCart',
                //做数据提交 提交要使用post请求
                type: 'post',
                // 后台要求的参数productId 但是我们变量加id
                data: {
                    productId: id,
                    num: num,
                    size: size
                },
                success: function (data) {
                    console.log(data);
                    // 5. data后台返回的数据 返回加入成功或者失败 失败就表示未登录
                    if (data.error) {
                        // 6. 有错误表示未登录跳转到登录页面
                        location = 'login.html?returnUrl=' + location.href;
                    } else {
                        // 7. 当加入购物车成功就提示用户是否去购物车查看
                        mui.confirm('您真的要去购物车查看吗？', '温馨提示', ['确定', '取消'], function (e) {
                            // 回调函数当点击了确定 或者 取消就会触发函数
                            if (e.index == 0) {
                                // 8. 表示点击了左边按钮 跳转到购物车页面
                                location = 'cart.html';
                            } else {
                                // 9. 表示点击了右边的按钮 提示用户继续添加
                                mui.toast('请继续添加!', {
                                    duration: 1000,
                                    type: 'div'
                                });
                            }
                        })
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