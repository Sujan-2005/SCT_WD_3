
// QUIZ DATA

const QUIZ = [
  {id:1,q:"What does HTML stand for?",type:"single",cat:"Web Basics",
   opts:["HyperText Markup Language","High Transfer Markup Language","HyperText Modern Language","Hyper Transfer Meta Language"],
   ans:"HyperText Markup Language"},
  {id:2,q:"Which of the following are JavaScript data types? (Select ALL that apply)",type:"multi",cat:"JavaScript",
   opts:["String","Integer","Boolean","Float","Symbol","Object"],
   ans:["String","Boolean","Symbol","Object"]},
  {id:3,q:"The CSS property 'display: flex' was introduced in CSS3.",type:"truefalse",cat:"CSS",
   opts:["TRUE","FALSE"],ans:"TRUE"},
  {id:4,q:"Complete the Git command: git ___ -m 'initial commit'",type:"fill",cat:"Git",opts:[],ans:"commit"},
  {id:5,q:"Which HTTP methods are considered 'safe'? (Select ALL that apply)",type:"multi",cat:"HTTP",
   opts:["GET","POST","HEAD","PUT","DELETE","OPTIONS"],ans:["GET","HEAD","OPTIONS"]},
  {id:6,q:"What is the correct way to declare a constant in JavaScript?",type:"single",cat:"JavaScript",
   opts:["var x = 5","let x = 5","const x = 5","constant x = 5"],ans:"const x = 5"},
  {id:7,q:"Python is a statically typed language.",type:"truefalse",cat:"Python",
   opts:["TRUE","FALSE"],ans:"FALSE"},
  {id:8,q:"Which CSS pseudo-class targets the first child element?",type:"single",cat:"CSS",
   opts:[":first-element",":first-child",":first-type",":primary-child"],ans:":first-child"},
  {id:9,q:"Which structures use LIFO ordering? (Select ALL that apply)",type:"multi",cat:"Data Structures",
   opts:["Stack","Queue","Deque (as stack)","Linked List","Call Stack"],ans:["Stack","Deque (as stack)","Call Stack"]},
  {id:10,q:"The Git command to initialize a new repository is: git ___",type:"fill",cat:"Git",opts:[],ans:"init"},
  {id:11,q:"Which of the following are valid CSS position values?",type:"multi",cat:"CSS",
   opts:["static","fixed","floating","sticky","absolute","relative"],ans:["static","fixed","sticky","absolute","relative"]},
  {id:12,q:"What does API stand for?",type:"single",cat:"Web Basics",
   opts:["Application Programming Interface","Advanced Protocol Integration","Automated Processing Index","Application Process Instruction"],
   ans:"Application Programming Interface"},
  {id:13,q:"In JavaScript, 'null' and 'undefined' are the same value.",type:"truefalse",cat:"JavaScript",
   opts:["TRUE","FALSE"],ans:"FALSE"},
  {id:14,q:"The CSS box model property that adds space OUTSIDE the border is: ___",type:"fill",cat:"CSS",opts:[],ans:"margin"},
  {id:15,q:"Which are valid HTTP status code ranges? (Select ALL that apply)",type:"multi",cat:"HTTP",
   opts:["1xx Informational","2xx Success","4xx Client Error","6xx Server Error","5xx Server Error"],
   ans:["1xx Informational","2xx Success","4xx Client Error","5xx Server Error"]},
];

// STATE

let state = {
  screen: 'start',   // start | quiz | results
  qIndex: 0,
  answers: {},       // {index: value}
  submitted: {},     // {index: true}
  leaderboard: [],
  typewriterDone: false,
};

try { state.leaderboard = JSON.parse(localStorage.getItem('sc_lb') || '[]'); } catch {}


// HELPERS

