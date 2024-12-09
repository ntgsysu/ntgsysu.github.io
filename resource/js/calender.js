window.addEventListener('load',function(){
    //get today date
    cur_time = new Date();
    cur_year=cur_time.getFullYear();
    cur_month = cur_time.getMonth() + 1;
    cur_day= cur_time.getDate();

    calendar_icon = document.querySelector(".column .calendar i");

    time_div = document.createElement('div');
    time_div.className='current-time';
    time_div_year = document.createElement('div');
    time_div_year.className='current-time-year';
    time_div_year.innerHTML = cur_year;
    time_div_monthAndDay = document.createElement('div');
    time_div_monthAndDay.className = "current-time-mmdd";
    time_div_monthAndDay.innerHTML = cur_month + '/' + cur_day;
    time_div.appendChild(time_div_year);
    time_div.appendChild(time_div_monthAndDay);
    calendar_icon.appendChild(time_div);

    console.log('append successful!');


});