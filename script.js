// Quiz frågor
const quizQuestions = [
  {
    question: "Vilket ämne har den kemiska beteckningen Fe?",
    choices: ["Fluor", "Fosfor", "Järn", "Francium"],
    correctIndex: 2
  },
  {
    question: "Vilket år inträffade den franska revolutionen?",
    choices: ["1776", "1789", "1812", "1848"],
    correctIndex: 1
  },
  {
    question: "Vilken planet har flest kända månar?",
    choices: ["Jupiter", "Saturnus", "Mars", "Neptunus"],
    correctIndex: 1
  },
  {
    question: "Vad heter den största perifera nerven i människokroppen?",
    choices: ["Ischiasnerven", "Ryggmärgsnerven", "Medianus", "Vagusnerven"],
    correctIndex: 0
  },
  {
    question: "Vilken svensk regent abdikerade år 1654?",
    choices: ["Karl X Gustav", "Karl XI", "Kristina", "Gustav II Adolf"],
    correctIndex: 2
  },
  {
    question: "Vilket programmeringsspråk skapades av James Gosling?",
    choices: ["Python", "C#", "Java", "Pascal"],
    correctIndex: 2
  },
  {
    question: "Vilket organ producerar insulin?",
    choices: ["Levern", "Bukspottkörteln", "Mjälten", "Tolvfingertarmen"],
    correctIndex: 1
  },
  {
    question: "Vem målade 'Guernica'?",
    choices: ["Pablo Picasso", "Salvador Dalí", "Henri Matisse", "Claude Monet"],
    correctIndex: 0
  },
  {
    question: "Vilken stad är Kanadas huvudstad?",
    choices: ["Toronto", "Montreal", "Ottawa", "Vancouver"],
    correctIndex: 2
  },
  {
    question: "Vilket år föddes Albert Einstein?",
    choices: ["1879", "1895", "1901", "1912"],
    correctIndex: 0
  }
];

// Globala variabler för quiz
let currentQuestion = 0;
let score = 0;
let hasAnswered = false;

// Funktion för att uppdatera klockan
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('sv-SE');
  const dateString = now.toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  document.getElementById('clock-time').textContent = timeString;
  document.getElementById('clock-date').textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
}

// Språkbyte funktion
let currentLanguage = 'sv';
const translations = {
  sv: {
    title: 'Kollektivtrafik Info',
    traffic: 'Trafikinformation',
    news: 'Senaste Nyheterna',
    game: 'Spela & Lär',
    localInfo: 'Lokal Information'
  },
  en: {
    title: 'Public Transport Info',
    traffic: 'Traffic Information',
    news: 'Latest News',
    game: 'Play & Learn',
    localInfo: 'Local Information'
  }
};

function changeLanguage() {
  currentLanguage = currentLanguage === 'sv' ? 'en' : 'sv';
  const lang = translations[currentLanguage];

  document.querySelector('h1').textContent = lang.title;
  document.querySelector('.traffic-header h2').textContent = lang.traffic;
  document.getElementById('langBtn').textContent = currentLanguage.toUpperCase();
}

// Hämta nyheter från API
// --- Fake data för prototypen ---
const fakeNews = [
  {
    title: "Stopp i tunnelbanan vid Slussen – bussar ersätter",
    description: "Tekniskt fel orsakar stopp mellan Slussen och Gamla stan. Prognos: 30 minuter.",
    url: "",
    publishedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    title: "Soligt väder hela dagen – ovanligt milt för årstiden",
    description: "SMHI meddelar klar himmel större delen av dagen. Max 14°.",
    url: "",
    publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    title: "Nytt café öppnar vid Centralen",
    description: "Lokala råvaror och öppet från kl. 06 för pendlare.",
    url: "",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

async function fetchNews() {
  // Använd fejkdata istället för API
  displayNews(fakeNews);
}


// Visa nyheter på sidan
function displayNews(articles) {
  const newsGrid = document.getElementById('newsGrid');
  newsGrid.innerHTML = '';

  articles.forEach(article => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';
    newsCard.onclick = function () {
      openNewsModal(article);
    };

    const title = article.title || 'Ingen rubrik';
    const time = new Date(article.publishedAt).toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit'
    });

    newsCard.innerHTML = `
      <div class="news-title">${title}</div>
      <div class="news-time">${time}</div>
    `;

    newsGrid.appendChild(newsCard);
  });
}

