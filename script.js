const rain = document.querySelector('.rain');
const giftButton = document.querySelector('#giftButton');
const surpriseButton = document.querySelector('#surpriseButton');
const toast = document.querySelector('#toast');
const backgroundMusic = document.querySelector('#backgroundMusic');
const soundControl = document.querySelector('#soundControl');
const soundLabel = document.querySelector('#soundLabel');
const welcomeScreen = document.querySelector('#welcomeScreen');
const enterButton = document.querySelector('#enterButton');
const bouquetPhoto = document.querySelector('#bouquetPhoto');
const letterButton = document.querySelector('#letterButton');
const letterModal = document.querySelector('#letterModal');
const closeLetter = document.querySelector('#closeLetter');
const shareButton = document.querySelector('#shareButton');

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
backgroundMusic.loop = true;
backgroundMusic.volume = 0.38;

function updateSoundState(isPlaying) {
  soundControl.classList.toggle('is-playing', isPlaying);
  soundControl.setAttribute('aria-pressed', String(isPlaying));
  soundControl.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Activar música');
  soundLabel.textContent = isPlaying ? 'sonando' : 'música';
}

async function startMusic() {
  backgroundMusic.currentTime = 0;
  try {
    await backgroundMusic.play();
    updateSoundState(true);
  } catch {
    updateSoundState(false);
  }
}

function stopMusic() {
  backgroundMusic.pause();
  updateSoundState(false);
}

function createPetalBurst() {
  const bounds = bouquetPhoto.getBoundingClientRect();
  const marks = ['✿', '✽', '❋', '·'];
  for (let index = 0; index < 18; index += 1) {
    const petal = document.createElement('span');
    petal.className = 'burst-petal';
    petal.textContent = marks[index % marks.length];
    petal.style.left = `${bounds.left + bounds.width * .5}px`;
    petal.style.top = `${bounds.top + bounds.height * .28}px`;
    petal.style.setProperty('--burst-x', `${-180 + Math.random() * 360}px`);
    petal.style.setProperty('--burst-y', `${80 + Math.random() * 260}px`);
    petal.style.animationDelay = `${Math.random() * .18}s`;
    document.body.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove(), { once: true });
  }
}

function openLetter() {
  letterModal.classList.add('is-open');
  letterModal.setAttribute('aria-hidden', 'false');
  closeLetter.focus();
}

function hideLetter() {
  letterModal.classList.remove('is-open');
  letterModal.setAttribute('aria-hidden', 'true');
}

startMusic();
document.addEventListener('pointerdown', () => {
  if (backgroundMusic.paused) startMusic();
}, { once: true });

soundControl.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    startMusic();
    showToast('La música está sonando ♫');
  } else {
    stopMusic();
    showToast('Música pausada');
  }
});

enterButton.addEventListener('click', () => {
  welcomeScreen.classList.add('is-hidden');
  startMusic();
  showToast('La sorpresa acaba de comenzar ♫');
});

bouquetPhoto.addEventListener('click', createPetalBurst);
bouquetPhoto.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    createPetalBurst();
  }
});

letterButton.addEventListener('click', openLetter);
closeLetter.addEventListener('click', hideLetter);
letterModal.addEventListener('click', (event) => {
  if (event.target === letterModal) hideLetter();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') hideLetter();
});

shareButton.addEventListener('click', async () => {
  const shareData = {
    title: 'Para ti, flores amarillas',
    text: 'Te preparé una sorpresa amarilla ✿',
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      showToast('Gracias por compartir la sorpresa ✿');
      return;
    }
    await navigator.clipboard.writeText(shareData.url);
    showToast('Enlace copiado para compartirlo ✿');
  } catch {
    showToast('Puedes copiar el enlace de esta página para compartirlo');
  }
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3500);
}

giftButton.addEventListener('click', () => {
  if (backgroundMusic.paused) startMusic();
  document.querySelector('#mensaje').scrollIntoView({ behavior: 'smooth' });
  showToast('Tu ramo está listo para florecer ✿');
});

surpriseButton.addEventListener('click', () => {
  showToast('Hoy también tú haces florecer el mundo ✦');
});
