document.getElementById('open-modal-button').addEventListener('click', openModal);

document.getElementById('close-modal-button').addEventListener('click', closeModal);

document.getElementById('overlay').addEventListener('click', (e) =>{
  if(e.target.classList.contains('overlay--visible') || e.target.id === 'reset-button') {
    closeModal();
  }
})

function openModal() {
  document.getElementById('overlay').classList.add('overlay--visible');
}

function closeModal() {
  document.getElementById('overlay').classList.remove('overlay--visible');
}