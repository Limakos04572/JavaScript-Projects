const main = document.querySelector("main");

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const photoContainer = document.getElementById("photoContainer");

let currentIndex = 0;
let currentPosition = 0;

prevButton.addEventListener("click", function () {
  currentIndex = Math.max(currentIndex - 1, -1);
  if (currentIndex == -1) {
    currentIndex = 5;
  }
  clearInterval(intervalRef);
  document.getElementById("play").innerHTML = "&#9658;";
  intervalRef = null;
  updateSlider(currentIndex);
});

nextButton.addEventListener("click", function () {
  currentIndex = Math.min(currentIndex + 1, 6);
  if (currentIndex == 6) {
    currentIndex = 0;
  }
  clearInterval(intervalRef);
  document.getElementById("play").innerHTML = "&#9658;";
  intervalRef = null;
  updateSlider(currentIndex);
});

function dotSlider(givenIndex) {
  clearInterval(intervalRef);
  document.getElementById("play").innerHTML = "&#9658;";
  intervalRef = null;
  updateSlider(givenIndex);
}

function updateSlider(givenIndex) {
  currentIndex = givenIndex;
  givenIndex = -currentIndex * 600;
  photoContainer.style.transform = "translateX(" + givenIndex + "px)";
  let dots = document.getElementsByClassName("dot");
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }
  dots[currentIndex].classList.add("active");
}

function playStop() {
  if (!intervalRef) {
    console.log("play");
    document.getElementById("play").innerHTML = "&#9209;";
    intervalRef = setInterval(() => {
      if (currentIndex == 5) {
        currentIndex = -1;
      }
      updateSlider(currentIndex + 1);
    }, 4000);
  } else {
    clearInterval(intervalRef);
    console.log("stop");
    intervalRef = null;
    document.getElementById("play").innerHTML = "&#9658;";
  }
}

let licznik = 0;
let intervalRef = setInterval(() => {
  if (currentIndex == 5) {
    currentIndex = -1;
  }
  updateSlider(currentIndex + 1);
}, 4000);
