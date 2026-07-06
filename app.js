const MATCH_DATE = '2026-07-11T21:00:00+02:00';

const squad = [
  { id:'pickford', name:'Jordan Pickford', pos:'GK', club:'Everton', no:1 },
  { id:'ramsdale', name:'Aaron Ramsdale', pos:'GK', club:'Southampton', no:13 },
  { id:'henderson', name:'Dean Henderson', pos:'GK', club:'Crystal Palace', no:23 },
  { id:'walker', name:'Kyle Walker', pos:'DEF', club:'Burnley', no:2 },
  { id:'stones', name:'John Stones', pos:'DEF', club:'Manchester City', no:5 },
  { id:'guehi', name:'Marc Guéhi', pos:'DEF', club:'Crystal Palace', no:6 },
  { id:'trippier', name:'Kieran Trippier', pos:'DEF', club:'Newcastle United', no:12 },
  { id:'shaw', name:'Luke Shaw', pos:'DEF', club:'Manchester United', no:3 },
  { id:'konsa', name:'Ezri Konsa', pos:'DEF', club:'Aston Villa', no:14 },
  { id:'gomez', name:'Joe Gomez', pos:'DEF', club:'Liverpool', no:22 },
  { id:'burn', name:'Dan Burn', pos:'DEF', club:'Newcastle United', no:24 },
  { id:'rice', name:'Declan Rice', pos:'MID', club:'Arsenal', no:4 },
  { id:'bellingham', name:'Jude Bellingham', pos:'MID', club:'Real Madrid', no:10 },
  { id:'mainoo', name:'Kobbie Mainoo', pos:'MID', club:'Manchester United', no:18 },
  { id:'gallagher', name:'Conor Gallagher', pos:'MID', club:'Atlético Madrid', no:16 },
  { id:'trent', name:'Trent Alexander-Arnold', pos:'MID', club:'Real Madrid', no:8 },
  { id:'palmer', name:'Cole Palmer', pos:'MID', club:'Chelsea', no:20 },
  { id:'foden', name:'Phil Foden', pos:'FWD', club:'Manchester City', no:11 },
  { id:'saka', name:'Bukayo Saka', pos:'FWD', club:'Arsenal', no:7 },
  { id:'kane', name:'Harry Kane', pos:'FWD', club:'Bayern Munich', no:9 },
  { id:'watkins', name:'Ollie Watkins', pos:'FWD', club:'Aston Villa', no:19 },
  { id:'toney', name:'Ivan Toney', pos:'FWD', club:'Al-Ahli', no:17 },
  { id:'eze', name:'Eberechi Eze', pos:'FWD', club:'Crystal Palace', no:21 },
  { id:'gordon', name:'Anthony Gordon', pos:'FWD', club:'Newcastle United', no:15 },
  { id:'bowen', name:'Jarrod Bowen', pos:'FWD', club:'West Ham United', no:25 },
  { id:'rashford', name:'Marcus Rashford', pos:'FWD', club:'Manchester United', no:26 }
];

const formations = {
  '433': [
    ['GK','GK',50,91], ['LB','DEF',18,72], ['LCB','DEF',38,74], ['RCB','DEF',62,74], ['RB','DEF',82,72],
    ['LCM','MID',30,53], ['CM','MID',50,48], ['RCM','MID',70,53], ['LW','FWD',22,27], ['ST','FWD',50,20], ['RW','FWD',78,27]
  ],
  '4231': [
    ['GK','GK',50,91], ['LB','DEF',18,72], ['LCB','DEF',38,74], ['RCB','DEF',62,74], ['RB','DEF',82,72],
    ['LDM','MID',40,55], ['RDM','MID',60,55], ['LAM','MID',25,34], ['CAM','MID',50,31], ['RAM','MID',75,34], ['ST','FWD',50,18]
  ],
  '352': [
    ['GK','GK',50,91], ['LCB','DEF',30,75], ['CB','DEF',50,78], ['RCB','DEF',70,75],
    ['LWB','MID',15,52], ['LCM','MID',35,50], ['CM','MID',50,43], ['RCM','MID',65,50], ['RWB','MID',85,52],
    ['LS','FWD',40,20], ['RS','FWD',60,20]
  ]
};

