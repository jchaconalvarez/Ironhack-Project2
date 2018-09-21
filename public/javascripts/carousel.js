const cards = Array.from(document.getElementsByClassName('article-card'));
let currentCard = 0;

const carousel = () => {
  document.getElementsByClassName('carousel-wrapper')[0].style.visibility = 'visible';
  cards.forEach((card) => {
    card.style.display = 'none';
  });

  if (currentCard === cards.length) {
    currentCard = 0;
  }
  cards[currentCard].style.display = 'grid';
  cards[currentCard].classList.add('carousel-card');
  currentCard++;
};

window.onload = () => {
  if (window.location.href === 'http://localhost:3000/') {
    carousel();
    setInterval(carousel, 6000);
  }
};
