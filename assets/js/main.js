(function () {
  /* *********************************************************************************************
   * ScrollProgress bar
   */
  const scrollProgress = document.getElementById('scroll-progress-bar');

  window.addEventListener('scroll', () => {
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

    scrollProgress.style.width = `${(scrollTop / height) * 100}%`;
  });

  /* *********************************************************************************************
   * Toggle dark-light mode
   */
  const darkLightToggleImage = document.getElementById('darkLightToggle');

  if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.toggle('light');
    darkLightToggleImage.src = '/assets/dark.svg';
  }

  darkLightToggleImage.addEventListener('click', () => {
    document.body.classList.toggle('light');

    if (darkLightToggleImage.src.indexOf('/assets/light.svg') > -1) {
      darkLightToggleImage.src = '/assets/dark.svg';
    } else {
      darkLightToggleImage.src = '/assets/light.svg';
    }
  });

  /* *********************************************************************************************
   * Copy code function
   */
  const codeBlocks = document.querySelectorAll('pre.highlight');

  codeBlocks.forEach((codeblock) => {
    const code = codeblock.children[0];

    const copyButton = document.createElement('button');
    copyButton.innerHTML = `<img src="/assets/copy.svg" class="copy"/>`;
    copyButton.className = 'copy-code-button';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'copy-code-container';
    buttonContainer.appendChild(copyButton);

    copyButton.addEventListener('click', () => {
      copyButton.innerHTML = `<img src="/assets/copy-check.svg" class="copy-check"/>`;
      copyButton.className = 'copy-code-button copy-code-button-clicked';

      window.navigator.clipboard.writeText(code.innerText);

      setTimeout(() => {
        copyButton.innerHTML = `<img src="/assets/copy.svg" class="copy"/>`;
        copyButton.className = 'copy-code-button';
      }, 2000);
    });

    codeblock.insertBefore(buttonContainer, code);
  });

})();

/* *********************************************************************************************
 * Navigation function
 */
function onNavigateBack() {
  window.history.go(-1);

  // fallback if no history is available
  setTimeout(function () {
    window.location.href = window.location.origin;
  }, 500);
}