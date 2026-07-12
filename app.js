'use strict';
const $ = id => document.getElementById(id);
let currentQuiz = [];
let usedFacts = new Set();
const FALLBACK_QUIZ = [
  {question:'Who scored England’s hat-trick in the 1966 men’s World Cup final?', options:['Geoff Hurst','Bobby Charlton','Martin Peters','Roger Hunt'], answer:0, difficulty:'Medium', explanation:'Geoff Hurst scored three in England’s 4-2 win over West Germany.'},
  {question:'Who was England’s top scorer at the 1986 men’s World Cup?', options:['Gary Lineker','Peter Beardsley','Bryan Robson','Chris Waddle'], answer:0, difficulty:'Hard', explanation:'Gary Lineker won the Golden Boot with six goals at Mexico 1986.'},
  {question:'Which country knocked England out of the 2002 men’s World Cup?', options:['Brazil','Portugal','Germany','Argentina'], answer:0, difficulty:'Medium', explanation:'Brazil beat England 2-1 in the quarter-final in Shizuoka.'},
  {question:'Who scored twice for England in the 1966 World Cup semi-final?', options:['Bobby Charlton','Geoff Hurst','Roger Hunt','Martin Peters'], answer:0, difficulty:'Legend', explanation:'Bobby Charlton scored both goals in England’s 2-1 win over Portugal.'}
];
const FALLBACK_CONTENT = {
  scorers: ['Harry Kane','Bukayo Saka','Jude Bellingham','Declan Rice','John Stones'],
  squad: [], quotes:[{text:'Football is nothing without fans.',by:'Matt Busby'}], recentForm:['W','W','W','D','W'],
  facts: ['England won the 1966 men’s World Cup at Wembley after extra time against West Germany.','Geoff Hurst remains the only player to score a hat-trick in a men’s World Cup final.','Gary Lineker won the Golden Boot at the 1986 men’s World Cup in Mexico.','England’s first men’s World Cup appearance came in Brazil in 1950.','England’s first World Cup penalty shoot-out win came against Colombia in 2018.']
};
function cfg(){ return window.SITE_CONFIG || {}; }
function match(){ return cfg().match || {}; }
function matchDate(){ return new Date(match().dateISO || '2026-07-15T20:00:00+01:00'); }
function getContent(){ return window.ENGLAND_CONTENT || FALLBACK_CONTENT; }
function getQuiz(){ return Array.isArray(window.WORLD_CUP_QUIZ) && window.WORLD_CUP_QUIZ.length ? window.WORLD_CUP_QUIZ : FALLBACK_QUIZ; }
function esc(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
function safeStoreGet(key, fallback){ try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}catch{return fallback;} }
function safeStoreSet(key, value){ try{localStorage.setItem(key, JSON.stringify(value));}catch{} }

