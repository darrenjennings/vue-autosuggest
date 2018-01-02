/** DOM Utilities */
function hasClass(el, className) {
  return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
}

function addClass(el, className) {
  if (!hasClass(el, className)) el.className += " " + className;
}

function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  }
}

export { addClass, removeClass };
