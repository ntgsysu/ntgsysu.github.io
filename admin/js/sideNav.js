import './jquery-3.6.3.min.js'
$(document).ready(function(){
    var sideNav = document.createElement('div');
    sideNav.id = 'sideNav'
    document.body.appendChild(sideNav)
    $("#sideNav").load("/admin/component/sideNav.html",()=>{
        const submenus = document.body.querySelectorAll('.submenu');
        submenus.forEach(submenu => {
            const sibling = submenu.previousElementSibling;
            sibling.addEventListener('click', () => {
                submenu.classList.toggle('show');
            });
        });
    });


});

