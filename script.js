const rain = document.querySelector('.rain');
const giftButton = document.querySelector('#giftButton');
const surpriseButton = document.querySelector('#surpriseButton');
const toast = document.querySelector('#toast');

const flowerMarks = ['✿', '✽', '✦', '·', '❋'];

for (let index = 0; index < 34; index += 1) {
  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.textContent = flowerMarks[index % flowerMarks.length];
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.fontSize = `${10 + Math.random() * 11}px`;
  petal.style.animationDuration = `${7 + Math.random() * 10}s`;
  petal.style.animationDelay = `${Math.random() * -14}s`;
  petal.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
  rain.appendChild(petal);
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3500);
}

giftButton.addEventListener('click', () => {
  document.querySelector('#mensaje').scrollIntoView({ behavior: 'smooth' });
  showToast('Tu ramo está listo para florecer ✿');
});

surpriseButton.addEventListener('click', () => {
  showToast('Hoy también tú haces florecer el mundo ✦');
});
