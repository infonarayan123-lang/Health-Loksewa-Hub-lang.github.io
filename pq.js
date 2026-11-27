/* Past questions, answer keys and syllabus posts from the WordPress news site (public list). */
(function(){
  'use strict';
  var HOST = 'https://news.healthloksewa.com', SLUGS = ['past-questions', 'answer-key', 'syllabus'];
  var list = document.getElementById('pqList'); if(!list || !window.fetch) return;
  var loading = document.getElementById('pqLoading'), none = document.getElementById('pqNone'), emptyBox = document.getElementById('pqEmpty'), more = document.getElementById('pqMore'), count = document.getElementById('pqCount'), search = document.getElementById('pqSearch'), cats = document.getElementById('pqCats');
  var state = { all: [], slug: 'all', q: '', shown: 30 }, catName = {};
  function el(t, c, x){ var e = document.createElement(t); if(c) e.className = c; if(x != null) e.textContent = x; return e; }
  function txt(s){ var d = document.createElement('textarea'); d.innerHTML = String(s == null ? '' : s); return d.value; }
  function nice(iso){ var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); if(!m) return ''; var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return Number(m[3]) + ' ' + M[Number(m[2]) - 1] + ' ' + m[1]; }
  function get(url){ var ctl = window.AbortController ? new AbortController() : null, t = setTimeout(function(){ if(ctl) ctl.abort(); }, 8000); return fetch(url, { signal: ctl ? ctl.signal : undefined }).then(function(r){ clearTimeout(t); if(!r.ok) throw new Error('bad'); return r.json(); }, function(e){ clearTimeout(t); throw e; }); }
  function filtered(){ var q = state.q.toLowerCase(); return state.all.filter(function(p){ if(state.slug !== 'all' && p.slugs.indexOf(state.slug) < 0) return false; return !q || (p.title + ' ' + p.catText).toLowerCase().indexOf(q) >= 0; }); }
  function draw(){
    var f = filtered(); while(list.firstChild) list.removeChild(list.firstChild);
    f.slice(0, state.shown).forEach(function(p){
      var li = el('li', 'docitem'), a = el('a', 'dtitle', p.title); a.href = p.link; a.target = '_blank'; a.rel = 'noopener'; li.appendChild(a);
      var bits = []; if(p.catText) bits.push(p.catText); var d = nice(p.date); if(d) bits.push(d);
      if(bits.length) li.appendChild(el('span', 'dmeta', bits.join(' · ')));
      list.appendChild(li);
    });
    emptyBox.hidden = !(state.all.length && !f.length);
    more.hidden = f.length <= state.shown;
    count.textContent = f.length ? (f.length + (f.length === 1 ? ' item' : ' items')) : '';
  }
  function fail(){ loading.hidden = true; none.hidden = false; }
  get(HOST + '/wp-json/wp/v2/categories?slug=' + SLUGS.join(',') + '&per_page=20&_fields=id,slug,name').then(function(cs){
    if(!Array.isArray(cs) || !cs.length){ fail(); return; }
    var ids = []; cs.forEach(function(c){ ids.push(c.id); catName[c.id] = txt(c.name); });
    var slugOf = {}; cs.forEach(function(c){ slugOf[c.id] = c.slug; });
    return get(HOST + '/wp-json/wp/v2/posts?per_page=100&categories=' + ids.join(',') + '&_fields=link,date,title,categories').then(function(ps){
      if(!Array.isArray(ps)) { fail(); return; }
      ps.forEach(function(p){
        var title = p && p.title ? txt(p.title.rendered) : '', link = p && p.link ? String(p.link) : '';
        if(!title || link.indexOf(HOST + '/') !== 0) return;
        var slugs = [], names = [];
        (p.categories || []).forEach(function(id){ if(slugOf[id]){ slugs.push(slugOf[id]); names.push(catName[id]); } });
        state.all.push({ title: title, link: link, date: p.date, slugs: slugs, catText: names.join(', ') });
      });
      loading.hidden = true;
      if(!state.all.length){ none.hidden = false; return; }
      draw();
    });
  }).catch(fail);
  cats.addEventListener('click', function(e){ var b = e.target.closest ? e.target.closest('button[data-slug]') : null; if(!b) return; state.slug = b.getAttribute('data-slug'); state.shown = 30; Array.prototype.forEach.call(cats.querySelectorAll('button'), function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); draw(); });
  search.addEventListener('input', function(){ state.q = search.value.trim().slice(0, 80); state.shown = 30; draw(); });
  more.addEventListener('click', function(){ state.shown += 30; draw(); });
})();
