/* Vaivén · registro de agua y recordatorios
   Se carga después del script principal y se engancha a sus funciones. */
(function () {
  const VASO = 250;
  let aguaCfg = Object.assign({ ini: '09:00', fin: '21:00', cada: 120, sonido: true }, ls.get('vaiven.aguaCfg', {}));
  KIND_LABEL.water = 'Agua';

  /* ---------- datos ---------- */
  // EFSA: ingesta adecuada de agua total 2,5 L (hombres) y 2,0 L (mujeres); ~20% viene de la comida
  const metaDefault = () => { const pf = perfil(); return pf && pf.sexo === 'm' ? 1600 : 2000; };
  const aguaMeta = () => { const pf = perfil(); return pf && num(pf.aguaMeta) > 0 ? num(pf.aguaMeta) : metaDefault(); };
  const delDia = d => Store.of('water').filter(w => w.date === d).sort(byTime);
  const mlDia = d => delDia(d).reduce((s, w) => s + num(w.ml), 0);
  const litros = ml => (Math.round(ml / 100) / 10).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const hm2m = s => { const m = String(s || '').match(/^(\d{1,2}):(\d{2})$/); return m ? +m[1] * 60 + +m[2] : null; };
  const m2hm = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  function horarios() {
    const a = hm2m(aguaCfg.ini) ?? 540, b = hm2m(aguaCfg.fin) ?? 1260, c = Math.max(30, Math.min(240, +aguaCfg.cada || 120));
    const out = []; for (let m = a; m <= b && out.length < 24; m += c) out.push(m2hm(m)); return out;
  }
  const icsUrl = () => getCfg().url + '?ics=agua&ini=' + encodeURIComponent(aguaCfg.ini) + '&fin=' + encodeURIComponent(aguaCfg.fin) + '&cada=' + (+aguaCfg.cada || 120);

  /* ---------- tarjeta en Hoy ---------- */
  function semana(meta) {
    const t = today(); const W = 300, H = 74, B = 16, T = 6; const bw = W / 7;
    const vals = []; for (let i = 6; i >= 0; i--) { const d = addDays(t, -i); vals.push([d, mlDia(d)]); }
    const top = Math.max(meta * 1.25, ...vals.map(v => v[1]), 500);
    const Y = v => T + (H - B - T) * (1 - v / top);
    let s = `<line x1="0" x2="${W}" y1="${Y(meta).toFixed(1)}" y2="${Y(meta).toFixed(1)}" stroke="var(--ink)" stroke-width="1" stroke-dasharray="4 3"/><text x="0" y="${(Y(meta) - 3).toFixed(1)}" class="sub">meta</text>`;
    vals.forEach(([d, v], i) => {
      const x = i * bw + 5, w = bw - 10;
      if (v > 0) { const y = Y(v), r = Math.min(4, (Y(0) - y)); s += `<path d="M${x} ${Y(0)} V${(y + r).toFixed(1)} Q${x} ${y.toFixed(1)} ${x + r} ${y.toFixed(1)} H${x + w - r} Q${x + w} ${y.toFixed(1)} ${x + w} ${(y + r).toFixed(1)} V${Y(0)} Z" fill="${v >= meta ? 'var(--teal)' : 'var(--agua-soft)'}"><title>${fmtShort(d)}: ${litros(v)} L</title></path>`; }
      s += `<text x="${(i * bw + bw / 2).toFixed(1)}" y="${H - 3}" text-anchor="middle" class="${d === t ? 'selx' : ''}">${DIAS3[parseD(d).getDay()]}</text>`;
    });
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Agua de los últimos 7 días">${s}</svg>`;
  }
  function aguaCard() {
    const t = today(); const ml = mlDia(t); const meta = aguaMeta(); const pct = Math.min(1, ml / meta);
    const lista = delDia(t); const ult = lista[lista.length - 1];
    const tragos = Store.of('meal').filter(m => m.date === t).reduce((s, m) => s + num(m.alcohol), 0);
    const C = 2 * Math.PI * 30;
    const prox = horarios().find(h => h > nowHM());
    return `<article class="card aguacard" id="aguaCard">
      <div class="spread"><span class="label">Agua</span><span class="small muted tabular">meta ${litros(meta)} L</span></div>
      <div class="agua-main">
        <svg class="ring" viewBox="0 0 76 76" role="img" aria-label="${litros(ml)} de ${litros(meta)} litros"><circle cx="38" cy="38" r="30" fill="none" stroke="var(--surface-2)" stroke-width="9"/><circle cx="38" cy="38" r="30" fill="none" stroke="var(--teal)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(C * pct).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 38 38)"/><text x="38" y="37" text-anchor="middle" class="ringv">${litros(ml)}</text><text x="38" y="50" text-anchor="middle" class="ringu">litros</text></svg>
        <div class="agua-btns">
          <button class="btn" data-agua="${VASO}">+ 1 vaso <span class="small" style="opacity:.8">250 ml</span></button>
          <button class="btn ghost" data-agua="500">+ botella 500 ml</button>
          <div class="row small" style="gap:4px 14px"><button class="linkbtn" data-agua-otro>Otra cantidad</button>${ult ? `<button class="linkbtn" data-agua-undo="${esc(ult.id)}">Deshacer ${esc(ult.ml)} ml de las ${esc(fixHM(ult.hora))}</button>` : ''}</div>
        </div>
      </div>
      <p class="small ${ml >= meta ? '' : 'muted'}">${ml >= meta ? 'Llegaste a tu meta de hoy. Bien hecho.' : `Te faltan unos ${Math.ceil((meta - ml) / VASO)} vasos para tu meta.`}${prox && aguaCfg.sonido ? ` Próximo recordatorio: ${prox}.` : ''}</p>
      ${tragos ? `<p class="small notice">Hoy registraste ${tragos} trago${tragos === 1 ? '' : 's'} con alcohol: suma un vaso de agua por cada uno.</p>` : ''}
      ${semana(meta)}
      <details class="aguarec"><summary>Recordatorios y meta</summary>
        <div class="f" style="padding-top:10px">
          <div class="grid3">${fld('agIni', 'Desde', `<input type="time" id="agIni" value="${esc(aguaCfg.ini)}">`)}${fld('agFin', 'Hasta', `<input type="time" id="agFin" value="${esc(aguaCfg.fin)}">`)}${fld('agCada', 'Cada', sel('agCada', [[60, '1 hora'], [90, '1 h 30'], [120, '2 horas'], [180, '3 horas']], aguaCfg.cada))}</div>
          <p class="small muted">Horarios: ${horarios().join(' · ')}</p>
          <a class="btn sun" href="${esc(icsUrl())}" target="_blank" rel="noopener">${svg('plus')}Agregar al calendario del iPhone</a>
          <p class="small muted">Se abre una invitación de calendario: toca «Agregar todo». El iPhone te avisará con sonido a esas horas todos los días, aunque Vaivén esté cerrada. Si cambias los horarios, borra los eventos antiguos «Vaivén: toma un vaso de agua» en Calendario (eliminar todos los futuros) y agrégalos de nuevo.</p>
          <label class="row small" style="gap:8px"><input type="checkbox" id="agSon" ${aguaCfg.sonido ? 'checked' : ''}> Además, sonar dentro de la app si está abierta a esa hora</label>
          <div class="row">${fld('agMeta', 'Meta diaria (litros)', `<input type="number" inputmode="decimal" step="0.1" min="0.5" max="6" id="agMeta" value="${String(meta / 1000).replace(',', '.')}" style="width:110px">`)}<button class="btn sm ghost" data-agua-meta style="align-self:flex-end">Guardar meta</button></div>
          <p class="small muted">La EFSA (autoridad europea de seguridad alimentaria) estima que un hombre adulto necesita unos 2,5 L de agua al día y una mujer unos 2,0 L, contando el agua de la comida (cerca de un 20%). Por eso la meta parte en ${litros(metaDefault())} L de bebidas. Infusiones y agua con sabor sin azúcar también cuentan; con calor, ejercicio o alcohol conviene tomar más.</p>
        </div>
      </details>
    </article>`;
  }

  /* ---------- engancharse al render ---------- */
  const _render = render;
  render = function () {
    _render();
    if (tab === 'hoy' && Store.mode !== 'config') { const st = document.querySelector('#main .stats'); if (st) st.insertAdjacentHTML('afterend', aguaCard()); }
  };

  /* ---------- acciones ---------- */
  async function sumar(ml, extra = {}) {
    await Store.add({ kind: 'water', date: extra.date || today(), hora: extra.hora || nowHM(), ml });
    toast(`+${ml} ml de agua`);
  }
  document.getElementById('main').addEventListener('click', async e => {
    const a = e.target.closest('[data-agua]');
    if (a) { a.disabled = true; try { await sumar(+a.dataset.agua); } catch { a.disabled = false; toast('No se pudo guardar. Revisa tu conexión.'); } return; }
    const u = e.target.closest('[data-agua-undo]');
    if (u) { u.disabled = true; try { await Store.remove(u.dataset.aguaUndo); toast('Listo, lo quité'); } catch { u.disabled = false; } return; }
    if (e.target.closest('[data-agua-otro]')) {
      openSheet('Registrar agua', `<form class="f">
        <div class="grid3">${fld('date', 'Fecha', `<input type="date" id="date" name="date" value="${today()}" required>`)}${fld('hora', 'Hora', `<input type="time" id="hora" name="hora" value="${nowHM()}">`)}${fld('ml', 'Cantidad (ml)', `<input type="number" inputmode="numeric" min="50" max="3000" step="50" id="ml" name="ml" value="${VASO}" required>`)}</div>
        <button class="btn" type="submit">Guardar</button></form>`,
        ov => formBind(ov, d => sumar(Math.round(num(d.ml)), { date: d.date, hora: fixHM(d.hora) })));
      return;
    }
    if (e.target.closest('[data-agua-meta]')) {
      const v = num($('#agMeta').value); if (v < 0.5 || v > 6) { toast('La meta debe estar entre 0,5 y 6 litros'); return; }
      const pf = perfil(); const ml = Math.round(v * 1000);
      try { if (pf) await Store.update(pf.id, { aguaMeta: ml }); else await Store.add({ kind: 'profile', aguaMeta: ml }); toast('Meta guardada'); } catch { toast('No se pudo guardar. Revisa tu conexión.'); }
    }
  });
  document.addEventListener('change', e => {
    const id = e.target.id;
    if (id === 'agIni' || id === 'agFin' || id === 'agCada' || id === 'agSon') {
      if (id === 'agIni' && isTime(e.target.value)) aguaCfg.ini = fixHM(e.target.value);
      if (id === 'agFin' && isTime(e.target.value)) aguaCfg.fin = fixHM(e.target.value);
      if (id === 'agCada') aguaCfg.cada = +e.target.value;
      if (id === 'agSon') aguaCfg.sonido = e.target.checked;
      ls.set('vaiven.aguaCfg', aguaCfg);
      const det = document.querySelector('.aguarec'); const open = det && det.open;
      render();
      const det2 = document.querySelector('.aguarec'); if (det2 && open) det2.open = true;
    }
  });

  /* ---------- sonido con la app abierta ---------- */
  let ctx = null;
  const prepAudio = () => { try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); } catch {} };
  document.addEventListener('pointerdown', prepAudio, { passive: true });
  function gota() {
    if (!ctx) return;
    const t0 = ctx.currentTime;
    [[880, 0], [1320, 0.16], [990, 0.34]].forEach(([f, d]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(f, t0 + d); o.frequency.exponentialRampToValueAtTime(f * 0.75, t0 + d + 0.18);
      g.gain.setValueAtTime(0.0001, t0 + d); g.gain.exponentialRampToValueAtTime(0.25, t0 + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.22);
      o.connect(g).connect(ctx.destination); o.start(t0 + d); o.stop(t0 + d + 0.25);
    });
  }
  function aviso() {
    gota();
    const old = document.getElementById('aguaAviso'); if (old) old.remove();
    const el = document.createElement('div'); el.id = 'aguaAviso'; el.className = 'aguaaviso'; el.setAttribute('role', 'alert');
    el.innerHTML = `<span>Hora de un vaso de agua</span><button class="btn sm" data-av="250">+ 1 vaso</button><button class="iconbtn" data-av="x" aria-label="Cerrar">${svg('x')}</button>`;
    el.addEventListener('click', async ev => { const b = ev.target.closest('[data-av]'); if (!b) return; el.remove(); if (b.dataset.av !== 'x') { try { await sumar(VASO); } catch {} } });
    document.body.append(el); setTimeout(() => el.isConnected && el.remove(), 60000);
  }
  setInterval(() => {
    if (!aguaCfg.sonido || document.visibilityState !== 'visible' || Store.mode === 'config') return;
    const now = nowHM(); if (!horarios().includes(now)) return;
    const key = today() + ' ' + now; if (ls.get('vaiven.aguaUlt', '') === key) return;
    ls.set('vaiven.aguaUlt', key); aviso();
  }, 20000);

  /* ---------- chat e IA ---------- */
  const _aiJSON = aiJSON;
  aiJSON = function (prompt, images) {
    if (typeof prompt === 'string' && prompt.includes('{"tipo_registro":"med"')) prompt = prompt.replace('{"tipo_registro":"med"', '{"tipo_registro":"water","fecha":"...","hora":"HH:MM","ml":número (un vaso ≈ 250, una botella chica ≈ 500)}\n{"tipo_registro":"med"');
    return _aiJSON(prompt, images);
  };
  const _norm = normEntry;
  normEntry = function (r) {
    if (r && (r.tipo_registro === 'water' || r.kind === 'water')) {
      const ml = Math.round(num(r.ml)); if (ml <= 0 || ml > 5000) return null;
      const t = today(); const date = isDate(r.fecha) ? r.fecha : t;
      return { kind: 'water', date, hora: isTime(r.hora) ? fixHM(r.hora) : (date === t ? nowHM() : ''), ml };
    }
    return _norm(r);
  };
  const _desc = describeEntry;
  describeEntry = e => e.kind === 'water' ? `${e.hora ? e.hora + ' ' : ''}${e.ml} ml de agua` : _desc(e);
  const _hist = historySummary;
  historySummary = function (days = 7) {
    const t = today(); const l = [];
    for (let i = days - 1; i >= 0; i--) { const d = addDays(t, -i); const v = mlDia(d); if (v) l.push(`- ${d}: ${litros(v)} L`); }
    return _hist(days) + `\nAGUA (meta ${litros(aguaMeta())} L/día):\n` + (l.length ? l.join('\n') : '- (sin registros)');
  };

  /* ---------- estilos ---------- */
  const css = document.createElement('style');
  css.textContent = `
  :root{--agua-soft:#9CCFD0}
  @media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--agua-soft:#2E6E70}}
  :root[data-theme="dark"]{--agua-soft:#2E6E70}
  .agua-main{display:flex;gap:16px;align-items:center}
  .ring{width:96px;height:96px;flex:none}
  .ring .ringv{font-family:var(--display);font-weight:800;font-size:17px;fill:var(--ink)}
  .ring .ringu{font-size:9px;fill:var(--muted)}
  .agua-btns{display:flex;flex-direction:column;gap:8px;min-width:0;flex:1}
  .agua-btns .btn{justify-content:center}
  .linkbtn{border:0;background:none;padding:4px 0;color:var(--teal);font-weight:700;cursor:pointer;text-align:left}
  .aguarec summary{cursor:pointer;font-weight:700;color:var(--teal);list-style:none}
  .aguarec summary::-webkit-details-marker{display:none}
  .aguarec summary::before{content:"+ "}
  .aguarec[open] summary::before{content:"– "}
  .aguarec a.btn{text-decoration:none;align-self:flex-start}
  .aguaaviso{position:fixed;left:50%;transform:translateX(-50%);top:calc(12px + env(safe-area-inset-top,0px));z-index:70;background:var(--surface);color:var(--ink);border:2px solid var(--teal);border-radius:16px;padding:8px 8px 8px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 24px rgba(0,0,0,.2);font-weight:700;max-width:calc(100% - 32px)}
  `;
  document.head.append(css);
  render();
})();
