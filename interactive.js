(function () {
  'use strict';

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .blank-interactive {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        vertical-align: middle;
        flex-wrap: wrap;
      }
      .blank-input {
        font-family: var(--font-sans, inherit);
        font-size: inherit;
        font-weight: 600;
        font-style: inherit;
        padding: 4px 10px;
        border: 2px solid var(--color-border-strong, #ccc);
        border-radius: 6px;
        background: var(--color-surface, #fff);
        color: var(--color-text, #222);
        min-width: 70px;
        width: auto;
        text-align: center;
        transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        margin: 0 2px;
      }
      .blank-input:focus {
        outline: none;
        border-color: var(--color-accent-light, #2196F3);
        background: var(--color-surface, #fff);
        box-shadow: 0 0 0 3px var(--color-accent-bg, #f0f8ff);
      }
      .blank-input.correct {
        border-color: var(--color-success, #4CAF50);
        background: var(--color-success-bg, #e8f5e9);
        color: var(--color-success, #2e7d32);
      }
      .blank-input.incorrect {
        border-color: var(--color-error, #f44336);
        background: var(--color-error-bg, #ffebee);
        color: var(--color-error, #c62828);
      }
      .blank-feedback {
        font-size: 0.85em;
        font-weight: 700;
        white-space: nowrap;
        font-family: var(--font-sans, inherit);
      }
      .blank-feedback.correct {
        color: var(--color-success, #4CAF50);
      }
      .blank-feedback.incorrect {
        color: var(--color-error, #f44336);
      }
      .blank-show-answer {
        font-size: 0.75em;
        padding: 3px 10px;
        border: 1px solid var(--color-border-strong, #999);
        border-radius: 6px;
        background: var(--color-surface-raised, #f5f5f5);
        color: var(--color-text-secondary, #555);
        cursor: pointer;
        font-family: var(--font-sans, inherit);
        font-weight: 500;
        white-space: nowrap;
        transition: all 0.2s;
      }
      .blank-show-answer:hover {
        background: var(--color-surface, #fff);
        border-color: var(--color-text-muted, #666);
        color: var(--color-text, #222);
      }
      .blank-answer-shown {
        color: var(--color-accent-light, #2196F3);
        font-size: 0.85em;
        font-weight: 700;
        white-space: nowrap;
        font-family: var(--font-sans, inherit);
      }
    `;
    document.head.appendChild(style);
  }

  function normalize(str) {
    return str.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function initBlanks() {
    const blanks = document.querySelectorAll('.blank');

    blanks.forEach(function (blankSpan) {
      const answer = blankSpan.dataset.answer;
      if (!answer) return;

      const container = document.createElement('span');
      container.className = 'blank-interactive';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'blank-input';
      input.placeholder = '___';
      input.style.width = Math.max(70, answer.length * 12 + 16) + 'px';
      input.dataset.answer = answer;

      const feedback = document.createElement('span');
      feedback.className = 'blank-feedback';
      feedback.style.display = 'none';

      const showAnswerBtn = document.createElement('button');
      showAnswerBtn.textContent = 'Show Answer';
      showAnswerBtn.className = 'blank-show-answer';
      showAnswerBtn.style.display = 'none';

      showAnswerBtn.addEventListener('click', function () {
        input.value = answer;
        input.classList.add('correct');
        input.classList.remove('incorrect');
        input.disabled = true;
        feedback.style.display = 'none';
        showAnswerBtn.style.display = 'none';

        const answerDisplay = document.createElement('span');
        answerDisplay.className = 'blank-answer-shown';
        answerDisplay.textContent = '(answer shown)';
        container.appendChild(answerDisplay);
      });

      function checkAnswer() {
        const userAnswer = input.value.trim();
        if (!userAnswer) return;

        const normalizedUser = normalize(userAnswer);
        const normalizedAnswer = normalize(answer);

        if (normalizedUser === normalizedAnswer) {
          input.classList.add('correct');
          input.classList.remove('incorrect');
          input.disabled = true;
          feedback.textContent = '\u2713 Correct!';
          feedback.className = 'blank-feedback correct';
          feedback.style.display = 'inline';
          showAnswerBtn.style.display = 'none';
        } else {
          input.classList.add('incorrect');
          input.classList.remove('correct');
          feedback.textContent = '\u2717 Incorrect';
          feedback.className = 'blank-feedback incorrect';
          feedback.style.display = 'inline';
          showAnswerBtn.style.display = 'inline-block';
        }
      }

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          checkAnswer();
        }
      });

      input.addEventListener('blur', checkAnswer);

      container.appendChild(input);
      container.appendChild(feedback);
      container.appendChild(showAnswerBtn);

      blankSpan.textContent = '';
      blankSpan.appendChild(container);
    });
  }

  addStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlanks);
  } else {
    initBlanks();
  }
})();
