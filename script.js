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
initPredictor();
initEnglandXi();

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


function initPredictor() {
  const scorer = document.getElementById('firstScorer');
  if (!scorer) return;
  (config.firstScorers || []).forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    scorer.appendChild(option);
  });
  const saved = JSON.parse(localStorage.getItem('tlcPrediction') || 'null');
  if (saved) {
    document.getElementById('homeScore').value = saved.home;
    document.getElementById('awayScore').value = saved.away;
    scorer.value = saved.scorer;
    renderPrediction(saved);
  } else {
    updatePredictionShare('Norway 1–2 England. First England scorer: Harry Kane.');
  }
  document.getElementById('savePrediction')?.addEventListener('click', () => {
    const prediction = {
      home: clampScore(document.getElementById('homeScore').value),
      away: clampScore(document.getElementById('awayScore').value),
      scorer: scorer.value || 'Harry Kane'
    };
    localStorage.setItem('tlcPrediction', JSON.stringify(prediction));
    renderPrediction(prediction);
  });
  document.getElementById('copyPrediction')?.addEventListener('click', async () => {
    const text = document.getElementById('predictionResult').textContent || 'My England prediction is ready.';
    try {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      document.getElementById('copyPrediction').textContent = 'Copied';
    } catch {
      document.getElementById('copyPrediction').textContent = 'Copy failed';
    }
  });
}

function clampScore(value) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) return 0;
  return Math.max(0, Math.min(15, number));
}

function renderPrediction(prediction) {
  const text = `My prediction: Norway ${prediction.home}–${prediction.away} England. First England scorer: ${prediction.scorer}.`;
  document.getElementById('predictionResult').textContent = text;
  updatePredictionShare(text);
}

function updatePredictionShare(text) {
  const url = encodeURIComponent(window.location.href);
  const encoded = encodeURIComponent(text);
  const fb = document.getElementById('predictionFacebook');
  const wa = document.getElementById('predictionWhatsapp');
  if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encoded}`;
  if (wa) wa.href = `https://wa.me/?text=${encoded}%20${url}`;
}

function initEnglandXi() {
  const squadList = document.getElementById('squadList');
  if (!squadList) return;
  const saved = JSON.parse(localStorage.getItem('tlcEnglandXi') || '[]');
  let selected = Array.isArray(saved) ? saved.slice(0, 11) : [];
  const players = config.players || [];

  const render = () => {
    squadList.innerHTML = '';
    players.forEach(player => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = player;
      const isSelected = selected.includes(player);
      btn.className = isSelected ? 'selected' : '';
      btn.disabled = selected.length >= 11 && !isSelected;
      btn.addEventListener('click', () => {
        if (selected.includes(player)) selected = selected.filter(name => name !== player);
        else if (selected.length < 11) selected.push(player);
        localStorage.setItem('tlcEnglandXi', JSON.stringify(selected));
        render();
      });
      squadList.appendChild(btn);
    });
    document.getElementById('xiCounter').textContent = `${selected.length}/11 selected`;
    document.getElementById('xiResult').textContent = selected.length === 11 ? 'Your England XI is ready to share.' : 'Pick eleven players to complete your XI.';
    renderPitch(selected);
    updateXiShare(selected);
  };

  document.getElementById('clearXi')?.addEventListener('click', () => {
    selected = [];
    localStorage.removeItem('tlcEnglandXi');
    render();
  });
  document.getElementById('copyXi')?.addEventListener('click', async () => {
    const text = selected.length ? `My England XI: ${selected.join(', ')}.` : 'I am choosing my England XI.';
    try {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      document.getElementById('copyXi').textContent = 'Copied';
    } catch {
      document.getElementById('copyXi').textContent = 'Copy failed';
    }
  });
  render();
}

function renderPitch(selected) {
  const pitch = document.getElementById('xiPitch');
  if (!pitch) return;
  const lines = [selected.slice(0, 1), selected.slice(1, 5), selected.slice(5, 8), selected.slice(8, 11)];
  const labels = ['GK', 'Defence', 'Midfield', 'Attack'];
  pitch.innerHTML = '';
  lines.forEach((line, idx) => {
    const row = document.createElement('div');
    row.className = 'xi-line';
    if (!line.length) {
      const empty = document.createElement('span');
      empty.className = 'xi-chip xi-empty';
      empty.textContent = labels[idx];
      row.appendChild(empty);
    } else {
      line.forEach(player => {
        const chip = document.createElement('span');
        chip.className = 'xi-chip';
        chip.textContent = player;
        row.appendChild(chip);
      });
    }
    pitch.appendChild(row);
  });
}

function updateXiShare(selected) {
  const url = encodeURIComponent(window.location.href);
  const text = selected.length ? `My England XI: ${selected.join(', ')}.` : 'Choose your England XI on Three Lions Countdown.';
  const encoded = encodeURIComponent(text);
  const fb = document.getElementById('xiFacebook');
  const wa = document.getElementById('xiWhatsapp');
  if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encoded}`;
  if (wa) wa.href = `https://wa.me/?text=${encoded}%20${url}`;
}
