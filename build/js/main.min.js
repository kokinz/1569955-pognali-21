var navMain = document.querySelector(".page-header");
var navToggle = document.querySelector(".page-header__nav-toggle");

navMain.classList.remove("page-header--no-js");

navToggle.addEventListener("click", function() {
  if (navMain.classList.contains("page-header--closed-menu")) {
    navMain.classList.remove("page-header--closed-menu");
    navMain.classList.add("page-header--opened-menu");
  } else {
    navMain.classList.add("page-header--closed-menu");
    navMain.classList.remove("page-header--opened-menu");
  }
});
