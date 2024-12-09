
//发送图片，如果成功，返回图片存储名
function addImages(){
    const images = document.getElementById('news_imgs').files
    var formData = new FormData()
    for(let i=0;i<images.length;i++){
        formData.append('imgs', images[i])
    }
    xhttp = new XMLHttpRequest()
    xhttp.open('POSt', localStorage.getItem('apiURL')+'/addData/addNewImages',true)
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status ==200){
            response = JSON.parse(this.response)
            if(response.status){
            return  alert(response.message)
            }else{
                console.log(response.data)
                showFileLink(response.data)
            } 
        }
    }
    xhttp.setRequestHeader('Authorization',localStorage.getItem('token'))
    xhttp.send(formData)

}

function showFileLink(data){
    const content = data.map((element, index)=>`
        <label for="img${index}">${element.originalname}</label>
        <input id="img${index}" type="text" onclick="copyLink(this)" value="<img src='${element.link}' alt=''>">
    `)
    document.getElementById('imgs_link').innerHTML = content.join('\n')
}


function copyLink(linkDiv){
    linkDiv.select()
    document.execCommand("copy")
    // alert('复制成功')

}

//发送添加数据请求
function addNewsData(form_id){
    const form = document.forms[form_id]
    const formData =
    `title=${encodeURIComponent(form['news_title'].value)}&`+
    `time=${form['news_time'].value}&`+
    `link=${encodeURIComponent(form['news_link'].value)}&`+
    `content=${encodeURIComponent(form['news_content'].value)}&`

    xhttp = new XMLHttpRequest()
    xhttp.open('POST',localStorage.getItem('apiURL')+'/addData/addNews',true)
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status ==200){
            response = JSON.parse(this.response)
            if(response.status){
            return  alert(response.message)
            }else{
                alert(response.message)
            } 
        }
    }
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.setRequestHeader('Authorization',localStorage.getItem('token'))
    xhttp.send(formData);
}

var renderId;
var newsData;
function getNewsData(){
    fetch('/article/news/news.json')
    .then((response) => response.json())
    .then((json) => {
        newsData = json
        console.log(json)
        renderToList(json)
    });
}


function renderToList(data){
    data.sort((a,b)=>Number(b.id)-Number(a.id))
    function cutString(Len,str){
        let pos = 0;
        let len = 0;
        for(; pos<str.length&&len<Len; pos++){
          str.charCodeAt(pos)<256?(len+=1):(len+=2)
        }
        return str.slice(0,pos)
    }

    const renderContent = data.map(element=>`
        <li class="element" id=${element.id}>
            <div class="time">${element.time}</div>
            <div class="title">${cutString(64,element.title)+'...'}</div>  
        </li>  
    `)

    document.getElementById("dataRender").innerHTML = renderContent.join('\n')
    var elements = document.getElementById('dataRender').getElementsByClassName('element')
    for (let i =0;i<elements.length;i++){
        elements[i].addEventListener('click',function(){
            renderId = this.id
            elementData = newsData.filter(e => e.id==renderId)[0]
            var form = document.getElementById('editNews_form')
            //点击更改信息页各项信息
            form.news_title.value= elementData.title
            form.news_time.value= elementData.time
            form.news_link.value= elementData.link
            //如果需要修改图片那么需要重新上传图片
            // form.news_imgs.value= elementData.speaker
            // form.imgs_link.value= elementData.room
            form.news_content.value= elementData.content
        })
    }
}

function updateNews(){
    if(renderId && confirm('确认提交修改后的数据？')){
        const form = document.forms['editNews_form']
        const formData =
        `id=${renderId}&`+
        `title=${encodeURIComponent(form['news_title'].value)}&`+
        `time=${form['news_time'].value}&`+
        `link=${form['news_link'].value}&`+
        `content=${encodeURIComponent(form['news_content'].value)}&`

        xhttp = new XMLHttpRequest()
        xhttp.open('POST',localStorage.getItem('apiURL')+'/updateData/updateNews',true)
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status ==200){
                response = JSON.parse(this.response)
                if(response.status){
                return  alert(response.message)
                }else{
                    alert(response.message)
                } 
            }
        }
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp.setRequestHeader('Authorization',localStorage.getItem('token'))
        xhttp.send(formData);
    }else if(!renderId){
        alert('请选择需要修改的项')
    }
}

function deleteNewsData(){
    if(renderId && confirm('确定删除数据？')){
        const message = `将要删除 ${newsData.filter(e => e.id = renderId)[0].title} ` 
        if(confirm(message)){            
            xhttp = new XMLHttpRequest()
            xhttp.open('POST',localStorage.getItem('apiURL')+'/deleteData/deleteNews',true)
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status ==200){
                    response = JSON.parse(this.response)
                    if(response.status){
                    return  alert(response.message)
                    }else{
                        alert(response.message)
                        document.getElementById(`${renderId}`).remove()
                        renderId = null;

                    } 
                }
            }
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhttp.setRequestHeader('Authorization', localStorage.getItem('token'))
            xhttp.send(`id=${renderId}`);
        }

    }else if(!renderId){
        alert('请选择删除项')
    }
}