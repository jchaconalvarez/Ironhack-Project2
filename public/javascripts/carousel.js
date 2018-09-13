const cards = Array.from(document.getElementsByClassName('article-card'));
let currentCard = 0;

const carousel = () => {
  cards.forEach((card) => {
    card.style.display = 'none';
  });

  console.log(currentCard, cards.length);
  if (currentCard === cards.length) {
    currentCard = 0;
    console.log(currentCard, cards.length);
  }
  cards[currentCard].style.display = 'grid';
  currentCard++;
};

window.onload = () => {
  if (window.location.href === 'http://localhost:3000/') {
    setInterval(carousel, 2000);
  }
};
