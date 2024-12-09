window.addEventListener('load',function(){

    const apiURL = `http://${document.domain}:3333`

    function journalclubRender(){
        function render(data){
            var journalclubList = document.getElementById('journalclubList')
            data.sort((a,b)=>{
                var aTime = new Date(a.startTime)
                var bTime = new Date(b.startTime)
                return bTime.getTime() - aTime.getTime()

            })
            date = data.slice(0,8)
            var renderContentsArray =  data.map(e=>`
                <li>
                    <a href="/article/journalclub/${e.id}.html" >
                        <div class="time">${e.startTime.slice(0,10)}</div>
                        <div class="content">${e.title.length < 58 ? e.title : e.title.slice(0,58) + '...'}</div>
                    </a>
                </li>
            `)
            journalclubList.innerHTML = renderContentsArray.join('\n')
        }

        fetch('/article/journalclub/journalclub.json')
        .then((response) => response.json())
        .then((json) => render(json));

        console.log("render journalclub successful!")
        // var xhttp = new XMLHttpRequest()
        // console.log(apiURL+'/getData/searchJClub')
        // xhttp.open('POST',apiURL+'/getData/searchJClub')
        // xhttp.onreadystatechange = function(){
        //     if(this.readyState == 4 && this.status ==200){
        //         response = JSON.parse(this.response)
        //         if(response.status){
        //         return  alert(response.message)
        //         }else{
        //         render(response.data)
        //         } 
        //     }
        // }
        // xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // xhttp.send('speaker=%&startTime=2020:01:01 00:00:00&endTime=2100:01:01 00:00:00')//具有有效的时间
    }
    function newsRender(){
        function render(data){
            var newsList = document.getElementById('newsList')
            data.sort((a,b)=>{
                var aTime = new Date(a.time)
                var bTime = new Date(b.time)
                return bTime.getTime() - aTime.getTime()

            })
            console.log(data)
            date = data.slice(0,7)
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
    }
    function seminarRender(){
        function render(data){
            var newsList = document.getElementById('seminarList')
            data.sort((a,b)=>{
                var aTime = new Date(a.time)
                var bTime = new Date(b.time)
                return bTime.getTime() - aTime.getTime()

            })
            date = data.slice(0,8)
            var renderContentsArray =  data.map(e=>`
            <li >
                <a href="/article/seminar/${e.id}.html">
                    <div class="time">${e.startTime.slice(0,10)}</div>
                    <div class="content">${e.title}</div>
                </a>
            </li>
            `)
            newsList.innerHTML = renderContentsArray.join('\n')
        }

        fetch('/article/seminar/seminar.json')
        .then((response) => response.json())
        .then((json) => render(json));
    }
    function conferenceRender(){
        function render(data){
            // console.log(data)
            var newsList = document.getElementById('conferenceList')
            data.sort((a,b)=>{
                var aTime = new Date(a.time)
                var bTime = new Date(b.time)
                return bTime.getTime() - aTime.getTime()

            })
            console.log(data)
            date = data.slice(0,4)
            var renderContentsArray =  data.map(e=>{
                const yearMonth = e.startTime.slice(0,7)
                var day;
                if(e.startTime.slice(0,7) == e.endTime.slice(0,7)){
                    day = `${e.startTime.slice(8,10)}~${e.endTime.slice(8,10)}`
                }else{
                    day = `${e.startTime.slice(8,10)}~`
                }
            
            return  `<li>
                        <div class="time">
                        <div class="day">${day}</div>
                        <div class="year-month">${yearMonth}</div>
                        </div>
                        <a href="${e.link}">${e.title}</a>
                    </li>`
            })
            newsList.innerHTML = renderContentsArray.join('\n')
        }
        fetch('/article/conference/conference.json')
        .then((response) => response.json())
        .then((json) => render(json));
    }

    journalclubRender();
    newsRender();
    seminarRender();
    conferenceRender();



})