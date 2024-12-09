const startYear = 2022
var tmpActiveYear = new Date().getFullYear()
var josnArray;
function contentRender(year){
    //切换导航栏年份背景色
    document.getElementById(`${tmpActiveYear}`).setAttribute('class','')
    document.getElementById(`${year}`).setAttribute('class','active')
    tmpActiveYear = year

    //渲染数据到内容区
    var renderPlace = document.getElementById('renderPlace')
    var dataInInputYear = josnArray.filter(e => new Date(e.startTime).getFullYear()==year)
    dataInInputYear.sort((a,b)=>{
        var aTime = new Date(a.startTime)
        var bTime = new Date(b.startTime)
        return bTime.getTime() - aTime.getTime()
    })
    var renderContentsArray =  dataInInputYear.map(e=>`
        <div>
            <a href="${e.link}">
                <div class="title">${e.title}</div>
                <div class="time">${e.startTime}~${e.endTime}</div>
                <div class="location">${e.location}</div>
            </a>
        </div>
    `)
    renderPlace.innerHTML = renderContentsArray.join('\n')
}



function conferencePageRender(){
    fetch('/article/conference/conference.json')
    .then((response) => response.json())
    .then((json) => {
        josnArray = json
        var navHTMLToBeRender = '' 
        for(let i = tmpActiveYear; i>=startYear; i--){
            navHTMLToBeRender += `
            <li onclick="contentRender(${i})" id="${i}">${i}</li>\n`
        }
       document.getElementById('years-nav').innerHTML = navHTMLToBeRender
       contentRender(tmpActiveYear)
    });

}

conferencePageRender();

