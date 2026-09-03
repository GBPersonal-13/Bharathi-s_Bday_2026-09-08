/**
 * =====================================================================
 * PAGE 4 CONTROLLER: THE CELEBRATION
 * Birthday sky stars, candle blowing, fireworks reveal
 * =====================================================================
 */
(function() {
  "use strict";

  function initCelebrationPage(bdayFireworks, bdayPetalEngine) {
    // Scatter static stars in the night sky
    var starsWrap = document.getElementById('bdayStars');
    if (starsWrap) {
      for (var i = 0; i < 26; i++) {
        var s = document.createElement('span');
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 70 + '%';
        s.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
        starsWrap.appendChild(s);
      }
    }

    // Intro tap-through sequence
    var bdayStep = 1;
    var bdayIntro = document.getElementById('bdayIntro');
    if (bdayIntro) {
      bdayIntro.addEventListener('click', function() {
        if (bdayStep >= 3) return;
        bdayStep++;
        var lines = bdayIntro.querySelectorAll('.bday-line');
        lines.forEach(function(l) {
          if (parseInt(l.getAttribute('data-line'), 10) <= bdayStep) {
            l.classList.add('show');
          }
        });
        if (bdayStep === 3) {
          document.getElementById('bdayTapHint').style.display = 'none';
          setTimeout(function() {
            bdayIntro.style.display = 'none';
            document.getElementById('cakeScene').classList.add('show');
          }, 1400);
        }
      });
    }

    // Wish / blow-out candles
    var wishBtn = document.getElementById('wishBtn');
    if (wishBtn) {
      wishBtn.addEventListener('click', function() {
        this.classList.add('done');
        this.textContent = 'Wish made 🌸';
        document.querySelectorAll('.candle-flame').forEach(function(f) {
          f.classList.add('out');
        });
        var bdayMoon = document.getElementById('bdayMoon');
        if (bdayMoon) bdayMoon.classList.add('bright');
        if (bdayFireworks) bdayFireworks.fire();
        if (bdayPetalEngine) bdayPetalEngine.boost(14);
        setTimeout(function() {
          document.getElementById('cakeScene').style.display = 'none';
          document.getElementById('bdayMessage').classList.add('show');
          setTimeout(function() {
            document.getElementById('bdayEnd').classList.add('show');
          }, 1800);
        }, 1300);
      });
    }
  }

  window.initCelebrationPage = initCelebrationPage;
})();
