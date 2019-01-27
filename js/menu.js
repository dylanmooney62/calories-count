// applys click listener to all 'more buttons'
document.querySelectorAll('.header__icon--more').forEach(e => {
  e.addEventListener('click', () => {
    // removes hidden class for all menus
    document.querySelectorAll('.header__menu').forEach(e => {
      e.classList.remove('header__menu--hidden');
    })
  })
})


document.body.addEventListener('click', (e) => {
  // only has to select one headerMenu to compared to as all headerMenu are all hidden and shown at same time
  const headerMenu = document.querySelector('.header__menu');

  // checks if header icon more button was not clicked
  if (!e.target.classList.contains('header__icon--more')) {
    // checks if one header menu is not hidden
    if (!headerMenu.classList.contains('header__menu--hidden')) {
      // applys hidden class to all menus
        document.querySelectorAll('.header__menu').forEach(e => e.classList.add('header__menu--hidden'));
    }
  }
  
});