function el(tag, cls, inner) {
  const d = document.createElement(tag);
  if (cls) d.className = cls;
  if (inner !== undefined) d.innerHTML = inner;
  return d;
}
function div(cls, inner) { return el('div', cls, inner); }
function span(cls, txt) { const s = el('span', cls, txt); return s; }

function asciiBar(val, max, width) {
  const filled = Math.round((val / max) * width);
  const empty = width - filled;
  const pct = Math.round((val / max) * 100);
  return `[<span style="color:var(--green)">` + '█'.repeat(filled) + '</span>' + '·'.repeat(empty) + `] ${pct}%`;
}

function panel(titleHTML, bodyFn) {
  const p = div('panel');
  const t = div('panel-title');
  t.innerHTML = `<span style="color:var(--muted)">+---</span><span class="glitch">${titleHTML}</span><span style="color:var(--muted)">---+</span>`;
  p.appendChild(t);
  const b = div('panel-body');
  bodyFn(b);
  p.appendChild(b);
  return p;
}

function isCorrect(q, ua) {
  if (q.type === 'multi') {
    const ans = q.ans; const given = Array.isArray(ua) ? ua : [];
    return ans.length === given.length && ans.every(a => given.includes(a));
  }
  if (q.type === 'fill') return typeof ua === 'string' && ua.trim().toLowerCase() === q.ans.toLowerCase();
  return ua === q.ans;
}

function saveLeaderboard(entry) {
  state.leaderboard = [entry, ...state.leaderboard].slice(0, 20);
  try { localStorage.setItem('sc_lb', JSON.stringify(state.leaderboard)); } catch {}
}


// TYPEWRITER

function typewriter(el, text, speed, onDone) {
  let i = 0;
  el.textContent = '';
  const iv = setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) { clearInterval(iv); if (onDone) onDone(); }
  }, speed);
  return iv;
}


// RENDER START SCREEN

