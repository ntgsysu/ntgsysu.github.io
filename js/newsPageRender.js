function render(data){
    var newsList = document.getElementById('newsList')
    data.sort((a,b)=>{
        var aTime = new Date(a.time)
        var bTime = new Date(b.time)
        return bTime.getTime() - aTime.getTime()

    })
    console.log(data)
    date = data.slice(0,8)
    var renderContentsArray =  data.map(e=>`
        <li>
            <a href="${e.link}" class="text">
                <div class="title">${e.title}</div>
                <div class="time">${e.time.slice(0,10)}</div>
            </a>
        </li>
    `)
    newsList.innerHTML = renderContentsArray.join('\n')
}

fetch('/article/news/news.json')
.then((response) => response.json())
.then((json) => render(json));