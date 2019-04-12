

$(function () {

    //查询商品详情
    queryProductDetail();

    addCart();

    var id;
    function queryProductDetail() {
        id = getQueryString('id');
        console.log(id);

        //发送请求
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: id
            },
            success: function (data) {
                console.log(data);

                var min = +data.size.split('-')[0];
                var max = +data.size.split('-')[1];
                console.log(min,max);

                //定义一个空数组
                data.size = [];
                for (var i = min; i <= max; i++) {
                    data.size.push(i);
                    
                }

                var html = template('productDetailTpl', data);
                $('#main').html(html);

                //获得slider插件对象
                var gallery = mui('.mui-slider');
                gallery.slider({
                    interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
                });
                mui('.mui-numbox').numbox();

                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });

                //初始化后给尺码添加点击事件
                $('.btn-size').on('tap',function () {
                    $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
                })

            }

        })
    }

    //加入购物车
    function addCart() {
        $('.btn-add-cart').on('tap',function () {
            var size = $('.btn-size.mui-btn-warning').data('size');
            // console.log(size);
            if (!size) {
                //提示用户选择尺码
                mui.toast('请选择尺码',{ duration:'800', type:'div' }) ;

                // 后面的不执行
                return;
            };
            //获取数量
            var num = mui('.mui-numbox').numbox().getValue();
            //发请求
            $.ajax({
                url:'/cart/addCart',
                type:'post',
                data:{
                    //避免混淆使用productId
                    productId:id,
                    num:num,
                    size:size
                },
                success:function (data) {
                    console.log(data);
                    
                    //后台判断加入失败 就表示未登录
                    if (data.error) {
                        location = 'login.html?returnUrl=' + location.href; 
                    }else{
                        
                        mui.confirm( '是否现在就去购物车查看', '加入成功！', ['好啊','稍后去看'], function(e){
                            console.log(e);
                            if(e.index == 0){
                                location = 'practice_cart.html';
                            }
                        } )
                    }
                }

            })
            
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