function renderStart() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  // Boot panel
  const boot = panel('SYSTEM BOOT', b => {
    const logo = div('ascii-logo');
    logo.textContent = `
 ____  _  __ _     _     ____ ____      _    _____ _____ 
/ ___|| |/ /| |   | |   / ___|  _ \\    / \\  |  ___|_   _|
\\___ \\| ' / | |   | |  | |   | |_) |  / _ \\ | |_    | |  
 ___) | . \\ | |___| |__| |___| _ <  / ___ \\|  _|   | |  
|____/|_|\\_\\|_____|_____\\____|_| \\_\\/_/   \\_\\_|     |_|  `;
    b.appendChild(logo);

    const l1 = div('log');
    l1.innerHTML = `<span class="ok">[BOOT]</span> `;
    const tw1 = span('', '');
    l1.appendChild(tw1);
    b.appendChild(l1);

    const l2 = div('log');
    l2.innerHTML = `<span class="warn">[INIT]</span> `;
    const tw2 = span('warn', '');
    l2.appendChild(tw2);
    b.appendChild(l2);

    typewriter(tw1, 'SKILLCRAFT TECHNOLOGY // QUIZ ENGINE v2.4.1', 35, () => {
      typewriter(tw2, `INITIALIZING... ${QUIZ.length} QUESTIONS LOADED. READY.`, 30);
    });
  });
  app.appendChild(boot);

  // Grid: briefing + categories
  const g = div('grid2');

  const brief = panel('MISSION BRIEFING', b => {
    const lines = [
      `<span class="ok">[OK]</span> Questions loaded: <span style="color:var(--amber)">${QUIZ.length}</span>`,
      `<span class="ok">[OK]</span> Types: SINGLE / MULTI / TRUE-FALSE / FILL`,
      `<span class="warn">[WARN]</span> Navigate freely — submit when ready`,
      `<span class="ok">[OK]</span> Scores saved to local storage`,
      `<span class="sep">════════════════════════════════</span>`,
      `<span class="prompt">user@skillcraft:~$</span> <span class="blink">█</span>`,
    ];
    lines.forEach((l, i) => {
      const d = div('log');
      d.innerHTML = l;
      d.style.animationDelay = i * 80 + 'ms';
      b.appendChild(d);
    });
  });

  const cats = panel('CATEGORIES', b => {
    const uniq = [...new Set(QUIZ.map(q => q.cat))];
    uniq.forEach(cat => {
      const cnt = QUIZ.filter(q => q.cat === cat).length;
      const d = div('log');
      d.innerHTML = `<span style="color:var(--muted)">> </span><span class="ok">${cat}</span> <span class="sep">[${cnt}Q]</span>`;
      b.appendChild(d);
    });
  });

  g.appendChild(brief);
  g.appendChild(cats);
  app.appendChild(g);

  // Controls
  const ctrl = panel('CONTROLS // START SESSION', b => {
    const row = div('controls-row');

    const startBtn = el('button', 'btn btn-lg');
    startBtn.textContent = '[ START QUIZ ]';
    startBtn.onclick = startQuiz;

    const lbBtn = el('button', 'btn btn-amber');
    lbBtn.textContent = '[ LEADERBOARD ]';

    const note = span('sep', '// Ready to receive input');
    note.style.fontSize = '.72rem';

    row.appendChild(startBtn);
    row.appendChild(lbBtn);
    row.appendChild(note);
    b.appendChild(row);

    // Leaderboard section
    const lbSection = div('');
    lbSection.style.display = 'none';
    lbSection.style.marginTop = '1rem';

    const lbTitle = div('sep');
    lbTitle.textContent = '════ LEADERBOARD ════';
    lbSection.appendChild(lbTitle);

    if (state.leaderboard.length === 0) {
      const empty = div('log');
      empty.style.marginTop = '.5rem';
      empty.innerHTML = `<span class="sep">No records found. Complete a quiz to populate.</span>`;
      lbSection.appendChild(empty);
    } else {
      state.leaderboard.slice(0, 8).forEach((e, i) => {
        const row2 = div('lb-row');
        const cls = e.pct >= 70 ? 'ok' : e.pct >= 40 ? 'warn' : 'err';
        row2.innerHTML = `<span class="sep">#${String(i+1).padStart(2,'0')}</span><span>${e.date}</span><span class="${cls}">${e.correct}/${e.total} (${e.pct}%)</span>`;
        lbSection.appendChild(row2);
      });
    }

    b.appendChild(lbSection);

    lbBtn.onclick = () => {
      lbSection.style.display = lbSection.style.display === 'none' ? 'block' : 'none';
    };
  });
  app.appendChild(ctrl);
}


// START QUIZ

function startQuiz() {
  state.screen = 'quiz';
  state.qIndex = 0;
  state.answers = {};
  state.submitted = {};
  renderQuestion();
}


// RENDER QUESTION

