/* NARESH.EXE interactions */
(function(){
  "use strict";

  /* ---------- boot sequence ---------- */
  var boot = document.getElementById('boot');
  setTimeout(function(){ boot.classList.add('done'); }, 1750);
  setTimeout(function(){ boot.remove(); startTyping(); }, 2300);

  /* ---------- typing effect ---------- */
  var roles = [
    "Software & AI Developer",
    "CSE (AI) undergrad · Karunya '28",
    "I ship games, AI & web apps",
    "Open to internships"
  ];
  var typedEl = document.getElementById('typed');
  var ri = 0, ci = 0, deleting = false, started = false;
  function startTyping(){
    if (started) return; started = true; tick();
  }
  function tick(){
    var word = roles[ri];
    if (!deleting){
      ci++;
      if (ci === word.length){ deleting = true; return void setTimeout(tick, 1600); }
      setTimeout(tick, 55);
    } else {
      ci--;
      if (ci === 0){ deleting = false; ri = (ri + 1) % roles.length; return void setTimeout(tick, 350); }
      setTimeout(tick, 28);
    }
    typedEl.textContent = word.slice(0, ci);
  }

  /* ---------- perspective grid canvas ---------- */
  var cv = document.getElementById('grid-bg'), ctx = cv.getContext('2d');
  var W, H, offset = 0;
  function sizeCv(){
    var r = cv.parentElement.getBoundingClientRect();
    W = cv.width = r.width; H = cv.height = r.height;
  }
  sizeCv(); window.addEventListener('resize', sizeCv);
  function drawGrid(){
    ctx.clearRect(0, 0, W, H);
    var horizon = H * 0.62;
    ctx.strokeStyle = 'rgba(230,255,0,0.10)'; ctx.lineWidth = 1;
    // vertical rays
    for (var i = -12; i <= 12; i++){
      ctx.beginPath();
      ctx.moveTo(W/2 + i * W/28, horizon);
      ctx.lineTo(W/2 + i * W/7, H);
      ctx.stroke();
    }
    // horizontal lines scrolling toward viewer
    offset = (offset + 0.6) % 46;
    for (var y = 0; y < 12; y++){
      var t = (y * 46 + offset) / (12 * 46);
      var ly = horizon + Math.pow(t, 2.1) * (H - horizon);
      ctx.globalAlpha = 0.25 + t * 0.75;
      ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(W, ly); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // horizon glow
    var g = ctx.createLinearGradient(0, horizon - 40, 0, horizon + 60);
    g.addColorStop(0, 'rgba(230,255,0,0)');
    g.addColorStop(0.5, 'rgba(230,255,0,0.07)');
    g.addColorStop(1, 'rgba(230,255,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, horizon - 40, W, 100);
    requestAnimationFrame(drawGrid);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) drawGrid();

  /* ---------- scroll reveal + bar animation ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---------- animated counters ---------- */
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      var el = e.target, target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10);
      var start = null, dur = 1400;
      function step(ts){
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * ease).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.hstat-num').forEach(function(el){ cio.observe(el); });

  /* ---------- nav active state ---------- */
  var secs = ['status','arsenal','quests','experience','contact'];
  var links = {};
  document.querySelectorAll('.nav-links a').forEach(function(a){ links[a.dataset.sec] = a; });
  var nio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){
        Object.keys(links).forEach(function(k){ links[k].classList.remove('active'); });
        var l = links[e.target.id]; if (l) l.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  secs.forEach(function(id){ var s = document.getElementById(id); if (s) nio.observe(s); });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger'), navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', function(){ navLinks.classList.toggle('open'); });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
  });

  /* ---------- seamless ticker ---------- */
  var track = document.getElementById('tickerTrack');
  track.innerHTML += track.innerHTML;
})();
