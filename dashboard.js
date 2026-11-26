/* Health Loksewa: the "My dashboard" page. Shows the signed-in student a way into every part of the app, and the SAME Free / Premium list and plans the app uses (read from your Google Sheet). Nothing private is shown: the plan and progress of a student live inside the app. */
(function(){
  'use strict';
  var d = document, S = (window.HLSite && window.HLSite.SITE) || {}, APP = String(S.appUrl || ''), API = String(S.api || ''), loaded = false;
  var CARDS = [
    ['practice', "Subject-wise MCQs", "Timed MCQs · negative marking"],
    ['mock', "Mock Test", "Simulates the real exam experience"],
    ['past', "Past Questions", "Real papers from previous years"],
    ['home', "Syllabus", "Units & downloadable PDFs"],
    ['second', "Second Paper", "Syllabus, notes & PDFs"],
    ['home', "Smart Tools", "BMI, health indicators & epidemiology calculators"],
    ['ai', "AI Assistant", "Ask about syllabus, subjects, study tips & more"],
    ['home', "Health Guide", "Basic health education articles"],
    ['home', "Weekly Tournament", "Same questions for everyone — compete this week!"],
    ['home', "New Update", "Official reports · view in-app"],
    ['rapid', "Rapid Fire", "Fast-paced practice, 5 modes"],
    ['home', "Handbook", "Formulas, Quick References & more"],
    ['whatsnew', "What's New", "App updates & features"],
    ['home', "Question of the Day", "One free question, updated every day"],
    ['flash', "Flash Cards", "Make and review your own flash cards"],
    ['leaderboard', "Leaderboard", "See how you rank"],
    ['progress', "My progress", "Your scores and study time"]
  ];
  function $(id){ return d.getElementById(id); }
  function el(t, c, x){ var e = d.createElement(t); if(c) e.className = c; if(x != null) e.textContent = x; return e; }
  function clean(t){ return String(t == null ? '' : t).replace(/<[^>]*>/g, '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim().slice(0, 300); }
  function go(k){ return APP ? APP + '?go=' + k : '#'; }
  function clear(n){ while(n.firstChild) n.removeChild(n.firstChild); }
  function getJson(action){
    return new Promise(function(res, rej){
      if(!API){ rej(new Error('no api')); return; }
      var ctl = window.AbortController ? new AbortController() : null, t = setTimeout(function(){ if(ctl) ctl.abort(); rej(new Error('timeout')); }, 9000);
      fetch(API + '?action=' + action, ctl ? { signal: ctl.signal } : {}).then(function(r){ return r.json(); }).then(function(j){ clearTimeout(t); res(j); }, function(e){ clearTimeout(t); rej(e); });
    });
  }
  function fail(box, msg){ clear(box); box.appendChild(el('p', 'empty', msg)); }
  function who(){
    var b = $('siBtn'), t = b ? b.textContent.trim() : '';
    if(/^Hi, /.test(t)) return t.slice(4);
    if(!b){ try{ return localStorage.getItem('hl:auth') || ''; }catch(e){} }
    return '';
  }
  var GROUPS = [
    ['Home', ['Question of the Day', "What's New", 'New Update']],
    ['Learn', ['Syllabus', 'Second Paper', 'Smart Tools', 'Handbook', 'Health Guide', 'AI Assistant']],
    ['Practice', ['Subject-wise MCQs', 'Mock Test', 'Past Questions', 'Rapid Fire', 'Flash Cards', 'Weekly Tournament']],
    ['Progress', ['My progress', 'Leaderboard']]
  ];
  var COLS = ['#14B8A6', '#8B5CF6', '#F59E0B', '#F43F5E', '#38BDF8', '#22C55E'];
  var ICONS = {
    'Question of the Day': '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
    "What's New": '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
    'New Update': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0"/>',
    'Syllabus': '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    'Second Paper': '<path d="M4 5h5a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4zM20 5h-5a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h6z"/>',
    'Smart Tools': '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2"/>',
    'Handbook': '<path d="M6 3h12v18l-6-4-6 4z"/>',
    'Health Guide': '<path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/>',
    'AI Assistant': '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z"/>',
    'Subject-wise MCQs': '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
    'Mock Test': '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',
    'Past Questions': '<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7"/>',
    'Rapid Fire': '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    'Flash Cards': '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
    'Weekly Tournament': '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8"/>',
    'My progress': '<path d="M3 3v18h18M7 15l4-4 3 3 5-6"/>',
    'Leaderboard': '<path d="M5 21V11M12 21V4M19 21v-7"/>'
  };
  function buildCards(){
    var g = $('mdGrid'); clear(g); var n = 0;
    GROUPS.forEach(function(gr, gi){
      var head = el('h3', 'md-gh'); head.appendChild(el('span', 'md-gn', String(gi + 1))); head.appendChild(el('span', '', gr[0])); g.appendChild(head);
      var grid = el('div', 'md-grid');
      gr[1].forEach(function(title){
        var c = null; CARDS.forEach(function(x){ if(x[1] === title) c = x; }); if(!c) return;
        var card = el('div', 'md-card'); card.style.setProperty('--a', COLS[n % COLS.length]); n++;
        var ic = el('span', 'md-ic'); ic.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[title] || '') + '</svg>'; card.appendChild(ic);
        card.appendChild(el('h3', '', c[1])); card.appendChild(el('p', '', c[2]));
        var a = el('a', 'btn btn-ghost btn-sm', c[0] === 'home' ? 'Find on Home' : 'Open'); a.href = go(c[0]); card.appendChild(a); grid.appendChild(card);
      });
      g.appendChild(grid);
    });
  }
  function buildTable(rows){
    var box = $('mdPf'); clear(box);
    rows = Array.isArray(rows) ? rows.filter(function(r){ return r && clean(r.Feature); }).slice(0, 60) : [];
    if(!rows.length){ fail(box, 'The Free and Premium list will appear here soon.'); return; }
    var t = el('table', 'md-pf'), hr = d.createElement('tr'); ['Feature', 'Free', 'Premium'].forEach(function(h){ hr.appendChild(el('th', '', h)); });
    var th = d.createElement('thead'); th.appendChild(hr); t.appendChild(th); var tb = d.createElement('tbody');
    rows.forEach(function(r){ var tr = d.createElement('tr'); tr.appendChild(el('td', '', clean(r.Feature))); tr.appendChild(el('td', '', clean(r.Free))); tr.appendChild(el('td', '', clean(r.Premium))); tb.appendChild(tr); });
    t.appendChild(tb); box.appendChild(t);
  }
  function buildPlans(plans){
    var box = $('mdPlans'); clear(box);
    plans = Array.isArray(plans) ? plans.filter(function(p){ return p && (p.label || p.planKey) && Number(p.finalPrice) > 0; }).slice(0, 12) : [];
    if(!plans.length){ fail(box, 'No plans are listed yet.'); return; }
    var g = el('div', 'md-plans');
    plans.forEach(function(p){
      var c = el('div', 'md-plan'), m = Math.max(1, Math.min(60, Math.round(Number(p.months) || 1))), disc = Math.round(Number(p.discountPercent) || 0), line = el('p', 'md-note');
      c.appendChild(el('strong', '', clean(p.label || p.planKey)));
      line.appendChild(el('span', '', String(m))); line.appendChild(d.createTextNode(' ')); line.appendChild(el('span', '', m === 1 ? 'month' : 'months')); c.appendChild(line);
      var pr = el('div', 'md-price', 'NPR ' + Math.round(Number(p.finalPrice))); if(disc > 0 && Number(p.basePrice) > Number(p.finalPrice)) pr.appendChild(el('span', 'md-was', 'NPR ' + Math.round(Number(p.basePrice))));
      c.appendChild(pr);
      if(disc > 0){ var sv = el('div', 'md-save'); sv.appendChild(el('span', '', 'Save')); sv.appendChild(d.createTextNode(' ' + Math.min(99, disc) + '%')); c.appendChild(sv); }
      g.appendChild(c);
    });
    box.appendChild(g);
  }
  function load(){
    if(loaded) return; loaded = true;
    getJson('premiumFeatures').then(buildTable, function(){ fail($('mdPf'), 'Could not load this. Check your internet and try again.'); });
    getJson('pricingPlans').then(buildPlans, function(){ fail($('mdPlans'), 'Could not load this. Check your internet and try again.'); });
  }
  function render(){
    var n = who(), out = $('mdOut'), inn = $('mdIn');
    if(n){
      $('mdName').textContent = n; out.hidden = true; inn.hidden = false;
      $('mdContinue').href = go('home'); $('mdPlanBtn').href = go('premium'); $('mdProgBtn').href = go('progress'); $('mdPremBtn').href = go('premium');
      if(!$('mdGrid').firstChild) buildCards(); load();
    } else { inn.hidden = true; out.hidden = false; }
  }
  var sb = $('mdSignIn'); if(sb) sb.addEventListener('click', function(){ var b = $('siBtn'); if(b) b.click(); });
  render();
  var btn = $('siBtn'); if(btn) new MutationObserver(render).observe(btn, { childList: true, characterData: true, subtree: true });
})();
