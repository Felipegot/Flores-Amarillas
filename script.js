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
const downloadLetter = document.querySelector('#downloadLetter');
const lightButton = document.querySelector('#lightButton');
const nightButton = document.querySelector('#nightButton');
const replayButton = document.querySelector('#replayButton');
const pageShell = document.querySelector('.page-shell');

const flowerMarks = ['✿', '✽', '✦', '·', '❋'];
const surpriseMessages = [
  'Hoy también tú haces florecer el mundo ✦',
  'Tu sonrisa combina con todas las flores amarillas ✿',
  'Qué bonito es coincidir contigo en esta vida ❋',
  'Esta sorpresa lleva un poquito de todo mi cariño ♥'
];
let surpriseIndex = 0;
let cursorTimer;

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
let musicStarted = false;
let resumeAfterVisibility = false;
backgroundMusic.loop = true;
backgroundMusic.volume = 0.38;

function updateSoundState(isPlaying) {
  soundControl.classList.toggle('is-playing', isPlaying);
  soundControl.setAttribute('aria-pressed', String(isPlaying));
  soundControl.setAttribute('aria-label', isPlaying ? 'Pausar música' : 'Activar música');
  soundLabel.textContent = isPlaying ? 'sonando' : 'música';
}

async function startMusic(resetToBeginning = false) {
  if (resetToBeginning) backgroundMusic.currentTime = 0;
  try {
    await backgroundMusic.play();
    musicStarted = true;
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

function downloadLetterAsImage() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const image = document.querySelector('.bouquet-photo img');
  canvas.width = 1000;
  canvas.height = 1400;
  context.fillStyle = '#fff8df';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#d8b64c';
  context.lineWidth = 3;
  context.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);
  context.fillStyle = '#c48e0c';
  context.font = '34px Georgia';
  context.textAlign = 'center';
  context.fillText('✳', canvas.width / 2, 105);
  context.fillStyle = '#332f22';
  context.font = '600 62px Georgia';
  context.fillText('Una carta para ti', canvas.width / 2, 210);
  context.fillStyle = '#625a42';
  context.font = '27px Georgia';
  context.textAlign = 'left';
  drawWrappedText(context, 'Que estas flores te recuerden lo mucho que vales, lo bonito que es tenerte cerca y todas las razones que tienes para sonreír.', 105, 310, 790, 42);
  drawWrappedText(context, 'Gracias por ser esa persona que hace más cálidos los días normales. Te mereces cosas bonitas, hoy y siempre.', 105, 485, 790, 42);
  context.drawImage(image, 170, 680, 660, 540);
  context.fillStyle = '#9a7b19';
  context.font = 'italic 28px Georgia';
  context.textAlign = 'right';
  context.fillText('Con mucho cariño ♥', 850, 1285);
  const link = document.createElement('a');
  link.download = 'carta-flores-amarillas.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('Tu carta con el ramo está lista para guardar ✿');
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const testLine = `${line}${word} `;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line.trim(), x, y);
      line = `${word} `;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line.trim(), x, y);
}

function createCursorPetal(event) {
  if (window.matchMedia('(pointer: coarse)').matches || cursorTimer) return;
  cursorTimer = window.setTimeout(() => { cursorTimer = undefined; }, 90);
  const petal = document.createElement('span');
  petal.className = 'cursor-petal';
  petal.textContent = flowerMarks[Math.floor(Math.random() * flowerMarks.length)];
  petal.style.left = `${event.clientX}px`;
  petal.style.top = `${event.clientY}px`;
  document.body.appendChild(petal);
  petal.addEventListener('animationend', () => petal.remove(), { once: true });
}

soundControl.addEventListener('click', () => {
  if (!musicStarted) {
    showToast('Primero abre tu ramo para iniciar la música ♫');
    return;
  }
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
  startMusic(true);
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
downloadLetter.addEventListener('click', downloadLetterAsImage);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') hideLetter();
});

lightButton.addEventListener('click', () => {
  const lightsEnabled = !pageShell.classList.contains('lights-off');
  pageShell.classList.toggle('lights-off', lightsEnabled);
  lightButton.setAttribute('aria-pressed', String(!lightsEnabled));
  showToast(lightsEnabled ? 'Luz suave apagada' : 'Luz suave encendida ✦');
});

nightButton.addEventListener('click', () => {
  const nightEnabled = pageShell.classList.toggle('night-mode');
  nightButton.setAttribute('aria-pressed', String(nightEnabled));
  showToast(nightEnabled ? 'Modo noche activado ☾' : 'Volvimos a la luz del día ✦');
});

replayButton.addEventListener('click', () => {
  stopMusic();
  musicStarted = false;
  backgroundMusic.currentTime = 0;
  hideLetter();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  welcomeScreen.classList.remove('is-hidden');
  showToast('La sorpresa está lista para comenzar de nuevo ✿');
});

document.addEventListener('pointermove', createCursorPetal, { passive: true });

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
  document.querySelector('#mensaje').scrollIntoView({ behavior: 'smooth' });
  showToast('Tu ramo está listo para florecer ✿');
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    resumeAfterVisibility = musicStarted && !backgroundMusic.paused;
    if (resumeAfterVisibility) stopMusic();
  } else if (resumeAfterVisibility) {
    resumeAfterVisibility = false;
    startMusic();
  }
});

window.addEventListener('pagehide', () => {
  if (!backgroundMusic.paused) backgroundMusic.pause();
});

surpriseButton.addEventListener('click', () => {
  showToast(surpriseMessages[surpriseIndex]);
  surpriseIndex = (surpriseIndex + 1) % surpriseMessages.length;
});
