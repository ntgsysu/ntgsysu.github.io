function addConferenceData(form_id){
    console.log("发送数据")
    const form = document.forms[form_id]
    const form_data = 
            `title=${encodeURIComponent(form['title'].value)}&`+
            `startTime=${form['startTime'].value}&`+
            `endTime=${form['endTime'].value}&`+
            `location=${form['location'].value}&`+
            `link=${encodeURIComponent(form['link'].value)}`

    //发送请求
    xhttp = new XMLHttpRequest()
    xhttp.open('POST',localStorage.getItem('apiURL')+'/addData/addConference',true)
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
    xhttp.send(form_data);
}

var renderId;
var conferenceData;
function getConferenceData(){
    fetch('/article/conference/conference.json')
    .then((response) => response.json())
    .then((json) => {
        conferenceData = json
        renderToList(conferenceData)
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
            <div class="time">${element.startTime}</div>
            <div class="title">${cutString(64,element.title)+'...'}</div>  
        </li>  
    `)

    document.getElementById("dataRender").innerHTML = renderContent.join('\n')
    var elements = document.getElementById('dataRender').getElementsByClassName('element')
    for (let i =0;i<elements.length;i++){
        elements[i].addEventListener('click',function(){
            renderId = this.id
            elementData = conferenceData.filter(e => e.id==renderId)[0]
            var form = document.getElementById('editConference_form')
            //点击更改信息页各项信息
            form.title.value= elementData.title
            form.startTime.value= elementData.startTime
            form.endTime.value= elementData.endTime
            form.location.value= elementData.location
            form.link.value= elementData.link
        })
    }
}

function updateConference(){
    if(renderId && confirm('确认提交修改后的数据？')){
        const form = document.forms['editConference_form']
        const formData =
        `id=${renderId}&`+
        `title=${encodeURIComponent(form['title'].value)}&`+
        `startTime=${form['startTime'].value}&`+
        `endTime=${form['endTime'].value}&`+
        `location=${form['location'].value}&`+
        `link=${encodeURIComponent(form['link'].value)}`

        xhttp = new XMLHttpRequest()
        xhttp.open('POST',localStorage.getItem('apiURL')+'/updateData/updateConference',true)
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

