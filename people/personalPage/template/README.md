---
注：
1. 如果有对html语言高亮的编程环境，修改代码内容会更简单。

---

# 文件说明
* personalPage.html 是个人页面的首页。
* css/personalPage.css 是为personalPage.html设置样式的css文件
* img/* 文件夹是页面的图片存放位置

# 修改说明
模板复制到 ~/personalPage/  文件夹后，修改personalPage.html文件来设置自己的内容。
## head 下的可设置

1. head下面的 title 内容来设置浏览器顶部显示的名称。

2. 如果你不想显示网页的logo，导航栏，底部信息栏，可以删除head下的这段代码：
```
   <script>
        $(function(){
            $("header").load("/base/header.html");
            $("nav").load("/base/nav.html");
            $("footer").load("/base/footer.html");
        });
    </script>
```

## body下的可设置
body下标签有四个：
 - header
 - nav
 - main
 - footer

header nav footer是保留给网页的logo，导航栏，底部信息栏 的位置空间。如果不需要此内容，可以去掉对应标签。
main 标签是该模板的个人内容标签。

### main 下可修改
1. class="header" 的div是个人内容的头部欢迎区。 
    - 修改backgrou-imge内的url路径可以修改该区的背景。
    - 修改color可以修改字体颜色。字体颜色可以是rgb值。
    - 修改其他可以设置内容

2. class="content" 的div是个人内容的正文区。
    - 每一个class="column"的div都是正文下的一个栏目
    - column 下的title是设置栏目名称
    - 在第一个column下的information内修改个人信息。

3. class="item"的div 是设置为栏目下的子栏目。
    - class="item-title"的div修改子栏目的标题名。标题名下方会有渐变的线条。

4. figure标签可以添加图片
```
    <figure>
        <img src="./img/xxxx.png" style="width: 600px; ">
        <figcaption>图1. xxx示意图
        </figcaption>
    </figure>
```
    - img 是导入图片的标签。若要调节图片大小，修改width后面的数值可以修改图片宽度（高度随之调节）。
    - figcaption 内容设置说明

### 样式设置
如果你想设置更多的样式，可以修改/css/personalPage.css文件。


