const MATCH_DATE = '2026-07-11T23:00:00+02:00';
const $ = id => document.getElementById(id);
let currentQuiz = [];

const FALLBACK_QUIZ = [
  {question:'Who won the Golden Boot at the 1986 men’s World Cup?', options:['Gary Lineker','Diego Maradona','Emilio Butragueño','Rudi Völler'], answer:0, difficulty:'Hard', explanation:'Gary Lineker scored six goals at Mexico 1986.'},
  {question:'Which country knocked England out of the 2002 men’s World Cup?', options:['Brazil','Portugal','Germany','Argentina'], answer:0, difficulty:'Medium', explanation:'Brazil beat England 2-1 in the quarter-final in Shizuoka.'},
  {question:'Who scored twice for England in the 1966 World Cup semi-final?', options:['Bobby Charlton','Geoff Hurst','Roger Hunt','Martin Peters'], answer:0, difficulty:'Legend', explanation:'Bobby Charlton scored both goals in England’s 2-1 win over Portugal.'}
];

const FALLBACK_CONTENT = {
  scorers: ['Harry Kane','Bukayo Saka','Jude Bellingham','Phil Foden','Cole Palmer','Marcus Rashford','Ollie Watkins','Declan Rice','John Stones','Own goal','No England scorer'],
  facts: [
    'England won the 1966 men’s World Cup at Wembley after extra time against West Germany.',
    'Geoff Hurst remains the only player to score a hat-trick in a men’s World Cup final.',
    'Gary Lineker won the Golden Boot at the 1986 men’s World Cup in Mexico.',
    'England’s first men’s World Cup appearance came in Brazil in 1950.',
    'England’s first World Cup penalty shoot-out win came against Colombia in 2018.'
  ]
};

function init(){
  setTimeout(() => $('loader')?.classList.add('hide'), 650);
  fillScorers();
  tick(); setInterval(tick, 1000);
  renderContent(); initQuiz(); initPrediction(); initCookie();
  $('newQuiz')?.addEventListener('click', initQuiz);
  $('checkQuiz')?.addEventListener('click', checkQuiz);
  $('closeCelebration')?.addEventListener('click', () => $('celebration')?.classList.remove('show'));
}

function tick(){
  const target = new Date(MATCH_DATE); let diff = Math.max(0, target - new Date());
  const d = Math.floor(diff/864e5); diff %= 864e5;
  const h = Math.floor(diff/36e5); diff %= 36e5;
  const m = Math.floor(diff/6e4); diff %= 6e4;
  const s = Math.floor(diff/1000);
  if($('countdown')) $('countdown').innerHTML = [d,h,m,s].map(v => `<span>${String(v).padStart(2,'0')}</span>`).join('');
  if($('dashCountdown')) $('dashCountdown').textContent = `${d} days ${h}h ${m}m`;
  if($('kickoffLocal')) $('kickoffLocal').textContent = 'Kick-off in your local time: ' + target.toLocaleString([], { dateStyle:'full', timeStyle:'short' });
}

function getContent(){ return window.ENGLAND_CONTENT || FALLBACK_CONTENT; }
function getQuiz(){ return Array.isArray(window.WORLD_CUP_QUIZ) && window.WORLD_CUP_QUIZ.length ? window.WORLD_CUP_QUIZ : FALLBACK_QUIZ; }

function renderContent(){
  const c = getContent();
  if($('factText')) {
    const facts = Array.isArray(c.facts) && c.facts.length ? c.facts : FALLBACK_CONTENT.facts;
    $('factText').textContent = facts[Math.floor(Math.random() * facts.length)];
  }
}

function fillScorers(){
  const sel = $('firstScorer'); if(!sel) return;
  getContent().scorers.forEach(x => sel.add(new Option(x,x)));
}

