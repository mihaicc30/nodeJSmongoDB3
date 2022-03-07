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
  if(window.scrollY == 0) {
    logo.style.position="initial";
  } 
  if(window.scrollY < 200) {
    logo.style.position="initial";
  } 

  if(scrollPos > 200 && width > 700) {
  logo.style.position="fixed";
  logo.style.zIndex="99";
  var scrollPos = window.scrollY;
  logo.style.top="50px";
  logo.style.left="30px";
  logo.style.transform = "rotate(" + scrollPos + "deg)";
  }
};
