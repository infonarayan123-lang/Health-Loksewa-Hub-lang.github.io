/* App-style bottom tab bar for phones. Same look as the app. Hidden on laptops by CSS. Uses only words the site already has. */
(function(){
  'use strict';
  if(document.getElementById('hlAppbar')) return;
  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var SV = function(d){ return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var tabs = [
    ['index.html', 'Home', SV('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>')],
    ['library.html', 'Library', SV('<path d="M4 5h5a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4z"/><path d="M20 5h-5a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h6z"/>')],
    ['tools.html', 'Tools', SV('<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2"/>')],
    ['loksewa.html', 'Exams', SV('<path d="M9 11l3 3 8-8"/><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>')],
    ['search.html', 'Search', SV('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>')]
  ];
  var nav = document.createElement('nav'); nav.id = 'hlAppbar'; nav.className = 'appbar'; nav.setAttribute('aria-label', 'Quick menu');
  tabs.forEach(function(t){
    var a = document.createElement('a'); a.href = t[0]; if(t[0] === file || (file === '' && t[0] === 'index.html')){ a.className = 'on'; a.setAttribute('aria-current', 'page'); }
    a.innerHTML = t[2]; var s = document.createElement('span'); s.textContent = t[1]; a.appendChild(s); nav.appendChild(a);
  });
  document.body.appendChild(nav);
})();
