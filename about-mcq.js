/* Sample questions for the About page. Shows one question at a time; the answer and explanation appear straight away. Nothing is saved or sent. */
(function(){
  'use strict';
  var Q = [["Deficiency of which vitamin causes night blindness?", ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], 0, "Vitamin A is needed for the retina to see in dim light. Lack of it first shows as night blindness."], ["How many antenatal care contacts does WHO recommend as a minimum for a pregnant woman?", ["2", "4", "6", "8"], 3, "Since 2016 WHO recommends at least eight contacts with a health worker during pregnancy."], ["Which mosquito spreads malaria?", ["Male Anopheles", "Female Anopheles", "Aedes aegypti", "Culex"], 1, "Only the female Anopheles mosquito bites and carries the malaria parasite."], ["Dengue is spread mainly by which mosquito?", ["Aedes aegypti", "Anopheles", "Culex", "Mansonia"], 0, "Aedes aegypti, which bites mostly in the daytime, is the main carrier of dengue."], ["Infant mortality rate is the number of deaths under one year of age per:", ["100 live births", "1,000 live births", "10,000 live births", "100,000 live births"], 1, "IMR is counted per 1,000 live births in a year."], ["The Declaration of Alma-Ata, which promoted primary health care, was adopted in:", ["1948", "1965", "1978", "1986"], 2, "Alma-Ata 1978 set the goal of Health for All through primary health care."], ["The Ottawa Charter is linked with:", ["Health promotion", "Family planning", "Immunisation", "Nutrition labelling"], 0, "The Ottawa Charter for Health Promotion was adopted in 1986."], ["Which study design is best for measuring how common a disease is at one point in time?", ["Case-control", "Cohort", "Cross-sectional", "Randomised trial"], 2, "A cross-sectional study takes a snapshot, so it measures prevalence."], ["The incubation period is the time between:", ["Exposure to an infectious agent and the first symptoms", "First symptoms and recovery", "Birth and the first infection", "Diagnosis and treatment"], 0, "Incubation period runs from exposure to the first symptoms."], ["BCG vaccine mainly protects against serious forms of:", ["Measles", "Tuberculosis", "Polio", "Tetanus"], 1, "BCG protects mainly against severe tuberculosis in children."], ["New cases of a disease in a population at risk during a period of time are called:", ["Prevalence", "Incidence", "Case fatality", "Sensitivity"], 1, "Incidence counts new cases. Prevalence counts all existing cases."], ["Which of these is a waterborne disease?", ["Cholera", "Malaria", "Dengue", "Scabies"], 0, "Cholera spreads through water or food contaminated with the bacterium Vibrio cholerae."], ["What is the median of 2, 4, 6, 8, 10?", ["4", "5", "6", "8"], 2, "The median is the middle value when numbers are in order, which is 6."], ["Immunisation of children is an example of:", ["Primary prevention", "Secondary prevention", "Tertiary prevention", "Rehabilitation"], 0, "Primary prevention stops a disease before it starts."], ["Iodine deficiency mainly causes:", ["Goitre", "Scurvy", "Rickets", "Pellagra"], 0, "Iodine is needed to make thyroid hormone. Lack of it enlarges the thyroid gland (goitre)."], ["Sex ratio is usually expressed as the number of males per:", ["10 females", "100 females", "1,000 females", "10,000 females"], 1, "In demography the sex ratio is males per 100 females."], ["Maternal mortality ratio is expressed per:", ["1,000 live births", "10,000 live births", "100,000 live births", "1,000,000 live births"], 2, "MMR is deaths of mothers per 100,000 live births."], ["How many provinces does Nepal have?", ["5", "6", "7", "8"], 2, "Nepal's 2015 Constitution created seven provinces."], ["Along with ORS, which supplement is given to children with diarrhoea?", ["Zinc", "Iron", "Vitamin K", "Calcium"], 0, "Zinc given with ORS shortens diarrhoea and lowers the chance of it coming back."], ["The pentavalent vaccine protects against how many diseases?", ["3", "4", "5", "6"], 2, "It covers diphtheria, pertussis, tetanus, hepatitis B and Hib: five diseases."]];
  var box = document.getElementById('aq'); if(!box) return;
  var i = 0, score = 0, done = false;
  function el(t, c, x){ var e = document.createElement(t); if(c) e.className = c; if(x != null) e.textContent = x; return e; }
  function start(){
    i = 0; score = 0; done = false; show();
  }
  function intro(){
    box.textContent = ''; var b = el('button', 'btn btn-primary', 'Start the quiz'); b.type = 'button'; b.addEventListener('click', start); box.appendChild(b);
  }
  function show(){
    box.textContent = ''; var q = Q[i];
    var top = el('div', 'aq-top'); top.appendChild(el('span', 'aq-n', 'Question')); top.appendChild(el('b', 'aq-num', String(i + 1))); top.appendChild(el('span', 'aq-n', 'of 20'));
    var bar = el('div', 'aq-bar'); var fill = el('i'); fill.style.width = (i / 20 * 100) + '%'; bar.appendChild(fill); top.appendChild(bar); box.appendChild(top);
    var qq = el('p', 'aq-q'); qq.setAttribute('data-hl-nolang', ''); qq.textContent = q[0]; box.appendChild(qq);
    var list = el('div', 'aq-opts'); var fb = el('div', 'aq-fb'); fb.setAttribute('aria-live', 'polite'); var locked = false; var btns = [];
    q[1].forEach(function(o, k){
      var b = el('button', 'aq-opt'); b.type = 'button'; b.setAttribute('data-hl-nolang', '');
      var l = el('span', 'aq-l', 'ABCD'.charAt(k)); l.setAttribute('data-hl-nolang', ''); b.appendChild(l); var tx = el('span', 'aq-t', o); tx.setAttribute('data-hl-nolang', ''); b.appendChild(tx);
      b.addEventListener('click', function(){
        if(locked) return; locked = true; var ok = k === q[2]; if(ok) score++;
        btns.forEach(function(x, n){ x.disabled = true; if(n === q[2]) x.classList.add('right'); });
        if(!ok) b.classList.add('wrong');
        fb.appendChild(el('b', ok ? 'aq-ok' : 'aq-no', ok ? 'Correct!' : 'Not quite. The right answer is highlighted.'));
        var ex = el('p', 'aq-ex', q[3]); ex.setAttribute('data-hl-nolang', ''); fb.appendChild(ex);
        var nx = el('button', 'btn btn-primary btn-sm', i === 19 ? 'See my score' : 'Next question'); nx.type = 'button';
        nx.addEventListener('click', function(){ if(i === 19) result(); else { i++; show(); } }); fb.appendChild(nx); nx.focus();
      });
      btns.push(b); list.appendChild(b);
    });
    box.appendChild(list); box.appendChild(fb);
  }
  function result(){
    box.textContent = ''; var r = el('div', 'aq-res');
    r.appendChild(el('span', 'aq-n', 'Your score')); var big = el('div', 'aq-big'); big.appendChild(el('b', '', String(score))); big.appendChild(el('span', '', 'out of 20')); r.appendChild(big);
    r.appendChild(el('p', 'aq-more', 'Want more questions like these? Open the app to practise by exam, take timed mock tests and revise your mistakes.'));
    var a = el('a', 'btn btn-primary', 'Open the app'); a.setAttribute('data-app', ''); a.href = 'index.html#get'; r.appendChild(a);
    var again = el('button', 'btn btn-ghost', 'Try again'); again.type = 'button'; again.addEventListener('click', start); r.appendChild(again);
    box.appendChild(r);
  }
  intro();
  /* gallery: shows only the pictures that exist (images/about-1.jpg ... about-6.jpg) */
  var gal = document.getElementById('abGallery'), grid = document.getElementById('abGalleryGrid');
  if(gal && grid){ var shown = 0; for(var n = 1; n <= 6; n++){ (function(n){
    var im = new Image(); im.onload = function(){ var f = document.createElement('figure'); im.alt = 'Photo from Health Loksewa'; im.loading = 'lazy'; f.appendChild(im); grid.appendChild(f); shown++; gal.hidden = false; };
    im.src = 'images/about-' + n + '.jpg'; })(n); } }
})();
