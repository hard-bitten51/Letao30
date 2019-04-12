$(function () {

    queryCart();

    deleteCart();
    editCart();
    // getSum();
    // getSum();
    addClick();
    //给每一个动态生成的input注册点击事件
    function addClick() {
        $('.cart-list').on('change','input',function () {
            getSum();
            console.log(111);
            
        })
    }
    //查询数据/创建模板
    function queryCart(){
        //发送请求
        $.ajax({
            url:'/cart/queryCart',
            success:function(data){
                console.log(data);
                
                //调用模板
                //是一个数组需要包装一下
                var html = template('cartlistTpl',{rows:data});
                
                $('.cart-list').html(html);
                //动态选然后，滑动需要初始化
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.001 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });
              
            }
        })
        
    }

    //购物车删除功能
    function deleteCart(){
        //删除数据库中的该数据，并重新渲染该页面
        $('.cart-list').on('tap','.btn-delete',function () {
            console.log(this);
            var id = $(this).data('id');
            var li = $(this).parent().parent();

            mui.confirm('确认删除该商品吗？', '温馨提示', ['确认', '取消'], function (e) {
                console.log(e);
                //判断点击结果
                if (e.index == 0) {
                    
                //发请求
            $.ajax({
                url:'/cart/deleteCart',
                data:{id:id},
                success:function(data){
                    //返回success说明
                    console.log(data);
                    if (data.success) {
                        li.remove();
                        //重新渲染
                        queryCart();
                    }
                }
            })
        }else{
            setTimeout(function() {
                //表示选择了取消，需要将该条滑回去
                // swipeoutClose把列表滑动回去 但是传递参数是dom元素li 如果dom元素之间传人 
                //如果是zepto 把zepto对象转成dom对象 li[0] 转成dom对象
                mui.swipeoutClose(li[0]);

            }, 0);
        }
        })
        })

    }
    //购物车编辑功能
    function editCart() {
        $('.cart-list').on('tap', '.btn-edit', function () {
            //$(this)为dom对象
            console.log(this);
            var li = $(this).parent().parent();        
            
            var data = $(this).data('product');
            console.log(data);
            
            var min = +data.productSize.split('-')[0];
            var max = +data.productSize.split('-')[1];
            //重新定义一个尺码的数组
            data.productSize = [];

            for (let i = min; i <= max; i++) {
                data.productSize.push(i);
            }
            //调用模板
            var html = template('editCartTpl',data);

            //将字符串中的回车和空格去除 使用正则
            html = html.replace(/[\r\n]/g, '');
             // 3. 弹出确认框 弹框会模板把字符串的回车换行 替换成br标签 提前把字符串的回车换行去掉
             mui.confirm(html, '编辑商品', ['确定', '取消'], function (e) {
                //判断
                if (e.index == 0) {
                    //说明确认修改
                    //获取当前修改的数据
                    var size = $('.btn-size.mui-btn-warning').data('size');
                    console.log(size);
                    var num = mui('.mui-numbox').numbox().getValue();
                    //发送请求
                    $.ajax({
                        url:'/cart/updateCart',
                        type:'post',
                        data:{
                            id:data.id,
                            size:size,
                            num:num
                        },
                        success:function (data) {
                            //判断返回值
                            if (data.success) {
                                //重新渲染页面
                                queryCart();
                            }
                        }
                    })
                    
                }else{
                    mui.swipeoutClose(li[0]);
                }
             });
             //由于是动态添加的，需要重新初始化
             mui('.mui-numbox').numbox();
             //尺码 的点击效果亦是如此
            $('.btn-size').on('tap', function () {
                $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
            });
        })
    }
    //计算金额的函数
    function getSum() {
        //获取所有选中的商品
        var checkeds = $('.mui-checkbox input:checked');
        console.log(checkeds);
        
        var sum = 0;
        //遍历所有的复选框
        checkeds.each(function (index,value) {
            // console.log($(value));
            // console.log($(value).parent().parent().parent().find('.product-price').find('span')[0]);
            // console.log($(value)[0]);
            
            var price = $(value).data('price');
            var num = $(value).data('num');
            console.log(price);
            console.log(num);
             
            //计算价格
            var count = price*num;
            //加至总价
            sum += count;
            //保留两位小数
            console.log(sum);

        })
        sum = sum.toFixed(2);
        $('.order-count span').html(sum);
       
    }
})
