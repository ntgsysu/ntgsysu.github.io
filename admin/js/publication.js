function addPublicationData(form_id){
    const form = document.forms[form_id]
    var formData = new FormData()
    formData.append('year',form['year'].value)
    formData.append('title',form['title'].value)
    formData.append('author',form['author'].value)
    formData.append('journal',form['journal'].value)
    formData.append('arxiv',form['arxiv'].value)
    formData.append('doi',form['doi'].value)
    formData.append('pdf',form['pdf'].files[0])
    //发送请求
    xhttp = new XMLHttpRequest()
    xhttp.open('POST',localStorage.getItem('apiURL')+'/addData/addPublicationDataWithFile',true)
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
    // xhttp.setRequestHeader('Content-Type', 'multipart/form-data');
    xhttp.setRequestHeader('Authorization',localStorage.getItem('token'))
    xhttp.send(formData);
}

var renderId;
var publicationData;

function getPublicationData(){
    var selectedYear = document.getElementById('yearSelect').value
    fetch('/article/publication/publication.json')
    .then((response) => response.json())
    .then((json) => {
        publicationData = json.filter(e=>e.year==selectedYear)
        renderToList(publicationData)
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
            <div class="time">${element.year}</div>
            <div class="title">${cutString(72,element.title)+'...'}</div>  
        </li>  
    `)

    document.getElementById("dataRender").innerHTML = renderContent.join('\n')
    var elements = document.getElementById('dataRender').getElementsByClassName('element')
    for (let i =0;i<elements.length;i++){
        elements[i].addEventListener('click',function(){
            renderId = this.id
            elementData = publicationData.filter(e => e.id==renderId)[0]
            var form = document.getElementById('editPublication_form')
            //点击更改信息页各项信息
            form.year.value= elementData.year
            form.title.value= elementData.title
            form.author.value= elementData.author
            form.journal.value= elementData.journal
            form.arxiv.value= elementData.arxiv
            form.doi.value= elementData.doi
            if(elementData.pdfname){
                document.getElementById('pdf').type="text"
                document.getElementById('pdf').addEventListener('click',function(){
                    this.type = 'file'
               })
               form.pdf.value= elementData.pdfname
            }

        })
    }
}

function updatePublication(){
    if(renderId && confirm('确认提交修改后的数据？')){
        const form = document.forms['editPublication_form']
        var formData = new FormData()
        formData.append('id',renderId)
        formData.append('year',form['year'].value)
        formData.append('title',form['title'].value)
        formData.append('author',form['author'].value)
        formData.append('journal',form['journal'].value)
        formData.append('arxiv',form['arxiv'].value)
        formData.append('doi',form['doi'].value)
        formData.append('pdf',form['pdf'].files ? form['pdf'].files[0]:'')

        xhttp = new XMLHttpRequest()
        xhttp.open('POST',localStorage.getItem('apiURL')+'/updateData/updatePublicationDataWithFile',true)
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
        // xhttp.setRequestHeader('Content-Type', 'multipart/form-data');
        xhttp.setRequestHeader('Authorization',localStorage.getItem('token'))
        xhttp.send(formData);
    }else if(!renderId){
        alert('请选择需要修改的项')
    }
}