function renderHTMLFromJson(id){
    fetch(`seminar.json`)
    .then((response) => response.json())
    .then((dataJson) => {
        data = dataJson.filter(e=>e.id==id)[0]
        //渲染数据到HTML
        document.getElementById('img').src ='./files/'+ data.imgname
        if(data.pptname) {
            document.getElementById('slide').classList = 'slide'
            document.getElementById('slide').innerHTML = `<a href="./files/${data.pptname}">PDF</a>`
        }
    });
}