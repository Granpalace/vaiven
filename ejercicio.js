/* Vaivén · dibujos de los ejercicios y check por ejercicio
   Se carga después del script principal. Cada dibujo es una figura de palitos
   que se mueve entre la posición inicial (A) y la final (B). */
(function () {
  /* ---------- poses ----------
     h cabeza · s hombros · p cadera · b curva de la espalda (opcional)
     arms: [[codo, mano], [codo, mano]] · legs: [[rodilla, talón, punta], ...]
     Suelo en y = 72; la figura mira a la derecha. */
  const stand = (x, arms) => ({ h: [x, 15], s: [x, 24], p: [x, 44], arms: arms || [[[x, 34], [x + 1, 43]], [[x, 34], [x + 1, 43]]], legs: [[[x + 1, 58], [x, 72], [x + 7, 72]], [[x + 1, 58], [x, 72], [x + 7, 72]]] });
  const hips = x => [[[x - 6, 33], [x - 2, 43]], [[x - 6, 33], [x - 2, 43]]];
  const L = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const chairL = L(27, 53, 42, 53) + L(27, 53, 27, 72) + L(41, 53, 41, 72) + L(27, 53, 27, 33);
  const walking = {
    A: { h: [52, 15], s: [51, 24], p: [50, 44], arms: [[[46, 33], [43, 41]], [[55, 33], [59, 41]]], legs: [[[54, 58], [58, 72], [64, 72]], [[46, 59], [40, 70], [45, 72]]] },
    B: { h: [52, 15], s: [51, 24], p: [50, 44], arms: [[[55, 33], [59, 41]], [[46, 33], [43, 41]]], legs: [[[46, 59], [40, 70], [45, 72]], [[54, 58], [58, 72], [64, 72]]] }
  };
  const FIG = {
    'Sentadilla a la silla': { props: chairL,
      A: { h: [50, 15], s: [49, 24], p: [47, 44], arms: [[[56, 26], [66, 26]], [[56, 26], [66, 26]]], legs: [[[49, 58], [50, 72], [57, 72]], [[49, 58], [50, 72], [57, 72]]] },
      B: { h: [57, 27], s: [52, 34], p: [40, 52], arms: [[[60, 34], [70, 33]], [[60, 34], [70, 33]]], legs: [[[54, 58], [50, 72], [57, 72]], [[54, 58], [50, 72], [57, 72]]] } },
    'Flexiones inclinadas': { props: L(70, 44, 96, 44) + L(72, 44, 72, 72) + L(94, 44, 94, 72),
      A: { h: [65, 30], s: [58, 36], p: [40, 50], arms: [[[65, 40], [72, 44]], [[65, 40], [72, 44]]], legs: [[[28, 61], [16, 70], [19, 72]], [[28, 61], [16, 70], [19, 72]]] },
      B: { h: [70, 37], s: [63, 42], p: [42, 55], arms: [[[60, 49], [72, 44]], [[60, 49], [72, 44]]], legs: [[[29, 63], [16, 70], [19, 72]], [[29, 63], [16, 70], [19, 72]]] } },
    'Puente de glúteos': {
      A: { h: [14, 66], s: [22, 68], p: [40, 68], arms: [[[31, 70], [40, 71]], [[31, 70], [40, 71]]], legs: [[[52, 59], [60, 72], [66, 72]], [[52, 59], [60, 72], [66, 72]]] },
      B: { h: [14, 66], s: [22, 68], p: [42, 57], arms: [[[31, 70], [40, 71]], [[31, 70], [40, 71]]], legs: [[[55, 58], [60, 72], [66, 72]], [[55, 58], [60, 72], [66, 72]]] } },
    'Nadador boca abajo': {
      A: { h: [86, 66], s: [78, 68], p: [56, 68], arms: [[[88, 71], [97, 71]], [[88, 71], [97, 71]]], legs: [[[42, 69], [28, 70], [24, 72]], [[42, 69], [28, 70], [24, 72]]] },
      B: { h: [86, 58], s: [78, 62], p: [56, 68], arms: [[[87, 59], [96, 56]], [[87, 59], [96, 56]]], legs: [[[42, 69], [28, 70], [24, 72]], [[42, 69], [28, 70], [24, 72]]] } },
    'Plancha': { hold: true,
      A: { h: [71, 53], s: [64, 56], p: [44, 62], arms: [[[64, 72], [76, 72]], [[64, 72], [76, 72]]], legs: [[[30, 66], [18, 70], [20, 72]], [[30, 66], [18, 70], [20, 72]]] } },
    'Elevación de talones': { props: L(72, 8, 72, 72),
      A: { h: [52, 15], s: [52, 24], p: [52, 44], arms: [[[60, 30], [71, 32]], [[60, 30], [71, 32]]], legs: [[[53, 58], [52, 72], [59, 72]], [[53, 58], [52, 72], [59, 72]]] },
      B: { h: [52, 10], s: [52, 19], p: [52, 39], arms: [[[60, 25], [71, 28]], [[60, 25], [71, 28]]], legs: [[[53, 53], [54, 67], [59, 72]], [[53, 53], [54, 67], [59, 72]]] } },
    'Zancada hacia atrás': {
      A: stand(50, hips(50)),
      B: { h: [44, 27], s: [44, 36], p: [44, 56], arms: [[[38, 45], [42, 55]], [[38, 45], [42, 55]]], legs: [[[56, 58], [56, 72], [63, 72]], [[36, 68], [24, 69], [29, 72]]] } },
    'Subir al escalón': { props: `<polyline points="52,72 52,64 84,64 84,72" fill="none"/>`,
      A: { h: [47, 15], s: [46, 24], p: [44, 44], arms: [[[46, 34], [47, 43]], [[46, 34], [47, 43]]], legs: [[[56, 50], [60, 64], [66, 64]], [[42, 58], [40, 72], [47, 72]]] },
      B: { h: [62, 7], s: [62, 16], p: [62, 36], arms: [[[62, 26], [63, 35]], [[62, 26], [63, 35]]], legs: [[[63, 50], [62, 64], [68, 64]], [[61, 50], [59, 64], [65, 64]]] } },
    'Bisagra de cadera': {
      A: stand(50, hips(50)),
      B: { h: [63, 31], s: [56, 35], p: [38, 47], arms: [[[46, 39], [40, 46]], [[46, 39], [40, 46]]], legs: [[[48, 59], [50, 72], [57, 72]], [[48, 59], [50, 72], [57, 72]]] } },
    'Perro-pájaro': {
      A: { h: [69, 50], s: [62, 54], p: [42, 58], arms: [[[62, 63], [62, 72]], [[62, 63], [62, 72]]], legs: [[[42, 72], [28, 72], [26, 72]], [[42, 72], [28, 72], [26, 72]]] },
      B: { h: [69, 50], s: [62, 54], p: [42, 58], arms: [[[62, 63], [62, 72]], [[72, 52], [82, 50]]], legs: [[[42, 72], [28, 72], [26, 72]], [[29, 58], [16, 58], [13, 58]]] } },
    'Plancha lateral': {
      A: { h: [69, 52], s: [62, 58], p: [44, 68], arms: [[[62, 72], [74, 72]], [[54, 57], [46, 63]]], legs: [[[30, 70], [16, 71], [16, 72]], [[30, 70], [16, 71], [16, 72]]] },
      B: { h: [69, 52], s: [62, 58], p: [43, 63], arms: [[[62, 72], [74, 72]], [[54, 54], [44, 58]]], legs: [[[29, 67], [16, 71], [16, 72]], [[29, 67], [16, 71], [16, 72]]] } },
    'Remo con toalla en la puerta': { props: L(84, 6, 84, 72) + `<rect x="79" y="38" width="5" height="4" rx="1" fill="none"/>`, anchor: [80, 40],
      A: { h: [40, 20], s: [44, 28], p: [53, 46], arms: [[[53, 32], [62, 35]], [[53, 32], [62, 35]]], legs: [[[59, 59], [64, 72], [70, 72]], [[59, 59], [64, 72], [70, 72]]] },
      B: { h: [50, 17], s: [52, 26], p: [57, 46], arms: [[[46, 35], [56, 34]], [[46, 35], [56, 34]]], legs: [[[61, 59], [64, 72], [70, 72]], [[61, 59], [64, 72], [70, 72]]] } },
    'Gato-vaca': {
      A: { h: [69, 47], s: [62, 54], p: [40, 54], b: [51, 62], arms: [[[62, 63], [62, 72]], [[62, 63], [62, 72]]], legs: [[[40, 72], [26, 72], [24, 72]], [[40, 72], [26, 72], [24, 72]]] },
      B: { h: [67, 61], s: [62, 54], p: [40, 54], b: [51, 40], arms: [[[62, 63], [62, 72]], [[62, 63], [62, 72]]], legs: [[[40, 72], [26, 72], [24, 72]], [[40, 72], [26, 72], [24, 72]]] } },
    'Rotación de tórax': { noFloor: true, note: 'Visto desde arriba',
      props: `<path d="M35 30 Q52 48 35 66" fill="none" stroke-dasharray="3 3"/>`,
      A: { h: [18, 46], s: [27, 48], p: [52, 50], arms: [[[27, 38], [27, 29]], [[27, 38], [27, 29]]], legs: [[[54, 36], [68, 36], [70, 36]], [[54, 36], [68, 36], [70, 36]]] },
      B: { h: [18, 46], s: [27, 48], p: [52, 50], arms: [[[27, 38], [27, 29]], [[27, 58], [27, 67]]], legs: [[[54, 36], [68, 36], [70, 36]], [[54, 36], [68, 36], [70, 36]]] } },
    'Apertura de cadera 90/90': { note: 'Visto de frente',
      A: { h: [50, 31], s: [50, 40], p: [50, 60], arms: [[[42, 52], [36, 64]], [[58, 52], [64, 64]]], legs: [[[34, 64], [40, 72], [42, 72]], [[38, 58], [26, 66], [24, 67]]] },
      B: { h: [50, 31], s: [50, 40], p: [50, 60], arms: [[[42, 52], [36, 64]], [[58, 52], [64, 64]]], legs: [[[66, 64], [60, 72], [58, 72]], [[62, 58], [74, 66], [76, 67]]] } },
    'Equilibrio en un pie': { props: L(66, 30, 66, 72) + L(66, 53, 82, 53) + L(82, 53, 82, 72),
      A: { h: [50, 15], s: [50, 24], p: [50, 44], arms: [[[57, 30], [65, 32]], [[50, 34], [51, 43]]], legs: [[[51, 58], [50, 72], [57, 72]], [[51, 58], [50, 72], [57, 72]]] },
      B: { h: [50, 15], s: [50, 24], p: [50, 44], arms: [[[57, 30], [65, 32]], [[50, 34], [51, 43]]], legs: [[[51, 58], [50, 72], [57, 72]], [[63, 46], [60, 58], [64, 59]]] } },
    'Caminar talón-punta': { props: `<line x1="20" y1="74" x2="86" y2="74" stroke-dasharray="2 3"/>`,
      A: { h: [47, 15], s: [47, 24], p: [47, 44], arms: [[[42, 31], [35, 33]], [[52, 31], [59, 33]]], legs: [[[45, 58], [42, 72], [49, 72]], [[50, 58], [49, 72], [56, 72]]] },
      B: { h: [53, 15], s: [53, 24], p: [53, 44], arms: [[[48, 31], [41, 33]], [[58, 31], [65, 33]]], legs: [[[55, 58], [56, 72], [63, 72]], [[51, 58], [49, 72], [56, 72]]] } },
    'Estiramiento de pantorrilla e isquios': { hold: true, props: L(74, 8, 74, 72),
      A: { h: [64, 26], s: [58, 32], p: [44, 48], arms: [[[66, 31], [73, 29]], [[66, 31], [73, 29]]], legs: [[[35, 60], [26, 72], [33, 72]], [[55, 56], [58, 72], [65, 72]]] } },
    'Calentar caminando suave': Object.assign({ dur: 2.4 }, walking),
    'Caminata a buen ritmo': Object.assign({ dur: 1.2 }, walking),
    'Volver a la calma': Object.assign({ dur: 2.4 }, walking)
  };

  /* ---------- dibujo ---------- */
  const r1 = n => Math.round(n * 10) / 10;
  function partes(P, anchor) {
    const [hx, hy] = P.h, [sx, sy] = P.s, [px, py] = P.p;
    const b = P.b || [(sx + px) / 2, (sy + py) / 2];
    const dx = sx - hx, dy = sy - hy, d = Math.hypot(dx, dy) || 1;
    const lines = [[sx, sy, hx + dx / d * 5, hy + dy / d * 5]];
    P.arms.forEach(([e, w]) => { lines.push([sx, sy, e[0], e[1]], [e[0], e[1], w[0], w[1]]); });
    P.legs.forEach(([k, f, t]) => { t = t || [f[0] + 6, f[1]]; lines.push([px, py, k[0], k[1]], [k[0], k[1], f[0], f[1]], [f[0], f[1], t[0], t[1]]); });
    if (anchor) lines.push([P.arms[0][1][0], P.arms[0][1][1], anchor[0], anchor[1]]);
    return { lines: lines.map(l => l.map(r1)), torso: `M${r1(sx)} ${r1(sy)} Q${r1(b[0])} ${r1(b[1])} ${r1(px)} ${r1(py)}`, head: [hx, hy] };
  }
  const reduce = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
  function marco(def, P, anim) {
    const A = partes(P, def.anchor), B = anim ? partes(def.B, def.anchor) : null;
    const dur = (def.dur || 2.8) + 's';
    const an = (attr, a, b) => a === b ? '' : `<animate attributeName="${attr}" values="${a};${b};${a}" keyTimes="0;0.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" dur="${dur}" repeatCount="indefinite"/>`;
    let s = '';
    A.lines.forEach((l, i) => {
      const anchorLine = def.anchor && i === A.lines.length - 1;
      const cls = anchorLine ? ' class="cuerda"' : '';
      if (!B) { s += `<line${cls} x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}"/>`; return; }
      const m = B.lines[i];
      s += `<line${cls} x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}">${an('x1', l[0], m[0])}${an('y1', l[1], m[1])}${an('x2', l[2], m[2])}${an('y2', l[3], m[3])}</line>`;
    });
    s += `<path d="${A.torso}" fill="none">${B ? an('d', A.torso, B.torso) : ''}</path>`;
    s += `<circle r="5" cx="${A.head[0]}" cy="${A.head[1]}" class="cabeza">${B ? an('cx', A.head[0], B.head[0]) + an('cy', A.head[1], B.head[1]) : ''}</circle>`;
    return s;
  }
  function figura(nombre, cuadro) {
    const def = FIG[nombre]; if (!def) return '';
    const base = `${def.noFloor ? '' : `<line x1="4" y1="72.5" x2="96" y2="72.5" class="suelo"/>`}<g class="prop">${def.props || ''}</g>`;
    const svgOf = (inner, label) => `<svg class="exsvg" viewBox="0 0 100 78" role="img" aria-label="${esc(label)}">${base}<g class="fig">${inner}</g></svg>`;
    if (def.hold || !def.B) return `<div class="exfig">${svgOf(marco(def, def.A, false), 'Posición de ' + nombre)}<span class="excap">${def.note ? esc(def.note) + ' · ' : ''}mantén</span></div>`;
    if (reduce() || cuadro) {
      return `<div class="exfig dos">${svgOf(marco(def, def.A, false), 'Inicio de ' + nombre)}${svgOf(marco(def, def.B, false), 'Final de ' + nombre)}<span class="excap">${def.note ? esc(def.note) + ' · ' : ''}inicio → final</span></div>`;
    }
    return `<div class="exfig">${svgOf(marco(def, def.A, true), 'Movimiento de ' + nombre)}${def.note ? `<span class="excap">${esc(def.note)}</span>` : ''}</div>`;
  }

  /* ---------- checks del día ---------- */
  const leer = () => { const s = ls.get('vaiven.ejHoy', {}); return s.date === today() ? s : { date: today(), r: {} }; };
  const hechos = k => leer().r[k] || [];
  function marcar(k, i, on) {
    const s = leer(); const set = new Set(s.r[k] || []);
    on ? set.add(i) : set.delete(i); s.r[k] = [...set].sort((a, b) => a - b); ls.set('vaiven.ejHoy', s);
  }
  const abiertos = new Set();
  const finTexto = k => { const n = hechos(k).length, t = ROUTINES[k].ex.length; return !n ? 'Marcar rutina completa' : n === t ? 'Guardar rutina completa' : `Guardar lo que hice (${n} de ${t})`; };

  /* ---------- vista Mover ---------- */
  vMover = function () {
    const t = today(); const dow = new Date().getDay();
    const monday = addDays(t, -((dow + 6) % 7));
    const works = Store.of('workout');
    let h = `<h2>Mover</h2><p class="muted">Plan base sin equipamiento para tu edad, siguiendo las recomendaciones de la OMS: al menos 150 minutos de actividad moderada a la semana y fuerza dos veces por semana, más equilibrio.</p>
    <div class="week">`;
    for (let i = 0; i < 7; i++) {
      const d = addDays(monday, i); const wd = parseD(d).getDay();
      const done = works.some(w => w.date === d);
      h += `<div class="wd ${d === t ? 'today' : ''}"><b>${DAYL[wd]}</b><span>${esc(WEEK[wd].s)}</span>${done ? '<span class="ok">✓</span>' : '<span class="ok" aria-hidden="true">&nbsp;</span>'}</div>`;
    }
    h += `</div>`;
    const sem = works.filter(w => w.date >= monday).sort((a, b) => (a.date + timeKey(a)).localeCompare(b.date + timeKey(b)));
    const weekMins = sem.reduce((s, w) => s + num(w.minutos), 0);
    h += `<div class="card"><div class="spread"><span class="label">Esta semana</span><span class="tabular"><strong>${weekMins}</strong> / 150 min</span></div>
      <svg viewBox="0 0 300 10" class="chart" preserveAspectRatio="none" aria-hidden="true"><rect width="300" height="10" rx="5" fill="var(--surface-2)"/><rect width="${Math.min(300, weekMins / 150 * 300)}" height="10" rx="5" fill="var(--teal)"/></svg>
      ${sem.length ? `<div>${sem.slice().reverse().map(w => `<div class="entry"><span class="dot"></span><div class="body"><div class="t">${esc(w.tipo)} <span class="muted small tabular">· ${esc(w.minutos)} min</span></div><div class="small muted">${fmtDay(w.date)}${w.hora ? ' · ' + esc(fixHM(w.hora)) : ''}${Array.isArray(w.ejercicios) && w.total ? ` · ${w.ejercicios.length} de ${w.total} ejercicios` : ''}</div></div><button class="iconbtn" aria-label="Borrar" data-del="${esc(w.id)}">${svg('trash')}</button></div>`).join('')}</div>` : ''}
      <div><button class="btn sm ghost" data-act="add-workout">${svg('plus')}Registrar otra actividad</button></div></div>`;
    const todayR = WEEK[dow].r;
    ['A', 'B', 'M', 'C'].forEach(k => {
      const r = ROUTINES[k]; const hs = hechos(k); const open = abiertos.has(k) || (k === todayR && !abiertos.has('_cerrado_' + k));
      h += `<details class="routine" data-rut="${k}" ${open ? 'open' : ''}><summary><span class="ico">${r.tag}</span><span style="flex:1;min-width:0"><h3>${esc(r.name)}${k === todayR ? ' <span class="chip teal">Hoy</span>' : ''} <span class="chip sun prog" ${hs.length ? '' : 'hidden'}>${hs.length} de ${r.ex.length}</span></h3><span class="muted small">${r.mins} min · ${esc(r.intro)}</span></span></summary>
        ${r.ex.map((e, i) => {
          const on = hs.includes(i);
          return `<div class="exrow ${on ? 'hecho' : ''}">
            <div class="exhead"><div style="min-width:0"><strong>${esc(e.n)}</strong> <span class="dose">${esc(e.d)}</span></div>
              <label class="excheck" title="Marcar como hecho"><input type="checkbox" data-ej="${k}|${i}" ${on ? 'checked' : ''}><span>Hecho</span></label></div>
            ${figura(e.n)}
            <div class="extxt"><p class="how">${esc(e.how)}</p>
              ${(e.easy || e.hard) ? `<div class="lv">${e.easy ? `<span class="chip">Más fácil: ${esc(e.easy)}</span>` : ''}${e.hard ? `<span class="chip teal">Más difícil: ${esc(e.hard)}</span>` : ''}</div>` : ''}
              ${k !== 'C' ? `<a class="small vidlink" href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.n + ' ejercicio cómo hacerlo')}" target="_blank" rel="noopener">Ver videos de ejemplo</a>` : ''}
            </div>
          </div>`;
        }).join('')}
        <div class="foot"><button class="btn sm" data-rutina-fin="${k}">${finTexto(k)}</button><span class="muted small">Empieza con 5 min de calentamiento: marcha en el lugar y círculos de brazos.</span></div></details>`;
    });
    h += `<p class="notice">Si sientes dolor en el pecho, falta de aire inusual o mareo, detente y consulta a un médico. Si tienes alguna condición de salud o hace tiempo no entrenas, conversa con tu médico antes de subir la intensidad.</p>`;
    return h;
  };

  /* ---------- interacción ---------- */
  document.addEventListener('toggle', e => {
    const d = e.target; if (!(d instanceof HTMLDetailsElement) || !d.dataset.rut) return;
    const k = d.dataset.rut;
    if (d.open) { abiertos.add(k); abiertos.delete('_cerrado_' + k); } else { abiertos.delete(k); abiertos.add('_cerrado_' + k); }
  }, true);
  document.addEventListener('change', e => {
    const c = e.target.closest && e.target.closest('[data-ej]'); if (!c) return;
    const [k, i] = c.dataset.ej.split('|'); marcar(k, +i, c.checked);
    const row = c.closest('.exrow'); if (row) row.classList.toggle('hecho', c.checked);
    const det = c.closest('details'); if (det) {
      const n = hechos(k).length; const chip = det.querySelector('.prog');
      if (chip) { chip.hidden = !n; chip.textContent = `${n} de ${ROUTINES[k].ex.length}`; }
      const b = det.querySelector('[data-rutina-fin]'); if (b) b.textContent = finTexto(k);
    }
  });
  document.getElementById('main').addEventListener('click', e => {
    const b = e.target.closest('[data-rutina-fin]'); if (!b) return;
    const k = b.dataset.rutinaFin; const r = ROUTINES[k];
    let idx = hechos(k); if (!idx.length) idx = r.ex.map((_, i) => i);
    const parcial = idx.length < r.ex.length;
    const mins = Math.max(5, Math.round(r.mins * idx.length / r.ex.length));
    openSheet(parcial ? 'Guardar lo que hiciste' : 'Guardar rutina', `<form class="f">
      <p class="small"><strong>${esc(r.name)}</strong>: ${idx.length} de ${r.ex.length} ejercicios.</p>
      <ul class="small list-plain">${idx.map(i => `<li>${esc(r.ex[i].n)}</li>`).join('')}</ul>
      ${parcial ? '<p class="small muted">Lo que hagas suma. La próxima vez intenta agregar uno más.</p>' : ''}
      <div class="grid3">${fld('date', 'Fecha', `<input type="date" id="date" name="date" value="${today()}" required>`)}${fld('hora', 'Hora de inicio', `<input type="time" id="hora" name="hora" value="${nowHM()}">`)}${fld('minutos', 'Minutos', `<input type="number" inputmode="numeric" min="1" id="minutos" name="minutos" value="${mins}" required>`)}</div>
      ${fld('nota', 'Nota (opcional)', `<input id="nota" name="nota" placeholder="Ej.: me costó la plancha">`)}
      <button class="btn" type="submit">Guardar</button></form>`,
      ov => formBind(ov, async d => {
        await Store.add({ kind: 'workout', date: d.date, hora: fixHM(d.hora), tipo: r.name, minutos: Math.round(num(d.minutos)), nota: d.nota, ejercicios: idx.map(i => r.ex[i].n), total: r.ex.length });
        const s = leer(); delete s.r[k]; ls.set('vaiven.ejHoy', s);
        toast(parcial ? 'Guardado. ¡Bien por moverte!' : 'Rutina guardada. ¡Bien hecho!');
        render();
      }));
  });

  /* ---------- estilos ---------- */
  const css = document.createElement('style');
  css.textContent = `
  .exrow{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border-top:1px solid var(--line)}
  details.routine > .exrow:first-of-type{border-top:0}
  .exrow.hecho{background:var(--teal-soft)}
  .exrow.hecho .exhead strong{text-decoration:line-through;text-decoration-color:var(--teal)}
  .exhead{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}
  .exhead .dose{font-variant-numeric:tabular-nums;font-weight:700;color:var(--teal);white-space:nowrap;margin-left:4px}
  .exfig{display:flex;flex-direction:column;align-items:center;gap:2px;background:var(--surface-2);border-radius:14px;padding:6px 8px 8px}
  .exfig .exsvg{max-width:190px}
  .exfig.dos{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;justify-items:center}
  .exfig.dos .exsvg{max-width:180px}
  .exfig.dos .excap{grid-column:1/-1}
  .exsvg{width:100%;height:auto;display:block}
  .exsvg .fig{stroke:var(--teal);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;fill:none}
  .exsvg .fig .cabeza{fill:var(--teal);stroke:none}
  .exsvg .fig .cuerda{stroke:var(--warn);stroke-width:1.6;stroke-dasharray:3 2}
  .exsvg .prop{stroke:var(--muted);stroke-width:1.6;fill:none;stroke-linecap:round}
  .exsvg .suelo{stroke:var(--line);stroke-width:1.5}
  .excap{font-size:.75rem;color:var(--muted);text-align:center;line-height:1.2}
  .extxt{display:flex;flex-direction:column;gap:6px;min-width:0}
  .extxt .how{color:var(--muted);font-size:.9rem;margin:0}
  .extxt .lv{font-size:.82rem;display:flex;gap:6px;flex-wrap:wrap}
  .vidlink{color:var(--teal);font-weight:700}
  .excheck{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:.68rem;color:var(--muted);cursor:pointer;flex:none}
  .excheck input{width:28px;height:28px;accent-color:var(--teal);cursor:pointer;margin:0}
  `;
  document.head.append(css);
  if (tab === 'mover') render();
})();
