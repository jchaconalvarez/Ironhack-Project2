console.log('yowaddup');
document.getElementsByClassName('share').forEach((button) => {
  button.addEventListener('click', toggleField, false);
});

const toggleField = (button) => {
  button.parentNode.getElementsByClassName('article-share')[0].classList.toggle('article-share-visible');
};