// Öppna nyhetsmodal
function openNewsModal(article) {
  document.getElementById('newsModalTitle').textContent = article.title || '';
  document.getElementById('newsModalTime').textContent = new Date(article.publishedAt).toLocaleString('sv-SE');
  document.getElementById('newsModalBody').innerHTML = `
    <p>${article.description || 'Ingen beskrivning tillgänglig.'}</p>
    ${article.url ? `<p><a href="${article.url}" target="_blank">Läs hela artikeln →</a></p>` : ''}
  `;
  document.getElementById('newsModal').classList.add('open');
  document.body.classList.add('modal-open');
}

// Stäng nyhetsmodal
function closeNewsModal() {
  document.getElementById('newsModal').classList.remove('open');
  document.body.classList.remove('modal-open');
}

// Quiz funktioner
function openQuizModal() {
  document.getElementById('quizModal').classList.add('open');
  document.body.classList.add('modal-open');
  currentQuestion = 0;
  score = 0;
  hasAnswered = false;
  showQuestion();
}

function closeQuizModal() {
  document.getElementById('quizModal').classList.remove('open');
  document.body.classList.remove('modal-open');
}

function showQuestion() {
  // Visa frågevyn och dölj resultatvyn
  document.getElementById('quizQuestionView').style.display = 'block';
  document.getElementById('quizResultView').style.display = 'none';

  const question = quizQuestions[currentQuestion];
  document.getElementById('quizProgress').textContent = `Fråga ${currentQuestion + 1}/${quizQuestions.length}`;
  document.getElementById('quizQuestionText').textContent = question.question;

  // Skapa svarsalternativ
  const choicesDiv = document.getElementById('quizChoices');
  choicesDiv.innerHTML = '';

  question.choices.forEach((choice, index) => {
    const label = document.createElement('label');
    label.className = 'quiz-option';
    label.innerHTML = `
      <input type="radio" name="answer" value="${index}">
      <span>${choice}</span>
    `;
    label.onclick = function () {
      if (!hasAnswered) {
        // Ta bort selected från alla
        document.querySelectorAll('.quiz-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        // Lägg till selected på vald
        label.classList.add('selected');
        document.getElementById('quizAdvanceBtn').disabled = false;
      }
    };
    choicesDiv.appendChild(label);
  });

  hasAnswered = false;
  document.getElementById('quizAdvanceBtn').disabled = true;
  document.getElementById('quizAdvanceBtn').textContent = 'Bekräfta svar';
}

function checkAnswer() {
  if (hasAnswered) {
    // Gå till nästa fråga
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
    return;
  }

  // Kontrollera svaret
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) return;

  const answer = parseInt(selected.value);
  const question = quizQuestions[currentQuestion];
  const options = document.querySelectorAll('.quiz-option');

  // Visa rätt och fel svar
  options.forEach((option, index) => {
    if (index === question.correctIndex) {
      option.classList.add('correct');
    } else if (index === answer) {
      option.classList.add('incorrect');
    }
  });

  if (answer === question.correctIndex) {
    score++;
  }

  hasAnswered = true;
  document.getElementById('quizAdvanceBtn').textContent = 'Nästa';
}

function showResult() {
  document.getElementById('quizQuestionView').style.display = 'none';
  document.getElementById('quizResultView').style.display = 'block';
  document.getElementById('quizScoreSummary').textContent = `Du fick ${score} av ${quizQuestions.length} rätt!`;
}


