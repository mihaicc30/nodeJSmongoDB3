let width = screen.width;
const logo = document.getElementById('myLogo2');

window.onscroll = function() {
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
  console.log(scrollPos)
};
