window.addEventListener('load',function(){
this.fetch('/img/banner/banner.json').then(
    response=>response.json()
).then(imgArry=>{
    //渲染图片
    var imgHTML = imgArry.map(e=>{
        if(e.link){
            return `<li><a href="${e.link}"><img src="/img/banner/${e.img}"></a></li>`
        }else{
            return `<li><img src="/img/banner/${e.img}"></li>`
        }
    })
    this.document.getElementById('bannerImg').innerHTML = imgHTML.join('\n')
        
    
    //添加动画
    var banner = document.querySelector('.banner');
    var left = document.querySelector('.banner .arrows.left');
    var right = document.querySelector('.banner .arrows.right');
    var banner_list = document.querySelector('.banner-list');
    var bottom_list = document.querySelector('.bottom-list');
    var banner_list_li_width =document.querySelector('.banner-list>li').offsetWidth;


    //鼠标移入箭头出现，鼠标移除箭头消失
    banner.addEventListener('mouseenter',function(){
        left.style.display = 'block';
        right.style.display = 'block';
    });

    banner.addEventListener('mouseleave',function(){
        left.style.display = 'none';
        right.style.display = 'none';
    });


    // 根据图片数量的多少设置banner-list的宽度
    banner_list.style.width = (banner_list.children.length +1) * banner_list_li_width + "px"



    function animate(obj,target,callback){
        clearInterval(obj.timer)
        obj.timer = setInterval(function(){
            var step =(target - obj.offsetLeft)/10;
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if(obj.offsetLeft == target){
            clearInterval(obj.timer);
            if(callback){
                callback();
            } 
        }
        obj.style.left = obj.offsetLeft + step +'px';
        },30);
    }

    var index=0;
    for(var i=0; i<banner_list.children.length;i++){
        //设置图片索引号
        banner_list.children[i].setAttribute('index',i);

        // 根据图片数量的多少添加底部按钮的数量
        var li = document.createElement('li');
        bottom_list.appendChild(li);
        //设置底部按钮索引号
        li.setAttribute('index',i);

        // 为底部按钮设置监听行为
        li.addEventListener('click',function(){
            // 通过排他,为点击的按钮设置selected
            for(var j=0;j<bottom_list.children.length;j++){
                bottom_list.children[j].className='';
            }
            this.className='selected';

            //通过获得底部按钮的索引号来对banner-list的left值进行调整
            index = this.getAttribute('index');
            animate(banner_list,-index * banner_list_li_width);
        });


    }

    // 默认选中的图片
    bottom_list.children[index].className="selected";


    //克隆第一个在最后面
    var first = banner_list.children[0].cloneNode(true);
    banner_list.appendChild(first);

    //右侧按钮的功能
    var num;
    right.addEventListener('click',function(){
        //点击前位置
        num = index;
        banner_list.style.left = -num * banner_list_li_width+'px';
        // if(num == banner_list.children.length-1){
        //     num = 0;
        //     banner_list.style.left = -num * banner_list_li_width+'px';
        // }


        //目前位置
        num++;
        index++;
        if(num==banner_list.children.length-1){
            index=0;
        }

        for(var i =0;i<bottom_list.children.length;i++){
            bottom_list.children[i].className = '';
        }
        bottom_list.children[index].className = 'selected';

        animate(banner_list,-num * banner_list_li_width);
    })

    left.addEventListener('click',function(){
        if(index==0){
            index=banner_list.children.length-1;
            banner_list.style.left = -index * banner_list_li_width+'px';
        }
        num = index;
        num--;
        index--;

        for(var i =0;i<bottom_list.children.length;i++){
            bottom_list.children[i].className = '';
        }
        bottom_list.children[index].className = 'selected';
        animate(banner_list,-num * banner_list_li_width);
    });

    //自动轮播
    var timer;
    function playTimer(){
        timer = this.setInterval(function(){
        right.click();
    },3000);

    }
    banner.onmouseenter = function () {
    clearInterval(timer);
    }
    banner.onmouseleave = function () {
        playTimer();
    }
} )

})