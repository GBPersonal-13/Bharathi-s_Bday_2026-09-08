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
          var tapHint = document.getElementById('bdayTapHint');
          if (tapHint) {
            tapHint.style.transition = 'opacity 0.4s ease';
            tapHint.style.opacity = '0';
          }
          setTimeout(function() {
            bdayIntro.classList.add('fade-out');
            setTimeout(function() {
              bdayIntro.style.display = 'none';
              var cakeScene = document.getElementById('cakeScene');
              if (cakeScene) {
                cakeScene.classList.add('show');
              }
            }, 750);
          }, 1500);
        }
      });
    }

    // Wish / blow-out candles
    var wishBtn = document.getElementById('wishBtn');
    var cakeSvg = document.querySelector('.cake');
    if (cakeSvg && wishBtn) {
      cakeSvg.addEventListener('click', function() {
        if (!wishBtn.classList.contains('done')) {
          wishBtn.click();
        }
      });
    }

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
          var cakeScene = document.getElementById('cakeScene');
          if (cakeScene) {
            cakeScene.classList.add('fade-out');
            setTimeout(function() {
              cakeScene.style.display = 'none';
              document.getElementById('bdayMessage').classList.add('show');
              setTimeout(function() {
                document.getElementById('bdayEnd').classList.add('show');
              }, 1800);
            }, 600);
          } else {
            document.getElementById('bdayMessage').classList.add('show');
          }
        }, 1300);
      });
    }
  }

  window.initCelebrationPage = initCelebrationPage;
})();
