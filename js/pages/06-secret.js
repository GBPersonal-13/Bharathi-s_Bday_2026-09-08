/**
 * =====================================================================
 * PAGE 6 CONTROLLER: THE SECRET
 * Pitch-black starfield, draggable moon with flashlight halo,
 * proximity-revealed hidden password star, and secret unlock
 * =====================================================================
 */
(function() {
  "use strict";

  function initSecretPage(reduceMotion) {
    var config = window.HER_CONFIG;
    var SECRET_ANSWERS = (config && config.SECRET_ANSWERS) ? config.SECRET_ANSWERS : ['dd.mm.yyyy'];

    function normalize(s) {
      return s.toLowerCase().replace(/\s+/g, '').trim();
    }

    var pageSecret = document.getElementById('page-secret');
    var secretMoon = document.getElementById('secretMoon');
    var moonDragHint = document.getElementById('moonDragHint');
    var hiddenStarEl = document.getElementById('secretHiddenStar');
    var hiddenValEl = document.getElementById('secretHiddenVal');

    var starsCanvas = document.getElementById('secretStarsCanvas');
    var starsCtx = starsCanvas ? starsCanvas.getContext('2d') : null;
    var starsW = 0, starsH = 0, starsDpr = 1;
    var secretStars = [];
    var starsAnimId = null;

    var moonPos = { x: 0, y: 0 };
    var starCoord = { x: 0, y: 0 };
    var isDraggingMoon = false;
    var dragOffset = { x: 0, y: 0 };
    var hasDraggedMoon = false;

    function resizeSecretStars() {
      if (!starsCanvas || !starsCtx || !pageSecret) return;
      var rect = pageSecret.getBoundingClientRect();
      starsW = rect.width || window.innerWidth;
      starsH = rect.height || window.innerHeight;
      starsDpr = Math.min(window.devicePixelRatio || 1, 2);
      starsCanvas.width = starsW * starsDpr;
      starsCanvas.height = starsH * starsDpr;
      starsCtx.setTransform(starsDpr, 0, 0, starsDpr, 0, 0);
      initSecretStars();
    }

    function initSecretStars() {
      secretStars = [];
      var count = 110;
      for (var i = 0; i < count; i++) {
        secretStars.push({
          x: Math.random() * starsW,
          y: Math.random() * starsH,
          radius: 0.6 + Math.random() * 1.5,
          baseAlpha: 0.15 + Math.random() * 0.65,
          twinkleSpeed: 0.0015 + Math.random() * 0.0035,
          phase: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.25 ? 'rgba(243,198,211,' : (Math.random() < 0.2 ? 'rgba(255,248,234,' : 'rgba(255,255,255,')
        });
      }
    }

    function renderSecretStars(now) {
      if (!starsCtx || !starsW || !starsH) return;
      starsCtx.clearRect(0, 0, starsW, starsH);

      if (moonPos.x && moonPos.y) {
        var moonGlow = starsCtx.createRadialGradient(moonPos.x, moonPos.y, 8, moonPos.x, moonPos.y, 220);
        moonGlow.addColorStop(0, 'rgba(255, 248, 230, 0.14)');
        moonGlow.addColorStop(0.35, 'rgba(216, 203, 232, 0.06)');
        moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        starsCtx.fillStyle = moonGlow;
        starsCtx.fillRect(0, 0, starsW, starsH);
      }

      for (var i = 0; i < secretStars.length; i++) {
        var s = secretStars[i];
        var alpha = s.baseAlpha + Math.sin(now * s.twinkleSpeed + s.phase) * 0.22;
        alpha = Math.max(0.08, Math.min(1, alpha));

        if (moonPos.x && moonPos.y) {
          var mdx = s.x - moonPos.x;
          var mdy = s.y - moonPos.y;
          var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 190) {
            alpha = Math.min(1, alpha + (1 - mDist / 190) * 0.45);
          }
        }

        starsCtx.fillStyle = s.hue + alpha + ')';
        starsCtx.beginPath();
        starsCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        starsCtx.fill();
      }

      if (!reduceMotion) {
        starsAnimId = requestAnimationFrame(renderSecretStars);
      }
    }

    function updateMoonDOM() {
      if (!secretMoon) return;
      secretMoon.style.left = moonPos.x + 'px';
      secretMoon.style.top = moonPos.y + 'px';
      if (moonDragHint && !hasDraggedMoon) {
        moonDragHint.style.left = moonPos.x + 'px';
        moonDragHint.style.top = (moonPos.y + 44) + 'px';
      }
    }

    function initMoonAndStar() {
      if (!pageSecret) return;
      var rect = pageSecret.getBoundingClientRect();
      var w = rect.width || window.innerWidth;
      var h = rect.height || window.innerHeight;

      moonPos.x = w * 0.5;
      moonPos.y = 80;
      updateMoonDOM();

      var side = Math.random() < 0.5 ? 'left' : 'right';
      starCoord.x = side === 'left' ? (w * (0.16 + Math.random() * 0.22)) : (w * (0.62 + Math.random() * 0.22));
      starCoord.y = h * (0.16 + Math.random() * 0.32);

      if (hiddenStarEl) {
        hiddenStarEl.style.left = starCoord.x + 'px';
        hiddenStarEl.style.top = starCoord.y + 'px';
      }
      if (hiddenValEl) {
        hiddenValEl.textContent = SECRET_ANSWERS[0] || 'dd.mm.yyyy';
      }

      checkMoonProximity();
    }

    function checkMoonProximity() {
      if (!hiddenStarEl) return;
      var dx = moonPos.x - starCoord.x;
      var dy = moonPos.y - starCoord.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var radius = 190;

      if (dist >= radius) {
        hiddenStarEl.style.opacity = '0';
        hiddenStarEl.style.filter = 'blur(10px)';
        hiddenStarEl.style.transform = 'translate(-50%, -50%) scale(0.8)';
        hiddenStarEl.classList.remove('revealed');
      } else {
        var ratio = 1 - (dist / radius);
        var eased = Math.pow(ratio, 1.2);
        hiddenStarEl.style.opacity = eased.toFixed(3);
        hiddenStarEl.style.filter = 'blur(' + ((1 - ratio) * 8).toFixed(1) + 'px)';
        hiddenStarEl.style.transform = 'translate(-50%, -50%) scale(' + (0.8 + ratio * 0.25).toFixed(2) + ')';

        if (ratio > 0.58) {
          hiddenStarEl.classList.add('revealed');
          hiddenStarEl.style.borderColor = 'rgba(243, 198, 211, ' + (0.35 + ratio * 0.5) + ')';
          hiddenStarEl.style.boxShadow = '0 0 ' + (ratio * 30).toFixed(0) + 'px rgba(243, 198, 211, ' + (ratio * 0.6) + '), 0 0 ' + (ratio * 55).toFixed(0) + 'px rgba(255, 248, 234, ' + (ratio * 0.35) + ')';
        } else {
          hiddenStarEl.classList.remove('revealed');
          hiddenStarEl.style.boxShadow = '0 0 15px rgba(0,0,0,0.8)';
        }
      }
    }

    // Moon drag via Pointer Events
    if (secretMoon) {
      secretMoon.addEventListener('pointerdown', function(e) {
        isDraggingMoon = true;
        secretMoon.classList.add('is-dragging');
        secretMoon.setPointerCapture(e.pointerId);

        var rect = pageSecret.getBoundingClientRect();
        var pX = e.clientX - rect.left;
        var pY = e.clientY - rect.top;
        dragOffset.x = pX - moonPos.x;
        dragOffset.y = pY - moonPos.y;

        if (!hasDraggedMoon) {
          hasDraggedMoon = true;
          if (moonDragHint) {
            moonDragHint.style.opacity = '0';
            setTimeout(function() { if (moonDragHint) moonDragHint.style.display = 'none'; }, 500);
          }
        }
        e.preventDefault();
      });

      secretMoon.addEventListener('pointermove', function(e) {
        if (!isDraggingMoon) return;
        var rect = pageSecret.getBoundingClientRect();
        var w = rect.width || window.innerWidth;
        var h = rect.height || window.innerHeight;

        var newX = (e.clientX - rect.left) - dragOffset.x;
        var newY = (e.clientY - rect.top) - dragOffset.y;

        newX = Math.max(32, Math.min(w - 32, newX));
        newY = Math.max(32, Math.min(h - 32, newY));

        moonPos.x = newX;
        moonPos.y = newY;
        updateMoonDOM();
        checkMoonProximity();
        e.preventDefault();
      });

      function stopMoonDrag(e) {
        if (!isDraggingMoon) return;
        isDraggingMoon = false;
        secretMoon.classList.remove('is-dragging');
        try { secretMoon.releasePointerCapture(e.pointerId); } catch(err) {}
      }

      secretMoon.addEventListener('pointerup', stopMoonDrag);
      secretMoon.addEventListener('pointercancel', stopMoonDrag);
    }

    // Tap on revealed star to auto-fill password
    if (hiddenStarEl) {
      hiddenStarEl.addEventListener('click', function() {
        var pass = (SECRET_ANSWERS && SECRET_ANSWERS.length > 0) ? SECRET_ANSWERS[0] : 'dd.mm.yyyy';
        var inp = document.getElementById('lockInput');
        if (inp) {
          inp.value = pass;
          var err = document.getElementById('lockError');
          if (err) err.textContent = '';
          inp.focus();
          inp.style.borderColor = 'var(--sakura)';
          inp.style.boxShadow = '0 0 25px rgba(243, 198, 211, 0.7)';
          setTimeout(function() {
            inp.style.borderColor = '';
            inp.style.boxShadow = '';
          }, 1400);
        }
      });
    }

    // Hint toggle
    var hintToggle = document.getElementById('hintToggle');
    if (hintToggle) {
      hintToggle.addEventListener('click', function() {
        document.getElementById('hintText').classList.toggle('show');
      });
    }

    // Unlock button
    var unlockBtn = document.getElementById('unlockBtn');
    if (unlockBtn) {
      unlockBtn.addEventListener('click', function() {
        var val = normalize(document.getElementById('lockInput').value);
        var match = SECRET_ANSWERS.some(function(a) { return normalize(a) === val; });
        if (match && val.length > 0) {
          document.getElementById('secretLocked').style.display = 'none';
          if (secretMoon) secretMoon.style.display = 'none';
          if (moonDragHint) moonDragHint.style.display = 'none';
          if (hiddenStarEl) hiddenStarEl.style.display = 'none';
          document.getElementById('secretReveal').classList.add('show');
        } else {
          document.getElementById('lockError').textContent = "That's not quite it — try again.";
        }
      });
    }

    // Publicly exposed enter hook (called by app.js when navigating to secret page)
    window.onEnterSecretPage = function() {
      resizeSecretStars();
      initMoonAndStar();
      if (!starsAnimId && !reduceMotion) {
        starsAnimId = requestAnimationFrame(renderSecretStars);
      }
    };

    window.addEventListener('resize', function() {
      resizeSecretStars();
      if (pageSecret && pageSecret.classList.contains('is-active')) {
        checkMoonProximity();
      }
    });

    // Edge case: direct load on page 6
    setTimeout(function() {
      if (pageSecret && pageSecret.classList.contains('is-active')) {
        window.onEnterSecretPage();
      }
    }, 100);
  }

  window.initSecretPage = initSecretPage;
})();
