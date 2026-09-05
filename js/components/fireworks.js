/**
 * =====================================================================
 * COMPONENT: FIREWORKS ENGINE
 * Night sky celebratory bursts for Page 4 (Birthday Celebration)
 * Luminous pastel fireworks with spark trails & radiant sky flashes
 * =====================================================================
 */
(function() {
  "use strict";

  function initFireworks(canvas, reduceMotion) {
    if (!canvas) return { fire: function() {}, stop: function() {} };
    var ctx = canvas.getContext('2d');

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;

      // Check containing app frame or stage for reliable sizing
      var appEl = canvas.closest('.app') || document.querySelector('.app');
      if (appEl) {
        var appRect = appEl.getBoundingClientRect();
        if (appRect.width > 0) w = Math.min(w || appRect.width, appRect.width);
        if (appRect.height > 0) h = Math.min(h || appRect.height, appRect.height);
      }

      if (!w || w <= 0) {
        var stageEl = document.getElementById('stage');
        if (stageEl) {
          var stageRect = stageEl.getBoundingClientRect();
          if (stageRect.width > 0) w = stageRect.width;
          if (stageRect.height > 0) h = stageRect.height;
        }
      }

      if (!w || w <= 0) w = Math.min(window.innerWidth || 430, 430);
      if (!h || h <= 0) h = window.innerHeight || 700;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    // Celebratory pastel color palettes (harmonious night sky blooms)
    var fireworkPalettes = [
      ['#FFD1DC', '#F3A7B9', '#FFFFFF', '#FFF0F5'], // Sakura pink & white
      ['#FBF3E1', '#F7D1B8', '#FFE4B5', '#FFFDF9'], // Warm golden champagne
      ['#D6C7EB', '#E6D7FF', '#F3C6D3', '#FFFFFF'], // Lavender twilight
      ['#F9B4AB', '#FFB7B2', '#FBF3E1', '#FFE8D6'], // Peach sunrise
      ['#E8A0BF', '#FAD02C', '#FFFFFF', '#F7C5CC']  // Celebration rose & star
    ];

    var particles = [];
    var flashes = [];
    var looping = false;
    var ambientTimer = null;
    var isFiring = false;

    function burst(x, y) {
      var dpr = window.devicePixelRatio || 1;
      var palette = fireworkPalettes[Math.floor(Math.random() * fireworkPalettes.length)];
      var particleCount = reduceMotion ? 20 : (40 + Math.floor(Math.random() * 18));
      var baseSpeed = (2.2 + Math.random() * 1.8) * dpr;

      // Radiant sky flash at burst center
      flashes.push({
        x: x,
        y: y,
        radius: (42 + Math.random() * 32) * dpr,
        color: palette[0],
        alpha: 0.48,
        decay: 0.045
      });

      for (var i = 0; i < particleCount; i++) {
        var angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.2;
        var speedSpread = 0.5 + Math.random() * 0.9;
        var speed = baseSpeed * speedSpread;
        var color = palette[Math.floor(Math.random() * palette.length)];

        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          decay: 0.012 + Math.random() * 0.008,
          size: (2.4 + Math.random() * 2.0) * dpr,
          color: color,
          trail: [],
          twinkle: Math.random() > 0.35
        });
      }
    }

    function loop() {
      if (!looping) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var dpr = window.devicePixelRatio || 1;

      // 1. Draw glowing sky flashes
      for (var f = flashes.length - 1; f >= 0; f--) {
        var flash = flashes[f];
        flash.alpha -= flash.decay;
        if (flash.alpha <= 0) {
          flashes.splice(f, 1);
          continue;
        }
        var grad = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, flash.radius);
        grad.addColorStop(0, flash.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save();
        ctx.globalAlpha = flash.alpha;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw sparkling particles with trails
      for (var pIdx = particles.length - 1; pIdx >= 0; pIdx--) {
        var p = particles[pIdx];

        // Store trail
        p.trail.unshift({ x: p.x, y: p.y });
        if (p.trail.length > 4) p.trail.pop();

        // Physics: drag and gentle gravity
        p.vx *= 0.955;
        p.vy *= 0.955;
        p.vy += 0.038 * dpr;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(pIdx, 1);
          continue;
        }

        var currentAlpha = p.life;
        if (p.twinkle && Math.random() > 0.75) {
          currentAlpha *= 0.5; // gentle sparkle flicker
        }

        // Draw luminous spark trail
        if (p.trail.length > 1) {
          ctx.save();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.55;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          for (var t = 0; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.globalAlpha = Math.max(0, currentAlpha * 0.45);
          ctx.stroke();
          ctx.restore();
        }

        // Draw spark head
        ctx.save();
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6 * dpr;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (particles.length > 0 || flashes.length > 0 || isFiring) {
        requestAnimationFrame(loop);
      } else {
        looping = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    function fireCelebrationSequence() {
      resize();
      if (!looping) {
        looping = true;
        requestAnimationFrame(loop);
      }
      isFiring = true;

      var w = canvas.width;
      var h = canvas.height;

      // Burst coordinates focused across the upper night sky
      var positions = [
        { x: 0.32 * w, y: 0.22 * h }, // Upper left
        { x: 0.70 * w, y: 0.18 * h }, // Near the moon
        { x: 0.48 * w, y: 0.28 * h }, // Upper center
        { x: 0.22 * w, y: 0.34 * h }, // Mid-left
        { x: 0.78 * w, y: 0.30 * h }, // Mid-right
        { x: 0.52 * w, y: 0.16 * h }, // High center bloom
        { x: 0.38 * w, y: 0.26 * h }, // Left-center
        { x: 0.64 * w, y: 0.24 * h }  // Right-center
      ];

      var step = 0;
      function nextBurst() {
        if (step >= positions.length) {
          isFiring = false;
          // Schedule occasional ambient celebratory bursts in the sky
          startAmbientFireworks();
          return;
        }
        var pos = positions[step];
        var jitterX = (Math.random() - 0.5) * 0.08 * w;
        var jitterY = (Math.random() - 0.5) * 0.06 * h;
        burst(pos.x + jitterX, pos.y + jitterY);

        step++;
        var delay = 360 + Math.random() * 260;
        setTimeout(nextBurst, delay);
      }

      nextBurst();
    }

    function startAmbientFireworks() {
      if (ambientTimer) clearTimeout(ambientTimer);
      // Gentle occasional firework in the distant night sky every 3.5 - 5 seconds
      function ambientCycle() {
        ambientTimer = setTimeout(function() {
          var bdayPage = document.getElementById('page-birthday');
          if (!bdayPage || !bdayPage.classList.contains('is-active')) {
            return; // Only fire if celebration page is active
          }
          var w = canvas.width;
          var h = canvas.height;
          var x = w * (0.22 + Math.random() * 0.56);
          var y = h * (0.16 + Math.random() * 0.22);
          burst(x, y);
          if (!looping) {
            looping = true;
            requestAnimationFrame(loop);
          }
          ambientCycle();
        }, 3600 + Math.random() * 1800);
      }
      ambientCycle();
    }

    return {
      fire: function() {
        fireCelebrationSequence();
      },
      stop: function() {
        if (ambientTimer) clearTimeout(ambientTimer);
        isFiring = false;
        particles = [];
        flashes = [];
      }
    };
  }

  window.initFireworks = initFireworks;
})();
