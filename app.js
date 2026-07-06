const MATCH_DATE = '2026-07-11T23:00:00+02:00';
const $ = id => document.getElementById(id);
let currentQuiz = [];
function init(){
  setTimeout(() => $('loader')?.classList.add('hide'), 650);
  fillScorers(); tick(); setInterval(tick, 1000);
  renderContent(); initQuiz(); initPrediction(); initCookie();
  $('newQuiz').onclick = initQuiz; $('checkQuiz').onclick = checkQuiz;
  $('closeCelebration').onclick = () => $('celebration').classList.remove('show');
}
function tick(){
  const target = new Date(MATCH_DATE); let diff = Math.max(0, target - new Date());
  const d = Math.floor(diff/864e5); diff %= 864e5; const h = Math.floor(diff/36e5); diff %= 36e5; const m = Math.floor(diff/6e4); diff %= 6e4; const s = Math.floor(diff/1000);
  $('countdown').innerHTML = [d,h,m,s].map(v => `<span>${String(v).padStart(2,'0')}</span>`).join('');
  $('dashCountdown').textContent = `${d} days ${h}h ${m}m`;
  $('kickoffLocal').textContent = 'Kick-off in your local time: ' + target.toLocaleString([], { dateStyle:'full', timeStyle:'short' });
}
function renderContent(){
  const c = ENGLAND_CONTENT;
  const day = new Date().getDate();
  $('factText').textContent = c.facts[day % c.facts.length];
  $('onThisDay').textContent = c.onThisDay[day % c.onThisDay.length];
  const legend = c.legends[Math.floor(Math.random()*c.legends.length)];
  $('legendCard').innerHTML = `<div class="legend-icon">${legend.icon}</div><div><h3>${legend.name}</h3><p>${legend.text}</p></div>`;
  $('recordsGrid').innerHTML = c.records.map(r => `<article><b>${r[0]}</b><span>${r[1]}</span></article>`).join('');
  $('hostGrid').innerHTML = c.hosts.map(h => `<article><b>${h[0]}</b><span>${h[1]}</span><small>${h[2]}</small></article>`).join('');
  $('timeline').innerHTML = c.timeline.map(t => `<div><b>${t[0]}</b><span>${t[1]}</span></div>`).join('');
}
function fillScorers(){ ENGLAND_CONTENT.scorers.forEach(x => $('firstScorer').add(new Option(x,x))); }
function initPrediction(){
  const saved = JSON.parse(localStorage.getItem('eng_wc_prediction') || 'null');
  if(saved){ $('engScore').value = saved.eng; $('norScore').value = saved.nor; $('firstScorer').value = saved.scorer; }
  ['engScore','norScore','firstScorer'].forEach(id => $(id).addEventListener('input', () => updatePrediction()));
  $('savePrediction').onclick = () => { localStorage.setItem('eng_wc_prediction', JSON.stringify(getPrediction())); updatePrediction('Saved. '); };
  $('copyPrediction').onclick = async () => { const d = getPrediction(); const t = `My prediction: England ${d.eng}-${d.nor} Norway. First England scorer: ${d.scorer}.`; try{ await navigator.clipboard.writeText(t); $('predictionSummary').textContent = 'Copied: ' + t; } catch { $('predictionSummary').textContent = t; } };
  updatePrediction();
}
function getPrediction(){ return { eng: Math.max(0, Number($('engScore').value || 0)), nor: Math.max(0, Number($('norScore').value || 0)), scorer: $('firstScorer').value }; }
function updatePrediction(prefix=''){ const d = getPrediction(); $('predictionSummary').textContent = `${prefix}You predicted: England ${d.eng}-${d.nor} Norway | First England scorer: ${d.scorer}.`; }
function initQuiz(){
  const pool = [...WORLD_CUP_QUIZ].sort(() => Math.random() - .5);
  const legend = pool.find(q => q.difficulty === 'Legend');
  const hard = pool.find(q => q.difficulty === 'Hard' && q !== legend);
  const medium = pool.find(q => q.difficulty === 'Medium' && q !== legend && q !== hard);
  currentQuiz = [medium, hard, legend].filter(Boolean).sort(() => Math.random() - .5);
  $('quizResult').textContent = '';
  $('quizContainer').innerHTML = currentQuiz.map((q,i) => `<div class="question" data-i="${i}"><div class="q-head"><strong>${i+1}. ${q.question.replace(/\s+#\d+$/,'')}</strong><span class="badge">${q.difficulty}</span></div><div class="options">${q.options.map((o,j) => `<label class="option"><input type="radio" name="q${i}" value="${j}"><span>${o}</span></label>`).join('')}</div><p class="explanation">${q.explanation}</p></div>`).join('');
}
function checkQuiz(){
  let score = 0;
  document.querySelectorAll('.question').forEach((el,i) => {
    el.classList.add('reviewed'); const q = currentQuiz[i]; const chosen = el.querySelector('input:checked');
    el.querySelectorAll('.option').forEach((opt,j) => { opt.classList.toggle('correct', j === q.answer); opt.classList.toggle('wrong', chosen && Number(chosen.value) === j && j !== q.answer); });
    if(chosen && Number(chosen.value) === q.answer) score++;
  });
  $('quizResult').textContent = score === 3 ? 'Perfect score: 3/3.' : `You scored ${score}/3. Try another set.`;
  if(score === 3){ $('celebration').classList.add('show'); confetti(); }
}
function confetti(){
  for(let i=0;i<48;i++){ const p=document.createElement('i'); p.textContent=['🎉','🦁','⭐','🏆'][i%4]; p.style.cssText=`position:fixed;left:${Math.random()*100}vw;top:-25px;z-index:50;font-size:24px;transition:transform 2.2s ease,opacity 2.2s`; document.body.appendChild(p); requestAnimationFrame(()=>{p.style.transform=`translateY(105vh) rotate(${Math.random()*720}deg)`;p.style.opacity=0}); setTimeout(()=>p.remove(),2400); }
}
function initCookie(){ if(localStorage.getItem('cookie_ok')) $('cookie').classList.add('hide'); $('acceptCookie').onclick = () => { localStorage.setItem('cookie_ok','yes'); $('cookie').classList.add('hide'); }; }
document.addEventListener('DOMContentLoaded', init);