document.addEventListener('DOMContentLoaded', init);
function init(){
  applyConfig();
  fillScorers();
  tick(); updateDetectedLocalTime(); setInterval(tick, 1000); setInterval(updateDetectedLocalTime, 1000);
  renderFact(); renderTeamNews(); renderMatchdayExtras(); renderMatchStatus(); renderFixtures(); loadWeather(); updateDetectedLocalTime(); initQuiz(); initPrediction(); initPoll(); initConfidence(); initCookie(); initUI(); runSelfHeal();
  $('newQuiz')?.addEventListener('click', initQuiz);
  $('checkQuiz')?.addEventListener('click', checkQuiz);
  $('newFact')?.addEventListener('click', renderFact);
  $('newQuote')?.addEventListener('click', renderQuote);
  $('nextSpotlight')?.addEventListener('click', renderSpotlight);
  $('winConfetti')?.addEventListener('click', launchCelebration);
  $('closeCelebration')?.addEventListener('click', closeCelebration);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCelebration();});
  setTimeout(() => $('loader')?.classList.add('hide'), 450);
}
function applyConfig(){
  const m = match();
  const title = `${m.home || 'England'} v ${m.away || 'Argentina'}`;
  if($('heroMatch')) $('heroMatch').textContent = title;
  if($('heroStage')) $('heroStage').textContent = `${m.stage || 'Quarter-final'} countdown`;
  if($('metaCompetition')) $('metaCompetition').textContent = `⚽ ${m.competition || m.stage || 'World Cup'}`;
  if($('metaDate')) $('metaDate').textContent = `📅 ${matchDate().toLocaleDateString([], {day:'numeric', month:'long', year:'numeric'})}`;
  if($('metaVenue')) $('metaVenue').textContent = `🏟️ ${m.venue || 'Venue TBC'}`;
  if($('dashMatch')) $('dashMatch').textContent = title;
  if($('dashProgress')) $('dashProgress').textContent = `${m.stage || 'Quarter-final'} stage`;
  if($('journey')) $('journey').innerHTML = (m.route || []).map(step => `<div class="${esc(step.status)}"><b>${esc(step.label)}</b><span>${esc(step.detail)}</span>${step.meta ? `<small>${esc(step.meta)}</small>` : ''}</div>`).join('');
  if(m.links){ if($('englandLink')) $('englandLink').href=m.links.england || $('englandLink').href; if($('flashscoreLink')) $('flashscoreLink').href=m.links.flashscore || $('flashscoreLink').href; if($('fifaLink')) $('fifaLink').href=m.links.fifa || $('fifaLink').href; }
  const ls=m.lineupStatus==='confirmed'?'Confirmed XI':'Predicted XI'; if($('lineupBadge')){ $('lineupBadge').textContent=ls; $('lineupBadge').className='lineup-badge '+(m.lineupStatus==='confirmed'?'confirmed':'predicted'); } if($('lineupUpdated')) $('lineupUpdated').textContent=m.lineupUpdated||'Check official team channels close to kick-off.';
  if($('versionText')) $('versionText').textContent = `Version ${cfg().version || '1.0'}`;
}
function renderTeamNews(){
  const list = $('teamNewsList');
  if(!list) return;
  const items = Array.isArray(match().teamNews) && match().teamNews.length ? match().teamNews : [
    { status:'green', icon:'🟢', title:'Kane fit and available', text:'England captain expected to lead the line.' },
    { status:'green', icon:'🟢', title:'Bellingham expected to start', text:'Midfield energy and control remain central to the plan.' },
    { status:'amber', icon:'🟡', title:'Saka fitness being monitored', text:'Final call closer to kick-off.' },
    { status:'red', icon:'🔴', title:'Jarell Quansah suspended', text:'His two-match ban also covers the semi-final.' }
  ];
  list.innerHTML = items.map(item => `<article class="news-item ${esc(item.status || 'green')}"><span class="news-icon">${esc(item.icon || '🟢')}</span><div><b>${esc(item.title)}</b><p>${esc(item.text || '')}</p></div></article>`).join('');
}
function updateDetectedLocalTime(){
  const el=$('localTimeExtra'); if(!el) return;
  try{
    const zone=Intl.DateTimeFormat().resolvedOptions().timeZone || 'Device timezone';
    const formatted=matchDate().toLocaleString([], {weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit', timeZone:zone});
    el.textContent=formatted;
    el.title=`Detected automatically: ${zone}`;
  }catch(e){ el.textContent=matchDate().toLocaleString([], {dateStyle:'medium', timeStyle:'short'}); }
}
function tick(){
  let diff = Math.max(0, matchDate() - new Date());
  const d = Math.floor(diff/864e5); diff %= 864e5;
  const h = Math.floor(diff/36e5); diff %= 36e5;
  const m = Math.floor(diff/6e4); diff %= 6e4;
  const s = Math.floor(diff/1000);
  if($('countdown')) $('countdown').innerHTML = [d,h,m,s].map(v => `<span>${String(v).padStart(2,'0')}</span>`).join('');
  if($('dashCountdown')) $('dashCountdown').textContent = `${d} days ${h}h ${m}m`;
  if($('kickoffLocal')) $('kickoffLocal').textContent = 'Kick-off in your local time: ' + matchDate().toLocaleString([], { dateStyle:'full', timeStyle:'short' });
  renderMatchStatus();
}
function fillScorers(){ const scorers=getContent().scorers || FALLBACK_CONTENT.scorers; const sel=$('firstScorer'); if(sel){ sel.innerHTML=''; scorers.forEach(x => sel.add(new Option(x,x))); } const potm=$('playerOfMatch'); if(potm){ potm.innerHTML=''; (getContent().squad||[]).map(p=>p.name).forEach(n=>potm.add(new Option(n,n))); } }
function renderFact(){
  const facts = (getContent().facts && getContent().facts.length ? getContent().facts : FALLBACK_CONTENT.facts).filter(Boolean);
  if(!facts.length || !$('factText')) return;
  if(usedFacts.size >= facts.length) usedFacts.clear();
  let index; do { index = Math.floor(Math.random()*facts.length); } while(usedFacts.has(index) && facts.length > 1);
  usedFacts.add(index); $('factText').textContent = facts[index];
}
function initPrediction(){
  let saved=safeStoreGet('eng_wc_prediction', null);
  if(saved){ if($('engScore')) $('engScore').value=saved.eng; if($('norScore')) $('norScore').value=saved.nor; if($('firstScorer')) $('firstScorer').value=saved.scorer; if($('playerOfMatch')) $('playerOfMatch').value=saved.potm||$('playerOfMatch').value; if($('engCorners')) $('engCorners').value=saved.corners??6; if($('cleanSheet')) $('cleanSheet').value=saved.cleanSheet||'No'; }
  ['engScore','norScore','firstScorer','playerOfMatch','engCorners','cleanSheet'].forEach(id => $(id)?.addEventListener('input', () => updatePrediction()));
  $('savePrediction')?.addEventListener('click', () => { safeStoreSet('eng_wc_prediction', getPrediction()); updatePrediction('Saved. '); });
  $('copyPrediction')?.addEventListener('click', async () => { const d=getPrediction(); const t=`My prediction: England ${d.eng}-${d.nor} ${match().away || 'Argentina'}. First England scorer: ${d.scorer}. Player of the match: ${d.potm}. England corners: ${d.corners}. Clean sheet: ${d.cleanSheet}.`; try{ await navigator.clipboard.writeText(t); $('predictionSummary').textContent='Copied: '+t; } catch { $('predictionSummary').textContent=t; } });
  updatePrediction();
}
function getPrediction(){ return {eng:Math.max(0,Number($('engScore')?.value||0)), nor:Math.max(0,Number($('norScore')?.value||0)), scorer:$('firstScorer')?.value||'', potm:$('playerOfMatch')?.value||'', corners:Math.max(0,Number($('engCorners')?.value||0)), cleanSheet:$('cleanSheet')?.value||'No'}; }
function updatePrediction(prefix=''){ const d=getPrediction(); if($('predictionSummary')) $('predictionSummary').innerHTML=`<span class="prediction-kicker">${esc(prefix||'Your prediction')}</span><strong>England ${d.eng}–${d.nor} ${esc(match().away || 'Argentina')}</strong><div class="prediction-details"><span>⚽ ${esc(d.scorer)}</span><span>⭐ ${esc(d.potm)}</span><span>🚩 ${d.corners} corners</span><span>🧤 Clean sheet: ${esc(d.cleanSheet)}</span><span>📊 Confidence: ${$('confidenceSlider')?.value||70}%</span></div>`; }
function validQuestion(q){ return q && q.question && Array.isArray(q.options) && q.options.length>=2 && Number.isInteger(q.answer) && q.answer>=0 && q.answer<q.options.length; }
function initQuiz(){
  const source=getQuiz().filter(validQuestion).filter(q=>q.difficulty!=='Easy');
  const used=safeStoreGet('eng_wc_quiz_used', []);
  let available=source.filter(q=>!used.includes(q.question));
  if(available.length<5){ available=[...source]; safeStoreSet('eng_wc_quiz_used', []); }
  currentQuiz=[...available].sort(()=>Math.random()-.5).slice(0,5);
  safeStoreSet('eng_wc_quiz_used', [...new Set([...used,...currentQuiz.map(q=>q.question)])].slice(-400));
  if($('quizResult')) $('quizResult').textContent='';
  if($('quizStreak')) $('quizStreak').textContent=safeStoreGet('eng_wc_quiz_streak',0);
  if($('quizBest')) $('quizBest').textContent=safeStoreGet('eng_wc_quiz_best',0)+'/5';
  if($('quizContainer')) $('quizContainer').innerHTML=currentQuiz.map((q,i)=>`<div class="question" data-i="${i}"><div class="q-head"><strong>${i+1}. ${esc(String(q.question).replace(/\s+#\d+$/,''))}</strong><span class="badge">${esc(q.difficulty||'Hard')}</span></div><div class="options">${[...q.options].map((o,j)=>({o,j})).sort(()=>Math.random()-.5).map(x=>`<label class="option"><input type="radio" name="q${i}" value="${x.j}"><span>${esc(x.o)}</span></label>`).join('')}</div><p class="explanation">${esc(q.explanation||'')}</p></div>`).join('') || '<p>Quiz loading problem. Please refresh the page.</p>';
}
function checkQuiz(){
  let score=0, answered=0;
  document.querySelectorAll('.question').forEach((el,i)=>{ const q=currentQuiz[i]; if(!q)return; const chosen=el.querySelector('input:checked'); if(chosen)answered++; el.classList.add('reviewed'); el.querySelectorAll('.option').forEach(opt=>{ const j=Number(opt.querySelector('input').value); opt.classList.toggle('correct',j===q.answer); opt.classList.toggle('wrong',chosen&&Number(chosen.value)===j&&j!==q.answer); }); if(chosen&&Number(chosen.value)===q.answer)score++; });
  if(answered<5){ if($('quizResult')) $('quizResult').textContent=`You answered ${answered}/5. Unanswered questions count as incorrect.`; }
  const previousBest=safeStoreGet('eng_wc_quiz_best',0); if(score>previousBest)safeStoreSet('eng_wc_quiz_best',score);
  let streak=safeStoreGet('eng_wc_quiz_streak',0); streak=score===5?streak+1:0; safeStoreSet('eng_wc_quiz_streak',streak);
  if($('quizStreak')) $('quizStreak').textContent=streak; if($('quizBest')) $('quizBest').textContent=Math.max(score,previousBest)+'/5';
  const titles=['Back to training','Needs more caps','Matchday regular','Strong supporter','England expert','Three Lions legend'];
  if($('quizResult')) $('quizResult').textContent=`${titles[score]}: ${score}/5. Explanations are now shown.`;
  if(score===5)launchCelebration();
}
function confetti(){ if(matchMedia('(prefers-reduced-motion: reduce)').matches) return; for(let i=0;i<120;i++){ const p=document.createElement('i'); p.className='confetti-piece'; p.textContent=['✦','★','◆','🦁','🏆'][i%5]; p.style.left=Math.random()*100+'vw'; p.style.animationDelay=(Math.random()*.8)+'s'; p.style.fontSize=(14+Math.random()*20)+'px'; document.body.appendChild(p); setTimeout(()=>p.remove(),4200); } }
function launchCelebration(){ $('celebration')?.classList.add('show'); document.body.classList.add('celebrating'); confetti(); }
function closeCelebration(){ $('celebration')?.classList.remove('show'); document.body.classList.remove('celebrating'); }

function initCookie(){
  try{
    if(localStorage.getItem('cookie_ok')) $('cookie')?.classList.add('hide');
    $('acceptCookie')?.addEventListener('click',()=>{
      try{ localStorage.setItem('cookie_ok','yes'); }catch{}
      $('cookie')?.classList.add('hide');
    });
  }catch{ $('cookie')?.classList.add('hide'); }
}
function initUI(){
  $('menuToggle')?.addEventListener('click',()=>{
    const nav=$('navLinks');
    nav?.classList.toggle('open');
    $('menuToggle')?.setAttribute('aria-expanded', nav?.classList.contains('open') ? 'true' : 'false');
  });
  document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>{
    $('navLinks')?.classList.remove('open');
    $('menuToggle')?.setAttribute('aria-expanded','false');
  }));
  $('backTop')?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll',()=> $('backTop')?.classList.toggle('show', scrollY>500), {passive:true});
  const obs = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
  }),{threshold:.08}) : null;
  document.querySelectorAll('.reveal').forEach(el=> obs ? obs.observe(el) : el.classList.add('in'));
}