function renderQuestion() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const q = QUIZ[state.qIndex];
  const idx = state.qIndex;
  const total = QUIZ.length;
  const ua = state.answers[idx];
  const isSubmitted = !!state.submitted[idx];
  const isLast = idx === total - 1;

  const isAnswered = ua !== null && ua !== undefined &&
    (Array.isArray(ua) ? ua.length > 0 : ua !== '');

  // ── HEADER ──
  const typeLabels = {single:'SINGLE CHOICE',multi:'MULTI-SELECT',truefalse:'TRUE / FALSE',fill:'FILL IN BLANK'};
  const typeClasses = {single:'t-single',multi:'t-multi',truefalse:'t-truefalse',fill:'t-fill'};

  const hdr = panel(`QUIZ ENGINE // ${q.cat}`, b => {
    b.style.display = 'flex';
    b.style.alignItems = 'center';
    b.style.justifyContent = 'space-between';
    b.style.flexWrap = 'wrap';
    b.style.gap = '.5rem';

    const left = div('');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.gap = '1rem';

    const qnum = div('qnum');
    qnum.textContent = `Q${String(idx+1).padStart(2,'0')}`;

    const info = div('');
    info.innerHTML = `<div style="font-size:.68rem;color:var(--muted);letter-spacing:.1em">OF ${total} QUESTIONS</div>
      <span class="tbadge ${typeClasses[q.type]}">${typeLabels[q.type]}</span>`;

    left.appendChild(qnum);
    left.appendChild(info);

    const right = div('');
    right.style.textAlign = 'right';
    const pb = div('pbar');
    pb.innerHTML = asciiBar(idx, total, 22);
    const plabel = div('');
    plabel.style.fontSize = '.68rem';
    plabel.style.color = 'var(--muted)';
    plabel.style.marginTop = '.25rem';
    plabel.textContent = `PROGRESS: ${idx}/${total} COMPLETE`;
    right.appendChild(pb);
    right.appendChild(plabel);

    b.appendChild(left);
    b.appendChild(right);
  });
  app.appendChild(hdr);

  // ── QUESTION ──
  const qpanel = panel(`QUESTION ${String(idx+1).padStart(2,'0')}`, b => {
    const qtxt = div('');
    qtxt.style.cssText = 'font-size:.9rem;line-height:1.7;margin-bottom:1.25rem;text-shadow:var(--glow)';
    qtxt.innerHTML = `<span class="prompt">user@skillcraft:~$</span> ${q.q}`;
    b.appendChild(qtxt);

    const sep = div('sep');
    sep.textContent = '──────────────────────────────────────────────';
    b.appendChild(sep);

    const opts = div('');
    opts.style.marginTop = '.75rem';

    if (q.type === 'fill') {
      const fillRow = div('');
      fillRow.style.display = 'flex';
      fillRow.style.alignItems = 'center';
      fillRow.style.gap = '.5rem';
      fillRow.style.flexWrap = 'wrap';

      const lbl = span('sep', '> answer: ');
      lbl.style.fontSize = '.8rem';

      const inp = el('input', 'fill-input');
      inp.type = 'text';
      inp.placeholder = 'type here...';
      inp.spellcheck = false;
      inp.autocomplete = 'off';
      inp.value = typeof ua === 'string' ? ua : '';
      inp.disabled = isSubmitted;
      if (isSubmitted) {
        const correct = typeof ua === 'string' && ua.trim().toLowerCase() === q.ans.toLowerCase();
        inp.classList.add(correct ? 'correct' : 'incorrect');
      }
      inp.oninput = e => { state.answers[idx] = e.target.value; updateControls(); };

      const cur = span('blink ok', '█');
      if (isSubmitted) cur.style.display = 'none';

      fillRow.appendChild(lbl);
      fillRow.appendChild(inp);
      fillRow.appendChild(cur);
      opts.appendChild(fillRow);

      setTimeout(() => { if (!isSubmitted) inp.focus(); }, 50);
    } else {
      q.opts.forEach(opt => {
        const row = div('option-row');

        // determine class
        if (isSubmitted) {
          const isCorrectOpt = q.type === 'multi'
            ? (Array.isArray(q.ans) && q.ans.includes(opt))
            : opt === q.ans;
          const isChosen = q.type === 'multi'
            ? (Array.isArray(ua) && ua.includes(opt))
            : ua === opt;
          if (isCorrectOpt) row.classList.add('correct');
          else if (isChosen && !isCorrectOpt) row.classList.add('incorrect');
        } else {
          const chosen = q.type === 'multi'
            ? (Array.isArray(ua) && ua.includes(opt))
            : ua === opt;
          if (chosen) row.classList.add('selected');
        }

        const box = div('opt-box');
        const isChosen2 = q.type === 'multi'
          ? (Array.isArray(ua) && ua.includes(opt))
          : ua === opt;
        const isCorrectOpt2 = q.type === 'multi'
          ? (Array.isArray(q.ans) && q.ans.includes(opt))
          : opt === q.ans;
        box.textContent = (isChosen2 || (isSubmitted && isCorrectOpt2))
          ? (q.type === 'multi' ? 'X' : '●') : ' ';

        const txt = span('', opt);

        row.appendChild(box);
        row.appendChild(txt);

        if (!isSubmitted) {
          row.onclick = () => {
            if (q.type === 'single' || q.type === 'truefalse') {
              state.answers[idx] = opt;
            } else {
              const curr = Array.isArray(state.answers[idx]) ? state.answers[idx] : [];
              state.answers[idx] = curr.includes(opt)
                ? curr.filter(x => x !== opt)
                : [...curr, opt];
            }
            renderQuestion();
          };
        }

        opts.appendChild(row);
      });
    }

    b.appendChild(opts);

    // Feedback
    if (isSubmitted) {
      const fb = div('feedback');
      const correct = isCorrect(q, ua);
      fb.classList.add(correct ? 'ok' : 'err');
      if (q.type === 'fill') {
        fb.innerHTML = correct
          ? `<span class="ok">[OK] CORRECT</span> — "${ua}"`
          : `<span class="err">[ERR] INCORRECT</span> — EXPECTED: "<strong>${q.ans}</strong>"`;
      } else if (q.type === 'multi') {
        fb.innerHTML = correct
          ? `<span class="ok">[OK] ALL CORRECT — Full marks</span>`
          : `<span class="err">[ERR] PARTIAL / INCORRECT</span> — CORRECT SET: ${q.ans.join(', ')}`;
      } else {
        fb.innerHTML = correct
          ? `<span class="ok">[OK] CORRECT</span>`
          : `<span class="err">[ERR] INCORRECT</span> — CORRECT: "<strong>${q.ans}</strong>"`;
      }
      b.appendChild(fb);
    }
  });
  app.appendChild(qpanel);

  // ── CONTROLS ──
  const cpanel = panel('NAVIGATION CONTROLS', b => {
    const row = div('controls-row');

    const prevBtn = el('button', 'btn');
    prevBtn.innerHTML = '◀ [ PREV ]';
    prevBtn.disabled = idx === 0;
    prevBtn.onclick = () => { state.qIndex--; renderQuestion(); };

    row.appendChild(prevBtn);

    if (!isSubmitted) {
      if (!isLast) {
        const nextBtn = el('button', 'btn btn-amber');
        nextBtn.innerHTML = '[ NEXT ] ▶';
        nextBtn.disabled = !isAnswered;
        nextBtn.onclick = () => {
          state.submitted[idx] = true;
          state.qIndex++;
          renderQuestion();
        };
        row.appendChild(nextBtn);
      } else {
        const subBtn = el('button', 'btn btn-amber');
        subBtn.innerHTML = '[ SUBMIT QUIZ ]';
        subBtn.disabled = !isAnswered;
        subBtn.onclick = submitQuiz;
        row.appendChild(subBtn);
      }
    } else {
      if (!isLast) {
        const nextBtn = el('button', 'btn btn-amber');
        nextBtn.innerHTML = '[ NEXT ] ▶';
        nextBtn.onclick = () => { state.qIndex++; renderQuestion(); };
        row.appendChild(nextBtn);
      } else {
        const finBtn = el('button', 'btn btn-amber btn-lg');
        finBtn.innerHTML = '[ VIEW RESULTS ]';
        finBtn.onclick = submitQuiz;
        row.appendChild(finBtn);
      }
    }

    const status = span('');
    status.style.cssText = 'font-size:.72rem;margin-left:auto';
    status.innerHTML = isAnswered
      ? `<span class="ok">[OK] ANSWER RECORDED</span>`
      : `<span class="warn">[WARN] NO ANSWER SELECTED</span>`;
    row.appendChild(status);

    b.appendChild(row);

    // Mini progress
    const prog = div('');
    prog.style.cssText = 'margin-top:.75rem;display:flex;gap:.35rem;flex-wrap:wrap';
    QUIZ.forEach((_, i) => {
      const dot = span('');
      dot.style.cssText = `font-size:.65rem;cursor:pointer;padding:.1rem .3rem;border:1px solid`;
      const isAns = state.answers[i] !== undefined && state.answers[i] !== null &&
        (Array.isArray(state.answers[i]) ? state.answers[i].length > 0 : state.answers[i] !== '');
      if (i === idx) {
        dot.style.borderColor = 'var(--amber)';
        dot.style.color = 'var(--amber)';
      } else if (isAns) {
        dot.style.borderColor = 'var(--green)';
        dot.style.color = 'var(--green)';
      } else {
        dot.style.borderColor = 'var(--muted)';
        dot.style.color = 'var(--muted)';
      }
      dot.textContent = String(i+1).padStart(2,'0');
      dot.onclick = () => { state.qIndex = i; renderQuestion(); };
      prog.appendChild(dot);
    });
    b.appendChild(prog);
  });
  app.appendChild(cpanel);
}

