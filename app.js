(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const storage = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  };

  const KICKOFF_ISO = '2026-07-10T20:00:00+02:00';

  const squad = [
    { id:'hampton', name:'Hannah Hampton', pos:'GK', club:'Chelsea' },
    { id:'earps', name:'Mary Earps', pos:'GK', club:'Paris Saint-Germain' },
    { id:'roebuck', name:'Ellie Roebuck', pos:'GK', club:'Barcelona' },
    { id:'bronze', name:'Lucy Bronze', pos:'DEF', club:'Chelsea' },
    { id:'greenwood', name:'Alex Greenwood', pos:'DEF', club:'Manchester City' },
    { id:'bright', name:'Millie Bright', pos:'DEF', club:'Chelsea' },
    { id:'carter', name:'Jess Carter', pos:'DEF', club:'Gotham FC' },
    { id:'morgan', name:'Esme Morgan', pos:'DEF', club:'Washington Spirit' },
    { id:'le-tissier', name:'Maya Le Tissier', pos:'DEF', club:'Manchester United' },
    { id:'charles', name:'Niamh Charles', pos:'DEF', club:'Chelsea' },
    { id:'stanway', name:'Georgia Stanway', pos:'MID', club:'Bayern Munich' },
    { id:'walsh', name:'Keira Walsh', pos:'MID', club:'Barcelona' },
    { id:'toone', name:'Ella Toone', pos:'MID', club:'Manchester United' },
    { id:'park', name:'Jess Park', pos:'MID', club:'Manchester City' },
    { id:'clinton', name:'Grace Clinton', pos:'MID', club:'Manchester United' },
    { id:'coombs', name:'Laura Coombs', pos:'MID', club:'Manchester City' },
    { id:'mead', name:'Beth Mead', pos:'FWD', club:'Arsenal' },
    { id:'hemp', name:'Lauren Hemp', pos:'FWD', club:'Manchester City' },
    { id:'russo', name:'Alessia Russo', pos:'FWD', club:'Arsenal' },
    { id:'kelly', name:'Chloe Kelly', pos:'FWD', club:'Arsenal' },
    { id:'james', name:'Lauren James', pos:'FWD', club:'Chelsea' },
    { id:'daly', name:'Rachel Daly', pos:'FWD', club:'Aston Villa' },
    { id:'beever-jones', name:'Aggie Beever-Jones', pos:'FWD', club:'Chelsea' }
  ];



  const scoreOptions = [
    '1-0 England', '2-0 England', '2-1 England', '3-1 England',
    '1-1 draw', '0-0 draw', '1-2 Norway', '0-1 Norway'
  ];

  const formations = {
    '433': [
      ['GK',50,92], ['LB',20,73], ['CB',40,76], ['CB',60,76], ['RB',80,73],
      ['CM',30,56], ['CM',50,52], ['CM',70,56], ['LW',24,31], ['ST',50,24], ['RW',76,31]
    ],
    '4231': [
      ['GK',50,92], ['LB',20,74], ['CB',40,77], ['CB',60,77], ['RB',80,74],
      ['DM',39,59], ['DM',61,59], ['AM',50,43], ['LW',24,34], ['RW',76,34], ['ST',50,22]
    ],
    '352': [
      ['GK',50,92], ['CB',30,76], ['CB',50,79], ['CB',70,76],
      ['LWB',18,55], ['CM',37,55], ['CM',50,48], ['CM',63,55], ['RWB',82,55], ['ST',42,27], ['ST',58,27]
    ]
  };

  let formation = storage.get('engFormation', '433');
  let xi = storage.get('engXI', {});
  let selectedPlayerId = null;
  let currentFilter = 'all';
  let quizAnswered = 0;
  let quizCorrect = 0;

  function countdown() {
    const target = new Date(KICKOFF_ISO).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    $('days').textContent = String(d);
    $('hours').textContent = String(h).padStart(2,'0');
    $('minutes').textContent = String(m).padStart(2,'0');
    $('seconds').textContent = String(s).padStart(2,'0');
    $('localKickoff').textContent = new Date(KICKOFF_ISO).toLocaleString([], { dateStyle:'medium', timeStyle:'short' });
  }

  function playerById(id) { return squad.find(p => p.id === id); }
  function usedPlayerIds() { return new Set(Object.values(xi).filter(Boolean)); }


  function renderMatchPredictor() {
    const scoreHost = $('scoreButtons');
    const scorerSelect = $('firstScorerSelect');
    if (!scoreHost || !scorerSelect) return;

    const saved = storage.get('engMatchPrediction', { score: '', scorer: '' });

    scoreHost.innerHTML = '';
    scoreOptions.forEach(score => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'score-button' + (saved.score === score ? ' active' : '');
      btn.textContent = score;
      btn.addEventListener('click', () => {
        const current = storage.get('engMatchPrediction', { score: '', scorer: scorerSelect.value || '' });
        current.score = score;
        storage.set('engMatchPrediction', current);
        renderMatchPredictor();
        updatePredictionStatus();
      });
      scoreHost.appendChild(btn);
    });

    const scorers = squad.filter(p => p.pos === 'FWD' || p.pos === 'MID');
    scorerSelect.innerHTML = '<option value="">Select first scorer…</option><option value="none">No England scorer</option>';
    scorers.forEach(player => {
      const option = document.createElement('option');
      option.value = player.id;
      option.textContent = `${player.name} (${player.pos})`;
      scorerSelect.appendChild(option);
    });
    scorerSelect.value = saved.scorer || '';
    updatePredictionStatus();
  }

  function updatePredictionStatus() {
    const status = $('predictionStatus');
    const saved = storage.get('engMatchPrediction', { score: '', scorer: '' });
    if (!status) return;
    const scorerName = saved.scorer === 'none' ? 'No England scorer' : (playerById(saved.scorer)?.name || 'no scorer selected');
    if (saved.score && saved.scorer) {
      status.textContent = `Saved: ${saved.score}; first England scorer: ${scorerName}.`;
    } else if (saved.score) {
      status.textContent = `Score picked: ${saved.score}. Now choose England’s first scorer.`;
    } else if (saved.scorer) {
      status.textContent = `First scorer picked: ${scorerName}. Now choose the score.`;
    } else {
      status.textContent = 'Make your match prediction.';
    }
  }

  function renderPitch() {
    const pitch = $('pitch');
    pitch.innerHTML = '<div class="box top" aria-hidden="true"></div><div class="box bottom" aria-hidden="true"></div>';
    formations[formation].forEach((slot, index) => {
      const [label, x, y] = slot;
      const assignedId = xi[index];
      const player = assignedId ? playerById(assignedId) : null;
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'slot';
      el.dataset.slot = String(index);
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.innerHTML = `<div><div class="slot-label">${label}</div><div class="slot-player">${player ? player.name : 'Tap here'}</div>${player ? `<div class="slot-meta">${player.pos} • ${player.club}</div>` : ''}</div>`;
      el.addEventListener('click', () => assignToSlot(index));
      el.addEventListener('dragover', (e) => { e.preventDefault(); el.classList.add('selected-target'); });
      el.addEventListener('dragleave', () => el.classList.remove('selected-target'));
      el.addEventListener('drop', (e) => {
        e.preventDefault(); el.classList.remove('selected-target');
        const id = e.dataTransfer.getData('text/player-id');
        if (id) { selectedPlayerId = id; assignToSlot(index); }
      });
      pitch.appendChild(el);
    });
  }

  function renderPlayers() {
    const list = $('playerList');
    const used = usedPlayerIds();
    list.innerHTML = '';
    const visible = squad.filter(p => currentFilter === 'all' || p.pos === currentFilter);
    visible.forEach(p => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'player-card';
      if (selectedPlayerId === p.id) button.classList.add('selected');
      if (used.has(p.id)) button.classList.add('used');
      button.draggable = true;
      button.dataset.playerId = p.id;
      button.innerHTML = `<span><strong>${p.name}</strong><span>${p.club}</span></span><em class="pos-badge">${p.pos}</em>`;
      button.addEventListener('click', () => selectPlayer(p.id));
      button.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/player-id', p.id);
        e.dataTransfer.effectAllowed = 'copyMove';
        selectPlayer(p.id);
      });
      list.appendChild(button);
    });
  }

  function selectPlayer(id) {
    selectedPlayerId = selectedPlayerId === id ? null : id;
    const p = selectedPlayerId ? playerById(selectedPlayerId) : null;
    $('selectedHint').textContent = p ? `${p.name} selected` : 'Tap or drag a player';
    $('xiStatus').textContent = p ? `Now tap a shirt for ${p.name}.` : 'Choose a player, then choose a shirt.';
    renderPlayers();
  }

  function assignToSlot(slotIndex) {
    if (!selectedPlayerId) {
      $('xiStatus').textContent = 'First tap a player from the player list.';
      return;
    }
    Object.keys(xi).forEach(key => { if (xi[key] === selectedPlayerId) delete xi[key]; });
    xi[slotIndex] = selectedPlayerId;
    const p = playerById(selectedPlayerId);
    selectedPlayerId = null;
    $('selectedHint').textContent = 'Tap or drag a player';
    $('xiStatus').textContent = `${p.name} added to your XI.`;
    renderPitch(); renderPlayers();
  }

  function resetXI() {
    xi = {}; selectedPlayerId = null;
    storage.set('engXI', xi);
    $('xiStatus').textContent = 'XI reset. Choose a player, then choose a shirt.';
    renderPitch(); renderPlayers();
  }

  function initQuiz() {
    const questions = window.ENGLAND_QUIZ_QUESTIONS || [];
    const host = $('quizQuestions');
    host.innerHTML = '';
    quizAnswered = 0; quizCorrect = 0; updateQuizScore();
    const shuffled = [...questions].sort(() => Math.random() - .5).slice(0, 3);
    shuffled.forEach((q, qi) => {
      const card = document.createElement('article');
      card.className = 'question';
      const answers = q.answers.map((answer, ai) => ({ answer, ai })).sort(() => Math.random() - .5);
      card.innerHTML = `<h3>${qi + 1}. ${q.question}</h3><div class="answers"></div><p class="explanation"></p>`;
      const answersHost = card.querySelector('.answers');
      const explanation = card.querySelector('.explanation');
      answers.forEach(({answer, ai}) => {
        const btn = document.createElement('button');
        btn.className = 'answer'; btn.type = 'button'; btn.textContent = answer;
        btn.addEventListener('click', () => {
          if (card.dataset.done) return;
          card.dataset.done = 'true'; quizAnswered++;
          const ok = ai === q.correct;
          if (ok) quizCorrect++;
          btn.classList.add(ok ? 'correct' : 'wrong');
          [...answersHost.children].forEach(child => {
            if (child.textContent === q.answers[q.correct]) child.classList.add('correct');
          });
          explanation.textContent = q.explanation || '';
          updateQuizScore();
        });
        answersHost.appendChild(btn);
      });
      host.appendChild(card);
    });
  }

  function updateQuizScore() { $('quizScore').textContent = `Score: ${quizCorrect}/${quizAnswered}`; }

  function initControls() {
    $('formationSelect').value = formation;
    $('formationSelect').addEventListener('change', (e) => {
      formation = e.target.value; xi = {}; selectedPlayerId = null;
      storage.set('engFormation', formation); storage.set('engXI', xi);
      $('xiStatus').textContent = 'Formation changed. Pick your XI again.';
      renderPitch(); renderPlayers();
    });
    $('saveXiBtn').addEventListener('click', () => { storage.set('engXI', xi); storage.set('engFormation', formation); $('xiStatus').textContent = 'XI saved on this device.'; });
    $('resetXiBtn').addEventListener('click', resetXI);
    $('clearSelectedBtn').addEventListener('click', () => selectPlayer(selectedPlayerId));
    document.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active'); currentFilter = chip.dataset.filter; renderPlayers();
    }));
    $('newQuizBtn').addEventListener('click', initQuiz);
    const scorerSelect = $('firstScorerSelect');
    if (scorerSelect) scorerSelect.addEventListener('change', () => {
      const current = storage.get('engMatchPrediction', { score: '', scorer: '' });
      current.scorer = scorerSelect.value;
      storage.set('engMatchPrediction', current);
      updatePredictionStatus();
    });
    const savePredictionBtn = $('savePredictionBtn');
    if (savePredictionBtn) savePredictionBtn.addEventListener('click', () => {
      const current = storage.get('engMatchPrediction', { score: '', scorer: '' });
      current.scorer = scorerSelect ? scorerSelect.value : current.scorer;
      storage.set('engMatchPrediction', current);
      updatePredictionStatus();
    });
    const resetPredictionBtn = $('resetPredictionBtn');
    if (resetPredictionBtn) resetPredictionBtn.addEventListener('click', () => {
      storage.set('engMatchPrediction', { score: '', scorer: '' });
      renderMatchPredictor();
    });
    if (!storage.get('cookiesOK', false)) $('cookieBanner').classList.add('show');
    $('acceptCookiesBtn').addEventListener('click', () => { storage.set('cookiesOK', true); $('cookieBanner').classList.remove('show'); });
  }

  function boot() {
    countdown(); setInterval(countdown, 1000);
    initControls(); renderPitch(); renderPlayers(); renderMatchPredictor(); initQuiz();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