const baseQuiz = [
  ['Who scored England’s winning goal in the UEFA EURO 2022 final?', ['Chloe Kelly','Ella Toone','Beth Mead','Lucy Bronze'], 0, 'Chloe Kelly scored the extra-time winner at Wembley.'],
  ['Who is England’s all-time leading men’s goalscorer?', ['Harry Kane','Wayne Rooney','Bobby Charlton','Gary Lineker'], 0, 'Harry Kane passed Wayne Rooney’s record.'],
  ['Which country did England beat in the 1966 World Cup final?', ['West Germany','Brazil','Portugal','Argentina'], 0, 'England beat West Germany 4-2 after extra time.'],
  ['Who managed the Lionesses at EURO 2022?', ['Sarina Wiegman','Hope Powell','Phil Neville','Mark Sampson'], 0, 'Sarina Wiegman led England to the title.'],
  ['What is England’s national stadium?', ['Wembley','Old Trafford','Villa Park','St James’ Park'], 0, 'Wembley is England’s national stadium.'],
  ['Which England player is nicknamed Starboy by many Arsenal fans?', ['Bukayo Saka','Phil Foden','Cole Palmer','Jude Bellingham'], 0, 'Saka is widely known by that nickname.'],
  ['Which keeper saved penalties for England at the 2018 World Cup?', ['Jordan Pickford','Joe Hart','David Seaman','Aaron Ramsdale'], 0, 'Pickford was the hero against Colombia.'],
  ['Who scored twice for England in the 2022 World Cup opener against Iran?', ['Bukayo Saka','Harry Kane','Raheem Sterling','Marcus Rashford'], 0, 'Saka scored two in the 6-2 win.'],
  ['Which Lioness won the Golden Boot at EURO 2022?', ['Beth Mead','Alessia Russo','Ellen White','Lauren Hemp'], 0, 'Beth Mead won the Golden Boot and Player of the Tournament.'],
  ['Who captained England men at EURO 2020?', ['Harry Kane','Jordan Henderson','Harry Maguire','Raheem Sterling'], 0, 'Kane was captain.'],
  ['Which team knocked England out of the 2022 men’s World Cup?', ['France','Croatia','Italy','Portugal'], 0, 'France won the quarter-final 2-1.'],
  ['Who scored England’s goal in the EURO 2020 final?', ['Luke Shaw','Harry Kane','Raheem Sterling','Mason Mount'], 0, 'Luke Shaw scored early against Italy.'],
  ['Which club does Jude Bellingham play for?', ['Real Madrid','Liverpool','Borussia Dortmund','Manchester City'], 0, 'Bellingham joined Real Madrid in 2023.'],
  ['Which club does Harry Kane play for?', ['Bayern Munich','Tottenham Hotspur','Manchester United','Chelsea'], 0, 'Kane joined Bayern Munich in 2023.'],
  ['Which England player scored the backheel goal against Sweden at EURO 2022?', ['Alessia Russo','Fran Kirby','Georgia Stanway','Lauren Hemp'], 0, 'Russo’s backheel became an iconic moment.'],
  ['Which country hosted UEFA Women’s EURO 2022?', ['England','Germany','Netherlands','France'], 0, 'England hosted and won the tournament.'],
  ['Who scored England’s semi-final winner against Denmark at EURO 2020?', ['Harry Kane','Raheem Sterling','Bukayo Saka','Jack Grealish'], 0, 'Kane scored after his penalty was saved.'],
  ['What colour are England’s traditional home shirts?', ['White','Red','Blue','Green'], 0, 'England traditionally play at home in white.'],
  ['Which England player is famous for the 1998 free-kick against Colombia?', ['David Beckham','Paul Scholes','Michael Owen','Alan Shearer'], 0, 'Beckham scored a famous free-kick.'],
  ['Who scored a wonder goal against Argentina at France 98?', ['Michael Owen','David Beckham','Paul Gascoigne','Teddy Sheringham'], 0, 'Michael Owen announced himself with that goal.'],
  ['Which England manager took the men’s team to the 2018 World Cup semi-final?', ['Gareth Southgate','Roy Hodgson','Fabio Capello','Steve McClaren'], 0, 'Southgate led England to the last four.'],
  ['Who scored England’s winner against Germany at EURO 2022?', ['Chloe Kelly','Beth Mead','Ella Toone','Keira Walsh'], 0, 'Kelly scored in extra time.'],
  ['Which England women’s goalkeeper retired internationally in 2025?', ['Mary Earps','Hannah Hampton','Karen Bardsley','Siobhan Chamberlain'], 0, 'Mary Earps announced her England retirement in 2025.'],
  ['Which England player wore number 7 for many years and became a global icon?', ['David Beckham','Steven Gerrard','Frank Lampard','Rio Ferdinand'], 0, 'Beckham made the number famous for England.'],
  ['Which country beat England in the 2018 World Cup semi-final?', ['Croatia','France','Belgium','Spain'], 0, 'Croatia won 2-1 after extra time.']
];

