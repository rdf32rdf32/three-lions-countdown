const config = window.SITE_CONFIG;
const target = new Date(config.match.kickoff).getTime();

const els = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
  meta: document.getElementById('matchMeta'),
  mode: document.getElementById('modeLabel'),
  lead: document.getElementById('heroLead')
};

els.meta.textContent = `${config.match.stage} · ${config.match.home} v ${config.match.away} · ${config.match.venue}, ${config.match.city}`;

startCountdown();
setInterval(startCountdown, 1000);
defineShareLinks();
loadFacts();
loadQuiz();
handleCookie();

function startCountdown() {
  const diff = target - Date.now();
  const day = 1000 * 60 * 60 * 24;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<div class="live-now">Matchday is here</div>';
    els.mode.textContent = 'It is matchday';
    els.lead.textContent = 'Come on England. Follow the match and the road to the trophy.';
    return;
  }

  if (diff < day) {
    els.mode.textContent = 'Matchday countdown';
    els.lead.textContent = 'Less than 24 hours to go. The lights are on, the road continues.';
  } else if (diff < day * 2) {
    els.mode.textContent = 'Matchday tomorrow';
  }

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  els.days.textContent = String(days).padStart(2, '0');
  els.hours.textContent = String(hours).padStart(2, '0');
  els.minutes.textContent = String(minutes).padStart(2, '0');
  els.seconds.textContent = String(seconds).padStart(2, '0');
}

function loadFacts() {
  const facts = config.facts || [];
  const didYouKnow = config.didYouKnow || [];
  const randomFact = document.getElementById('randomFact');
  const ticker = document.getElementById('didYouKnow');
  randomFact.textContent = facts[Math.floor(Math.random() * facts.length)] || 'England fact loading soon.';
  let index = new Date().getDate() % didYouKnow.length;
  const setTicker = () => {
    ticker.style.opacity = 0;
    setTimeout(() => {
      ticker.textContent = didYouKnow[index] || 'More England facts coming soon.';
      ticker.style.opacity = 1;
      index = (index + 1) % didYouKnow.length;
    }, 250);
  };
  ticker.style.transition = 'opacity .25s ease';
  setTicker();
  setInterval(setTicker, 18000);
}

function loadQuiz() {
  const quizzes = config.quizzes || [];
  const quiz = quizzes[new Date().getDate() % quizzes.length];
  const q = document.getElementById('quizQuestion');
  const answers = document.getElementById('quizAnswers');
  const result = document.getElementById('quizResult');
  if (!quiz) return;
  q.textContent = quiz.question;
  answers.innerHTML = '';
  quiz.answers.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = answer;
    btn.addEventListener('click', () => {
      result.textContent = index === quiz.correct ? 'Correct. Three Lions knowledge confirmed.' : `Not quite. The answer is ${quiz.answers[quiz.correct]}.`;
    });
    answers.appendChild(btn);
  });
}

function defineShareLinks() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(config.shareText);
  document.getElementById('whatsappShare').href = `https://wa.me/?text=${text}%20${url}`;
  document.getElementById('facebookShare').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  document.getElementById('emailShare').href = `mailto:?subject=${encodeURIComponent('Three Lions Countdown')}&body=${text}%0A%0A${url}`;
  document.getElementById('copyLink').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      document.getElementById('copyLink').textContent = 'Copied';
    } catch {
      document.getElementById('copyLink').textContent = 'Copy failed';
    }
  });
}

function handleCookie() {
  const cookieNotice = document.getElementById('cookieNotice');
  if (localStorage.getItem('tlcCookieOK') === 'yes') cookieNotice?.remove();
  document.getElementById('acceptCookies')?.addEventListener('click', () => {
    localStorage.setItem('tlcCookieOK', 'yes');
    cookieNotice?.remove();
  });
}
