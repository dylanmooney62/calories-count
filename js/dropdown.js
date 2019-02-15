// add event listener to all drop downs headers
document.querySelectorAll('.drop-down__header').forEach(e => {
  e.addEventListener('click', function() {
    // go up to dropdown class and add open class
    this.parentNode.classList.toggle('drop-down--open');
  });
})
