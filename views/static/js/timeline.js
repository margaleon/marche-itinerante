// SETUP
const line = document.querySelector(".timeline-innerline");
const timeline = document.getElementById("timeline");
const timelineLine = document.querySelector(".timeline-line");
const knots = document.querySelectorAll(".knot");
const posts = document.querySelectorAll(".post-container");
const placeholder = document.querySelector(".placeholder-text");

function select(knot) {
  knot.setAttribute("selected", "true");
  knot.querySelector(".timeline-point").style.background = "green";
}
function hide(knot) {
  knot.removeAttribute("selected");
  knot.querySelector(".timeline-point").style.background = "lightgray";
}

//update timeline depending on selected knot
knots.forEach((knot, index) => {
  knot.addEventListener("click", () => {
    select(knot);
    placeholder.style.display = "none";

    // update timeline
    let progress = ((index + 1) / knots.length) * 100;

    if (knot.getAttribute("selected")) {
      // select correct post and set visible class
      posts.forEach(function (post) {
        if (knot.id === post.id) {
          post.classList.add("visible");
          // set url to images folder
          let imgFolderPath = `/static/img/post_${index + 1}`;
          // console.log(imgFolderPath);
        } else {
          post.classList.remove("visible");
        }
      });
      line.style.width = `${progress}%`;
      knots.forEach((e, i) => {
        if (i > index) {
          hide(e);
        } else if (i <= index) {
          select(e);
        }
      });
    }
  });
});

function getPointsSize() {
  var points = document.querySelectorAll(".timeline-point");
  points.forEach((point) => {
    pointSize = point.offsetWidth;
  });
  return pointSize;
}

function resizePoints(pointSize, changeType) {
  var points = document.querySelectorAll(".timeline-point");

  if (changeType === "smaller") {
    let newWidth = pointSize - 5;
    let newHeight = pointSize - 5;
    let newTopPos = newWidth / 2 + 3;

    points.forEach((point) => {
      point.style.width = `${newWidth}px`;
      point.style.height = `${newHeight}px`;
      point.style.top = `-${newTopPos}px`;
    });
  } else if (changeType === "bigger") {
    let newWidth = pointSize + 5;
    let newHeight = pointSize + 5;
    let newTopPos = newWidth / 2 + 3;

    points.forEach((point) => {
      point.style.width = `${newWidth}px`;
      point.style.height = `${newHeight}px`;
      point.style.top = `-${newTopPos}px`;
    });
  }
}

function updateTimeline() {
  // !! offsetWidth includes margin, border, padding
  var spaceBtwn = timeline.offsetWidth / knots.length;
  var pointSize = getPointsSize();
  // detect space between knots to resize points
  if (spaceBtwn < pointSize + 5) {
    // limit between 15 and 30
    if (pointSize > 15) {
      var changeType = "smaller";
      resizePoints(pointSize, changeType);
    }
  } else if (spaceBtwn > pointSize + 10) {
    if (pointSize < 30) {
      var changeType = "bigger";
      resizePoints(pointSize, changeType);
    }
  }
}

window.addEventListener("resize", () => {
  updateTimeline();
});