const quizQuestions = Array.from({length:250}, (_,i) => {
  const q = baseQuiz[i % baseQuiz.length];
  const cycle = Math.floor(i / baseQuiz.length) + 1;
  return { question: q[0] + (cycle > 1 ? ` #${cycle}` : ''), answers: q[1], correct: q[2], explain: q[3] };
});

let currentFormation = localStorage.getItem('formation') || '433';
let xi = JSON.parse(localStorage.getItem('englandXI') || '{}');
let selectedPlayer = null;
let filter = 'all';
let score = 0;
let answered = 0;

function qs(id){ return document.getElementById(id); }
function playerById(id){ return squad.find(p => p.id === id); }

function updateCountdown(){
  const now = new Date();
  const target = new Date(MATCH_DATE);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff % 86400000 / 3600000);
  const minutes = Math.floor(diff % 3600000 / 60000);
  const seconds = Math.floor(diff % 60000 / 1000);
  qs('days').textContent = String(days);
  qs('hours').textContent = String(hours).padStart(2,'0');
  qs('minutes').textContent = String(minutes).padStart(2,'0');
  qs('seconds').textContent = String(seconds).padStart(2,'0');
  qs('localKickoff').textContent = target.toLocaleString([], { weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
}

function renderPitch(){
  const pitch = qs('pitch');
  pitch.innerHTML = '';
  formations[currentFormation].forEach(([label, type, x, y], index) => {
    const slotId = `slot-${index}`;
    const slot = document.createElement('button');
    slot.className = 'slot';
    slot.type = 'button';
    slot.style.left = `${x}%`;
    slot.style.top = `${y}%`;
    slot.dataset.slot = slotId;
    slot.dataset.type = type;
    const picked = playerById(xi[slotId]);
    slot.innerHTML = picked ? `<small>${label}</small><span class="picked">${picked.name}</span><span class="club">${picked.pos} · ${picked.club}</span>` : `<small>${label}</small><span class="picked">Tap shirt</span>`;
    slot.addEventListener('click', () => placeSelected(slotId));
    slot.addEventListener('dragover', (e) => { e.preventDefault(); slot.classList.add('active-drop'); });
    slot.addEventListener('dragleave', () => slot.classList.remove('active-drop'));
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('active-drop');
      const id = e.dataTransfer.getData('text/plain');
      assignPlayer(slotId, id);
    });
    pitch.appendChild(slot);
  });
}

function renderPlayers(){
  const list = qs('playerList');
  list.innerHTML = '';
  const pickedIds = new Set(Object.values(xi));
  squad.filter(p => filter === 'all' || p.pos === filter).forEach(player => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'player-card' + (selectedPlayer === player.id ? ' selected' : '');
    btn.draggable = true;
    btn.dataset.player = player.id;
    btn.innerHTML = `<span class="num">${player.no}</span><span><span class="player-name">${player.name}</span><span class="player-meta">${player.club}${pickedIds.has(player.id) ? ' · selected' : ''}</span></span><span class="pos-pill">${player.pos}</span>`;
    btn.addEventListener('click', () => selectPlayer(player.id));
    btn.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', player.id));
    list.appendChild(btn);
  });
}

