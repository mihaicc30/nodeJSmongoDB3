//Get the button:
mybutton = document.getElementById("toTheTopBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction();};

function scrollFunction() {
  if (document.body.scrollTop > 240 || document.documentElement.scrollTop > 240) {
    document.getElementById("toTheTopBtn").style.display = "block";
  } else {
    document.getElementById("toTheTopBtn").style.display = "none";
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

