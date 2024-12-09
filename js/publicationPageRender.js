const startYear = 2020
var currYear = new Date().getFullYear()

function render(data){
    var navList = document.getElementById('yearNav')
    var renderPlace = document.getElementById('renderPlace')

    var navHTML = ['<a href="#preprint">Preprint</a>']
    var yearArry = ['preprint']
    for(let i=currYear; i>=startYear; i--){
        navHTML.push(`<a href="#${i}">${i}</a>`)
        yearArry.push(`${i}`)
    }
    navList.innerHTML = navHTML.join('\n')
    var renderArry = []
    for(let i=0; i< yearArry.length; i++){
        var year = yearArry[i]
        var tmpdata = data.filter(e=>e.year==year)
        tmpdata.sort((a,b)=>Number(b.id) -Number(a.id))
        var divinnerHTML = `<div id=${year}>\n<span>${year}:</span>\n`
        for(let i=0; i < tmpdata.length; i++){
            var e = tmpdata[i]
            var tmpLink = ''
            if(e.doi) tmpLink+=`<a href="${e.doi}" class="doi"></a>\n`
            if(e.arxiv) tmpLink+=`<a href="${e.arxiv}" class="arxiv"></a>\n`
            if(e.pdfname) tmpLink+=`<a href="/article/publication/files/${e.pdfname}" class="pdf"></a>\n`
            divinnerHTML +=`
                <ul>
                    <li class="title">${e.title}</li>
                    <li class="authors">${e.author}</li>
                    <li class="journal">${e.journal}</li>
                    <li class="link">${tmpLink}</li>
                </ul>\n
            `
        }
        divinnerHTML+='</div>'
        renderArry.push(divinnerHTML)
    }
    renderPlace.innerHTML = renderArry.join('\n')
}

fetch('/article/publication/publication.json')
.then((response) => response.json())
.then((json) => render(json));