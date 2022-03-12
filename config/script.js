//Get the button:
mybutton = document.getElementById("toTheTopBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction(),rotateLogo();};

function scrollFunction() {
  if (window.location.pathname == "/findaroom") {
    if (document.body.scrollTop > 240 || document.documentElement.scrollTop > 240) {
      document.getElementById("toTheTopBtn").style.display = "block";
    } else {
      document.getElementById("toTheTopBtn").style.display = "none";
    }
  }
}
  

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function scrollzTo(choice) {
    document.getElementById("choice"+choice+"").scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
}

let width = screen.width;
const logo = document.getElementById('myLogo2');

function rotateLogo() {
  var scrollPos = window.scrollY;
  
  if(scrollPos > 0) {
  logo.style.position="sticky";
  logo.style.zIndex="99";
  var scrollPos = window.scrollY;
  logo.style.transform = "rotate(" + scrollPos + "deg)";
  }
};

function editBooking(name,email,telephone,location,checkin,checkout,roomtype,breakfast,champagne,car,topay){
  alert("in progress", "values:",name,email,telephone,location,checkin,checkout,roomtype,breakfast,champagne,car,topay)
}


function setLoc(x) {
   document.getElementById('messageLocation').innerText = x; 
  }