// Minimal bussdemo: 4 synliga, unika minuter, 1 "min" var 10:e sekund
function startSimpleBusDemo() {
  const TICK_MS = 10000; // 10 s = 1 "minut"
  const MIN_GAP = 2;     // minst 2 min mellan synliga avgångar

  const container = document.querySelector('.traffic-cards');
  if (!container) return;

  const allCards = Array.from(container.querySelectorAll('.traffic-card'));
  if (allCards.length === 0) return;

  // Kör bara EN timer
  if (window.__busTimer) {
    clearInterval(window.__busTimer);
    window.__busTimer = null;
  }

  // Hjälpfunktioner
  const readMinutes = (card) => {
    const txt = card.querySelector('.time-value')?.textContent || '';
    const n = parseInt(txt, 10);
    return isNaN(n) ? 0 : n;
  };
  const writeMinutes = (card, m) => {
    // 👉 Här ändrar vi hur 0 visas
    if (m <= 0) {
      card.querySelector('.time-value').textContent = 'Avgår nu';
    } else {
      card.querySelector('.time-value').textContent = `${m} min`;
    }
  };

  // Initiera start med större mellanrum
  const startBase = [5, 9, 13, 17];
  allCards.slice(0, 4).forEach((card, i) => {
    writeMinutes(card, startBase[i % startBase.length]);
    const labelEl = card.querySelector('.time-label');
    if (labelEl && !labelEl.textContent.trim()) labelEl.textContent = 'I tid';
  });

  // Håll 2+ minuters mellanrum mellan de 4 synliga
  function enforceGapOnTop4() {
    const top4 = allCards.slice(0, 4);
    let prev = null;
    top4.forEach(card => {
      let m = readMinutes(card);
      if (prev !== null && (m - prev) < MIN_GAP) {
        m = prev + MIN_GAP;
        writeMinutes(card, m);
      }
      prev = m;
    });
  }

  // Sortering/rendering
  function sortAndRender() {
    allCards.sort((a, b) => readMinutes(a) - readMinutes(b));
    enforceGapOnTop4();
    allCards.forEach(c => container.appendChild(c));
  }

  // Mjuk in-animation för de 4 synliga
  function sortRenderWithArrive() {
    sortAndRender();
    const first4 = allCards.slice(0, 4);
    first4.forEach(c => {
      c.classList.add('arriving');
      void c.offsetWidth; // reflow
      requestAnimationFrame(() => {
        c.classList.add('show');
        setTimeout(() => c.classList.remove('arriving', 'show'), 400);
      });
    });
  }

  // Första rendering
  sortAndRender();

  // Tick-loop
  window.__busTimer = setInterval(() => {
    let hadDeparture = false;

    allCards.forEach(card => {
      const labelEl = card.querySelector('.time-label');
      let m = readMinutes(card);

      if (m > 1) {
        // Vanlig nedräkning
        writeMinutes(card, m - 1);
      } else if (m === 1) {
        // När den ska gå nästa tick: visa "Avgår nu"
        writeMinutes(card, 0);
      } else {
        // "Avgår nu" → glid ut vänster och få ny tid
        card.classList.add('departing');
        hadDeparture = true;

        setTimeout(() => {
          let next = Math.floor(Math.random() * 11) + 15; // 15–25 min
          const delayed = Math.random() < 0.2;
          if (delayed) next += Math.floor(Math.random() * 4) + 2; // +2–5

          writeMinutes(card, next);
          if (labelEl) labelEl.textContent = delayed ? 'Försenad' : 'I tid';
          card.classList.remove('departing');

          sortRenderWithArrive();
        }, 400);
      }
    });

    if (!hadDeparture) sortAndRender();
  }, TICK_MS);
}








// Event listeners
document.getElementById('langBtn').addEventListener('click', changeLanguage);
document.getElementById('newsModalClose').addEventListener('click', closeNewsModal);
document.getElementById('quizOpenBtn').addEventListener('click', openQuizModal);
document.getElementById('quizCloseBtn').addEventListener('click', closeQuizModal);
document.getElementById('quizAdvanceBtn').addEventListener('click', checkAnswer);

// Starta allt när sidan laddas
window.addEventListener('DOMContentLoaded', function () {
  updateClock();
  setInterval(updateClock, 1000);
  fetchNews();
  startSimpleBusDemo();

});