function selectPlayer(id){
  selectedPlayer = selectedPlayer === id ? null : id;
  const player = playerById(selectedPlayer);
  qs('selectedHint').textContent = player ? `${player.name} selected. Tap a shirt.` : 'Tap or drag a player';
  renderPlayers();
}

function assignPlayer(slotId, playerId){
  if(!playerById(playerId)) return;
  Object.keys(xi).forEach(key => { if(xi[key] === playerId) delete xi[key]; });
  xi[slotId] = playerId;
  selectedPlayer = null;
  qs('selectedHint').textContent = 'Player placed';
  renderPitch();
  renderPlayers();
}

function placeSelected(slotId){
  if(xi[slotId] && !selectedPlayer){
    delete xi[slotId];
    renderPitch();
    renderPlayers();
    qs('selectedHint').textContent = 'Player removed';
    return;
  }
  if(!selectedPlayer){ qs('selectedHint').textContent = 'Choose a player first'; return; }
  assignPlayer(slotId, selectedPlayer);
}

function saveXI(){
  localStorage.setItem('englandXI', JSON.stringify(xi));
  localStorage.setItem('formation', currentFormation);
  qs('selectedHint').textContent = 'XI saved on this device';
}

function resetXI(){
  xi = {};
  selectedPlayer = null;
  localStorage.removeItem('englandXI');
  renderPitch();
  renderPlayers();
  qs('selectedHint').textContent = 'XI reset';
}

function shuffle(arr){ return [...arr].sort(() => Math.random() - 0.5); }
function renderQuiz(){
  const box = qs('quizQuestions');
  box.innerHTML = '';
  score = 0; answered = 0;
  qs('quizScore').textContent = 'Score: 0/0';
  shuffle(quizQuestions).slice(0,3).forEach((q,idx) => {
    const card = document.createElement('article');
    card.className = 'question';
    card.innerHTML = `<p>${idx+1}. ${q.question}</p><div class="answers"></div><div class="explain"></div>`;
    const answers = card.querySelector('.answers');
    q.answers.forEach((answer,i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'answer';
      b.textContent = answer;
      b.addEventListener('click', () => {
        if(card.dataset.done) return;
        card.dataset.done = '1';
        answered++;
        if(i === q.correct){ score++; b.classList.add('correct'); }
        else { b.classList.add('wrong'); answers.children[q.correct].classList.add('correct'); }
        card.querySelector('.explain').textContent = q.explain;
        qs('quizScore').textContent = `Score: ${score}/${answered}`;
      });
      answers.appendChild(b);
    });
    box.appendChild(card);
  });
}

function init(){
  currentFormation = formations[currentFormation] ? currentFormation : '433';
  qs('formationSelect').value = currentFormation;
  qs('formationSelect').addEventListener('change', e => { currentFormation = e.target.value; xi = {}; renderPitch(); renderPlayers(); });
  qs('saveXiBtn').addEventListener('click', saveXI);
  qs('resetXiBtn').addEventListener('click', resetXI);
  document.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active'); filter = chip.dataset.filter; renderPlayers();
  }));
  qs('newQuizBtn').addEventListener('click', renderQuiz);
  qs('confidenceRange').addEventListener('input', e => qs('confidenceValue').textContent = e.target.value);
  if(localStorage.getItem('cookieOK') !== '1') qs('cookieBanner').classList.add('show');
  qs('acceptCookies').addEventListener('click', () => { localStorage.setItem('cookieOK','1'); qs('cookieBanner').classList.remove('show'); });
  renderPitch(); renderPlayers(); renderQuiz(); updateCountdown(); setInterval(updateCountdown, 1000);
}

document.addEventListener('DOMContentLoaded', init);
