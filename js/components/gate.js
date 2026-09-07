/**
 * =====================================================================
 * ENTRANCE GATE CONTROLLER
 * Password gate screen that guards landing page until correct key is entered
 * =====================================================================
 */
(function() {
  "use strict";

  var initialized = false;

  function initPasswordGate() {
    if (initialized) return;

    var gateOverlay = document.getElementById('passwordGate');
    var gateInput = document.getElementById('gatePasswordInput');
    var gateBtn = document.getElementById('gateUnlockBtn');
    var gateError = document.getElementById('gateError');
    var gateToggleEye = document.getElementById('gateToggleEye');
    var gateCard = document.getElementById('gateCard');

    if (!gateOverlay) return;
    initialized = true;

    var config = window.HER_CONFIG || {};
    var correctPassword = (config.ENTRY_PASSWORD || "GB13789").trim();

    // Check if session is already unlocked
    var isAlreadyUnlocked = false;
    try {
      isAlreadyUnlocked = sessionStorage.getItem('her_gate_unlocked') === 'true';
    } catch(e) {}

    if (isAlreadyUnlocked) {
      gateOverlay.style.display = 'none';
      return;
    }

    // Auto-focus input on launch
    setTimeout(function() {
      if (gateInput) gateInput.focus();
    }, 300);

    function attemptUnlock() {
      if (!gateInput) return;
      var val = gateInput.value.trim();

      if (val.toLowerCase() === correctPassword.toLowerCase()) {
        // Correct password
        if (gateError) {
          gateError.classList.remove('show');
          gateError.textContent = '';
        }

        try {
          sessionStorage.setItem('her_gate_unlocked', 'true');
        } catch(e) {}

        // Unlock animation flourish
        gateOverlay.classList.add('is-unlocked');

        // Optional petal boost on unlock
        setTimeout(function() {
          if (window.petalEngines && window.petalEngines[0] && window.petalEngines[0].boost) {
            window.petalEngines[0].boost();
          }
        }, 150);

        setTimeout(function() {
          gateOverlay.style.display = 'none';
        }, 700);
      } else {
        // Wrong password
        if (gateError) {
          gateError.textContent = "Oops! That's not the secret key 💕 Try again.";
          gateError.classList.add('show');
        }

        if (gateCard) {
          gateCard.classList.remove('shake');
          // Force reflow
          void gateCard.offsetWidth;
          gateCard.classList.add('shake');
        }

        gateInput.focus();
        gateInput.select();
      }
    }

    if (gateBtn) {
      gateBtn.addEventListener('click', attemptUnlock);
    }

    if (gateInput) {
      gateInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          attemptUnlock();
        }
      });

      gateInput.addEventListener('input', function() {
        if (gateError && gateError.classList.contains('show')) {
          gateError.classList.remove('show');
        }
      });
    }

    if (gateToggleEye && gateInput) {
      gateToggleEye.addEventListener('click', function() {
        var isPassword = gateInput.getAttribute('type') === 'password';
        gateInput.setAttribute('type', isPassword ? 'text' : 'password');
        gateToggleEye.textContent = isPassword ? '🙈' : '👁️';
        gateToggleEye.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      });
    }
  }

  window.initPasswordGate = initPasswordGate;

  if (document.readyState !== 'loading') {
    initPasswordGate();
  } else {
    document.addEventListener('DOMContentLoaded', initPasswordGate);
  }
})();
