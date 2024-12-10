function renderHTMLFromJson(id){
    fetch(`news.json`)
    .then((response) => response.json())
    .then((dataJson) => {
        data = dataJson.filter(e=>e.id==id)[0]
        console.log(data.content)
        //渲染数据到HTML
        document.getElementById('title').innerText = data.title
        document.getElementById('time').innerText = data.time
        var content = data.content.replaceAll('\n','<br>')
        document.getElementById('content').innerHTML = content
    });
}