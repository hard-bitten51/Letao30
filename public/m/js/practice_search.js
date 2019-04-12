//dom 加载完再执行里面的代码

$(function(){

    addHistory();
    queryHistory();
    deleteHistory();
    clearHistory();

    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    //trim( )的作用是去掉字符串两端的多余的空格,注意,是两端的空格,且无论两端的空格有多少个都会去掉,当然中间的那些空格不会被去掉

    //查询记录的函数
    function queryHistory() {
        var arr = getHistoryData();
        console.log(arr);
        
        var html = template('historyTpl', {
            rows: arr
        });
        // 4. 把模板渲染到ul里面
        $('.search-history ul').html(html);
        
    }

    //添加记录的函数
    function addHistory() {
    /* 添加记录的思路
        1. 数据存在localStorage 里面 需要永久存储除非你手动删掉
        2. 点击搜索的时候获取输入关键字
        3. 把这个关键加到本地存储localStorage
        4. 以数组的方式添加（可能会有很多记录） */
    
        $('.btn-search').on('tap',function(){
            // console.log(111);
            

            var search = $('.input-search').val().trim();
            //做非空判断
            if (search == "") {
                return; 
            }

        // var arr = [];//新建一个空数组

        var arr = getHistoryData();
        arr = unqi(arr);//去重处理
        
        for(var i = 0;i<arr.length;i++){
            // console.log(i);
            if (arr[i] == search) {
                arr.splice(i,1);//将重复项删除

                i--;//循环次数减一
            }
        }

        //将刚才搜索的search添加到arr中
        arr.unshift(search);
        console.log(arr);
        //存在localstorage中
        setHistoryData(arr);

        //把输入框清空
        $('.input-search').val('');

        queryHistory();
        
            // 记录添加完成后就跳转到商品列表页面 由于按钮不是a链接只能使用js localtion对象去跳转
            // 跳转页面的文件路径参照是当前search.html这个页面而不是search.js文件
            // 由于这个当前输入搜索关键字在商品列表需要这个值通过url参数传递过去
            location = 'practice_productlist.html?search='+search+"&time="+new Date().getTime()+"&rsv_pq=fsdfdsf1231231";
        })
    }

    //删除记录的函数
    function deleteHistory() {
        $('.search-history ul').on('tap', 'li .btn-delete' ,function(){
            var index = $(this).data('index');
            console.log(index);
            
            var arr = getHistoryData();

            arr.splice(index,1);

            setHistoryData(arr);
            //重新渲染
            queryHistory(arr);
        })
    }

    //全部清除的操作
    function clearHistory() {
        $('.btn-clear').on('tap',function () {
            localStorage.removeItem('searchHistory');
            //重新渲染
            queryHistory();
        })
    }

    //获取localstorage中的数组
    function getHistoryData() {
        var arr = localStorage.getItem('searchHistory');
        //判断arr是否为空
        if (arr == null) {
            arr = [];
        }else{
            arr = JSON.parse(arr);
        }
        return arr;
    }

    //将搜索记录装进localStorage
    function setHistoryData(arr) {
        localStorage.setItem('searchHistory',JSON.stringify(arr));
    }

    //数组去重的函数
    function unqi(array){
        //声明一个新数组
        var temp = [];
        for(var i =0;i < array.length;i++){
            //inexof方法如未出现则返回-1
            if (temp.indexOf(array[i]) == -1) {
                temp.push(array[i]);                
            };
        };
        return temp;
    };
});