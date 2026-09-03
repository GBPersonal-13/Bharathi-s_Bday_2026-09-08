/**
 * =====================================================================
 * PAGE 2 CONTROLLER: OUR STORY
 * Renders chapter timeline cards from config
 * =====================================================================
 */
(function() {
  "use strict";

  function initStoryPage() {
    var config = window.HER_CONFIG;
    if (!config || !config.CHAPTERS) return;

    var pathEl = document.getElementById('chapterPath');
    if (!pathEl) return;

    config.CHAPTERS.forEach(function(ch) {
      var div = document.createElement('div');
      div.className = 'chapter';
      div.innerHTML =
        '<div class="chapter-card">' +
          '<div class="chapter-label">' + ch.label + '</div>' +
          '<div class="chapter-title">' + ch.title + '</div>' +
          '<div class="chapter-body"><div class="chapter-body-inner">' +
            '<div class="polaroid">' + ch.icon + '</div>' +
            '<div class="chapter-date">' + ch.date + '</div>' +
            '<div class="chapter-note">"' + ch.note + '"</div>' +
            '<p style="font-size:13px;color:var(--ink-soft);margin-top:8px;line-height:1.6;">' + ch.body + '</p>' +
          '</div></div>' +
        '</div>';
      div.querySelector('.chapter-card').addEventListener('click', function() {
        div.classList.toggle('open');
      });
      pathEl.appendChild(div);
    });
  }

  window.initStoryPage = initStoryPage;
})();
