/**
 * =====================================================================
 * PAGE 5 CONTROLLER: THE LETTER
 * Envelope opening and letter reveal interaction
 * =====================================================================
 */
(function() {
  "use strict";

  function initLetterPage() {
    var envelope = document.getElementById('envelope');
    if (!envelope) return;

    envelope.addEventListener('click', function() {
      envelope.classList.add('open');
      setTimeout(function() {
        document.getElementById('envelopeWrap').style.display = 'none';
        document.getElementById('letterPaper').classList.add('show');
        setTimeout(function() {
          document.getElementById('letterEnd').classList.add('show');
        }, 2200);
      }, 700);
    });
  }

  window.initLetterPage = initLetterPage;
})();
