// Add this JavaScript to handle the modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    var modal = document.createElement('div');
    modal.className = 'img-modal';
    modal.innerHTML = `
        <span class="close">&times;</span>
        <img class="modal-content" id="modal-img">
        <div id="caption"></div>
    `;
    document.body.appendChild(modal);
    
    // Get the image and insert it inside the modal
    var images = document.querySelectorAll('.content img');
    var modalImg = document.getElementById("modal-img");
    var captionText = document.getElementById("caption");
    
    images.forEach(img => {
        img.onclick = function(){
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        }
    });
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() { 
        modal.style.display = "none";
    }
    
    // Also close when clicking anywhere on the modal
    modal.onclick = function() {
        modal.style.display = "none";
    }
});