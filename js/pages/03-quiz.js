/**
 * =====================================================================
 * PAGE 3 CONTROLLER: THE QUIZ
 * Renders quiz questions and handles scoring
 * =====================================================================
 */
(function() {
  "use strict";

  function initQuizPage() {
    var config = window.HER_CONFIG;
    if (!config || !config.QUIZ) return;

    var QUIZ = config.QUIZ;
    var correctFeedback = config.correctFeedback;
    var wrongFeedback = config.wrongFeedback;

    var qIndex = 0;
    var signboard = document.getElementById('signboard');
    var gameProgress = document.getElementById('gameProgress');
    var gameProgressFill = document.getElementById('gameProgressFill');

    function renderQuestion() {
      var item = QUIZ[qIndex];
      gameProgress.childNodes[0].textContent = 'Question ' + (qIndex + 1) + ' / ' + QUIZ.length;
      gameProgressFill.style.width = ((qIndex / QUIZ.length) * 100) + '%';

      var html = '<div class="q-text">' + item.q + '</div><div class="q-options">';
      item.options.forEach(function(opt, i) {
        html += '<button class="q-option" data-i="' + i + '">' + opt + '</button>';
      });
      html += '</div>';
      signboard.innerHTML = html;

      var feedbackEl = document.getElementById('qFeedback');
      if (feedbackEl) {
        feedbackEl.textContent = '';
        feedbackEl.classList.remove('show');
      }

      signboard.querySelectorAll('.q-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (signboard.querySelector('.q-option.chosen')) return;
          btn.classList.add('chosen');
          var optIndex = parseInt(btn.getAttribute('data-i'), 10);
          var pool = Math.random() > 0.35 ? correctFeedback : wrongFeedback;
          var replyText = (item.replies && item.replies[optIndex])
            ? item.replies[optIndex]
            : pool[Math.floor(Math.random() * pool.length)];

          // Thoughtful pause before showing reply so it's not abrupt
          setTimeout(function() {
            if (feedbackEl) {
              feedbackEl.textContent = replyText;
              feedbackEl.classList.add('show');
            }
          }, 450);

          // Softly fade out feedback just before switching questions
          setTimeout(function() {
            if (feedbackEl) {
              feedbackEl.classList.remove('show');
            }
          }, 3600);

          // Exactly 4 seconds delay after answer made to move to next question
          setTimeout(function() {
            qIndex++;
            if (qIndex < QUIZ.length) {
              renderQuestion();
            } else {
              finishGame();
            }
          }, 4000);
        });
      });
    }

    function finishGame() {
      gameProgressFill.style.width = '100%';
      signboard.style.display = 'none';
      var feedbackArea = document.getElementById('gameFeedbackArea');
      if (feedbackArea) feedbackArea.style.display = 'none';
      document.getElementById('gameResult').style.display = 'block';
    }

    renderQuestion();

    document.getElementById('findOutBtn').addEventListener('click', function() {
      document.getElementById('hiddenMsg').classList.add('shown');
      this.style.display = 'none';
      document.getElementById('toBirthdayBtn').style.display = 'inline-block';
    });
  }

  window.initQuizPage = initQuizPage;
})();