function runSelfHeal(){
  if(!$('quizContainer')?.children.length) initQuiz();
  if(!$('factText')?.textContent) renderFact();
}


function initPoll(){
  const box = $('pollOptions'), results = $('pollResults');
  if(!box || !results) return;
  const choices = ['Semi-final exit','Runner-up','World Cup winners'];
  const fallback = {'Semi-final exit':3,'Runner-up':5,'World Cup winners':12};
  let counts = safeStoreGet('eng_wc_poll_counts', fallback) || fallback;
  choices.forEach(c => { if(typeof counts[c] !== 'number') counts[c] = fallback[c] || 0; });
  const voted = safeStoreGet('eng_wc_poll_vote', null);
  box.querySelectorAll('.poll-option').forEach(btn => {
    btn.classList.toggle('selected', voted === btn.dataset.choice);
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice;
      const previous = safeStoreGet('eng_wc_poll_vote', null);
      if(previous && counts[previous] > 0) counts[previous] -= 1;
      counts[choice] = (counts[choice] || 0) + 1;
      safeStoreSet('eng_wc_poll_vote', choice);
      safeStoreSet('eng_wc_poll_counts', counts);
      box.querySelectorAll('.poll-option').forEach(b => b.classList.toggle('selected', b.dataset.choice === choice));
      renderPoll(counts, choice);
    });
  });
  renderPoll(counts, voted);
}
function renderPoll(counts, voted){
  const results = $('pollResults'); if(!results) return;
  const choices = ['Semi-final exit','Runner-up','World Cup winners'];
  const total = choices.reduce((sum,c)=>sum+(counts[c]||0),0) || 1;
  results.innerHTML = choices.map(c => {
    const pct = Math.round(((counts[c]||0) / total) * 100);
    return `<div class="poll-row"><span>${esc(c)}</span><div class="poll-bar" aria-label="${esc(c)} ${pct}%"><div class="poll-fill" style="width:${pct}%"></div></div><span>${pct}%</span></div>`;
  }).join('') + `<p class="poll-note">${voted ? 'Thanks for voting: '+esc(voted)+'.' : 'Make your pick to add your vote.'}</p>`;
}
function initConfidence(){
  const slider = $('confidenceSlider'), value = $('confidenceValue'), label = $('confidenceLabel');
  if(!slider || !value || !label) return;
  const saved = safeStoreGet('eng_wc_confidence', 70);
  slider.value = saved;
  const update = () => {
    const n = Number(slider.value || 0);
    value.textContent = `${n}%`;
    label.textContent = n >= 85 ? 'Belief is sky high' : n >= 65 ? 'Strong belief' : n >= 45 ? 'Cautiously optimistic' : n >= 25 ? 'Nervy' : 'Very worried';
  };
  slider.addEventListener('input', update);
  $('saveConfidence')?.addEventListener('click', () => { safeStoreSet('eng_wc_confidence', Number(slider.value)); update(); $('saveConfidence').textContent='Saved'; setTimeout(()=>{$('saveConfidence').textContent='Save confidence';},1200); });
  $('resetConfidence')?.addEventListener('click', () => { slider.value = 70; safeStoreSet('eng_wc_confidence', 70); update(); });
  update();
}

