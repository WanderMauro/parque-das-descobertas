(() => {
  'use strict';
  const KEY = 'parque-descobertas-ultimate-v1';
  const $ = (s, r = document) => r.querySelector(s);
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const data = Object.assign({ stars: {}, badges: [], narrate: true, volume: .6, calm: false, streak: 0 }, load());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} };
  const LV = [['easy', 'Fácil', '🌱'], ['medium', 'Médio', '🎡'], ['hard', 'Difícil', '🎯']];
  const BADGES = [
    ['first', '🎉', 'Primeira descoberta', 'Conclua 1 atividade', d => total(d) >= 1],
    ['ten', '🎈', 'Explorador', 'Conclua 10 atividades', d => total(d) >= 10],
    ['all', '🏆', 'Mestre do Parque', 'Conclua 60 atividades', d => total(d) >= 60],
    ['perfect', '💎', 'Sem errar!', 'Acerte de primeira', d => Object.values(d.stars).includes(3)],
    ['streak', '🔥', 'Em chamas', '3 acertos perfeitos seguidos', d => d.streak >= 3],
    ['lvl', '🎖️', 'Nível completo', 'Termine os 20 desafios de um nível', d => LV.some(l => count(d, l[0]) >= 20)]
  ];
  const sum = d => Object.values(d.stars).reduce((a, b) => a + b, 0);
  const total = d => Object.keys(d.stars).length;
  const count = (d, lv) => Object.keys(d.stars).filter(k => k.endsWith('-' + lv)).length;
  let mistakes = 0, ctx;

  // ---------- sons ----------
  const muted = () => !!$('.sound-off');
  addEventListener('pd:soundchange', e => {
    if (e.detail && e.detail.enabled === false && ctx) {
      const oldContext = ctx; ctx = null;
      try { oldContext.close(); } catch (error) {}
    }
  });
  function tone(f, t0, dur, type = 'triangle', vol = .12) {
    if (muted()) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + t0;
      o.type = type; o.frequency.setValueAtTime(f, t); o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol * data.volume + .0002, t + .02);
      g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.start(t); o.stop(t + dur + .02);
    } catch (e) {}
  }
  const oops = () => { tone(300, 0, .16, 'sine'); tone(220, .12, .22, 'sine'); };
  const fanfare = n => [523, 659, 784, 1047].slice(0, n + 1).forEach((f, i) => tone(f, .35 + i * .12, .3, 'triangle', .1));

  // ---------- confete ----------
  function confetti() {
    if (data.calm || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const c = document.createElement('canvas'); c.id = 'pd-confetti'; document.body.append(c);
    const g = c.getContext('2d'), W = c.width = innerWidth, H = c.height = innerHeight;
    const cols = ['#f2a93b', '#e86f4f', '#7ed957', '#57c3e4', '#c58be8', '#ffd84d'];
    const ps = Array.from({ length: 110 }, () => ({ x: W / 2 + (Math.random() - .5) * 200, y: H * .55, vx: (Math.random() - .5) * 14, vy: -Math.random() * 15 - 5, s: 6 + Math.random() * 8, r: Math.random() * 6, c: cols[Math.random() * cols.length | 0] }));
    let f = 0;
    (function tick() {
      g.clearRect(0, 0, W, H);
      ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += .2; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
      if (++f < 110) requestAnimationFrame(tick); else c.remove();
    })();
  }

  // ---------- medalhas ----------
  let medal; function showMedal(txt) {
    medal = medal || Object.assign(document.createElement('div'), { className: 'pd-medal', role: 'status' }); document.body.append(medal);
    medal.textContent = txt; requestAnimationFrame(() => medal.classList.add('show'));
    clearTimeout(medal._t); medal._t = setTimeout(() => medal.classList.remove('show'), 3200);
  }
  function checkBadges() {
    const fresh = BADGES.filter(b => !data.badges.includes(b[0]) && b[4](data));
    fresh.forEach((b, i) => { data.badges.push(b[0]); setTimeout(() => showMedal(`${b[1]} Nova conquista: ${b[2]}!`), 1400 + i * 3400); });
  }

  // ---------- eventos do jogo ----------
  let activityNarrationTimer = null, mistakeSpeechTimer = null, completedSpeechTimer = null, hintFeedbackTimer = null;
  function cancelDelayedSpeech() {
    [activityNarrationTimer, mistakeSpeechTimer, completedSpeechTimer, hintFeedbackTimer].forEach(timer => { if (timer !== null) clearTimeout(timer); });
    activityNarrationTimer = mistakeSpeechTimer = completedSpeechTimer = hintFeedbackTimer = null;
  }
  addEventListener('pd:open', () => {
    cancelDelayedSpeech();
    mistakes = 0;
    // Every new activity gets only one announcement. Stale timers are canceled on every change.
    if (data.narrate) activityNarrationTimer = setTimeout(() => {
      activityNarrationTimer = null;
      if (!data.narrate || !window.__pd || window.__pd.state.screen !== 'game') return;
      const button = $('[data-action="speak-activity"]');
      if (button) button.click();
    }, 350);
  });
  addEventListener('pd:mistake', () => {
    mistakes++; data.streak = 0;
    oops();
    if (mistakeSpeechTimer !== null) clearTimeout(mistakeSpeechTimer);
    mistakeSpeechTimer = setTimeout(() => {
      mistakeSpeechTimer = null;
      if (!window.__pd || window.__pd.state.screen !== 'game' || window.__pd.state.complete) return;
      tobi(rnd(NO), false);
      if (mistakes >= 2) showHint(false);
    }, 250);
  });
  addEventListener('pd:complete', e => {
    const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1, k = e.detail.key;
    data.stars[k] = Math.max(data.stars[k] || 0, stars);
    data.streak = stars === 3 ? data.streak + 1 : 0;
    save(); confetti(); fanfare(stars); checkBadges(); save();
    [activityNarrationTimer, mistakeSpeechTimer, hintFeedbackTimer].forEach(timer => { if (timer !== null) clearTimeout(timer); });
    activityNarrationTimer = mistakeSpeechTimer = hintFeedbackTimer = null;
    if (completedSpeechTimer !== null) clearTimeout(completedSpeechTimer);
    completedSpeechTimer = setTimeout(() => {
      completedSpeechTimer = null;
      if (!window.__pd || window.__pd.state.screen !== 'game' || !window.__pd.state.complete) return;
      tobi(rnd(YES), true);
    }, 700);
  });

  // ---------- modo pequenos leitores (5 a 7 anos) ----------
  const YES = ['Muito bem!', 'Isso mesmo!', 'Você é demais!', 'Uau, que esperto!', 'Arrasou!', 'Parabéns!'];
  const NO = ['Quase! Tente de Novo!', 'Ops! Olhe com calma.', 'Vamos tentar outra vez!', 'Você consegue!'];
  const rnd = a => a[Math.random() * a.length | 0];
  let bubble;
  function tobi(txt, good) {
    bubble = bubble || Object.assign(document.createElement('div'), { className: 'pd-tobi', role: 'status' });
    bubble.innerHTML = `<img src="assets/img/ilustracoes/tobi.webp" alt=""><span></span>`; $('span', bubble).textContent = txt;
    bubble.classList.toggle('bad', !good); document.body.append(bubble);
    requestAnimationFrame(() => bubble.classList.add('show')); clearTimeout(bubble._t); bubble._t = setTimeout(() => bubble.classList.remove('show'), 2600);
    const voiceBusy = !!(window.__pd && typeof window.__pd.isNarrating === 'function' && window.__pd.isNarrating());
    if (data.narrate && window.__pd && !voiceBusy) window.__pd.say(txt);
  }
  function hintTarget() {
    const P = window.__pd; if (!P) return null; const l = P.lvl(), a = P.act(); let q = [];
    if (typeof l.correct === 'number') q.push(`[data-option-index="${l.correct}"]`, `[data-plate-index="${l.correct}"]`, `[data-mole-index="${l.correct}"]`, `[data-emotion-piece="${l.correct}"]`, `[data-word-option="${l.correct}"]`);
    if (l.syllables) q.push(`[data-syllable-count="${l.syllables}"]`);
    if (l.targets) { const t = l.targets.find(x => x.correct && !(P.state.mechanic.found || []).includes(x.id)); if (t) q.push(`[data-target-id="${t.id}"]`); }
    if (l.foods) { const f = l.foods.find(x => x[2] && !(P.state.mechanic.fed || []).includes(x[1])); if (f) q.push(`[data-food-name="${f[1]}"]`); }
    if (l.points) q.push(`[data-dot-index="${P.state.mechanic.nextDot}"]`);
    if (l.regions) { const r = l.regions.find(x => P.state.mechanic.painted[x.id] !== x.correct); if (r) q.push(`[data-region-id="${r.id}"]`); }
    if (l.cards) { const i = l.cards.findIndex((c, n) => c.key === l.targetKey && !P.state.mechanic.matched.includes(n)); if (i > -1) q.push(`[data-memory-index="${i}"]`); }
    if (l.correctMap) { const id = Object.keys(l.correctMap).find(k => $(`[data-item-id="${k}"]`)); if (id) q.push(`[data-item-id="${id}"]`); }
    return q.length ? $(q.join(','), app) : null;
  }
  function showHint(say) {
    document.querySelectorAll('.pd-hint').forEach(e => e.classList.remove('pd-hint'));
    const el = hintTarget(); if (el) { el.classList.add('pd-hint'); el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); setTimeout(() => el.classList.remove('pd-hint'), 4500); }
    if (say) tobi('Olhe aqui! Eu te ajudo.', true);
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-action="hint"]'); if (b) { if (hintFeedbackTimer !== null) clearTimeout(hintFeedbackTimer); hintFeedbackTimer = setTimeout(() => { hintFeedbackTimer = null; if (window.__pd && window.__pd.state.screen === 'game') showHint(false); }, 30); } }, true);

  // ---------- narração automática ----------
  const app = $('#app');
  new MutationObserver(() => {
    const fab = $('#pd-fab'); if (fab) $('b', fab).textContent = total(data);
  }).observe(app, { childList: true, subtree: true });

  // ---------- painel do explorador ----------
  const ov = document.createElement('div'); ov.id = 'pd-overlay'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Painel do explorador');
  const fab = document.createElement('button'); fab.id = 'pd-fab'; fab.type = 'button'; fab.setAttribute('aria-label', 'Abrir painel do explorador'); fab.innerHTML = '🏅 <b>0</b> <span>Painel</span>';
  function panel() {
    ov.innerHTML = `<div class="pd-card"><button class="pd-close" aria-label="Fechar">✕</button>
      <h2>🧭 Painel do Explorador</h2><p><strong>${total(data)}</strong> de 60 desafios concluídos</p>
      <h3>Progresso</h3><div class="pd-bars">${LV.map(l => { const c = count(data, l[0]); return `<div class="pd-bar"><span>${l[2]} ${l[1]}</span><div class="pd-track"><i style="width:${c * 5}%"></i></div><span>${c}/20</span></div>`; }).join('')}</div>
      <h3>Conquistas</h3><div class="pd-badges">${BADGES.map(b => `<div class="pd-badge ${data.badges.includes(b[0]) ? '' : 'off'}"><b>${b[1]}</b>${b[2]}<br><small>${b[3]}</small></div>`).join('')}</div>
      <h3>Ajustes</h3>
      <label class="pd-row"><span class="pd-row-label">🗣️ Tobi fala tudo em voz alta</span><input type="checkbox" id="pd-nar" ${data.narrate ? 'checked' : ''}></label>
      <label class="pd-row"><span class="pd-row-label">🎵 Volume da música e das falas</span><input type="range" id="pd-vol" min="0" max="1" step=".05" value="${data.volume}"></label>
      <label class="pd-row"><span class="pd-row-label">🐢 Animações mais lentas</span><input type="checkbox" id="pd-calm" ${data.calm ? 'checked' : ''}></label>
      <button class="pd-danger" id="pd-reset">Apagar progresso</button></div>`;
    $('.pd-close', ov).onclick = close;
    $('#pd-nar', ov).onchange = e => { data.narrate = e.target.checked; save(); };
    $('#pd-vol', ov).oninput = e => { data.volume = +e.target.value; applyVol(); save(); };
    $('#pd-calm', ov).onchange = e => { data.calm = e.target.checked; document.body.classList.toggle('pd-calm', data.calm); save(); };
    $('#pd-reset', ov).onclick = () => { if (confirm('Apagar todas as estrelas, conquistas e o progresso?')) { data.stars = {}; data.badges = []; data.streak = 0; save(); window.__pd && window.__pd.reset(); close(); } };
  }
  const applyVol = () => {
    if (!window.__pd) return;
    if (typeof window.__pd.setVolume === 'function') window.__pd.setVolume(data.volume);
    else window.__pd.bgMusic.volume = Math.min(1, data.volume);
  };
  const open = () => { panel(); ov.classList.add('open'); $('.pd-close', ov).focus(); };
  const close = () => { ov.classList.remove('open'); fab.focus(); };
  fab.onclick = open;
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && ov.classList.contains('open')) close(); });
  document.body.append(fab, ov);
  $('b', fab).textContent = total(data); applyVol(); document.body.classList.toggle('pd-calm', data.calm);

  // ---------- offline / instalável (requer http/https) ----------
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('./sw.js').catch(() => {});
})();
