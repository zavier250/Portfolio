// Slider show references from https://www.w3schools.com/w3css/w3css_slideshow.asp
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

// Slider show references from https://www.w3schools.com/w3css/w3css_slideshow.asp
var slideIndex2 = 1;
showSlides2(slideIndex2);

// Next/previous controls
function plusSlides2(n) {
  showSlides2(slideIndex2 += n);
}

// Thumbnail image controls
function currentSlide2(n) {
  showSlides2(slideIndex2 = n);
}

function showSlides2(n) {
  var i;
  var slides2 = document.getElementsByClassName("mySlides2");
  var dots2 = document.getElementsByClassName("dot2");
  if (n > slides2.length) {slideIndex2 = 1}
  if (n < 1) {slideIndex2 = slides2.length}
  for (i = 0; i < slides2.length; i++) {
      slides2[i].style.display = "none";
  }
  for (i = 0; i < dots2.length; i++) {
      dots2[i].className = dots2[i].className.replace(" active", "");
  }
  slides2[slideIndex2-1].style.display = "block";
  dots2[slideIndex2-1].className += " active";
}

$(document).ready(function() {
    $("body").addClass("js");

    //Popup
    $("#de-button, #design-exploration-popup #close-pop").click(function(event){
        event.preventDefault();
        $("body").toggleClass("show-design-exploration-popup");
    })

    $("#mp-button, #major-project-popup #close-pop").click(function(event){
        event.preventDefault();
        $("body").toggleClass("show-major-project-popup");
    })

    $("#pj-button, #participation-and-journal-popup #close-pop").click(function(event){
        event.preventDefault();
        $("body").toggleClass("show-participation-and-journal-popup");
    })

    $("#pc-button, #portfolio-content-popup #close-pop").click(function(event){
        event.preventDefault();
        $("body").toggleClass("show-portfolio-content-popup");
    })

    $("#ow-button, #twe-popup #close-pop").click(function(event){
        event.preventDefault();
        $("body").toggleClass("show-twe-popup");
    })

    // Tineline
    $.timeliner({});
			$.timeliner({
				timelineContainer: '#timeline-js',
				timelineSectionMarker: '.milestone',
				oneOpen: true,
				startState: 'flat',
				expandAllText: '+ Show All',
				collapseAllText: '- Hide All'
			});
})