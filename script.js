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
  let index = didYouKnow.length ? new Date().getDate() % didYouKnow.length : 0;
  const setTicker = () => {
    ticker.style.opacity = 0;
    setTimeout(() => {
      ticker.textContent = didYouKnow[index] || 'More England facts coming soon.';
      ticker.style.opacity = 1;
      index = didYouKnow.length ? (index + 1) % didYouKnow.length : 0;
    }, 250);
  };
  ticker.style.transition = 'opacity .25s ease';
  setTicker();
  setInterval(setTicker, 18000);
}

function loadQuiz() {
  const quizzes = shuffle([...(config.quizzes || [])]);
  const questions = quizzes.slice(0, 3);
  const container = document.getElementById('quizQuestions');
  const result = document.getElementById('quizResult');
  const refresh = document.getElementById('newQuizSet');
  if (!container || !questions.length) return;

  const answersState = new Array(questions.length).fill(null);

  const renderScore = () => {
    const answered = answersState.filter(item => item !== null).length;
    const score = answersState.filter(Boolean).length;
    if (answered < questions.length) {
      result.textContent = `${answered}/3 answered. Current score: ${score}/3.`;
      return;
    }
    const messages = {
      3: 'Perfect. 3/3. You are an England expert.',
      2: 'Great effort. 2/3.',
      1: 'Not bad. 1/3.',
      0: '0/3. Time to brush up on your England knowledge.'
    };
    result.textContent = messages[score];
  };

  container.innerHTML = '';
  questions.forEach((quiz, questionIndex) => {
    const card = document.createElement('article');
    card.className = 'quiz-mini-card';
    const title = document.createElement('h3');
    title.textContent = `${questionIndex + 1}. ${quiz.question}`;
    const answers = document.createElement('div');
    answers.className = 'quiz-answers';

    quiz.answers.forEach((answer, answerIndex) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = answer;
      btn.addEventListener('click', () => {
        if (answersState[questionIndex] !== null) return;
        const correct = answerIndex === quiz.correct;
        answersState[questionIndex] = correct;
        [...answers.children].forEach((child, idx) => {
          child.disabled = true;
          if (idx === quiz.correct) child.classList.add('correct');
          if (idx === answerIndex && !correct) child.classList.add('wrong');
        });
        renderScore();
      });
      answers.appendChild(btn);
    });

    card.appendChild(title);
    card.appendChild(answers);
    container.appendChild(card);
  });

  result.textContent = 'Answer all three to see your score.';
  refresh?.addEventListener('click', () => loadQuiz(), { once: true });
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
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
    document.getElementById('predictionMessage').value = saved.message || '';
    renderPrediction(saved);
  } else {
    updatePredictionShare('My prediction: Norway 1–2 England. First England scorer: Harry Kane. Come on England!');
  }
  document.getElementById('savePrediction')?.addEventListener('click', () => {
    const prediction = {
      home: clampScore(document.getElementById('homeScore').value),
      away: clampScore(document.getElementById('awayScore').value),
      scorer: scorer.value || 'Harry Kane',
      message: (document.getElementById('predictionMessage').value || 'Come on England!').trim().slice(0, 90)
    };
    localStorage.setItem('tlcPrediction', JSON.stringify(prediction));
    renderPrediction(prediction);
  });
  document.getElementById('copyPrediction')?.addEventListener('click', async () => {
    const text = document.getElementById('predictionResult').textContent || document.getElementById('predictionPreview').textContent || 'My England prediction is ready.';
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
  const message = prediction.message ? ` ${prediction.message}` : '';
  const text = `My prediction: Norway ${prediction.home}–${prediction.away} England. First England scorer: ${prediction.scorer}.${message}`;
  document.getElementById('predictionResult').textContent = text;
  const preview = document.getElementById('predictionPreview');
  if (preview) preview.textContent = text.replace('My prediction: ', '');
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

function playerName(player) {
  return typeof player === 'string' ? player : player.name;
}

function playerLabel(player) {
  return typeof player === 'string' ? player : `${player.no ? player.no + '. ' : ''}${player.name} · ${player.position}`;
}

function initEnglandXi() {
  const squadList = document.getElementById('squadList');
  if (!squadList) return;
  const saved = JSON.parse(localStorage.getItem('tlcEnglandXi') || '[]');
  let selected = Array.isArray(saved) ? saved.map(item => typeof item === 'string' ? item : item.name).filter(Boolean).slice(0, 11) : [];
  const players = config.players || [];
  const groups = ['Goalkeepers', 'Defenders', 'Midfielders', 'Forwards'];

  const render = () => {
    squadList.innerHTML = '';
    groups.forEach(group => {
      const groupPlayers = players.filter(player => (player.group || groupFromPosition(player.position)) === group);
      if (!groupPlayers.length) return;
      const heading = document.createElement('div');
      heading.className = 'squad-group-heading';
      heading.textContent = group;
      squadList.appendChild(heading);
      groupPlayers.forEach(player => {
        const name = playerName(player);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'player-button';
        btn.innerHTML = `<strong>${player.no ? player.no + '. ' : ''}${name}</strong><small>${player.position || ''}</small>`;
        const isSelected = selected.includes(name);
        btn.classList.toggle('selected', isSelected);
        btn.disabled = selected.length >= 11 && !isSelected;
        btn.addEventListener('click', () => {
          if (selected.includes(name)) selected = selected.filter(existing => existing !== name);
          else if (selected.length < 11) selected.push(name);
          localStorage.setItem('tlcEnglandXi', JSON.stringify(selected));
          render();
        });
        squadList.appendChild(btn);
      });
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

function groupFromPosition(position = '') {
  if (position.includes('Goalkeeper')) return 'Goalkeepers';
  if (position.includes('Defender')) return 'Defenders';
  if (position.includes('Midfielder')) return 'Midfielders';
  if (position.includes('Centre-forward') || position.includes('Forward') || position.includes('winger') || position.includes('Winger')) return 'Forwards';
  return 'Midfielders';
}

function renderPitch(selected) {
  const pitch = document.getElementById('xiPitch');
  if (!pitch) return;
  const getPlayer = name => (config.players || []).find(player => player.name === name) || { name, position: '' };
  const buckets = {
    Goalkeepers: selected.map(getPlayer).filter(player => player.group === 'Goalkeepers'),
    Defenders: selected.map(getPlayer).filter(player => player.group === 'Defenders'),
    Midfielders: selected.map(getPlayer).filter(player => player.group === 'Midfielders'),
    Forwards: selected.map(getPlayer).filter(player => player.group === 'Forwards')
  };
  const lines = [buckets.Forwards, buckets.Midfielders, buckets.Defenders, buckets.Goalkeepers];
  const labels = ['Forwards', 'Midfielders', 'Defenders', 'Goalkeeper'];
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
        chip.textContent = `${player.no ? player.no + '. ' : ''}${player.name} (${positionShort(player.position)})`;
        row.appendChild(chip);
      });
    }
    pitch.appendChild(row);
  });
}

function positionShort(position = '') {
  if (position.includes('Goalkeeper')) return 'GK';
  if (position.includes('back') || position.includes('Back') || position.includes('Centre-back') || position.includes('Full-back')) return 'DEF';
  if (position.includes('midfielder') || position.includes('Midfielder')) return 'MID';
  if (position.includes('winger') || position.includes('Forward') || position.includes('Centre-forward')) return 'FWD';
  return 'MID';
}

function updateXiShare(selected) {
  const url = encodeURIComponent(window.location.href);
  const getPlayer = name => (config.players || []).find(player => player.name === name) || { name, position: '' };
  const text = selected.length ? `My England XI: ${selected.map(name => playerLabel(getPlayer(name))).join(', ')}.` : 'Choose your England XI on Three Lions Countdown.';
  const encoded = encodeURIComponent(text);
  const fb = document.getElementById('xiFacebook');
  const wa = document.getElementById('xiWhatsapp');
  if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encoded}`;
  if (wa) wa.href = `https://wa.me/?text=${encoded}%20${url}`;
}