function updateControls() {
  // lightweight — just re-render for simplicity
}


// SUBMIT QUIZ

function submitQuiz() {
  state.submitted[state.qIndex] = true;
  const totalCorrect = QUIZ.filter((q,i) => isCorrect(q, state.answers[i])).length;
  const pct = Math.round((totalCorrect / QUIZ.length) * 100);
  saveLeaderboard({
    date: new Date().toLocaleDateString(),
    correct: totalCorrect,
    total: QUIZ.length,
    pct,
  });
  state.screen = 'results';
  renderResults();
}


// RENDER RESULTS

function renderResults() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const results = QUIZ.map((q, i) => ({ ...q, ua: state.answers[i], correct: isCorrect(q, state.answers[i]) }));
  const totalCorrect = results.filter(r => r.correct).length;
  const totalWrong = results.length - totalCorrect;
  const pct = Math.round((totalCorrect / results.length) * 100);

  let perfClass = 'ok', perfMsg = '[OK] EXCELLENT PERFORMANCE — SYSTEM CERTIFIED';
  if (pct < 70 && pct >= 40) { perfClass = 'warn'; perfMsg = '[WARN] AVERAGE — REVIEW WEAK AREAS'; }
  else if (pct < 40) { perfClass = 'err'; perfMsg = '[ERR] NEEDS IMPROVEMENT — RESTUDY REQUIRED'; }

  // Eval log
  const evalPanel = panel('RESULTS EVALUATION', b => {
    const logs = [
      `<span class="ok">[PROC]</span> Compiling answer data...`,
      `<span class="ok">[CALC]</span> Running score algorithm...`,
      `<span class="ok">[OK]</span> Correct: <span class="ok">${totalCorrect}</span> / Wrong: <span class="err">${totalWrong}</span>`,
      `<span class="ok">[OK]</span> Score calculated: <span style="color:${pct>=70?'var(--green)':pct>=40?'var(--amber)':'var(--error)'}; text-shadow:var(--glow)">${pct}%</span>`,
      `<span class="${perfClass}">${perfMsg}</span>`,
      `<span class="ok">[DONE]</span> Session logged to leaderboard. <span class="blink ok">█</span>`,
    ];
    logs.forEach((l, i) => {
      const d = div('log');
      d.innerHTML = l;
      d.style.opacity = '0';
      setTimeout(() => { d.style.opacity='1'; d.style.transition='opacity .3s'; }, i * 350);
      b.appendChild(d);
    });
  });
  app.appendChild(evalPanel);

  // Stats grid
  const sg = div('grid2');
  [
    { val: totalCorrect, label: 'CORRECT ANSWERS', cls: 'ok' },
    { val: totalWrong,   label: 'WRONG ANSWERS',   cls: 'err' },
    { val: results.length, label: 'TOTAL QUESTIONS', style: 'color:var(--amber)' },
    { val: pct + '%',    label: 'FINAL SCORE', style: `color:${pct>=70?'var(--green)':pct>=40?'var(--amber)':'var(--error)'}` },
  ].forEach(s => {
    const b = div('stat-block');
    const n = div('stat-num ' + (s.cls||''));
    if (s.style) n.style.cssText = s.style;
    n.textContent = s.val;
    const l = div('stat-label');
    l.textContent = s.label;
    b.appendChild(n);
    b.appendChild(l);
    sg.appendChild(b);
  });
  app.appendChild(sg);

  // Score breakdown
  const sbp = panel('SCORE BREAKDOWN', b => {
    const al = div('');
    al.style.cssText = 'font-size:.75rem;color:var(--muted);margin-bottom:.4rem';
    al.textContent = 'OVERALL ACCURACY';
    b.appendChild(al);

    const ab = div('pbar');
    ab.innerHTML = asciiBar(totalCorrect, results.length, 36);
    b.appendChild(ab);

    const sep = div('sep');
    sep.style.margin = '.75rem 0 .5rem';
    sep.textContent = '──── BY CATEGORY ────';
    b.appendChild(sep);

    const cats = [...new Set(QUIZ.map(q => q.cat))];
    cats.forEach(cat => {
      const catQ = results.filter(r => r.cat === cat);
      const catRight = catQ.filter(r => r.correct).length;
      const row = div('');
      row.style.cssText = 'display:flex;align-items:center;gap:.75rem;margin-bottom:.4rem;font-size:.75rem;flex-wrap:wrap';
      const lbl = span('');
      lbl.style.cssText = 'color:var(--muted);min-width:130px;flex-shrink:0';
      lbl.textContent = cat;
      const bar = span('pbar', '');
      bar.innerHTML = asciiBar(catRight, catQ.length, 14);
      row.appendChild(lbl);
      row.appendChild(bar);
      b.appendChild(row);
    });
  });
  app.appendChild(sbp);

  // Question review
  const qrp = panel('QUESTION REVIEW', b => {
    results.forEach((r, i) => {
      const row = div('rev-row');
      const top = div('');
      top.style.display = 'flex';
      top.style.gap = '.5rem';
      top.style.alignItems = 'flex-start';
      top.style.flexWrap = 'wrap';

      const qn = span('sep');
      qn.style.flexShrink = '0';
      qn.textContent = `Q${String(i+1).padStart(2,'0')}`;

      const qtxt = span('');
      qtxt.style.flex = '1';
      qtxt.textContent = r.q;

      const status = span(r.correct ? 'ok' : 'err');
      status.style.flexShrink = '0';
      status.textContent = r.correct ? '[OK]' : '[FAIL]';

      top.appendChild(qn);
      top.appendChild(qtxt);
      top.appendChild(status);
      row.appendChild(top);

      if (!r.correct) {
        const ans = div('err');
        ans.style.cssText = 'margin-top:.3rem;padding-left:2rem;font-size:.72rem';
        const ansVal = Array.isArray(r.ans) ? r.ans.join(', ') : r.ans;
        ans.textContent = `CORRECT: ${ansVal}`;
        row.appendChild(ans);
      }

      b.appendChild(row);
    });
  });
  app.appendChild(qrp);

  // Restart
  const rp = panel('OPTIONS', b => {
    const row = div('controls-row');
    const rb = el('button', 'btn btn-lg');
    rb.textContent = '[ RESTART QUIZ ]';
    rb.onclick = () => { state.screen = 'start'; renderStart(); };
    const note = span('sep', '// Session saved. Ready for next attempt.');
    note.style.fontSize = '.72rem';
    row.appendChild(rb);
    row.appendChild(note);
    b.appendChild(row);
  });
  app.appendChild(rp);
}


// INIT

renderStart();

