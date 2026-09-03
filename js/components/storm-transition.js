/**
 * =====================================================================
 * COMPONENT: VOLUMETRIC STORM CLOUD TRANSITION
 * Cinematic dark cloud convergence/dispersal between quiz → birthday
 * =====================================================================
 */
(function() {
  "use strict";

  var stormCanvas = null;
  var stormCtx = null;
  var stormWidth, stormHeight, stormDpr;
  var stormParticles = [];
  var stormAnimId = null;

  function resizeStormCanvas() {
    if (!stormCanvas || !stormCtx) return;
    var rect = stormCanvas.getBoundingClientRect();
    stormWidth = rect.width || stormCanvas.clientWidth || window.innerWidth;
    stormHeight = rect.height || stormCanvas.clientHeight || window.innerHeight;
    stormDpr = Math.min(window.devicePixelRatio || 1, 2);
    stormCanvas.width = stormWidth * stormDpr;
    stormCanvas.height = stormHeight * stormDpr;
    stormCtx.setTransform(stormDpr, 0, 0, stormDpr, 0, 0);
  }

  function VolumetricDarkCloud(index) {
    this.index = index;
    this.reset();
  }

  VolumetricDarkCloud.prototype.reset = function() {
    var minDim = Math.min(stormWidth, stormHeight);
    this.radius = minDim * 0.55 + Math.random() * (minDim * 0.35);

    var padding = 180;
    var corner = this.index % 4;
    if (corner === 0) {
      this.startX = -padding;
      this.startY = Math.random() * stormHeight;
    } else if (corner === 1) {
      this.startX = stormWidth + padding;
      this.startY = Math.random() * stormHeight;
    } else if (corner === 2) {
      this.startX = Math.random() * stormWidth;
      this.startY = -padding;
    } else {
      this.startX = Math.random() * stormWidth;
      this.startY = stormHeight + padding;
    }

    this.coverX = (stormWidth * 0.5) + (Math.random() - 0.5) * (stormWidth * 0.6);
    this.coverY = (stormHeight * 0.5) + (Math.random() - 0.5) * (stormHeight * 0.6);

    var angle = Math.atan2(this.coverY - stormHeight / 2, this.coverX - stormWidth / 2) + (Math.random() - 0.5) * 0.6;
    var dist = Math.max(stormWidth, stormHeight) * 1.3;
    this.exitX = this.coverX + Math.cos(angle) * dist;
    this.exitY = this.coverY + Math.sin(angle) * dist;

    this.x = this.startX;
    this.y = this.startY;
    this.alpha = 0;

    var tone = Math.floor(10 + Math.random() * 12);
    this.colorCenter = 'rgba(' + tone + ',' + (tone + 1) + ',' + (tone + 4);
    this.colorMid = 'rgba(' + (tone - 4) + ',' + (tone - 3) + ',' + tone;
  };

  VolumetricDarkCloud.prototype.update = function(phase, progress) {
    if (phase === 'converge') {
      var ease = 1 - Math.pow(1 - progress, 3);
      this.x = this.startX + (this.coverX - this.startX) * ease;
      this.y = this.startY + (this.coverY - this.startY) * ease;
      this.alpha = Math.min(1, progress * 1.35);
    } else if (phase === 'disperse') {
      var ease2 = Math.pow(progress, 2.2);
      this.x = this.coverX + (this.exitX - this.coverX) * ease2;
      this.y = this.coverY + (this.exitY - this.coverY) * ease2;
      this.alpha = Math.max(0, 1 - Math.pow(progress, 1.4));
    }
  };

  VolumetricDarkCloud.prototype.draw = function() {
    if (this.alpha <= 0.001 || !stormCtx) return;

    var grad = stormCtx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );

    grad.addColorStop(0, this.colorCenter + ',' + this.alpha + ')');
    grad.addColorStop(0.45, this.colorMid + ',' + (this.alpha * 0.85) + ')');
    grad.addColorStop(0.75, this.colorMid + ',' + (this.alpha * 0.4) + ')');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    stormCtx.fillStyle = grad;
    stormCtx.beginPath();
    stormCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    stormCtx.fill();
  };

  function initStormClouds() {
    stormParticles = [];
    var density = 28;
    for (var i = 0; i < density; i++) {
      stormParticles.push(new VolumetricDarkCloud(i));
    }
  }

  function playCloudTransition(next, reduceMotion) {
    if (reduceMotion || !stormCanvas || !stormCtx) {
      if (next) next();
      return;
    }

    if (stormAnimId) {
      cancelAnimationFrame(stormAnimId);
      stormAnimId = null;
    }

    resizeStormCanvas();
    initStormClouds();

    var startTime = performance.now();
    var convergeDuration = 1800;
    var holdDuration = 250;
    var disperseDuration = 2000;
    var hasSwitched = false;

    function render(now) {
      var elapsed = now - startTime;
      stormCtx.clearRect(0, 0, stormWidth, stormHeight);

      if (elapsed < convergeDuration) {
        var t = elapsed / convergeDuration;
        stormParticles.forEach(function(p) {
          p.update('converge', t);
          p.draw();
        });
        if (t > 0.88) {
          var ft = (t - 0.88) / 0.12;
          stormCtx.fillStyle = 'rgba(10, 11, 14, ' + ft + ')';
          stormCtx.fillRect(0, 0, stormWidth, stormHeight);
        }
      } else if (elapsed < convergeDuration + holdDuration) {
        stormCtx.fillStyle = '#0a0b0e';
        stormCtx.fillRect(0, 0, stormWidth, stormHeight);
        if (!hasSwitched) {
          hasSwitched = true;
          if (next) next();
        }
      } else if (elapsed < convergeDuration + holdDuration + disperseDuration) {
        var t2 = (elapsed - (convergeDuration + holdDuration)) / disperseDuration;
        if (t2 < 0.15) {
          stormCtx.fillStyle = 'rgba(10, 11, 14, ' + (1 - t2 / 0.15) + ')';
          stormCtx.fillRect(0, 0, stormWidth, stormHeight);
        }
        stormParticles.forEach(function(p) {
          p.update('disperse', t2);
          p.draw();
        });
      } else {
        stormCtx.clearRect(0, 0, stormWidth, stormHeight);
        cancelAnimationFrame(stormAnimId);
        stormAnimId = null;
        return;
      }

      stormAnimId = requestAnimationFrame(render);
    }

    stormAnimId = requestAnimationFrame(render);
  }

  function initStormTransition(reduceMotion) {
    stormCanvas = document.getElementById('stormCanvas');
    if (!stormCanvas) return;
    stormCtx = stormCanvas.getContext('2d');
    window.addEventListener('resize', resizeStormCanvas);
    resizeStormCanvas();

    document.getElementById('toBirthdayBtn').addEventListener('click', function() {
      playCloudTransition(function() {
        window.goTo('birthday');
      }, reduceMotion);
    });
  }

  window.initStormTransition = initStormTransition;
})();