function renderMatchdayExtras(){
  renderSpotlight();
  const content=getContent(), form=Array.isArray(content.recentForm)?content.recentForm:[];
  if($('recentForm')) $('recentForm').innerHTML=form.map(r=>`<span class="form-badge ${r.toLowerCase()}">${esc(r)}</span>`).join('');
  renderQuote();
}
function renderSpotlight(){
  const content=getContent(), squad=Array.isArray(content.squad)?content.squad:[]; if(!squad.length)return;
  const p=squad[Math.floor(Math.random()*squad.length)], map=content.spotlightFacts||{};
  if($('spotlightName')) $('spotlightName').textContent=p.name;
  if($('spotlightInfo')) $('spotlightInfo').textContent=`${p.position} · ${p.club}`;
  if($('spotlightInitials')) $('spotlightInitials').textContent=p.name.split(/\s+/).map(v=>v[0]).slice(0,2).join('').toUpperCase();
  const facts=map[p.name]||[`Current England ${p.position.toLowerCase()}.`,`Plays club football for ${p.club}.`,'Selected in the current England squad.'];
  if($('spotlightFacts')) $('spotlightFacts').innerHTML=facts.slice(0,3).map(f=>`<li>${esc(f)}</li>`).join('');
}
function renderQuote(){ const qs=getContent().quotes||[]; if(!qs.length)return; const q=qs[Math.floor(Math.random()*qs.length)]; const text=q.text, by=q.by; if($('matchQuote')) $('matchQuote').textContent='“'+text+'”'; if($('quoteAttribution')) $('quoteAttribution').textContent='— '+by; }
function renderMatchStatus(){ const m=match(), now=new Date(), ko=matchDate(), end=new Date(ko.getTime()+130*60000); let label='Countdown', detail='Kick-off approaching'; if(m.finalStatus){label='Full time';detail=m.finalStatus;} else if(now.toDateString()===ko.toDateString()&&now<ko){label='Match day';detail=`${m.home} v ${m.away}`;} else if(now>=ko&&now<end){label='Live now';detail=`${m.home} v ${m.away}`;} else if(now>=end){label='Full time';detail=`${m.home} v ${m.away}`;} if($('matchStatusText'))$('matchStatusText').textContent=label; if($('matchStatusDetail'))$('matchStatusDetail').textContent=detail; const b=$('matchStatusBanner'); if(b)b.dataset.status=label.toLowerCase().replace(/\s+/g,'-'); }


