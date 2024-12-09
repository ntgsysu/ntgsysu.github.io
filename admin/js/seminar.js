function addSeminarDataWithFile(form_id){
    const form = document.forms[form_id]
    var formData = new FormData()
    formData.append('title',form['seminar_title'].value)
    formData.append('reporter',form['seminar_reporter'].value)
    formData.append('inviter',form['seminar_inviter'].value)
    formData.append('startTime',form['seminar_startTime'].value)
    formData.append('endTime',form['seminar_endTime'].value)
    formData.append('room',form['seminar_room'].value)
    formData.append('img',form['seminar_img'].files[0])
    formData.append('ppt',form['seminar_ppt'].files[0])
    //发送请求
    xhttp = new XMLHttpRequest()
    xhttp.open('POST',localStorage.getItem('apiURL')+'/addData/addSeminarWithFile',true)
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status ==200){
            response = JSON.parse(this.response)
            if(response.status){
                return  alert(response.message)
            }else{
                console.log("成功")
               return alert(response.message)
            } 
        }
    }
    // xhttp.setRequestHeader('Content-Type', 'multipart/form-data');
    xhttp.setRequestHeader('Authorization',localStorage.getItem('token'))
    xhttp.send(formData);
}

var renderId
var seminarData
function getSeminarData(){
    fetch('/article/seminar/seminar.json')
    .then((response) => response.json())
    .then((json) => {
        seminarData = json
        renderToList(seminarData)
    });
}

function renderToList(data){
    data.sort((a,b)=>{
        var aTime = new Date(a.startTime)
        var bTime = new Date(b.startTime)
        return bTime.getTime() - aTime.getTime()
    })
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
            <div class="reporter">${element.reporter}</div>
            <div class="title">${cutString(55,element.title)+'...'}</div>  
        </li>  
    `)

    document.getElementById("dataRender").innerHTML = renderContent.join('\n')
    var elements = document.getElementById('dataRender').getElementsByClassName('element')
    for (let i =0;i<elements.length;i++){
        elements[i].addEventListener('click',function(){
            renderId = this.id
            elementData = seminarData.filter(e => e.id==renderId)[0]
            var form = document.getElementById('editSeminar_form')
            //点击更改信息页各项信息
            form.title.value= elementData.title
            form.reporter.value= elementData.reporter
            form.inviter.value= elementData.inviter
            form.startTime.value= elementData.startTime
            form.endTime.value= elementData.endTime
            form.room.value= elementData.room
            if(elementData.imgname){
                document.getElementById('img').type="text"
                document.getElementById('img').addEventListener('click',function(){
                    this.type = 'file'
               })
               form.img.value= elementData.imgname
            }
            if(elementData.pptname){
                document.getElementById('ppt').type="text"
                document.getElementById('ppt').addEventListener('click',function(){
                    this.type = 'file'
               })
               form.ppt.value= elementData.pptname
            }

        })
    }

}

function updateSeminar(){
    if(renderId && confirm('确认提交修改后的数据？')){
        const form = document.forms["editSeminar_form"]
        var formData = new FormData()
        formData.append('id',renderId)
        formData.append('title',form['title'].value)
        formData.append('reporter',form['reporter'].value)
        formData.append('inviter',form['inviter'].value)
        formData.append('startTime',form['startTime'].value)
        formData.append('endTime',form['endTime'].value)
        formData.append('room',form['room'].value)
        formData.append('img',form['img'].files ? form['img'].files[0]:'')
        formData.append('ppt',form['ppt'].files ? form['ppt'].files[0]:'')
        xhttp = new XMLHttpRequest()
        xhttp.open('POST',localStorage.getItem('apiURL')+'/updateData/updateSeminarWithFile',true)
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status ==200){
                response = JSON.parse(this.response)
                if(response.status){
                    alert(response.message)
                }else{
                    alert(response.message)
                    // console.log(response.message)
                } 
            }
        }
        // xhttp.setRequestHeader('Content-Type', 'multipart/form-data');
        xhttp.setRequestHeader('Authorization',localStorage.getItem('token'))
        xhttp.send(formData);
    }else if(!renderId){
        alert('请选择需要修改的项')
    }
}