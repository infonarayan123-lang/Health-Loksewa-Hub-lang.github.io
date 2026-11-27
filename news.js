/* Latest posts from the WordPress news site (public list). Shows nothing if the site is empty or cannot be reached. */
(function(){
  'use strict';
  var HOST = 'https://news.healthloksewa.com';
  var box = document.getElementById('wpNews'), list = document.getElementById('wpnList');
  if(!box || !list || !window.fetch) return;
  function el(t, c, x){ var e = document.createElement(t); if(c) e.className = c; if(x != null) e.textContent = x; return e; }
  function txt(s){ var d = document.createElement('textarea'); d.innerHTML = String(s == null ? '' : s); return d.value; }
  function nice(iso){ var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); if(!m) return ''; var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return Number(m[3]) + ' ' + M[Number(m[2]) - 1] + ' ' + m[1]; }
  function cat(p){ try{ var g = p._embedded['wp:term'][0]; for(var i = 0; i < g.length; i++){ if(g[i].taxonomy === 'category' && g[i].slug !== 'uncategorized') return txt(g[i].name); } }catch(e){} return ''; }
  var ctl = window.AbortController ? new AbortController() : null, timer = setTimeout(function(){ if(ctl) ctl.abort(); }, 7000);
  fetch(HOST + '/wp-json/wp/v2/posts?per_page=6&_embed=wp:term&_fields=link,date,title,_embedded', { signal: ctl ? ctl.signal : undefined })
    .then(function(r){ if(!r.ok) throw new Error('bad'); return r.json(); })
    .then(function(a){
      clearTimeout(timer);
      if(!Array.isArray(a)) return;
      var n = 0;
      a.slice(0, 6).forEach(function(p){
        var title = p && p.title ? txt(p.title.rendered) : '', link = p && p.link ? String(p.link) : '';
        if(!title || link.indexOf(HOST + '/') !== 0) return;
        var c = el('a', 'wpn-card'); c.href = link; c.target = '_blank'; c.rel = 'noopener';
        var k = cat(p); if(k) c.appendChild(el('span', 'wpn-cat', k));
        c.appendChild(el('span', 'wpn-title', title));
        var d = nice(p.date); if(d) c.appendChild(el('span', 'wpn-date', d));
        list.appendChild(c); n++;
      });
      if(n) box.hidden = false;
    })
    .catch(function(){ clearTimeout(timer); });
})();