function renderFixtures(){
  const box=$('nextFixtures'); if(!box) return;
  const fixtures=Array.isArray(match().nextFixtures)?match().nextFixtures:[];
  box.innerHTML=fixtures.length?fixtures.map(f=>`<article class="fixture-item"><div><b>${esc(f.opponent)}</b><span>${esc(f.competition)}</span></div><div><strong>${esc(f.date)}</strong><span>${esc(f.venue)}</span>${f.conditional?'<small>Subject to England progressing</small>':''}</div></article>`).join(''):'<p>Future fixtures will appear here when confirmed.</p>';
}
async function loadWeather(){
  const box=$('weatherPanel'), w=match().weather; if(!box||!w)return;
  const ko=matchDate();
  const day=ko.toISOString().slice(0,10);
  try{
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(w.latitude)}&longitude=${encodeURIComponent(w.longitude)}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto&start_date=${day}&end_date=${day}`;
    const res=await fetch(url,{cache:'no-store'}); if(!res.ok)throw new Error('weather');
    const d=await res.json(), x=d.daily||{}, code=(x.weather_code||[])[0];
    const labels={0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',51:'Light drizzle',61:'Rain',63:'Moderate rain',65:'Heavy rain',80:'Rain showers',95:'Thunderstorms'};
    box.innerHTML=`<div class="weather-main"><strong>${esc(labels[code]||'Forecast available')}</strong><span>${Math.round((x.temperature_2m_max||[])[0])}°C high</span></div><div class="weather-stats"><span>Low <b>${Math.round((x.temperature_2m_min||[])[0])}°C</b></span><span>Rain <b>${Math.round((x.precipitation_probability_max||[])[0])}%</b></span><span>Wind <b>${Math.round((x.wind_speed_10m_max||[])[0])} km/h</b></span></div><small>Forecast for ${esc(w.label||match().venue||'the stadium')}. Weather can change.</small>`;
  }catch(e){box.innerHTML='<p>Live weather is temporarily unavailable.</p><a class="button-link" target="_blank" rel="noopener" href="https://www.weather.gov/ffc/">Check weather</a>';}
}
