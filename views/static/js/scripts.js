/* ----------toggle navbar---------- */

const navToggler = document.querySelector(".nav-toggler");
const nav = document.querySelector(".header");
const navItems = document.querySelector(".nav-items");

function toggleNav() {
  nav.classList.toggle("open");
}

function closeNav() {
  nav.classList.remove("open");
}

navToggler.addEventListener("click", toggleNav);

// close nav when clicking on a nav item
document.addEventListener("click", function (e) {
  if (e.target.closest(".nav-item")) {
    closeNav();
  }
});

/* ----------toggle popup form---------- */

const popups = document.querySelectorAll(".popup");
const buttons = document.querySelectorAll(".add-review");

buttons.forEach((button, buttonIndex) => {
  button.addEventListener("click", () => {
    popups.forEach((popup, popupIndex) => {
      if (popupIndex === buttonIndex) {
        closePopups();
        openPopup(popup.id);
      }
    });
  });
});

function openPopup(id) {
  const popup = document.getElementById(id);
  popup.style.display = "flex";
}

function closePopups() {
  popups.forEach((popup) => {
    popup.style.display = "none";
  });
}

/* ----------reformat articles---------- */

const rawHtmlArticles = document.querySelectorAll(".raw-html");
const parser = new DOMParser();

rawHtmlArticles.forEach((article) => {
  const rawArticle = article.textContent;

  const doc = parser.parseFromString(rawArticle, "text/html");
  const formattedArticle = doc.documentElement.innerHTML
    .replace("<head>", "")
    .replace("</head>", "")
    .replace("<body>", "")
    .replace("</body>", "");

  const articleEl = document.createElement("div");
  articleEl.innerHTML = formattedArticle;
  article.replaceWith(articleEl);
});

/* ----------gallery---------- */

const thumbs = document.querySelectorAll(".thumb");

function selectThumb(thumb) {
  unselectThumbs();
  /* select a unique image */
  thumb.setAttribute("selected", "true");
}

function unselectThumbs() {
  /* unselect all the images */
  thumbs.forEach((img) => {
    img.removeAttribute("selected");
  });
}

thumbs.forEach((thumb, thumbIndex) => {
  thumb.addEventListener("click", () => {
    if (!thumb.attributes.selected === true) {
      selectThumb(thumb);
    } else {
      unselectThumbs();
    }
  });
});