function initPrediction(){
  const saved = JSON.parse(localStorage.getItem('eng_wc_prediction') || 'null');
  if(saved){ $('engScore').value = saved.eng; $('norScore').value = saved.nor; $('firstScorer').value = saved.scorer; }
  ['engScore','norScore','firstScorer'].forEach(id => $(id)?.addEventListener('input', () => updatePrediction()));
  $('savePrediction')?.addEventListener('click', () => { localStorage.setItem('eng_wc_prediction', JSON.stringify(getPrediction())); updatePrediction('Saved. '); });
  $('copyPrediction')?.addEventListener('click', async () => {
    const d = getPrediction(); const t = `My prediction: England ${d.eng}-${d.nor} Norway. First England scorer: ${d.scorer}.`;
    try{ await navigator.clipboard.writeText(t); $('predictionSummary').textContent = 'Copied: ' + t; }
    catch { $('predictionSummary').textContent = t; }
  });
  updatePrediction();
}
function getPrediction(){ return { eng: Math.max(0, Number($('engScore')?.value || 0)), nor: Math.max(0, Number($('norScore')?.value || 0)), scorer: $('firstScorer')?.value || 'No England scorer' }; }
function updatePrediction(prefix=''){ const d = getPrediction(); if($('predictionSummary')) $('predictionSummary').textContent = `${prefix}You predicted: England ${d.eng}-${d.nor} Norway | First England scorer: ${d.scorer}.`; }

function initQuiz(){
  const source = getQuiz().filter(q => q && q.question && Array.isArray(q.options) && Number.isInteger(q.answer));
  const pool = [...source].sort(() => Math.random() - .5);
  const legend = pool.find(q => q.difficulty === 'Legend');
  const hard = pool.find(q => q.difficulty === 'Hard' && q !== legend);
  const medium = pool.find(q => q.difficulty === 'Medium' && q !== legend && q !== hard);
  currentQuiz = [medium, hard, legend].filter(Boolean);
  while(currentQuiz.length < 3 && pool.length){ const q = pool.pop(); if(!currentQuiz.includes(q)) currentQuiz.push(q); }
  currentQuiz = currentQuiz.slice(0,3).sort(() => Math.random() - .5);
  if($('quizResult')) $('quizResult').textContent = '';
  if($('quizContainer')) $('quizContainer').innerHTML = currentQuiz.map((q,i) => `
    <div class="question" data-i="${i}">
      <div class="q-head"><strong>${i+1}. ${q.question.replace(/\s+#\d+$/,'')}</strong><span class="badge">${q.difficulty || 'Hard'}</span></div>
      <div class="options">${q.options.map((o,j) => `<label class="option"><input type="radio" name="q${i}" value="${j}"><span>${o}</span></label>`).join('')}</div>
      <p class="explanation">${q.explanation || ''}</p>
    </div>`).join('');
}

function checkQuiz(){
  let score = 0;
  document.querySelectorAll('.question').forEach((el,i) => {
    el.classList.add('reviewed'); const q = currentQuiz[i]; const chosen = el.querySelector('input:checked');
    el.querySelectorAll('.option').forEach((opt,j) => { opt.classList.toggle('correct', j === q.answer); opt.classList.toggle('wrong', chosen && Number(chosen.value) === j && j !== q.answer); });
    if(chosen && Number(chosen.value) === q.answer) score++;
  });
  if($('quizResult')) $('quizResult').textContent = score === 3 ? 'Perfect score: 3/3.' : `You scored ${score}/3. Try another set.`;
  if(score === 3){ $('celebration')?.classList.add('show'); confetti(); }
}
function confetti(){
  for(let i=0;i<48;i++){ const p=document.createElement('i'); p.textContent=['🎉','🦁','⭐','🏆'][i%4]; p.style.cssText=`position:fixed;left:${Math.random()*100}vw;top:-25px;z-index:50;font-size:24px;transition:transform 2.2s ease,opacity 2.2s`; document.body.appendChild(p); requestAnimationFrame(()=>{p.style.transform=`translateY(105vh) rotate(${Math.random()*720}deg)`;p.style.opacity=0}); setTimeout(()=>p.remove(),2400); }
}
function initCookie(){ if(localStorage.getItem('cookie_ok')) $('cookie')?.classList.add('hide'); $('acceptCookie')?.addEventListener('click', () => { localStorage.setItem('cookie_ok','yes'); $('cookie')?.classList.add('hide'); }); }
document.addEventListener('DOMContentLoaded', init);
