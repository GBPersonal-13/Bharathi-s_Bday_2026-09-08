/**
 * =====================================================================
 * APP CORE: NAVIGATION, AUDIO, PROGRESS, BOOTSTRAP
 * Wires all page controllers and components together
 * =====================================================================
 */
(function() {
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var order = ['opening', 'story', 'game', 'birthday', 'letter', 'secret'];

  /* ---------------- Page navigation ---------------- */
  function goTo(id) {
    var stage = document.getElementById('stage');
    var current = stage.querySelector('.page.is-active');
    var target = document.getElementById('page-' + id);
    if (!target) return;
    if (current) {
      current.classList.remove('is-active');
      current.classList.add('is-prev');
      (function(el) {
        setTimeout(function() { el.classList.remove('is-prev'); }, 800);
      })(current);
    }
    target.classList.add('is-active');
    target.scrollTop = 0;
    updateProgress(id);
    setTimeout(function() {
      window.dispatchEvent(new Event('resize'));
    }, 60);
    if (id === 'secret' && typeof window.onEnterSecretPage === 'function') {
      window.onEnterSecretPage();
    }
  }

  // Expose globally so page controllers can call it
  window.goTo = goTo;

  function updateProgress(id) {}
  updateProgress('opening');

  document.querySelectorAll('[data-goto]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      goTo(btn.getAttribute('data-goto'));
    });
  });

  document.getElementById('beginBtn').addEventListener('click', function() {
    goTo('story');
  });

  /* ---------------- Audio engine ---------------- */
  var musicBtn = document.getElementById('musicBtn');
  var music = document.getElementById('bgMusic');
  var playing = false;

  musicBtn.addEventListener('click', function() {
    if (playing) {
      music.pause();
      playing = false;
      musicBtn.classList.remove('playing');
    } else {
      music.play().catch(function() { /* no audio source configured yet */ });
      playing = true;
      musicBtn.classList.add('playing');
    }
  });

  /* ---------------- Bootstrap components & pages ---------------- */

  // Petal engines (one per canvas)
  var petalEngines = {};
  var bdayPetalEngine = null;
  document.querySelectorAll('canvas.petal-canvas').forEach(function(c, i) {
    var engine = window.initPetalCanvas(c, reduceMotion);
    petalEngines[i] = engine;
    if (c.id === 'bdayPetalCanvas') {
      bdayPetalEngine = engine;
    }
  });

  // Fireworks
  var bdayFireworks = window.initFireworks(document.getElementById('fireworksCanvas'), reduceMotion);

  // Storm transition
  window.initStormTransition(reduceMotion);

  // Page controllers
  window.initStoryPage();
  window.initQuizPage();
  window.initCelebrationPage(bdayFireworks, bdayPetalEngine);
  window.initLetterPage();
  window.initSecretPage(reduceMotion);

})();
