/* ===== CAPPELLERIA MELEGARI · main.js ===== */
(function(){
  'use strict';

  /* ---- INTRO ---- */
  var intro=document.getElementById('intro');
  function closeIntro(){ if(intro){intro.classList.add('done');document.body.style.overflow='';} }
  if(intro){
    document.body.style.overflow='hidden';
    var skip=document.getElementById('intro-skip');
    if(skip) skip.addEventListener('click',closeIntro);
    setTimeout(closeIntro,2000);
  }
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches){ if(intro){intro.classList.add('done');document.body.style.overflow='';} }

  /* ---- HEADER scroll ---- */
  var header=document.getElementById('site-header');
  function onScroll(){ if(header) header.classList.toggle('scrolled',window.scrollY>18); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* ---- BURGER ---- */
  var burger=document.getElementById('burger'), nav=document.querySelector('.nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');});});
  }

  /* ---- REVEAL ---- */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* ---- LIGHTBOX ---- */
  var lb=document.getElementById('lightbox'),lbImg=document.getElementById('lb-img'),lbClose=document.getElementById('lb-close');
  document.querySelectorAll('.g-item').forEach(function(it){
    it.addEventListener('click',function(){
      var full=it.getAttribute('data-full'); if(!full)return;
      lbImg.src=full; var im=it.querySelector('img'); lbImg.alt=im?im.alt:''; lb.classList.add('open');
    });
  });
  function closeLb(){lb.classList.remove('open');setTimeout(function(){lbImg.src='';},300);}
  if(lbClose) lbClose.addEventListener('click',closeLb);
  if(lb) lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb();});

  /* ---- ORARI DINAMICI ---- */
  // getDay: 0=Dom..6=Sab. Mar–Sab 10–13:30 + 15–19:30 · Lun 15–19:30 · Dom chiuso.
  var TABLE={0:[],1:[[15,19.5]],2:[[10,13.5],[15,19.5]],3:[[10,13.5],[15,19.5]],4:[[10,13.5],[15,19.5]],5:[[10,13.5],[15,19.5]],6:[[10,13.5],[15,19.5]]};
  function nowRome(){
    try{ var s=new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'}); return new Date(s); }
    catch(e){ return new Date(); }
  }
  function fmt(h){var H=Math.floor(h),M=Math.round((h-H)*60);return H+':'+(M<10?'0'+M:''+M);}
  function updateLive(){
    var dot=document.getElementById('live-dot'), txt=document.getElementById('live-text');
    if(!dot||!txt)return;
    var d=nowRome(), day=d.getDay(), hr=d.getHours()+d.getMinutes()/60;
    var wins=TABLE[day]||[], openNow=false, closeAt=0, nextOpen=null;
    for(var i=0;i<wins.length;i++){ if(hr>=wins[i][0]&&hr<wins[i][1]){openNow=true;closeAt=wins[i][1];} if(hr<wins[i][0]&&nextOpen===null){nextOpen=wins[i][0];} }
    var LANG=document.documentElement.getAttribute('lang')||'it';
    if(openNow){
      dot.className='open';
      txt.textContent=(LANG==='en'?'Open now · until ':'Aperto ora · fino alle ')+fmt(closeAt);
    }else if(nextOpen!==null){
      dot.className='closed';
      txt.textContent=(LANG==='en'?'Closed · opens at ':'Chiuso · apre alle ')+fmt(nextOpen);
    }else{
      // trova il prossimo giorno con apertura
      var names=LANG==='en'?['Sun','Mon','Tue','Wed','Thu','Fri','Sat']:['dom','lun','mar','mer','gio','ven','sab'];
      var nd=null,ndDay=null;
      for(var k=1;k<=7;k++){ var dd=(day+k)%7; if((TABLE[dd]||[]).length){ nd=TABLE[dd][0][0]; ndDay=dd; break; } }
      dot.className='closed';
      if(nd!==null) txt.textContent=(LANG==='en'?'Closed · opens ':'Chiuso · apre ')+names[ndDay]+' '+fmt(nd);
      else txt.textContent=(LANG==='en'?'Closed':'Chiuso');
    }
  }
  updateLive(); setInterval(updateLive,60000);

  /* ---- I18N ---- */
  var EN={
    'intro.skip':'Enter →',
    'brand.since':'since 1914',
    'nav.storia':'The story','nav.cappelli':'The hats','nav.maglieria':'More than hats','nav.dove':'The shop',
    'cta.call':'02 312094',
    'hero.eyebrow':'Via Paolo Sarpi 19 · Chinatown, Milan',
    'hero.sub':'Heads covered since 1914. Hats for men and women across three floors — fedoras, panamas, flat caps and top hats — with Borsalino, Stetson and the Melegari collection. Plus English and Scottish knitwear, gloves and accessories.',
    'hero.cta1':'Browse the hats','hero.cta2':'Visit the shop',
    'hero.live':'Checking hours…','hero.f2':'★ 4.6 · 393 reviews',
    'storia.kicker':'The story',
    'storia.h2':'More than a century<br>covering Milanese heads.',
    'storia.p1':'If a shop stays open since <b>1914</b>, there’s a reason. Cappelleria Melegari is one of Milan’s historic names: a landmark for anyone who loves hats and craftsmanship, in the heart of <b>Chinatown</b>, on Via Paolo Sarpi.',
    'storia.p2':'Three floors of headwear for men and women, of every shape, season and colour. Famous brands — Borsalino, Stetson — alongside the <em>Melegari collection</em> and hats made by hand, even to measure.',
    'storia.s1':'the founding year','storia.s2':'floors of hats','storia.s3':'393 reviews',
    'cappelli.kicker':'The wardrobe','cappelli.h2':'Every head, its hat',
    'cappelli.sub':'Five families, a thousand models. From felt to straw, from classic to ceremony — for him and for her.',
    'hat.1t':'The Fedora','hat.1p':'The felt classic with a pinched crown: Borsalino, Stetson and the Melegari collection.',
    'hat.2t':'The Panama & straw','hat.2p':'For summer: panamas, Toyo-straw trilbies and sun hats, light and airy.',
    'hat.3t':'The flat cap & berets','hat.3p':'Flat caps, coppole and berets in English tweed and wool, for every day.',
    'hat.4t':'The top hat & ceremony','hat.4p':'Top hats, bowlers and ceremony hats for the occasions that matter.',
    'hat.5t':'Cloche & women’s hats','hat.5p':'Cloches, capelines and coloured felts: a whole floor dedicated to her.',
    'hat.6t':'…and made to measure','hat.6p':'Some models we make by hand and to measure, with crown and brim on request.','hat.6cta':'Ask in the shop',
    'maglieria.kicker':'More than hats','maglieria.h2':'English knitwear,<br>gloves and accessories.',
    'maglieria.p1':'At Melegari the covered head is only the beginning. A <b>guarantee for lovers of English, Irish and Scottish fabrics</b>: splendid sweaters, knits, shirts, jackets.',
    'maglieria.p2':'And then gloves and scarves of every material and colour, to finish the wardrobe with timeless style.',
    'mag.t1':'Scottish & Irish knitwear','mag.t2':'Leather and wool gloves','mag.t3':'Scarves & accessories',
    'gallery.kicker':'Inside the shop','gallery.h2':'Three floors to explore',
    'rev.kicker':'The word','rev.h2':'4.6 ★ · «Melegari, a safe bet»',
    'dove.kicker':'The shop','dove.h2':'On Via Paolo Sarpi,<br>since 1914.',
    'dove.addr':'Address','dove.addr2':'— Chinatown','dove.hours':'Hours','dove.hoursv':'Tue–Sat 10–13:30 · 15–19:30 · Mon 15–19:30 · Sun closed',
    'dove.phone':'Phone','dove.note':'Good to know','dove.notev':'Three floors, for men and women. You leave with your head covered.',
    'dove.route':'Get directions','dove.call':'Call the shop',
    'faq.h2':'Frequently asked questions',
    'faq.q1':'Where is Cappelleria Melegari?','faq.a1':'At Via Paolo Sarpi 19, in the heart of Milan’s Chinatown. The shop spans three floors.',
    'faq.q2':'What do you sell?','faq.a2':'Hats for men and women of every shape, season and material — fedora, panama, flat cap, top hat, cloche — with brands like Borsalino and Stetson and the Melegari collection. Plus English and Scottish knitwear, gloves, scarves and accessories.',
    'faq.q3':'Do you make hats to measure?','faq.a3':'Yes: some models are made by hand and to measure, on request, with crown and brim sizes agreed with the customer.',
    'faq.q4':'When are you open?','faq.a4':'Tuesday to Saturday 10:00–13:30 and 15:00–19:30; Monday afternoon only 15:00–19:30; closed on Sunday.',
    'foot.sub':'Hats and knitwear since 1914 · Milan',
    'foot.where':'Where','foot.hours':'Hours','foot.hours2':'Tue–Sat 10–13:30 · 15–19:30','foot.hours3':'Mon 15–19:30 · Sun closed','foot.contact':'Contact',
    'foot.disclaimer':'Demo website. Content and photos gathered from public sources (Google Maps); hours, brands and availability are indicative, to be confirmed with the shop.',
    'ab.cappelli':'The hats','ab.call':'Call','ab.route':'Directions'
  };
  var IT={};
  document.querySelectorAll('[data-i18n]').forEach(function(el){ IT[el.getAttribute('data-i18n')]=el.innerHTML; });
  function setLang(lang){
    var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n'); if(dict[k]!=null) el.innerHTML=dict[k]; else if(IT[k]!=null) el.innerHTML=IT[k];
    });
    document.documentElement.setAttribute('lang',lang);
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-lang')===lang);});
    try{localStorage.setItem('melegari_lang',lang);}catch(e){}
    updateLive();
  }
  document.querySelectorAll('.lang button').forEach(function(b){ b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'));}); });
  var saved='it'; try{saved=localStorage.getItem('melegari_lang')||'it';}catch(e){}
  if(saved==='en') setLang('en');

})();
